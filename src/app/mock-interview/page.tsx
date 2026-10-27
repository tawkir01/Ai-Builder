"use client";

import { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';
import FeatureNav from '@/components/FeatureNav';
import { 
  Mic, 
  Send, 
  RotateCcw, 
  Award, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Loader2,
  User,
  Bot
} from 'lucide-react';

interface EvaluationReport {
  score: number;
  overallFeedback: string;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
}

export default function MockInterviewPage() {
  const [chatHistory, setChatHistory] = useState<{role: 'ai' | 'user', content: string}[]>([
    { role: 'ai', content: "Hello! I'm your AI interviewer. I've reviewed your profile for the Software Engineer role. Let's start—can you tell me about a challenging technical project you've led recently?" }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationReport | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping]);

  const handleSubmit = async (isEvaluation = false) => {
    if ((!inputText.trim() && !isEvaluation) || isLoading) return;

    let updatedHistory = [...chatHistory];
    if (!isEvaluation) {
      const userMessage = { role: 'user' as const, content: inputText };
      setChatHistory(prev => [...prev, userMessage]);
      setInputText("");
    }
    
    setIsLoading(true);
    setIsTyping(true);

    try {
      const payload = {
        pathName: "Software Engineer",
        chatHistory: isEvaluation ? chatHistory : [...chatHistory, { role: 'user', content: inputText }],
        evaluate: isEvaluation
      };

      const res = await fetch('/api/ai/mock-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (isEvaluation) {
        try {
          const report = typeof data.reply === 'string' ? JSON.parse(data.reply) : data.reply;
          setEvaluation(report);
        } catch (e) {
          console.error("Failed to parse evaluation:", e);
        }
      } else if (data.reply) {
        // Simulate a slight delay for "personality"
        setTimeout(() => {
          setChatHistory(prev => [...prev, { role: 'ai', content: data.reply }]);
          setIsTyping(false);
        }, 1000);
      } else {
        setChatHistory(prev => [...prev, { role: 'ai', content: "I'm sorry, I'm having trouble connecting. Could you please repeat that?" }]);
        setIsTyping(false);
      }
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { role: 'ai', content: "Network error occurred. Please check your connection." }]);
      setIsTyping(false);
    } finally {
      setIsLoading(false);
      if (isEvaluation) setIsTyping(false);
    }
  };

  const handleRestart = () => {
    setChatHistory([{ role: 'ai', content: "Hello! I'm your AI interviewer. I've reviewed your profile for the Software Engineer role. Let's start—can you tell me about a challenging technical project you've led recently?" }]);
    setEvaluation(null);
    setInputText("");
  };

  if (evaluation) {
    return (
      <div className={styles.container}>
        <main className={styles.mainContent}>
          <FeatureNav />
          <div className={styles.reportContainer}>
            <div className={`${styles.reportHeader} glass`}>
              <Award className={styles.awardIcon} size={48} />
              <h1>Interview Performance Report</h1>
              <div className={styles.scoreBadge}>
                <span className={styles.scoreValue}>{evaluation.score}</span>
                <span className={styles.scoreTotal}>/100</span>
              </div>
            </div>

            <div className={styles.reportGrid}>
              <section className={`${styles.reportCard} glass`}>
                <h3><TrendingUp size={20} /> Overall Feedback</h3>
                <p>{evaluation.overallFeedback}</p>
              </section>

              <section className={`${styles.reportCard} glass`}>
                <h3><CheckCircle size={20} color="#10b981" /> Key Strengths</h3>
                <ul>
                  {evaluation.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </section>

              <section className={`${styles.reportCard} glass`}>
                <h3><AlertCircle size={20} color="#f43f5e" /> Areas for Improvement</h3>
                <ul>
                  {evaluation.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </section>

              <section className={`${styles.reportCard} glass`}>
                <h3><Award size={20} /> Recommendation</h3>
                <p><strong>{evaluation.recommendation}</strong></p>
              </section>
            </div>

            <button onClick={handleRestart} className={styles.btnAction}>
              <RotateCcw size={18} /> Try Another Interview
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        <FeatureNav />
        <header className={styles.header}>
          <div className={styles.badge}>Live Session</div>
          <h1>AI Mock Interview 室</h1>
          <p>Practice for your <strong>Software Engineer</strong> interview with our expert AI.</p>
        </header>

        <div className={styles.interviewLayout}>
          <section className={styles.chatSection}>
            <div className={styles.chatHistory}>
              {chatHistory.map((chat, i) => (
                <div key={i} className={`${styles.messageWrapper} ${chat.role === 'ai' ? styles.wrapperAI : styles.wrapperUser}`}>
                  <div className={styles.avatar}>
                    {chat.role === 'ai' ? <Bot size={20} /> : <User size={20} />}
                  </div>
                  <div className={`${styles.messageContent} glass`}>
                    <p>{chat.content}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className={`${styles.messageWrapper} ${styles.wrapperAI}`}>
                  <div className={styles.avatar}><Bot size={20} /></div>
                  <div className={`${styles.messageContent} glass ${styles.typing}`}>
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className={`${styles.inputArea} glass`}>
              <textarea 
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Share your thoughts..." 
                className={styles.textarea}
                disabled={isLoading}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(false);
                  }
                }}
              />
              <div className={styles.controls}>
                <button className={styles.btnIcon} title="Voice Input">
                  <Mic size={20} />
                </button>
                <div className={styles.mainActions}>
                  <button 
                    className={styles.btnEvaluate} 
                    onClick={() => handleSubmit(true)}
                    disabled={chatHistory.length < 3 || isLoading}
                  >
                    <Award size={18} /> Finish & Evaluate
                  </button>
                  <button 
                    disabled={isLoading || !inputText.trim()} 
                    onClick={() => handleSubmit(false)} 
                    className={styles.btnSend}
                  >
                    {isLoading ? <Loader2 className={styles.spin} size={20} /> : <Send size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <aside className={`${styles.sidebar} glass`}>
            <h3>Interview Tips</h3>
            <ul className={styles.tipsList}>
              <li><CheckCircle size={14} /> Be specific with your examples (STAR method).</li>
              <li><CheckCircle size={14} /> Focus on your individual contribution.</li>
              <li><CheckCircle size={14} /> Think out loud during technical questions.</li>
            </ul>
            <div className={styles.sessionInfo}>
              <p>Duration: ~15 mins</p>
              <p>Type: Technical + Behavioral</p>
            </div>
            <button onClick={handleRestart} className={styles.btnRestart}>
              <RotateCcw size={16} /> Reset Session
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}
