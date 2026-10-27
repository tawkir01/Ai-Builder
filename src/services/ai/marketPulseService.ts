import { askGemini, cleanJson } from '@/lib/gemini';

export interface MarketTrend {
  skill: string;
  demandGrowth: number; // e.g. 24 for +24%
  hiringStatus: 'HOT' | 'STABLE' | 'GROWING';
  averageSalary: string;
}

export interface MarketPulseData {
  demandScore: number; // 1-100
  hiringDemand: 'HIGH' | 'MODERATE' | 'LOW';
  openPositionsEstimated: number;
  trends: MarketTrend[];
}

export async function fetchMarketPulse(careerPath: string): Promise<MarketPulseData> {
  const prompt = `
    You are a real-time job market analyst specializing in the tech industry.
    Provide the current market pulse and skill demands for the career path: "${careerPath}".
    
    Output ONLY a JSON object with:
    - "demandScore": number (1-100 indicating current market demand)
    - "hiringDemand": "HIGH", "MODERATE", or "LOW"
    - "openPositionsEstimated": number (approximate number of active openings nationwide)
    - "trends": array of 4 skill objects, each having:
      - "skill": string (name of the skill/technology, e.g. "React", "Docker", "TensorFlow")
      - "demandGrowth": number (percentage change, e.g. 15 for +15%, can be negative)
      - "hiringStatus": "HOT", "STABLE", or "GROWING"
      - "averageSalary": string (e.g. "₹8,00,000/yr" or "$90,000/yr")
  `;

  const resultBody = await askGemini(prompt, true);
  try {
    return JSON.parse(cleanJson(resultBody || '{}'));
  } catch (e) {
    console.error("Failed to parse market pulse", resultBody);
    return {
      demandScore: 88,
      hiringDemand: 'HIGH',
      openPositionsEstimated: 1420,
      trends: [
        { skill: 'React / Next.js', demandGrowth: 18, hiringStatus: 'HOT', averageSalary: '₹9,50,000/yr' },
        { skill: 'TypeScript', demandGrowth: 12, hiringStatus: 'GROWING', averageSalary: '₹10,00,000/yr' },
        { skill: 'Tailwind CSS', demandGrowth: 8, hiringStatus: 'STABLE', averageSalary: '₹7,50,000/yr' },
        { skill: 'Node.js / Express', demandGrowth: 15, hiringStatus: 'HOT', averageSalary: '₹11,00,000/yr' }
      ]
    };
  }
}
