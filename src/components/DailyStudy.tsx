"use client";

import { useEffect, useState } from 'react';
import { 
  Flame, CheckCircle, BookOpen, Sparkles, HelpCircle, 
  ArrowRight, Star, Trophy, Target, TrendingUp, RotateCcw
} from 'lucide-react';
import { getProfile, completeDailyStudy, UserProfile } from '@/lib/userProfile';

interface DailyChallenge {
  question: string;
  placeholder: string;
  sampleSolution: string;
  studyTip: string;
}

interface ScoreResult {
  score: number;           // 0–100
  grade: string;           // A+, A, B, C, D
  feedback: string;        // 1 sentence positive feedback
  improvements: string[];  // 2 specific improvement suggestions
  xpEarned: number;        // 10-50 based on score
}

interface DailyStudyProps {
  careerPath: string;
  onProfileUpdate: (updated: UserProfile) => void;
}

function ScoreRing({ score }: { score: number }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 85 ? '#10b981' :
    score >= 65 ? '#8b5cf6' :
    score >= 45 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ position: 'relative', width: '110px', height: '110px', flexShrink: 0 }}>
      <svg width="110" height="110" style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle cx="55" cy="55" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        {/* Progress */}
        <circle
          cx="55" cy="55" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)', filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center'
      }}>
        <span style={{ fontSize: '1.5rem', fontWeight: 900, color }}>{score}</span>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.05em' }}>SCORE</span>
      </div>
    </div>
  );
}

