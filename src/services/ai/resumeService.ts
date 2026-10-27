import { askGemini } from '@/lib/gemini';

export async function formatResume(jobTitle: string, rawExperience: string) {
  const prompt = `
    You are a professional resume writer specializing in ATS-friendly formats.
    The user wants a resume for the role: "${jobTitle}".
    Here is their raw experience info:
    ${rawExperience}

    Format this into a professional resume structure and return ONLY a JSON object with:
    - "name": string (placeholder "YOUR NAME")
    - "title": string (the job title)
    - "sections": array of objects each containing:
      - "heading": string (e.g. "Professional Experience", "Education", "Skills")
      - "items": array of strings (bullet points)
  `;

  const resultBody = await askGemini(prompt, true);
  try {
    const { cleanJson } = await import('@/lib/gemini');
    return JSON.parse(cleanJson(resultBody || '{}'));
  } catch (e) {
    console.error("Failed to parse resume", resultBody);
    return {
      name: "YOUR NAME",
      title: jobTitle,
      sections: [
        { heading: "Professional Experience", items: [rawExperience || "Add your experience above"] }
      ]
    };
  }
}
