import { PDFParse } from 'pdf-parse';

export async function parseResumeFromBuffer(buffer: Buffer) {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    return result;
}