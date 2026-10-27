"use client";
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.css';
import { getProfile } from '@/lib/userProfile';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

import { BrainCircuit, Trophy, RefreshCw, LayoutDashboard, ChevronRight } from 'lucide-react';

export default function AssessmentPage() {
  return (
    <Suspense fallback={<AssessmentLoadingState />}>
      <AssessmentPageContent />
    </Suspense>
  );
}

function AssessmentLoadingState() {
  return (
    <div className={styles.container}>
      <div className={`glass ${styles.loadingState}`}>
        <BrainCircuit className={styles.pulseIcon} size={48} />
        <h2>Loading assessment...</h2>
        <p>Preparing your custom challenge.</p>
      </div>
    </div>
  );
}

function AssessmentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const profile = getProfile();
  const field = searchParams.get('field') || profile.careerPath || "Software Engineer";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuestions() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/ai/assessment?field=${encodeURIComponent(field)}`);
        if (!res.ok) throw new Error('Failed to fetch questions');
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('No questions generated. Please try again.');
        }
        setQuestions(data);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    }
    fetchQuestions();
  }, [field]);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...userAnswers, answer];
    setUserAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      let finalScore = 0;
      questions.forEach((q, idx) => {
        if (q.correctAnswer === newAnswers[idx]) finalScore++;
      });
      setScore(finalScore);
      setIsFinished(true);
      submitResult(finalScore, newAnswers);
    }
  };

  const submitResult = async (finalScore: number, answers: string[]) => {
    const payload = {
      userId: profile.name || 'anonymous',
      field,
      score: finalScore,
      totalQuestions: questions.length,
      questions: questions.map((q, idx) => ({
        question: q.question,
        selectedAnswer: answers[idx],
        correctAnswer: q.correctAnswer,
        isCorrect: q.correctAnswer === answers[idx]
      }))
    };

    try {
      await fetch('/api/ai/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error("Failed to save result", err);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={`glass ${styles.loadingState}`}>
          <BrainCircuit className={styles.pulseIcon} size={48} />
          <h2>Analyzing your engineering profile...</h2>
          <p>Generating custom questions for {field} roles.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={`glass ${styles.errorCard}`}>
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button className="btn-primary" onClick={() => window.location.reload()}>
            <RefreshCw size={18} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const percentage = (score / questions.length) * 100;
    return (
      <div className={styles.container}>
        <div className={`glass ${styles.resultCard}`}>
          <div className={styles.iconContainer}>
            {percentage >= 70 ? <Trophy size={60} color="var(--primary)" /> : <BrainCircuit size={60} color="var(--accent)" />}
          </div>
          <h2>Assessment Complete!</h2>
          <div className={styles.scoreDisplay}>
            <span className={styles.scoreNumber}>{score}</span>
            <span className={styles.totalNumber}>/ {questions.length}</span>
          </div>
          <p className={styles.feedback}>
            {percentage >= 80 ? "Outstanding! You're ready for the big leagues." : 
             percentage >= 50 ? "Good job! A few more practice steps and you'll be there." : 
             "Need more practice. Check your personalized roadmap to improve."}
          </p>
          <div className={styles.actionButtons}>
            <button className="btn-primary" onClick={() => router.push('/dashboard')}>
              <LayoutDashboard size={18} /> Back to Dashboard
            </button>
            <button className="btn-secondary" onClick={() => window.location.reload()}>
              <RefreshCw size={18} /> Retake Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1>{field} Skills</h1>
          <span className={styles.badge}>Level: Graduate</span>
        </div>
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <p>Question {currentIndex + 1} of {questions.length}</p>
        </div>
      </div>

      <div className={`glass ${styles.questionCard}`}>
        <h3 className={styles.questionText}>{currentQuestion.question}</h3>
        <div className={styles.optionsGrid}>
          {currentQuestion.options.map((option, idx) => (
            <button 
              key={idx} 
              className={styles.optionBtn}
              onClick={() => handleAnswer(option)}
            >
              <span className={styles.optionLetter}>{String.fromCharCode(65 + idx)}</span>
              <span className={styles.optionContent}>{option}</span>
              <ChevronRight className={styles.optionArrow} size={16} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
