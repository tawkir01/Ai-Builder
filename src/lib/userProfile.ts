"use client";

export interface UserProfile {
  name: string;
  careerPath: string;
  level: number;
  experience: number;
  completedTasks: string[];
  skills: { [key: string]: number };
  lastActive: string;
  notes?: { [taskId: string]: string };
  streak?: number;
  lastStudyDate?: string;
}

const STORAGE_KEY = 'ai_builder_user_profile';

export const getProfile = (): UserProfile => {
  if (typeof window === 'undefined') return defaultProfile;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return defaultProfile;
  try {
    return JSON.parse(saved);
  } catch {
    return defaultProfile;
  }
};

export const saveProfile = (profile: UserProfile) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }
};

export const addExperience = (amount: number) => {
  const profile = getProfile();
  profile.experience += amount;
  
  // Level up logic (e.g., each level requires 100 * level exp)
  const nextLevelExp = profile.level * 100;
  if (profile.experience >= nextLevelExp) {
    profile.level += 1;
    profile.experience -= nextLevelExp;
  }
  
  saveProfile(profile);
  return profile;
};

export const completeTask = (taskId: string, skillPoints: { [key: string]: number }) => {
  const profile = getProfile();
  if (!profile.completedTasks.includes(taskId)) {
    profile.completedTasks.push(taskId);
    
    // Add skill points
    for (const [skill, points] of Object.entries(skillPoints)) {
      profile.skills[skill] = (profile.skills[skill] || 0) + points;
    }
    
    addExperience(50); // Flat bonus for completing a task
  }
  saveProfile(profile);
  return profile;
};

export const saveTaskNote = (taskId: string, noteText: string) => {
  const profile = getProfile();
  if (!profile.notes) {
    profile.notes = {};
  }
  profile.notes[taskId] = noteText;
  saveProfile(profile);
  return profile;
};

export const completeDailyStudy = () => {
  const profile = getProfile();
  const today = new Date().toISOString().split('T')[0];
  
  if (profile.lastStudyDate === today) {
    return { profile, success: false, message: "Already completed today's study!" };
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  if (profile.lastStudyDate === yesterdayStr) {
    profile.streak = (profile.streak || 0) + 1;
  } else {
    profile.streak = 1;
  }
  
  profile.lastStudyDate = today;
  profile.experience += 25;
  
  const nextLevelExp = profile.level * 100;
  if (profile.experience >= nextLevelExp) {
    profile.level += 1;
    profile.experience -= nextLevelExp;
  }
  
  saveProfile(profile);
  return { profile, success: true, message: `Completed! +25 XP. Current Streak: ${profile.streak} days!` };
};

const defaultProfile: UserProfile = {
  name: "Explorer",
  careerPath: "Software Engineer",
  level: 1,
  experience: 0,
  completedTasks: [],
  skills: {},
  lastActive: new Date().toISOString(),
  streak: 0,
  lastStudyDate: ""
};
