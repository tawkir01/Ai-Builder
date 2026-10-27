import { askGemini, cleanJson } from '@/lib/gemini';

export async function generateRoadmapBlocks(careerPath: string, level: number) {
  const prompt = `
    Create a highly actionable, structured 4-week roadmap for an engineering graduate to become job-ready as a "${careerPath}".
    Assume starting level: ${level}/10.
    Output ONLY a JSON array of week objects, where each week has:
    - "weekNumber": number (1 to 4)
    - "tasks": array of objects with "title", "description", "type" (must be "LEARN" or "BUILD" or "APPLY")
  `;

  const resultBody = await askGemini(prompt, true);
  try {
    return JSON.parse(cleanJson(resultBody || '[]'));
  } catch (e) {
    console.error("Failed to parse map", resultBody);
    return [];
  }
}
