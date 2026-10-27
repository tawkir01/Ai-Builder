import { askGemini } from '@/lib/gemini';

export async function getNextInterviewQuestion(
  pathName: string, 
  previousChat: {role: string, content: string}[],
  evaluate: boolean = false
) {
  const chatHistoryContext = previousChat.map(c => `${c.role}: ${c.content}`).join('\n');
  
  const basePrompt = `
    You are an expert technical recruiter for the role of ${pathName}.
    Chat history so far:
    ${chatHistoryContext}
  `;

  if (evaluate) {
    const evaluationPrompt = `
      ${basePrompt}
      
      CRITICAL: The interview is now finished. Provide a detailed final evaluation.
      Output ONLY a JSON object with:
      - "score": number (0-100)
      - "overallFeedback": string
      - "strengths": string[] (3 points)
      - "weaknesses": string[] (3 points)
      - "recommendation": string (one sentence)
    `;
    return await askGemini(evaluationPrompt, true);
  }

  const nextQuestionPrompt = `
    ${basePrompt}
    
    Ask the next highly relevant interview question. 
    Mix technical/behavioral based on the previous answers.
    Keep it concise, professional, and slightly challenging.
    Be encouraging but professional.
  `;

  return await askGemini(nextQuestionPrompt, false);
}
