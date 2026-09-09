import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || process.env.gemini_api_key;
const ai = new GoogleGenAI({ apiKey });

export async function parseResumeWithAI(resumeText: string): Promise<string> {
    const prompt = `Parse the following resume text and extract the information requested. Respond strictly in JSON format.

Resume Text:
${resumeText}

Expected JSON format:
{
  "name": "Candidate Name",
  "title": "Professional Title / Role",
  "aiSummary": "Comprehensive summary...",
  "contact": {
    "email": "email@example.com",
    "phone": "+1...",
    "location": "City, Country",
    "linkedin": "linkedin url"
  },
  "skills": ["skill1", "skill2"],
  "experience": [
    {
      "company": "Company",
      "title": "Role Title",
      "dates": "Date range",
      "location": "Location",
      "responsibilities": ["bullet 1", "bullet 2"]
    }
  ],
  "education": [
    {
      "institution": "University/College",
      "degree": "Degree/Major",
      "year": "Graduation Year"
    }
  ],
  "certifications": ["Cert 1"],
  "content": "Raw text"
}`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        },
    });

    return response.text || "";
}