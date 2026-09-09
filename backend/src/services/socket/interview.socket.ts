import { GoogleGenAI, Modality } from "@google/genai";
import { WebSocket, WebSocketServer } from "ws";
import { Server } from 'http';
import Jwt from "jsonwebtoken";
import sessionModel from "../db/models/session";

export function setupInterviewWebSocket(server: Server) {
    const wss = new WebSocketServer({ server, path: '/ws/interview' });

    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY || process.env.gemini_api_key,
    });

    wss.on('connection', async (ws: WebSocket, req) => {
        console.log("Client connected to interview WebSocket");

        const url = new URL(req.url || '', `http://${req.headers.host}`);
        const sessionId = url.searchParams.get("sessionId");
        const token = url.searchParams.get("token");

        if (!sessionId || !token) {
            ws.close(1008, 'Token or Session Id missing');
            return;
        }

        let userId: string;
        try {
            const decoded = Jwt.verify(token, process.env.JWT_SECRET as string) as any;
            userId = decoded.userId || decoded.id || decoded._id;
        } catch (error) {
            console.error("JWT verification error in WebSocket:", error);
            ws.close(1008, 'Invalid Token');
            return;
        }

        const session = await sessionModel.findOne({ _id: sessionId, userId })
            .populate('jobId')
            .populate('resumeId')
            .populate('userId', 'fullname');

        if (!session) {
            ws.close(1011, 'Session not found');
            return;
        }

        const candidateName = (session.userId as any)?.fullname || 'Candidate';
        const systemPrompt = `
You are a professional, polite, but thorough technical interviewer conducting a ${session.difficulty} level ${session.sessionType} interview.

Candidate Resume Details:
${JSON.stringify(session.resumeId || {})}

Job Requirements:
${JSON.stringify(session.jobId || {})}

Instructions:
- Greet the candidate ${candidateName} briefly and start with an introductory question.
- Ask one question at a time.
- Keep responses concise and conversational (as this is a live voice call).
- Challenge candidate answers when appropriate.
`;

        // Turn Buffers to accumulate streaming word tokens into complete sentences
        let currentAiTurnText = "";
        let currentUserTurnText = "";

        const flushAiTurn = async () => {
            const textToSave = currentAiTurnText.trim();
            if (textToSave) {
                currentAiTurnText = "";
                await sessionModel.findByIdAndUpdate(sessionId, {
                    $push: {
                        transcript: {
                            speaker: 'ai',
                            text: textToSave,
                            timestamp: new Date(),
                        }
                    }
                });
            }
        };

        const flushUserTurn = async () => {
            const textToSave = currentUserTurnText.trim();
            if (textToSave) {
                currentUserTurnText = "";
                await sessionModel.findByIdAndUpdate(sessionId, {
                    $push: {
                        transcript: {
                            speaker: 'user',
                            text: textToSave,
                            timestamp: new Date(),
                        }
                    }
                });
            }
        };

        let geminiSession: any;
        try {
            geminiSession = await ai.live.connect({
                model: 'gemini-3.1-flash-live-preview',

                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: {
                                voiceName: session.voiceName || 'Zephyr',
                            }
                        }
                    },
                    systemInstruction: {
                        parts: [{ text: systemPrompt }],
                    },
                },
                callbacks: {
                    onopen: async () => {
                        console.log("Gemini Live Session connected");
                        ws.send(JSON.stringify({ type: 'STATUS', message: 'AI Interviewer Ready' }));

                        // Mark session as in-progress and record start time
                        await sessionModel.findByIdAndUpdate(sessionId, {
                            status: 'in-progress',
                            startedAt: new Date(),
                        });
                    },

                    onmessage: async (message) => {
                        // 1. Stream Audio Chunk to Client
                        if (message.serverContent?.modelTurn?.parts) {
                            for (const part of message.serverContent.modelTurn.parts) {
                                if (part.inlineData) {
                                    ws.send(JSON.stringify({
                                        type: 'AUDIO',
                                        data: part.inlineData.data, // Raw Base64 audio string
                                        mimeType: part.inlineData.mimeType,
                                    }));
                                }

                                if (part.text) {
                                    currentAiTurnText += part.text;
                                    ws.send(JSON.stringify({
                                        type: 'TRANSCRIPT',
                                        speaker: 'ai',
                                        text: part.text,
                                    }));
                                }
                            }
                        }

                        // 2. Stream AI Speech-to-Text Transcription
                        if (message.serverContent?.outputTranscription?.text) {
                            const chunk = message.serverContent.outputTranscription.text;
                            currentAiTurnText += chunk;
                            ws.send(JSON.stringify({
                                type: 'TRANSCRIPT',
                                speaker: 'ai',
                                text: chunk,
                            }));
                        }

                        // 3. Stream User Mic Speech-to-Text Transcription
                        if (message.serverContent?.inputTranscription?.text) {
                            const chunk = message.serverContent.inputTranscription.text;
                            currentUserTurnText += chunk;
                            ws.send(JSON.stringify({
                                type: 'TRANSCRIPT',
                                speaker: 'user',
                                text: chunk,
                            }));

                            if (message.serverContent.inputTranscription.finished) {
                                await flushUserTurn();
                            }
                        }

                        // 4. When AI finishes speaking this turn, save the complete accumulated sentence to DB
                        if (message.serverContent?.turnComplete || message.serverContent?.generationComplete || message.serverContent?.interrupted) {
                            await flushAiTurn();
                            await flushUserTurn();
                        }
                    },

                    onerror: (err) => {
                        console.error("Error in Gemini live session:", err);
                        ws.send(JSON.stringify({ type: 'ERROR', message: 'Error: Gemini session failed' }));
                        try {
                            geminiSession?.close();
                        } catch { }
                    },

                    onclose: () => {
                        console.log("Gemini Live Session closed");
                    },
                },
            });

            // Trigger Gemini to greet the candidate and ask the first question
            geminiSession.sendClientContent({
                turns: [
                    {
                        role: 'user',
                        parts: [{ text: `Hello, I am ${candidateName}. I am ready for the interview. Please greet me and ask the first question.` }],
                    },
                ],
            });
        } catch (error) {
            console.error('Failed to connect to Gemini Live:', error);
            ws.close(1011, 'Failed to initialize AI stream');
            return;
        }

        // Handle incoming client messages
        ws.on('message', async (data) => {
            try {
                const message = JSON.parse(data.toString());

                // 1. User Microphone Audio Chunk -> Pipe to Gemini Live
                if (message.type === 'AUDIO_CHUNK' && message.data && geminiSession) {
                    geminiSession.sendRealtimeInput([
                        {
                            mimeType: 'audio/pcm;rate=16000',
                            data: message.data,
                        },
                    ]);
                }

                // 2. User Text Message / Transcript -> Send to Gemini Live & Save to DB
                if ((message.type === 'TEXT' || message.type === 'USER_TRANSCRIPT') && message.text && geminiSession) {
                    // Flush any pending turn first
                    await flushAiTurn();
                    await flushUserTurn();

                    // Save user turn to DB
                    await sessionModel.findByIdAndUpdate(sessionId, {
                        $push: {
                            transcript: {
                                speaker: 'user',
                                text: message.text.trim(),
                                timestamp: new Date(),
                            }
                        }
                    });

                    // Forward to Gemini Live
                    geminiSession.sendClientContent({
                        turns: [
                            {
                                role: 'user',
                                parts: [{ text: message.text }],
                            },
                        ],
                    });
                }
            } catch (e) {
                console.error('Error handling socket message: ', e);
            }
        });

        // Handle client disconnect
        ws.on('close', async () => {
            console.log('Client disconnected from interview');
            // Flush any remaining accumulated text to DB
            await flushAiTurn();
            await flushUserTurn();

            if (geminiSession) {
                try {
                    geminiSession.close();
                } catch { }
            }

            await sessionModel.findByIdAndUpdate(sessionId, {
                status: 'completed',
                endedAt: new Date(),
            });
        });
    });
}