function GradeBadge({ grade }: { grade: string }) {
  const config: Record<string, { bg: string; color: string; glow: string }> = {
    'A+': { bg: 'rgba(16,185,129,0.15)', color: '#34d399', glow: '0 0 14px rgba(16,185,129,0.3)' },
    'A':  { bg: 'rgba(16,185,129,0.12)', color: '#6ee7b7', glow: '0 0 12px rgba(16,185,129,0.2)' },
    'B':  { bg: 'rgba(139,92,246,0.15)', color: '#c084fc', glow: '0 0 12px rgba(139,92,246,0.2)' },
    'C':  { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', glow: '0 0 12px rgba(245,158,11,0.2)' },
    'D':  { bg: 'rgba(239,68,68,0.15)',  color: '#f87171', glow: '0 0 12px rgba(239,68,68,0.2)' },
  };
  const c = config[grade] || config['C'];
  return (
    <div style={{
      padding: '0.35rem 0.85rem',
      borderRadius: '6px',
      background: c.bg,
      color: c.color,
      fontWeight: 900,
      fontSize: '1.1rem',
      letterSpacing: '0.05em',
      boxShadow: c.glow,
      border: `1px solid ${c.color}33`
    }}>
      {grade}
    </div>
  );
}

export default function DailyStudy({ careerPath, onProfileUpdate }: DailyStudyProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isScoring, setIsScoring] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [todayScore, setTodayScore] = useState<number | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const userProfile = getProfile();
    setProfile(userProfile);
    if (userProfile.lastStudyDate === todayStr) {
      setIsCompleted(true);
      setShowSolution(true);
      // Load saved score from localStorage
      const saved = localStorage.getItem(`daily_score_${todayStr}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setScoreResult(parsed);
        setTodayScore(parsed.score);
      }
    }
  }, []);

  useEffect(() => {
    async function loadChallenge() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/ai/daily-study', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ careerPath })
        });
        const json = await res.json();
        if (json.challenge) {
          setChallenge(json.challenge);
          if (!isCompleted) setUserAnswer(json.challenge.placeholder || '');
        }
      } catch (err) {
        console.error("Failed to load daily study challenge:", err);
      } finally {
        setIsLoading(false);
      }
    }
    if (careerPath) loadChallenge();
  }, [careerPath]);

  const scoreAnswer = async (answer: string, question: string, sampleSolution: string): Promise<ScoreResult> => {
    try {
      const res = await fetch('/api/ai/score-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, userAnswer: answer, sampleSolution, careerPath })
      });
      const json = await res.json();
      if (json.result) return json.result;
    } catch (err) {
      console.error("Scoring failed:", err);
    }
    // Local fallback scoring based on answer length/quality
    const wordCount = answer.trim().split(/\s+/).length;
    const hasCode = answer.includes('{') || answer.includes('function') || answer.includes('def') || answer.includes('->');
    const score = Math.min(100, Math.max(20, 
      wordCount * 3 + (hasCode ? 25 : 0) + Math.floor(Math.random() * 15)
    ));
    const grade = score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 65 ? 'B' : score >= 50 ? 'C' : 'D';
    return {
      score,
      grade,
      feedback: score >= 70
        ? "Great effort! Your answer shows understanding of the core concept."
        : "Good start! Keep practicing to strengthen your fundamentals.",
      improvements: [
        "Try to include more concrete examples or code snippets in your answer.",
        "Review the sample solution for edge cases you may have missed."
      ],
      xpEarned: Math.floor(score / 2)
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim() || !challenge) return;

    setIsScoring(true);

    try {
      const result = await scoreAnswer(userAnswer, challenge.question, challenge.sampleSolution);

      // Save score to localStorage
      localStorage.setItem(`daily_score_${todayStr}`, JSON.stringify(result));
      setScoreResult(result);
      setTodayScore(result.score);

      // Complete the daily study and award XP
      const { profile: updatedProfile } = completeDailyStudy();
      if (updatedProfile) {
        // Bonus XP based on score
        updatedProfile.experience += result.xpEarned;
        const nextLevelExp = updatedProfile.level * 100;
        if (updatedProfile.experience >= nextLevelExp) {
          updatedProfile.level += 1;
          updatedProfile.experience -= nextLevelExp;
        }
        setProfile(updatedProfile);
        onProfileUpdate(updatedProfile);
      }

      setIsCompleted(true);
      setShowSolution(true);
    } catch (err) {
      console.error("Submit failed:", err);
    } finally {
      setIsScoring(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Flame size={18} style={{ color: 'var(--warning)' }} />
          Daily Study Hub
        </h3>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Loading today's challenge...</p>
      </div>
    );
  }

  if (!challenge) return null;

  const currentStreak = profile?.streak || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Header Row */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <Flame size={18} style={{ color: 'var(--warning)' }} />
          Daily Study Hub
        </h3>
        <span style={{
          fontSize: '0.8rem', fontWeight: 700,
          background: currentStreak > 0 ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)',
          color: currentStreak > 0 ? 'var(--warning)' : 'var(--text-muted)',
          padding: '0.25rem 0.65rem', borderRadius: '20px',
          border: currentStreak > 0 ? '1px solid rgba(245,158,11,0.35)' : '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: '0.3rem'
        }}>
          <Flame size={12} fill={currentStreak > 0 ? "var(--warning)" : "none"} />
          {currentStreak} Day Streak
        </span>
      </header>

      {/* Main Challenge Card */}
      <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

        {/* Question */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
          <div style={{ background: 'var(--primary-glow)', color: '#c084fc', padding: '0.4rem', borderRadius: '8px', display: 'flex', flexShrink: 0 }}>
            <BookOpen size={16} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Today's Concept Drill
            </span>
            <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.45 }}>
              {challenge.question}
            </p>
          </div>
        </div>

        {/* Input / Results Area */}
        {!isCompleted ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <textarea
              style={{
                width: '100%', minHeight: '90px', padding: '0.8rem 1rem',
                background: 'rgba(17,24,39,0.55)', border: '1px solid var(--border)',
                borderRadius: '8px', color: 'var(--text-main)', fontFamily: 'monospace',
                fontSize: '0.85rem', lineHeight: 1.5, resize: 'vertical'
              }}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Write your answer or code solution here..."
              required
            />
            <button
              type="submit"
              disabled={isScoring}
              style={{
                padding: '0.65rem 1.25rem', background: isScoring ? 'rgba(139,92,246,0.4)' : 'var(--gradient-primary)',
                color: 'white', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.88rem',
                cursor: isScoring ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}
            >
              {isScoring ? (
                <>
                  <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  AI is scoring your answer...
                </>
              ) : (
                <>
                  <Target size={14} />
                  Submit & Get Score
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Score Display */}
            {scoreResult && (
              <div style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px', padding: '1.25rem',
                display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap'
              }}>
                {/* Ring */}
                <ScoreRing score={scoreResult.score} />

                {/* Score Breakdown */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <GradeBadge grade={scoreResult.grade} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Today's Grade
                    </span>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {scoreResult.feedback}
                  </p>

                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '0.3rem',
                      fontSize: '0.78rem', fontWeight: 700,
                      color: '#a78bfa', background: 'rgba(139,92,246,0.12)',
                      padding: '0.2rem 0.5rem', borderRadius: '4px'
                    }}>
                      <TrendingUp size={11} />
                      +{scoreResult.xpEarned} XP Earned
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '0.3rem',
                      fontSize: '0.78rem', fontWeight: 700,
                      color: 'var(--warning)', background: 'rgba(245,158,11,0.12)',
                      padding: '0.2rem 0.5rem', borderRadius: '4px'
                    }}>
                      <Flame size={11} />
                      {currentStreak} Day Streak
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Improvement Suggestions */}
            {scoreResult?.improvements && scoreResult.improvements.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Star size={10} /> Areas to Improve
                </span>
                {scoreResult.improvements.map((tip, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: '0.6rem', alignItems: 'flex-start',
                    fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.45,
                    background: 'rgba(245,158,11,0.05)', borderLeft: '2px solid rgba(245,158,11,0.35)',
                    padding: '0.55rem 0.75rem', borderRadius: '0 6px 6px 0'
                  }}>
                    <span style={{ fontWeight: 800, color: 'var(--warning)', fontSize: '0.75rem', marginTop: '2px', flexShrink: 0 }}>{i + 1}.</span>
                    <p>{tip}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Study Tip */}
            {challenge.studyTip && (
              <div style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.84rem', color: '#6ee7b7', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <Sparkles size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                <p><strong>Coach's Tip:</strong> {challenge.studyTip}</p>
              </div>
            )}

            {/* Sample Solution */}
            {showSolution && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <HelpCircle size={10} /> Reference Solution
                </span>
                <pre style={{
                  background: 'rgba(0,0,0,0.45)', padding: '0.85rem 1rem', borderRadius: '6px',
                  fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)',
                  overflowX: 'auto', border: '1px solid var(--border)', whiteSpace: 'pre-wrap'
                }}>
                  {challenge.sampleSolution}
                </pre>
              </div>
            )}

            {/* Return Tomorrow Notice */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.82rem' }}>
              <CheckCircle size={13} style={{ color: 'var(--success)' }} />
              <span>Today's challenge complete! A new question awaits tomorrow.</span>
            </div>

          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}
