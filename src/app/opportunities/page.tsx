"use client";
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import FeatureNav from '@/components/FeatureNav';
import { getProfile, UserProfile } from '@/lib/userProfile';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Zap, 
  Search,
  Filter
} from 'lucide-react';

interface Opportunity {
  type: "INTERNSHIP" | "FREELANCE" | "FULL-TIME";
  title: string;
  company: string;
  match: number;
  compensation: string;
  location: string;
  skills: string[];
  matchReason: string;
}

export default function OpportunitiesPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'INTERNSHIP' | 'FREELANCE' | 'FULL-TIME'>('ALL');

  useEffect(() => {
    async function fetchOpps() {
      const userProfile = getProfile();
      setProfile(userProfile);

      try {
        const res = await fetch('/api/ai/opportunities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            careerPath: userProfile.careerPath || 'Software Engineer', 
            level: userProfile.level || 1
          })
        });
        const data = await res.json();
        if (data.opportunities && Array.isArray(data.opportunities)) {
          setOpportunities(data.opportunities);
        }
      } catch (err) {
        console.error("Failed to load ops:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOpps();
  }, []);

  const filteredOpps = activeTab === 'ALL' 
    ? opportunities 
    : opportunities.filter(opp => opp.type === activeTab);

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        <FeatureNav />
        <header className={styles.header}>
          <div className={styles.headerIcon}><Zap size={40} color="var(--success)" /></div>
          <h1>Earning Engine</h1>
          <p>AI-matched opportunities for your <strong>{profile?.careerPath || 'Software Engineer'}</strong> profile.</p>
        </header>

        <div className={styles.filterBar}>
          <button 
            className={activeTab === 'ALL' ? styles.activeFilter : ''} 
            onClick={() => setActiveTab('ALL')}
          >All</button>
          <button 
            className={activeTab === 'INTERNSHIP' ? styles.activeFilter : ''} 
            onClick={() => setActiveTab('INTERNSHIP')}
          >Internships</button>
          <button 
            className={activeTab === 'FULL-TIME' ? styles.activeFilter : ''} 
            onClick={() => setActiveTab('FULL-TIME')}
          >Full-Time</button>
          <button 
            className={activeTab === 'FREELANCE' ? styles.activeFilter : ''} 
            onClick={() => setActiveTab('FREELANCE')}
          >Freelance</button>
        </div>

        <div className={styles.grid}>
          {isLoading ? (
            <div className={styles.loadingState}>
              <div className="loader"></div>
              <p>Scanning global markets for your profile...</p>
            </div>
          ) : filteredOpps.length === 0 ? (
            <div className={styles.emptyState}>
              <Search size={48} color="var(--text-dim)" />
              <p>No matching {activeTab.toLowerCase()} opportunities found right now.</p>
            </div>
          ) : (
            filteredOpps.map((opp, idx) => (
              <div key={idx} className={`glass ${styles.oppCard}`}>
                <div className={styles.cardHeader}>
                  <span className={`${styles.tag} ${styles[opp.type.replace('-', '').toLowerCase()]}`}>
                    {opp.type}
                  </span>
                  <div className={styles.matchBadge}>
                    <Zap size={14} /> {opp.match}% Match
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <h2>{opp.title}</h2>
                  <p className={styles.company}><Building2 size={16} /> {opp.company}</p>
                  
                  <div className={styles.locationComp}>
                    <span><MapPin size={14} /> {opp.location}</span>
                    <span><DollarSign size={14} /> {opp.compensation}</span>
                  </div>

                  <div className={styles.skillsList}>
                    {opp.skills?.map((skill, sIdx) => (
                      <span key={sIdx} className={styles.skillTag}>{skill}</span>
                    ))}
                  </div>

                  <p className={styles.matchReason}>
                    <strong>Why you match:</strong> {opp.matchReason}
                  </p>
                </div>

                <button className={styles.btnApply}>
                  Quick Apply <Briefcase size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
