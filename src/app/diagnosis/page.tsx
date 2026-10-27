"use client";
import { useState } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { saveProfile, getProfile } from '@/lib/userProfile';

export default function Diagnosis() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [degree, setDegree] = useState("");
  const [skillRank, setSkillRank] = useState(5);
  const [interests, setInterests] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsLoading(true);
      try {
        const payload = {
          resumeText: "", 
          questionnaire: { degree, interests }
        };
        const res = await fetch('/api/ai/career-diagnosis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        const bestPath = data?.paths?.[0]?.pathName || "Software Engineer";
        
        // Save to User Profile for the roadmap access
        const profile = getProfile();
        profile.careerPath = bestPath;
        profile.level = Math.max(1, Math.floor(skillRank / 2)); // Map 10-scale to 5-level-scale
        profile.name = degree.split(" ")[0] || "Explorer"; // Give a simple name if possible
        saveProfile(profile);

        router.push('/roadmap');
      } catch (err) {
        console.error(err);
        const profile = getProfile();
        profile.careerPath = "Software Engineer";
        profile.level = Math.max(1, Math.floor(skillRank / 2));
        saveProfile(profile);
        router.push('/roadmap');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={`glass ${styles.card}`}>
        <h2>🧠 AI Career Diagnosis</h2>
        <div className={styles.progress}>Step {step} of 3</div>
        
        {step === 1 && (
          <div className={styles.qBox}>
            <p>What is your current degree or major?</p>
            <input 
              type="text" 
              placeholder="e.g. B.Tech Computer Science" 
              className={styles.input} 
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
            />
          </div>
        )}

        {step === 2 && (
          <div className={styles.qBox}>
            <p>How would you rate your practical coding skills out of 10?</p>
            <input 
              type="range" min="1" max="10" 
              value={skillRank} 
              onChange={e => setSkillRank(parseInt(e.target.value))} 
              className={styles.range}
            />
            <span>{skillRank}/10</span>
          </div>
        )}

        {step === 3 && (
          <div className={styles.qBox}>
            <p>What type of work excites you the most?</p>
            <textarea 
              placeholder="e.g. Building websites, training AI models..." 
              className={styles.textarea}
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
            />
          </div>
        )}

        <button disabled={isLoading} className={styles.btnAction} onClick={handleNext}>
          {isLoading ? "Analyzing..." : (step === 3 ? "Generate My Roadmap" : "Next step")}
        </button>
      </div>
    </div>
  );
}
