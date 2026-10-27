"use client";
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import FeatureNav from '@/components/FeatureNav';
import { getProfile, UserProfile } from '@/lib/userProfile';
import Link from 'next/link';
import MarketPulse from '@/components/MarketPulse';
import DailyStudy from '@/components/DailyStudy';

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  if (!profile) return <div className={styles.loader}>Loading your impact...</div>;

  const earningPotential = profile.level * 15000;
  const matchRate = 40 + (profile.level * 10);
  const currentStreak = profile.streak || 0;
  const todayStr = new Date().toISOString().split('T')[0];
  const savedScore = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem(`daily_score_${todayStr}`) || 'null')
    : null;

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        <FeatureNav />
        <header className={styles.header}>
          <h1>Your Impact Dashboard 🚀</h1>
          <p>Tracking your journey from graduate to professional.</p>
        </header>

        <div className={styles.statsGrid}>
          <div className={`glass ${styles.statCard}`}>
            <h3>Current Level</h3>
            <div className={styles.statValue}>{profile.level}</div>
            <p>Experience: {profile.experience} XP</p>
          </div>
          <div className={`glass ${styles.statCard}`}>
            <h3>Earning Potential</h3>
            <div className={styles.statValue}>₹{earningPotential.toLocaleString()}/mo</div>
            <p>Based on your {profile.level} skills</p>
          </div>
          <div className={`glass ${styles.statCard}`}>
            <h3>Job Match Rate</h3>
            <div className={styles.statValue}>{matchRate}%</div>
            <p>Top {profile.careerPath} roles</p>
          </div>
          <div className={`glass ${styles.statCard}`}>
            <h3>🔥 Study Streak</h3>
            <div className={styles.statValue} style={{ color: currentStreak > 0 ? 'var(--warning)' : 'var(--text-dim)' }}>
              {currentStreak}
            </div>
            <p>{currentStreak > 0 ? `${currentStreak} day${currentStreak > 1 ? 's' : ''} in a row!` : 'Start your streak today'}</p>
          </div>
          <div className={`glass ${styles.statCard}`}>
            <h3>📊 Today's Score</h3>
            <div
              className={styles.statValue}
              style={{
                color: savedScore
                  ? savedScore.score >= 85 ? 'var(--success)'
                  : savedScore.score >= 65 ? 'var(--primary)'
                  : 'var(--warning)'
                  : 'var(--text-dim)'
              }}
            >
              {savedScore ? `${savedScore.score}` : '—'}
            </div>
            <p>
              {savedScore
                ? `Grade: ${savedScore.grade} · +${savedScore.xpEarned} XP`
                : 'Complete daily study to score'}
            </p>
          </div>
        </div>

        <div className={styles.contentGrid}>
          <div className={`glass ${styles.section}`}>
            <h2>Skills Mastered</h2>
            <div className={styles.skillsList}>
              {Object.entries(profile.skills).length > 0 ? (
                Object.entries(profile.skills).map(([skill, val]) => (
                  <div key={skill} className={styles.skillItem}>
                    <span>{skill}</span>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${Math.min(val, 100)}%` }}></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.empty}>No skills tracked yet. Start your <Link href="/roadmap">Roadmap</Link>!</p>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className={`glass ${styles.section}`}>
              <DailyStudy careerPath={profile.careerPath || 'Software Engineer'} onProfileUpdate={setProfile} />
            </div>

            <div className={`glass ${styles.section}`}>
              <h2>Recent Achievements</h2>
              <div className={styles.achievements}>
                {profile.completedTasks.length > 0 ? (
                  profile.completedTasks.slice(-3).map((task, idx) => (
                    <div key={idx} className={styles.achievementItem}>
                      🎉 Completed Task: {task}
                    </div>
                  ))
                ) : (
                  <p className={styles.empty}>Complete tasks to earn achievements!</p>
                )}
              </div>
            </div>

            <div className={`glass ${styles.section}`}>
              <MarketPulse careerPath={profile.careerPath || 'Software Engineer'} />
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Link href="/roadmap" className={styles.cta}>Continue Learning</Link>
          <Link href="/opportunities" className={styles.ctaSecondary}>View Open Jobs</Link>
        </div>
      </main>
    </div>
  );
}
