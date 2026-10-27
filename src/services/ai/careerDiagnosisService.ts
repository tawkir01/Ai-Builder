import { askGemini, cleanJson } from '@/lib/gemini';

export async function processCareerDiagnosis(resumeText: string, questionnaire: Record<string, string>) {
  const prompt = `
    You are an expert technical career advisor for engineering graduates.
    Given the following details:
    Resume: ${resumeText || 'None provided'}
    Questionnaire Answers: ${JSON.stringify(questionnaire)}
    
    Please analyze the user's background and suggest the 3 best-fit career paths (e.g., Software Developer, Data Scientist, UI/UX Designer, etc.).
    Return ONLY a JSON array of objects with the following keys:
    - "pathName": string (The role name)
    - "confidence": number (1-100 indicating match strength)
    - "justification": string (Why this matches their profile)
  `;

  const resultBody = await askGemini(prompt, true);
  try {
    return JSON.parse(cleanJson(resultBody || '[]'));
  } catch (e) {
    console.error("Failed to parse Gemini output", resultBody);
    return [];
  }
}
