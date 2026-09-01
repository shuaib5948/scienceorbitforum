export default function MissionPage() {
  return (
    <section className="mission-page">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <h1 style={{
          margin: 0,
          fontSize: 'clamp(1.2rem, 1.5vw, 1.5rem)',
          lineHeight: 1.2,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#081d3a',
        }}>
          Our Mission
        </h1>

        <p style={{
          margin: '1.5rem 0 0',
          fontSize: 'clamp(1.05rem, 1.5vw, 1.45rem)',
          lineHeight: 1.7,
          color: '#1c2f4e',
          maxWidth: 620,
        }}>
          To promote scientific research, STEM education, technological innovation, skill development, entrepreneurship, and public engagement by providing education, mentorship, scholarships, research support, infrastructure, collaborations, and outreach programmes that empower individuals and communities to address societal challenges and drive sustainable development.
        </p>
      </div>

      <div style={{
        minHeight: '460px',
        borderRadius: '28px',
        background: 'linear-gradient(135deg, #dfeaf8 0%, #9db9d7 100%)',
        boxShadow: '0 18px 40px rgba(8, 29, 58, 0.12)',
      }} />
    </section>
  );
}