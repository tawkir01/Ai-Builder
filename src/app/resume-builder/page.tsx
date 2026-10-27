"use client";
import { useState } from 'react';
import styles from './page.module.css';
import FeatureNav from '@/components/FeatureNav';

interface ResumeSection {
  heading: string;
  items: string[];
}

interface ResumeData {
  name: string;
  title: string;
  sections: ResumeSection[];
}

export default function ResumeBuilderPage() {
  const [jobTitle, setJobTitle] = useState("");
  const [rawExperience, setRawExperience] = useState("");
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormat = async () => {
    if (!jobTitle.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle, rawExperience })
      });
      const data = await res.json();
      if (data.resume) {
        setResume(data.resume);
      }
    } catch (err) {
      console.error("Resume format error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        <FeatureNav />
        <header className={styles.header}>
          <h1>AI Resume Builder 📄</h1>
          <p>Generate an ATS-friendly resume to match high-paying jobs.</p>
        </header>

        <section className={styles.builderGrid}>
          <div className={`glass ${styles.editor}`}>
            <h2>Raw Information</h2>
            <p className={styles.hint}>Paste your raw experience, bullets, or LinkedIn summary. AI will format it.</p>
            <input
              type="text"
              placeholder="Desired Job Title (e.g. React Developer)"
              className={styles.input}
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
            />
            <textarea
              placeholder="Experience: Worked at XYZ corp for 2 years doing java..."
              className={styles.textarea}
              value={rawExperience}
              onChange={e => setRawExperience(e.target.value)}
            />
            <button disabled={isLoading} className={styles.btnAction} onClick={handleFormat}>
              {isLoading ? "Formatting..." : "✨ Auto-Format with AI"}
            </button>
          </div>

          <div className={`glass ${styles.preview}`}>
            <div className={styles.previewHeader}>
              <h2>Live ATS Preview</h2>
              <button className={styles.btnSecondary}>⬇️ PDF</button>
            </div>

            <div className={styles.resumeDoc}>
              <h3 className={styles.docName}>{resume?.name || "YOUR NAME"}</h3>
              <p className={styles.docTitle}>{resume?.title || "Job Title"}</p>
              {resume?.sections?.map((section, idx) => (
                <div key={idx} className={styles.docSection}>
                  <h4>{section.heading}</h4>
                  <div className={styles.jobBlock}>
                    <ul>
                      {section.items.map((item, iIdx) => (
                        <li key={iIdx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )) || (
                <div className={styles.docSection}>
                  <p style={{ color: '#94a3b8', textAlign: 'center', paddingTop: '2rem' }}>
                    Enter your info on the left and click &quot;Auto-Format&quot; to generate your resume!
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
