import { askGemini, cleanJson } from '@/lib/gemini';

export interface OutreachInput {
  careerPath: string;
  skills: string[];
  companyName: string;
  jobDescription: string;
}

export async function generateOutreach(input: OutreachInput) {
  const prompt = `
    You are an expert career coach helping an engineering graduate land their first job.
    Generate a compelling, highly personalized cold email and a short LinkedIn connection note (under 300 characters) for this target position.
    
    Candidate Info:
    - Target Role: ${input.careerPath}
    - Mastered Skills: ${input.skills.join(', ')}
    
    Target Job Info:
    - Company Name: ${input.companyName}
    - Job Description/Requirements: ${input.jobDescription}
    
    Be direct, highlight how their specific mastered skills fit the role description, and show enthusiasm.
    Output ONLY a JSON object with:
    - "emailSubject": string (A catchy, professional subject line)
    - "emailBody": string (The body of the cold email, formatted with line breaks)
    - "linkedinMessage": string (A punchy connection request message, maximum 280 characters)
  `;

  const resultBody = await askGemini(prompt, true);
  try {
    return JSON.parse(cleanJson(resultBody || '{}'));
  } catch (e) {
    console.error("Failed to parse outreach", resultBody);
    return {
      emailSubject: `Applying for ${input.careerPath} opportunities at ${input.companyName}`,
      emailBody: `Dear Hiring Team,\n\nI hope this email finds you well. I am writing to express my strong interest in the ${input.careerPath} role at ${input.companyName}.\n\nBased on my experience, I have developed skills in ${input.skills.slice(0, 3).join(', ')}. I would love to discuss how I can contribute to your team.\n\nBest regards,\n[Your Name]`,
      linkedinMessage: `Hi there, I saw your post about the ${input.careerPath} role at ${input.companyName}. I have skills in ${input.skills.slice(0, 2).join(', ')} and would love to connect to learn more about the team's work!`
    };
  }
}
