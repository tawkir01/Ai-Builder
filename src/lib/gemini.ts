/**
 * GEMINI AI SERVICE & FALLBACK
 * This module handles AI requests with a robust fallback system.
 * It uses lazy initialization to prevent crashes if the SDK is missing or incorrectly configured.
 */

export async function askGemini(prompt: string, expectJson: boolean = false) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === "your_gemini_api_key" || apiKey.includes("your_")) {
    return fallbackResponse(prompt);
  }

  try {
    // Dynamic import to prevent top-level crashes if the package is missing/incompatible
    const { GoogleGenAI } = await import("@google/genai");
    const client = new GoogleGenAI({ apiKey });
    
    const result = await client.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });
    
    return result.text;
  } catch (error) {
    console.error("Gemini AI Error (falling back):", error);
    return fallbackResponse(prompt);
  }
}

export function cleanJson(text: string) {
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
}

/**
 * LARGE POOL OF QUESTIONS FOR RANDOMIZATION
 */
const MCQ_POOL = [
  // TECHNICAL
  { 
    question: "What is the primary role of a technical professional in a modern development team?", 
    options: ["Writing documentation", "Designing and implementing solutions", "Managing payroll", "Cleaning the office"], 
    correctAnswer: "Designing and implementing solutions", 
    explanation: "The core responsibility involves technical design and implementation." 
  },
  { 
    question: "Which data structure follows the Last-In, First-Out (LIFO) principle?", 
    options: ["Queue", "Linked List", "Stack", "Tree"], 
    correctAnswer: "Stack", 
    explanation: "Stacks operate on a LIFO basis while queues are FIFO." 
  },
  { 
    question: "What does the 'S' in SOLID principles stand for?", 
    options: ["Simple Access", "Single Responsibility", "System Security", "Server Side"], 
    correctAnswer: "Single Responsibility", 
    explanation: "The Single Responsibility Principle states a class should have one reason to change." 
  },
  { 
    question: "In Git, what command is used to combine changes from one branch into another?", 
    options: ["git push", "git commit", "git merge", "git fetch"], 
    correctAnswer: "git merge", 
    explanation: "git merge is used to integrate changes from different branches." 
  },
  { 
    question: "Which of these is NOT a characteristic of Cloud Computing?", 
    options: ["On-demand self-service", "Resource pooling", "Fixed hardware dependency", "Rapid elasticity"], 
    correctAnswer: "Fixed hardware dependency", 
    explanation: "Cloud computing is designed to be hardware-independent and scalable." 
  },
  { 
    question: "What is the complexity of searching for an element in a balanced Binary Search Tree?", 
    options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"], 
    correctAnswer: "O(log n)", 
    explanation: "Balanced trees allow for logarithmic search time." 
  },
  { 
    question: "Which HTTP status code represents 'Not Found'?", 
    options: ["200", "400", "404", "500"], 
    correctAnswer: "404", 
    explanation: "404 is the standard code for a resource not found." 
  },
  { 
    question: "What does CSS stand for?", 
    options: ["Creative Style Sheets", "Computer Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets"], 
    correctAnswer: "Cascading Style Sheets", 
    explanation: "CSS describes how HTML elements are to be displayed." 
  },
  { 
    question: "Which company developed the React library?", 
    options: ["Google", "Microsoft", "Meta (Facebook)", "Amazon"], 
    correctAnswer: "Meta (Facebook)", 
    explanation: "React was created by Jordan Walke at Facebook." 
  },
  { 
    question: "What is the purpose of 'Docker' in software development?", 
    options: ["Database management", "Containerization", "Word processing", "Image editing"], 
    correctAnswer: "Containerization", 
    explanation: "Docker allows developers to package applications into containers." 
  },

  // LOGICAL
  { 
    question: "Which of the following is a key skill for technical problem solving?", 
    options: ["Guessing", "Analytical thinking", "Copying code without understanding", "Waiting for others to solve it"], 
    correctAnswer: "Analytical thinking", 
    explanation: "Breaking down complex problems is essential for engineering roles." 
  },
  { 
    question: "Find the next number in the series: 2, 6, 12, 20, 30, ?", 
    options: ["40", "42", "44", "38"], 
    correctAnswer: "42", 
    explanation: "The difference increases by 2 each time: +4, +6, +8, +10, +12." 
  },
  { 
    question: "If 'CODER' is coded as 'DPEFS', how is 'HELLO' coded?", 
    options: ["IFMMP", "GDKKN", "JFMMP", "IDMMP"], 
    correctAnswer: "IFMMP", 
    explanation: "Each letter is shifted by one position forward in the alphabet." 
  },
  { 
    question: "Point A is to the West of Point B. Point C is to the South of Point A. Which direction is Point B from Point C?", 
    options: ["North-East", "North-West", "South-East", "South-West"], 
    correctAnswer: "North-East", 
    explanation: "If C is South of A, and A is West of B, then B is North-East of C." 
  },
  { 
    question: "All squares are rectangles. Some rectangles are red. Therefore:", 
    options: ["All squares are red", "Some rectangles are squares", "Some squares might be red", "No square is red"], 
    correctAnswer: "Some squares might be red", 
    explanation: "While all squares are rectangles, they may or may not be part of the 'red' group." 
  },
  { 
    question: "If yesterday was Tuesday, what day will it be 100 days from today?", 
    options: ["Thursday", "Friday", "Saturday", "Sunday"], 
    correctAnswer: "Friday", 
    explanation: "Today is Wednesday. 100 % 7 = 2. Wednesday + 2 days = Friday." 
  },
  { 
    question: "An octopus has 8 legs. A group of octopuses has a total of 120 legs. How many octopuses are there?", 
    options: ["12", "15", "18", "20"], 
    correctAnswer: "15", 
    explanation: "120 divided by 8 equals 15." 
  },

  // QUANTITATIVE
  { 
    question: "If a project is expected to take 100 hours and you've completed 25% in 20 hours, how many more hours will it take at the current rate?", 
    options: ["60 hours", "75 hours", "80 hours", "40 hours"], 
    correctAnswer: "60 hours", 
    explanation: "At 25% per 20 hours, the total time is 80 hours. 80 - 20 = 60 remaining." 
  },
  { 
    question: "A train 150m long is running at 60km/h. In how much time will it pass a pole?", 
    options: ["9 seconds", "12 seconds", "15 seconds", "10 seconds"], 
    correctAnswer: "9 seconds", 
    explanation: "Speed in m/s = 60 * 5/18 = 16.67 m/s. Time = 150 / 16.67 = 9s." 
  },
  { 
    question: "If 5 workers can build 5 tables in 5 days, how many workers are needed to build 100 tables in 100 days?", 
    options: ["100", "50", "5", "10"], 
    correctAnswer: "5", 
    explanation: "5 workers build 5 tables every 5 days." 
  },
  { 
    question: "What is 15% of 1200?", 
    options: ["150", "180", "120", "200"], 
    correctAnswer: "180", 
    explanation: "1200 * 0.15 = 180." 
  },
  { 
    question: "A laptop is sold for $900 after a 10% discount. What was the original price?", 
    options: ["$1000", "$990", "$1100", "$950"], 
    correctAnswer: "$1000", 
    explanation: "$900 represents 90% of the price. 900 / 0.9 = $1000." 
  },
];

