"use client";

import { useEffect, useState } from 'react';
import { TrendingUp, Briefcase, CircleDollarSign, Activity, Flame } from 'lucide-react';

interface MarketTrend {
  skill: string;
  demandGrowth: number;
  hiringStatus: 'HOT' | 'STABLE' | 'GROWING';
  averageSalary: string;
}

interface MarketPulseData {
  demandScore: number;
  hiringDemand: 'HIGH' | 'MODERATE' | 'LOW';
  openPositionsEstimated: number;
  trends: MarketTrend[];
}

interface MarketPulseProps {
  careerPath: string;
}

export default function MarketPulse({ careerPath }: MarketPulseProps) {
  const [data, setData] = useState<MarketPulseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMarketPulse() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/ai/market-pulse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ careerPath })
        });
        const json = await res.json();
        if (json.marketPulse) {
          setData(json.marketPulse);
        }
      } catch (err) {
        console.error("Failed to load market pulse:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (careerPath) {
      loadMarketPulse();
    }
  }, [careerPath]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={18} style={{ color: 'var(--accent)' }} className="pulse" />
          Market Pulse Tracker
        </h3>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Analyzing recent job postings and skill demands...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: '1rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
        Could not load market data.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <Activity size={18} style={{ color: 'var(--accent)' }} />
          Market Pulse Tracker
        </h3>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          background: data.hiringDemand === 'HIGH' ? 'var(--primary-glow)' : 'rgba(255, 255, 255, 0.05)',
          color: data.hiringDemand === 'HIGH' ? '#a78bfa' : 'var(--text-muted)',
          padding: '0.2rem 0.5rem',
          borderRadius: '4px',
          border: '1px solid rgba(139, 92, 246, 0.2)'
        }}>
          Hiring: {data.hiringDemand}
        </span>
      </header>

      {/* Hero Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 500, marginBottom: '0.25rem' }}>
            <TrendingUp size={12} style={{ color: 'var(--success)' }} />
            Demand Score
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
            {data.demandScore}<span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 400 }}>/100</span>
          </div>
        </div>

        <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 500, marginBottom: '0.25rem' }}>
            <Briefcase size={12} style={{ color: 'var(--accent)' }} />
            Estimated Openings
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {data.openPositionsEstimated.toLocaleString()}+
          </div>
        </div>
      </div>

      {/* Skill Trends */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Trending Skills for {careerPath}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {data.trends.map((item, index) => (
            <div 
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.6rem 0.8rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                fontSize: '0.85rem'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.skill}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <CircleDollarSign size={10} /> Avg: {item.averageSalary}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.15rem' }}>
                <span style={{ 
                  color: item.demandGrowth >= 0 ? 'var(--success)' : 'var(--danger)', 
                  fontWeight: 700 
                }}>
                  {item.demandGrowth >= 0 ? `+${item.demandGrowth}%` : `${item.demandGrowth}%`}
                </span>
                <span style={{ 
                  fontSize: '0.7rem', 
                  color: item.hiringStatus === 'HOT' ? 'var(--accent)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.15rem',
                  fontWeight: 600
                }}>
                  {item.hiringStatus === 'HOT' && <Flame size={8} />} {item.hiringStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
