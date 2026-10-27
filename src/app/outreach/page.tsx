"use client";

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import FeatureNav from '@/components/FeatureNav';
import { getProfile, UserProfile } from '@/lib/userProfile';
import { 
  Mail, 
  Linkedin, 
  Send, 
  Copy, 
  Check, 
  Briefcase, 
  Sparkles, 
  Layers 
} from 'lucide-react';

interface OutreachTemplates {
  emailSubject: string;
  emailBody: string;
  linkedinMessage: string;
}

export default function OutreachPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [careerPath, setCareerPath] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [templates, setTemplates] = useState<OutreachTemplates | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedLinkedin, setCopiedLinkedin] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const userProfile = getProfile();
    setProfile(userProfile);
    setCareerPath(userProfile.careerPath || 'Software Engineer');
    
    // Auto-select skills from profile if available
    if (userProfile.skills) {
      const skillsArray = Object.keys(userProfile.skills);
      setSelectedSkills(skillsArray);
    }
  }, []);

  const handleToggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !jobDescription.trim()) {
      setError('Please fill out the Company Name and Job Description.');
      return;
    }
    
    setError('');
    setIsLoading(true);
    setTemplates(null);

    try {
      const res = await fetch('/api/ai/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          careerPath,
          skills: selectedSkills.length > 0 ? selectedSkills : ['React', 'Node.js', 'Problem Solving'],
          companyName,
          jobDescription
        })
      });

      const data = await res.json();
      if (data.outreach) {
        setTemplates(data.outreach);
      } else {
        throw new Error(data.error || 'Failed to generate templates');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: 'email' | 'linkedin') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedLinkedin(true);
      setTimeout(() => setCopiedLinkedin(false), 2000);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        <FeatureNav />
        
        <header className={styles.header}>
          <h1>
            <Sparkles size={32} style={{ color: 'var(--primary)' }} />
            AI Outreach Assistant
          </h1>
          <p>Draft high-conversion, personalized recruiter pitches using your mastered skills.</p>
        </header>

        <div className={styles.grid}>
          {/* Left Column: Form Card */}
          <div className={`glass ${styles.card}`}>
            <h2 className={styles.cardTitle}>
              <Briefcase size={20} style={{ color: 'var(--primary)' }} />
              Outreach Parameters
            </h2>

            <form onSubmit={handleGenerate} className={styles.formGroup} style={{ gap: '1.25rem' }}>
              <div className={styles.formGroup}>
                <label htmlFor="careerPath">Target Role / Title</label>
                <input 
                  type="text" 
                  id="careerPath" 
                  className={styles.input}
                  value={careerPath} 
                  onChange={(e) => setCareerPath(e.target.value)}
                  placeholder="e.g. Frontend Engineer"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="companyName">Target Company</label>
                <input 
                  type="text" 
                  id="companyName" 
                  className={styles.input}
                  value={companyName} 
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Stripe, Google, or a local startup"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="jobDesc">Job Description / Requirements</label>
                <textarea 
                  id="jobDesc" 
                  className={styles.textarea}
                  value={jobDescription} 
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job posting requirements or key responsibilities here..."
                  required
                />
              </div>

              <div className={styles.skillsSection}>
                <span className={styles.skillsLabel}>Include Mastered Skills</span>
                {profile && Object.keys(profile.skills).length > 0 ? (
                  <div className={styles.skillsGrid}>
                    {Object.keys(profile.skills).map((skill) => {
                      const isChecked = selectedSkills.includes(skill);
                      return (
                        <label 
                          key={skill} 
                          className={`${styles.skillCheckbox} ${isChecked ? styles.skillCheckboxChecked : ''}`}
                        >
                          <input 
                            type="checkbox" 
                            checked={isChecked}
                            onChange={() => handleToggleSkill(skill)}
                          />
                          {skill}
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                    No profile skills found. We'll automatically match general industry skills.
                  </p>
                )}
              </div>

              {error && <p style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>{error}</p>}

              <button 
                type="submit" 
                className={styles.btnSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className={styles.loader}></div>
                    Generating Templates...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Generate Pitch Templates
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Templates Card */}
          <div className={`glass ${styles.card}`}>
            <h2 className={styles.cardTitle}>
              <Layers size={20} style={{ color: 'var(--accent)' }} />
              Generated Pitches
            </h2>

            {!templates && !isLoading && (
              <div className={styles.emptyState}>
                <Mail size={48} />
                <p>Fill out the outreach details and click generate to generate custom messaging templates.</p>
              </div>
            )}

            {isLoading && (
              <div className={styles.emptyState}>
                <Sparkles className={styles.loader} style={{ width: '2.5rem', height: '2.5rem', border: 'none', borderTop: 'none' }} />
                <p>AI is matching your skills with the job description...</p>
              </div>
            )}

            {templates && (
              <div className={styles.templatesContainer}>
                {/* Cold Email */}
                <div className={styles.templateCard}>
                  <div className={styles.templateHeader}>
                    <span className={styles.templateType}>Cold Email Pitch</span>
                    <button 
                      className={styles.btnCopy} 
                      onClick={() => copyToClipboard(`Subject: ${templates.emailSubject}\n\n${templates.emailBody}`, 'email')}
                    >
                      {copiedEmail ? (
                        <>
                          <Check size={14} style={{ color: 'var(--success)' }} />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          Copy Email
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className={styles.subjectLine}>
                    <strong>Subject:</strong> {templates.emailSubject}
                  </div>
                  
                  <div className={styles.templateBody}>
                    {templates.emailBody}
                  </div>
                </div>

                {/* LinkedIn Connection Message */}
                <div className={styles.templateCard}>
                  <div className={styles.templateHeader}>
                    <span className={styles.templateType} style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>
                      LinkedIn Connection Note
                    </span>
                    <button 
                      className={styles.btnCopy} 
                      onClick={() => copyToClipboard(templates.linkedinMessage, 'linkedin')}
                    >
                      {copiedLinkedin ? (
                        <>
                          <Check size={14} style={{ color: 'var(--success)' }} />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          Copy Note
                        </>
                      )}
                    </button>
                  </div>

                  <div className={styles.linkedinBox}>
                    {templates.linkedinMessage}
                  </div>
                  
                  <div className={styles.charCount}>
                    {templates.linkedinMessage.length} / 300 characters
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