export function fallbackResponse(prompt: string) {
  const p = prompt.toLowerCase();

  if (p.includes('outreach') || p.includes('linkedin connection note') || p.includes('cold email')) {
    const roleMatch = prompt.match(/Target Role:\s*(.*)/i);
    const companyMatch = prompt.match(/Company Name:\s*(.*)/i);
    const skillsMatch = prompt.match(/Mastered Skills:\s*(.*)/i);
    
    const role = roleMatch ? roleMatch[1].trim() : 'Software Engineer';
    const company = companyMatch ? companyMatch[1].trim() : 'Tech Corp';
    const skillsList = skillsMatch ? skillsMatch[1].trim().split(', ') : ['React', 'Node.js'];
    
    return JSON.stringify({
      emailSubject: `Potential ${role} opportunities at ${company}`,
      emailBody: `Dear Hiring Team,\n\nI hope this email finds you well. My name is [Your Name], and I am a junior engineer specializing in ${role} development.\n\nI recently completed a series of advanced projects using ${skillsList.join(', ')}. I’ve been following ${company}'s growth and would love to bring my dedication and skills to your engineering team.\n\nWould you be open to a brief 10-minute chat next week to discuss how my background matches your needs?\n\nBest regards,\n[Your Name]`,
      linkedinMessage: `Hi, I noticed the ${role} opening at ${company}. I recently built projects using ${skillsList.slice(0, 2).join(' & ')} and would love to connect to learn more about the team's culture and work!`
    });
  }

  if (p.includes('market analyst') || p.includes('market pulse') || p.includes('skill demands')) {
    const careerPathMatch = prompt.match(/career path:\s*"(.*)"/i);
    const careerPath = careerPathMatch ? careerPathMatch[1].trim() : 'Software Engineer';
    
    let trends = [
      { skill: 'React / Next.js', demandGrowth: 24, hiringStatus: 'HOT', averageSalary: '₹9,50,000/yr' },
      { skill: 'TypeScript', demandGrowth: 18, hiringStatus: 'GROWING', averageSalary: '₹10,50,000/yr' },
      { skill: 'Docker / Kubernetes', demandGrowth: 14, hiringStatus: 'GROWING', averageSalary: '₹12,00,000/yr' },
      { skill: 'Node.js / Express', demandGrowth: 11, hiringStatus: 'STABLE', averageSalary: '₹9,00,000/yr' }
    ];
    
    if (careerPath.toLowerCase().includes('data') || careerPath.toLowerCase().includes('ai') || careerPath.toLowerCase().includes('machine')) {
      trends = [
        { skill: 'Python / PyTorch', demandGrowth: 35, hiringStatus: 'HOT', averageSalary: '₹14,00,000/yr' },
        { skill: 'SQL & Data Warehousing', demandGrowth: 16, hiringStatus: 'GROWING', averageSalary: '₹9,50,000/yr' },
        { skill: 'Large Language Models', demandGrowth: 42, hiringStatus: 'HOT', averageSalary: '₹18,00,000/yr' },
        { skill: 'Data Visualization (Tableau)', demandGrowth: 5, hiringStatus: 'STABLE', averageSalary: '₹7,50,000/yr' }
      ];
    } else if (careerPath.toLowerCase().includes('design') || careerPath.toLowerCase().includes('ui') || careerPath.toLowerCase().includes('ux')) {
      trends = [
        { skill: 'Figma Component Systems', demandGrowth: 22, hiringStatus: 'HOT', averageSalary: '₹8,50,000/yr' },
        { skill: 'UX Research & Testing', demandGrowth: 12, hiringStatus: 'GROWING', averageSalary: '₹9,00,000/yr' },
        { skill: 'Interactive Prototyping', demandGrowth: 15, hiringStatus: 'GROWING', averageSalary: '₹8,00,000/yr' },
        { skill: 'Tailwind CSS / HTML5', demandGrowth: 8, hiringStatus: 'STABLE', averageSalary: '₹6,50,000/yr' }
      ];
    }
    
    return JSON.stringify({
      demandScore: 85 + Math.floor(Math.random() * 10),
      hiringDemand: 'HIGH',
      openPositionsEstimated: 1200 + Math.floor(Math.random() * 800),
      trends
    });
  }

  if (p.includes('strict but encouraging') || p.includes('technical coding instructor') || p.includes('student\'s answer')) {
    const questionMatch = prompt.match(/Question Asked:\s*"([^"]+)"/i);
    const answerMatch = prompt.match(/Student's Answer:\s*"([^"]+)"/i);
    const solutionMatch = prompt.match(/Reference Solution:\s*"([^"]+)"/i);

    const userAnswer = answerMatch ? answerMatch[1] : '';
    const sampleSolution = solutionMatch ? solutionMatch[1] : '';

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

    return JSON.stringify({
      score,
      grade,
      feedback: score >= 70
        ? "Good work! Your answer demonstrates solid understanding of the core concept."
        : "Nice attempt! With a bit more detail and practice, you'll nail it next time.",
      improvements: [
        "Include more detailed code comments to explain your reasoning step by step.",
        "Check edge cases — does your solution handle empty inputs or boundary values?"
      ],
      xpEarned: Math.max(10, Math.floor(score / 2))
    });
  }

  if (p.includes('study coach') || p.includes('study challenge') || p.includes('5-minute study')) {
    const careerPathMatch = prompt.match(/career path:\s*"(.*)"/i);
    const careerPath = careerPathMatch ? careerPathMatch[1].trim() : 'Software Engineer';
    const pathLower = careerPath.toLowerCase();

    if (pathLower.includes('frontend') || pathLower.includes('web') || pathLower.includes('ui') || pathLower.includes('design')) {
      return JSON.stringify({
        question: "Explain what CSS Flexbox is and write a CSS class to center a div container.",
        placeholder: ".center-container {\n  /* Your CSS flex rules here */\n}",
        sampleSolution: ".center-container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}",
        studyTip: "Use flex-direction: column if you want your centered items stacked vertically!"
      });
    } else if (pathLower.includes('data') || pathLower.includes('ai') || pathLower.includes('machine') || pathLower.includes('model')) {
      return JSON.stringify({
        question: "Write a Python function to check if a number is prime.",
        placeholder: "def is_prime(n):\n    # Write your logic here\n    pass",
        sampleSolution: "def is_prime(n):\n    if n < 2: return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0: return False\n    return True",
        studyTip: "Checking up to the square root of n is a simple optimization that cuts down calculations significantly!"
      });
    } else {
      return JSON.stringify({
        question: "Write a function in JavaScript to check if a word is a palindrome (reads same forward and backward).",
        placeholder: "function isPalindrome(word) {\n  // Write logic\n}",
        sampleSolution: "function isPalindrome(word) {\n  const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');\n  return clean === clean.split('').reverse().join('');\n}",
        studyTip: "Remember to normalize user input (lowercase, remove non-alphanumeric) before testing!"
      });
    }
  }

  if (p.includes('technical tutor') || p.includes('study guide') || p.includes('how to learn') || p.includes('where to learn')) {
    const titleMatch = prompt.match(/learning topic:\s*"(.*)"/i);
    const taskTitle = titleMatch ? titleMatch[1].trim() : 'Software Engineering';
    const label = taskTitle.toLowerCase();
    
    let how = [
      "Study the syntax and read the documentation to understand fundamental usage.",
      "Build 3-5 small coding drills or visual exercises to test your understanding.",
      "Browse GitHub or open-source repositories to see how experienced developers write it.",
      "Build a project applying the concept (e.g. a styled login box, or an API service)."
    ];
    
    let where = [
      { label: "freeCodeCamp Tutorials", url: "https://www.freecodecamp.org" },
      { label: "YouTube Search: " + taskTitle, url: `https://www.youtube.com/results?search_query=${encodeURIComponent(taskTitle)}` },
      { label: "W3Schools Web Dev Guides", url: "https://www.w3schools.com" }
    ];

    if (label.includes('react') || label.includes('next.js')) {
      where = [
        { label: "Official React Docs", url: "https://react.dev" },
        { label: "freeCodeCamp React Core Course", url: "https://www.freecodecamp.org/news/tag/react/" },
        { label: "YouTube: React Crash Course", url: `https://www.youtube.com/results?search_query=react+crash+course` }
      ];
    } else if (label.includes('html') || label.includes('css') || label.includes('js') || label.includes('javascript') || label.includes('responsive')) {
      where = [
        { label: "MDN Web Docs", url: "https://developer.mozilla.org" },
        { label: "JavaScript Info Guide", url: "https://javascript.info" },
        { label: "YouTube: CSS Flexbox & Grid Masterclass", url: `https://www.youtube.com/results?search_query=css+flexbox+and+grid+tutorial` }
      ];
    } else if (label.includes('sql') || label.includes('database') || label.includes('mongodb') || label.includes('mongoose')) {
      where = [
        { label: "SQLBolt Lessons", url: "https://sqlbolt.com" },
        { label: "MongoDB University", url: "https://learn.mongodb.com" },
        { label: "YouTube: Database Fundamentals", url: `https://www.youtube.com/results?search_query=databases+for+beginners` }
      ];
    }

    return JSON.stringify({
      howToLearn: how,
      whereToLearn: where
    });
  }

  if (p.includes('career advisor') || p.includes('career paths') || p.includes('suggest the 3 best-fit')) {
    let path1 = "Software Developer";
    let path2 = "Full Stack Engineer";
    let path3 = "DevOps Specialist";
    
    if (p.includes('web') || p.includes('design') || p.includes('ui') || p.includes('ux') || p.includes('frontend')) {
      path1 = "Frontend Developer";
      path2 = "UI/UX Designer";
      path3 = "Full Stack Developer";
    } else if (p.includes('ai') || p.includes('data') || p.includes('model') || p.includes('python')) {
      path1 = "Data Scientist";
      path2 = "Machine Learning Engineer";
      path3 = "Data Analyst";
    }
    
    return JSON.stringify([
      {
        pathName: path1,
        confidence: 95,
        justification: "Your interest in building interactive solutions and coding experience perfectly align with this role."
      },
      {
        pathName: path2,
        confidence: 85,
        justification: "Your background matches the technical skills required to design and build end-to-end applications."
      },
      {
        pathName: path3,
        confidence: 75,
        justification: "Matches your analytical background and coding interest for scalability and data analysis."
      }
    ]);
  }

  if (p.includes('roadmap') || p.includes('weeknumber') || p.includes('4-week roadmap')) {
    const pathMatch = prompt.match(/"([^"]+)"/);
    const careerPath = pathMatch ? pathMatch[1].trim() : 'Software Engineer';
    const pathLower = careerPath.toLowerCase();
    
    let w1_tasks = [];
    let w2_tasks = [];
    let w3_tasks = [];
    let w4_tasks = [];
    
    if (pathLower.includes('frontend') || pathLower.includes('web') || pathLower.includes('ui/ux') || pathLower.includes('design')) {
      w1_tasks = [
        { title: "Master HTML5 & Semantic Elements", description: "Learn layout guidelines, accessibility rules, and HTML forms.", type: "LEARN" },
        { title: "Responsive Layouts with CSS Grid & Flexbox", description: "Build 3 different responsive header and grid layouts.", type: "BUILD" }
      ];
      w2_tasks = [
        { title: "JavaScript ES6+ Fundamentals", description: "Deep dive into promises, fetch API, array methods, and local storage.", type: "LEARN" },
        { title: "Interactive Dynamic Portfolio Page", description: "Build a multi-page portfolio website that pulls data dynamically.", type: "BUILD" }
      ];
      w3_tasks = [
        { title: "React Components & State Management", description: "Learn useState, useEffect, props, and standard React lifecycle.", type: "LEARN" },
        { title: "Single Page App Dashboard", description: "Create a React-based app displaying user metrics and styled with CSS modules.", type: "BUILD" }
      ];
      w4_tasks = [
        { title: "Host and Deploy Web Application", description: "Learn how to use Vercel or Netlify to host your front-end code.", type: "APPLY" },
        { title: "Create recruiter cold outreach template", description: "Prepare a LinkedIn message pointing recruiters to your new React dashboard.", type: "APPLY" }
      ];
    } else if (pathLower.includes('data') || pathLower.includes('ai') || pathLower.includes('machine') || pathLower.includes('model')) {
      w1_tasks = [
        { title: "Python for Data Analysis", description: "Master NumPy, Pandas, and data frame manipulation basics.", type: "LEARN" },
        { title: "EDA on Public Datasets", description: "Load a dataset from Kaggle and perform Exploratory Data Analysis with visualizations.", type: "BUILD" }
      ];
      w2_tasks = [
        { title: "SQL & Relational Databases", description: "Write complex joins, grouping, and aggregations in PostgreSQL.", type: "LEARN" },
        { title: "Database Schema Design & Seed", description: "Build a database representation of an e-commerce platform and seed with test data.", type: "BUILD" }
      ];
      w3_tasks = [
        { title: "Introduction to Machine Learning Models", description: "Learn supervised learning, regression, classification, and evaluation metrics.", type: "LEARN" },
        { title: "Build Predictor Model & Evaluate", description: "Train a scikit-learn model to predict housing prices and graph the accuracy.", type: "BUILD" }
      ];
      w4_tasks = [
        { title: "Deploy API Endpoint for Model", description: "Expose your predictor model using FastAPI or Flask on a cloud host.", type: "APPLY" },
        { title: "Publish Notebook to GitHub", description: "Write a detailed README explaining your model pipeline and send it to potential employers.", type: "APPLY" }
      ];
    } else {
      w1_tasks = [
        { title: "Data Structures & Algorithms Basics", description: "Understand Arrays, Linked Lists, Stacks, Queues, and Big-O notation.", type: "LEARN" },
        { title: "Implement basic CLI tools", description: "Write a terminal app in Node.js or Python to manage a task list saved to a file.", type: "BUILD" }
      ];
      w2_tasks = [
        { title: "HTTP Protocol & RESTful APIs", description: "Learn REST principles, headers, status codes, and HTTP verbs.", type: "LEARN" },
        { title: "Express.js REST API with CRUD", description: "Build an Express app with CRUD endpoints using in-memory arrays.", type: "BUILD" }
      ];
      w3_tasks = [
        { title: "Database Integration (Mongoose/MongoDB)", description: "Learn schemas, indexes, and connection patterns in Node.", type: "LEARN" },
        { title: "Connect API to MongoDB", description: "Refactor your CRUD application to store data in a MongoDB Atlas instance.", type: "BUILD" }
      ];
      w4_tasks = [
        { title: "Deploy Backend Application", description: "Deploy your backend server to Render or Heroku and verify live endpoints.", type: "APPLY" },
        { title: "Add Swagger Documentation", description: "Generate clear API docs and share them in your portfolio.", type: "APPLY" }
      ];
    }
    
    return JSON.stringify([
      { weekNumber: 1, tasks: w1_tasks },
      { weekNumber: 2, tasks: w2_tasks },
      { weekNumber: 3, tasks: w3_tasks },
      { weekNumber: 4, tasks: w4_tasks }
    ]);
  }

  if (p.includes('multiple-choice questions') || p.includes('mcq') || p.includes('assessment')) {
    // Randomize the pool each time
    const shuffled = [...MCQ_POOL].sort(() => Math.random() - 0.5);
    return JSON.stringify(shuffled.slice(0, 10));
  }

  if (p.includes('opportunities') || p.includes('earning')) {
    return JSON.stringify([
      { 
        type: "INTERNSHIP", 
        title: "Frontend Developer Intern", 
        company: "Vibrant Tech", 
        match: 92, 
        compensation: "$600/mo",
        location: "Remote",
        skills: ["React", "CSS", "TypeScript"],
        matchReason: "Your strong React fundamentals and UI design skills are a perfect fit."
      },
      { 
        type: "FULL-TIME", 
        title: "Junior Web Engineer", 
        company: "Next Gen Solutions", 
        match: 85, 
        compensation: "70k-85k/yr",
        location: "Bengaluru, IN",
        skills: ["Node.js", "Express", "MongoDB"],
        matchReason: "Matches your recent backend project experience."
      },
      { 
        type: "FREELANCE", 
        title: "Build Responsive Landing Page", 
        company: "Local Startup", 
        match: 98, 
        compensation: "$200",
        location: "Remote",
        skills: ["HTML", "Tailwind", "JS"],
        matchReason: "Quick wins based on your mobile-first design expertise."
      },
      { 
        type: "INTERNSHIP", 
        title: "Full Stack Developer", 
        company: "Cloud Nine Systems", 
        match: 78, 
        compensation: "$400/mo",
        location: "Pune, IN",
        skills: ["React", "PostgreSQL", "Docker"],
        matchReason: "Opportunity to grow your full-stack and DevOps skillsets."
      }
    ]);
  }

  if (p.includes('interview') || p.includes('mock')) {
    if (p.includes('evaluate') || p.includes('score')) {
      return JSON.stringify({
        score: 85,
        overallFeedback: "You demonstrated a strong understanding of technical concepts but could improve on structuring your behavioral answers. Overall, a very solid performance!",
        strengths: ["Clear explanation of technical architectures", "Good problem-solving logic", "Professional communication style"],
        weaknesses: ["Need more specific STAR examples", "Some answers lack depth", "Slightly nervous tone"],
        recommendation: "Focus on practicing behavioral scenarios using the STAR method."
      });
    }
    
    // Return a random single question for the conversational flow
    const questions = [
      "Tell me about a challenging technical project you've worked on.",
      "How do you handle disagreements within a development team?",
      "Explain the concept of recursion to someone who doesn't know programming.",
      "Where do you see yourself in 5 years as a Software Engineer?",
      "Walk me through your process for debugging a complex issue."
    ];
    return questions[Math.floor(Math.random() * questions.length)];
  }

  return JSON.stringify({
    questions: [
      "Tell me about a challenging technical project you've worked on.",
      "How do you handle disagreements within a development team?",
      "Explain the concept of recursion to someone who doesn't know programming."
    ]
  });
}
