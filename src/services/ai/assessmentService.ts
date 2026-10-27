import { askGemini, cleanJson } from '@/lib/gemini';

export interface MCQQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export async function generateMCQs(field: string, count: number = 10): Promise<MCQQuestion[]> {
  const prompt = `
    You are an expert technical and aptitude interviewer. 
    Generate ${count} multiple-choice questions for someone pursuing a career as a "${field}".
    
    The questions should be a mix of:
    - 40% Technical Fundamentals related to ${field}
    - 30% Logical Reasoning
    - 30% Quantitative Aptitude
    
    Return ONLY a JSON array of objects with the following keys:
    - "question": string
    - "options": string[] (exactly 4 options)
    - "correctAnswer": string (one of the options)
    - "explanation": string (briefly why it's correct)
  `;

  const resultBody = await askGemini(prompt, true);
  try {
    const questions = JSON.parse(cleanJson(resultBody || '[]'));
    return questions;
  } catch (e) {
    console.error("Failed to parse Gemini output for MCQs", resultBody);
    return [];
  }
}

export function calculateScore(userAnswers: string[], correctAnswers: string[]) {
  let score = 0;
  userAnswers.forEach((ans, idx) => {
    if (ans === correctAnswers[idx]) score++;
  });
  return score;
}
