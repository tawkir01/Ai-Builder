import Link from 'next/link';

const navItems = [
  { href: '/dashboard', label: 'Home' },
  { href: '/diagnosis', label: 'Diagnosis' },
  { href: '/roadmap', label: 'Roadmap' },
  { href: '/projects', label: 'Projects' },
  { href: '/opportunities', label: 'Earning' },
  { href: '/mock-interview', label: 'Interview' },
  { href: '/resume-builder', label: 'Resume' },
  { href: '/outreach', label: 'Outreach' },
];

export default function FeatureNav() {
  return (
    <nav style={{
      marginBottom: '1.5rem',
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'nowrap',
      overflowX: 'auto',
      padding: '0.6rem 0.75rem',
      background: 'rgba(17, 24, 39, 0.9)',
      backdropFilter: 'blur(12px)',
      borderRadius: '12px',
      border: '1px solid rgba(99, 102, 241, 0.15)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    }}>
      <span style={{
        fontSize: '0.8rem',
        fontWeight: 900,
        background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginRight: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
      }}>
        AI BUILDER
      </span>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          style={{
            color: '#94a3b8',
            textDecoration: 'none',
            fontSize: '0.8rem',
            fontWeight: 500,
            padding: '0.3rem 0.6rem',
            borderRadius: '6px',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease',
          }}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
