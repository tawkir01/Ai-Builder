import { askGemini, cleanJson } from '@/lib/gemini';

export interface TaskResourceInfo {
  howToLearn: string[];
  whereToLearn: { label: string; url: string }[];
}

export async function fetchTaskResources(taskTitle: string, taskDesc: string): Promise<TaskResourceInfo> {
  const prompt = `
    You are an expert technical tutor.
    Provide a concise study guide for the learning topic: "${taskTitle}".
    Topic Description: ${taskDesc || 'No description provided'}
    
    Output ONLY a JSON object with:
    - "howToLearn": array of 4 strings (concise, actionable step-by-step study/practice instructions)
    - "whereToLearn": array of 3 objects, each having:
      - "label": string (e.g. "MDN Web Docs", "freeCodeCamp React Course", "YouTube Search: Flexbox Tutorial")
      - "url": string (a highly relevant, real domain URL like https://developer.mozilla.org, https://www.freecodecamp.org, or a search link like https://www.youtube.com/results?search_query=...)
  `;

  const resultBody = await askGemini(prompt, true);
  try {
    return JSON.parse(cleanJson(resultBody || '{}'));
  } catch (e) {
    console.error("Failed to parse resources", resultBody);
    
    const label = taskTitle.toLowerCase();
    let how = [
      "Read official documentation or starter guides to understand the syntax.",
      "Write 3-5 simple examples to practice basic methods or API calls.",
      "Inspect similar implementations in open-source projects on GitHub.",
      "Build a mini-project (e.g. a small UI element or API router) applying this concept."
    ];
    let where = [
      { label: "freeCodeCamp Developer Tutorials", url: "https://www.freecodecamp.org" },
      { label: "YouTube Search: " + taskTitle, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(taskTitle)}` },
      { label: "W3Schools Web Development", url: "https://www.w3schools.com" }
    ];

    if (label.includes('react') || label.includes('next.js')) {
      where = [
        { label: "Official React Documentation", url: "https://react.dev" },
        { label: "freeCodeCamp React Course", url: "https://www.freecodecamp.org/news/tag/react/" },
        { label: "YouTube: React Course for Beginners", url: `https://www.youtube.com/results?search_query=react+course+for+beginners` }
      ];
    } else if (label.includes('html') || label.includes('css') || label.includes('js') || label.includes('javascript') || label.includes('responsive')) {
      where = [
        { label: "MDN Web Docs", url: "https://developer.mozilla.org" },
        { label: "javascript.info Tutorial", url: "https://javascript.info" },
        { label: "YouTube: CSS Grid & Flexbox Guide", url: `https://www.youtube.com/results?search_query=css+grid+and+flexbox+tutorial` }
      ];
    } else if (label.includes('sql') || label.includes('database') || label.includes('mongodb') || label.includes('mongoose')) {
      where = [
        { label: "SQLBolt Interactive Lessons", url: "https://sqlbolt.com" },
        { label: "MongoDB University Docs", url: "https://learn.mongodb.com" },
        { label: "YouTube: Relational Databases vs NoSQL", url: `https://www.youtube.com/results?search_query=databases+for+beginners` }
      ];
    }

    return {
      howToLearn: how,
      whereToLearn: where
    };
  }
}
