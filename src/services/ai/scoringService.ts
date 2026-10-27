import { askGemini, cleanJson } from '@/lib/gemini';

export interface AnswerScore {
  score: number;
  grade: string;
  feedback: string;
  improvements: string[];
  xpEarned: number;
}

export async function scoreStudyAnswer(
  question: string,
  userAnswer: string,
  sampleSolution: string,
  careerPath: string
): Promise<AnswerScore> {
  const prompt = `
    You are a strict but encouraging technical coding instructor evaluating a student's answer.
    Career Path: "${careerPath}"
    
    Question Asked:
    "${question}"
    
    Student's Answer:
    "${userAnswer}"
    
    Reference Solution:
    "${sampleSolution}"
    
    Evaluate the student's answer against the reference solution for correctness, completeness, and clarity.
    Be fair: award partial credit for partially correct answers.
    
    Output ONLY a JSON object with:
    - "score": number (0 to 100)
    - "grade": string ("A+", "A", "B", "C", or "D")
    - "feedback": string (1 encouraging sentence summarizing their performance)
    - "improvements": string[] (exactly 2 specific, actionable suggestions to improve)
    - "xpEarned": number (10 to 50, proportional to score)
  `;

  const resultBody = await askGemini(prompt, true);
  try {
    const parsed = JSON.parse(cleanJson(resultBody || '{}'));
    // Clamp and validate
    parsed.score = Math.min(100, Math.max(0, Number(parsed.score) || 50));
    parsed.xpEarned = Math.min(50, Math.max(10, Number(parsed.xpEarned) || Math.floor(parsed.score / 2)));
    if (!['A+', 'A', 'B', 'C', 'D'].includes(parsed.grade)) {
      parsed.grade = parsed.score >= 90 ? 'A+' : parsed.score >= 80 ? 'A' : parsed.score >= 65 ? 'B' : parsed.score >= 50 ? 'C' : 'D';
    }
    return parsed;
  } catch (e) {
    console.error("Failed to parse score result", resultBody);
    // Smart fallback based on answer quality
    const wordCount = userAnswer.trim().split(/\s+/).filter(Boolean).length;
    const hasCode = /[{};()=>]|function|def |const |let |var /.test(userAnswer);
    const matchesSolution = sampleSolution.split('\n').some(line => 
      line.trim().length > 4 && userAnswer.includes(line.trim())
    );
    const score = Math.min(100, Math.max(15,
      wordCount * 2 +
      (hasCode ? 25 : 0) +
      (matchesSolution ? 30 : 0) +
      Math.floor(Math.random() * 10)
    ));
    const grade = score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 65 ? 'B' : score >= 50 ? 'C' : 'D';
    return {
      score,
      grade,
      feedback: score >= 70
        ? "Good work! Your answer demonstrates understanding of the core concept."
        : "Nice try! With a bit more detail and practice, you'll nail it next time.",
      improvements: [
        "Include more detailed code comments to explain your thought process.",
        "Review edge cases — does your solution handle empty inputs or boundary values?"
      ],
      xpEarned: Math.max(10, Math.floor(score / 2))
    };
  }
}
