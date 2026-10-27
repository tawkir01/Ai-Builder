import { askGemini, cleanJson } from '@/lib/gemini';

export interface DailyStudyChallenge {
  question: string;
  placeholder: string;
  sampleSolution: string;
  studyTip: string;
}

export async function fetchDailyStudy(careerPath: string): Promise<DailyStudyChallenge> {
  const prompt = `
    You are an AI study coach for junior software developers.
    Generate a simple, daily 5-minute study challenge/question for the career path: "${careerPath}".
    Keep it fundamental and quick (e.g. basic syntax, concept explanation, or simple code completion).
    
    Output ONLY a JSON object with:
    - "question": string (The study question or task, e.g. "Write a function in JS to count vowels in a string" or "Explain the difference between let and const")
    - "placeholder": string (A starter code snippet or text area placeholder, e.g. "function countVowels(str) {\n  // write code\n}")
    - "sampleSolution": string (A brief, clean sample solution or answer)
    - "studyTip": string (A short, helpful tip for today's study)
  `;

  const resultBody = await askGemini(prompt, true);
  try {
    return JSON.parse(cleanJson(resultBody || '{}'));
  } catch (e) {
    console.error("Failed to parse daily study", resultBody);
    
    const pathLower = careerPath.toLowerCase();
    if (pathLower.includes('frontend') || pathLower.includes('web') || pathLower.includes('ui') || pathLower.includes('design')) {
      return {
        question: "Explain what CSS Flexbox is and write a CSS class to center a div container.",
        placeholder: ".center-container {\n  /* Your CSS flex rules here */\n}",
        sampleSolution: ".center-container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}",
        studyTip: "Use flex-direction: column if you want your centered items stacked vertically!"
      };
    } else if (pathLower.includes('data') || pathLower.includes('ai') || pathLower.includes('machine') || pathLower.includes('model')) {
      return {
        question: "Write a Python function to check if a number is prime.",
        placeholder: "def is_prime(n):\n    # Write your logic here\n    pass",
        sampleSolution: "def is_prime(n):\n    if n < 2: return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0: return False\n    return True",
        studyTip: "Checking up to the square root of n is a simple optimization that cuts down calculations significantly!"
      };
    } else {
      return {
        question: "Write a function in JavaScript to check if a word is a palindrome (reads same forward and backward).",
        placeholder: "function isPalindrome(word) {\n  // Write logic\n}",
        sampleSolution: "function isPalindrome(word) {\n  const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');\n  return clean === clean.split('').reverse().join('');\n}",
        studyTip: "Remember to normalize user input (lowercase, remove non-alphanumeric) before testing!"
      };
    }
  }
}
