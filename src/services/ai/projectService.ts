import { askGemini, cleanJson } from '@/lib/gemini';

export async function generateProjects(careerPath: string, level: number) {
  const prompt = `
    You are a portfolio advisor for engineering graduates.
    Generate 2 project ideas for someone pursuing "${careerPath}" at skill level ${level}/10.
    Output ONLY a JSON array, where each project has:
    - "title": string
    - "description": string
    - "techStack": array of strings
    - "status": "READY" or "IN PROGRESS"
  `;

  const resultBody = await askGemini(prompt, true);
  try {
    return JSON.parse(cleanJson(resultBody || '[]'));
  } catch (e) {
    console.error("Failed to parse projects", resultBody);
    return [];
  }
}
