import { askGemini, cleanJson } from '@/lib/gemini';

export interface Opportunity {
  type: "INTERNSHIP" | "FREELANCE" | "FULL-TIME";
  title: string;
  company: string;
  match: number;
  compensation: string;
  location: string;
  skills: string[];
  matchReason: string;
}

export async function fetchOpportunities(careerPath: string, level: number): Promise<Opportunity[]> {
  const prompt = `
    You are an earning engine generating 6 custom opportunities (jobs/freelance) for a user aiming to be a "${careerPath}" at skill level ${level}/10.
    Provide a mix of INTERNSHIP, FREELANCE, and FULL-TIME roles.
    
    Output ONLY a JSON array of objects with these keys:
    - "type": "INTERNSHIP", "FREELANCE", or "FULL-TIME"
    - "title": string
    - "company": string
    - "match": number (0 to 100)
    - "compensation": string (e.g., "$1,200/mo", "$20/hr", "60k-80k/yr")
    - "location": string (e.g., "Remote", "San Francisco, CA", "Bengaluru, IN")
    - "skills": string[] (3-5 key skills)
    - "matchReason": string (brief explanation of why they match)
  `;

  const resultBody = await askGemini(prompt, true);
  try {
    return JSON.parse(cleanJson(resultBody || '[]'));
  } catch (e) {
    console.error("Failed to parse opportunities map", resultBody);
    return [];
  }
}
