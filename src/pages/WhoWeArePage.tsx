export default function WhoWeArePage() {
  return (
    <section style={{
      width: 'min(1200px, calc(100% - 2rem))',
      margin: 'clamp(2rem, 5vw, 4rem) auto',
      display: 'grid',
      gridTemplateColumns: '1.1fr 0.9fr',
      gap: 'clamp(1.5rem, 3vw, 3rem)',
      alignItems: 'center',
    }}>
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
          Who We Are
        </h1>

        <p style={{
          margin: '1.5rem 0 0',
          fontSize: 'clamp(1.05rem, 1.5vw, 1.45rem)',
          lineHeight: 1.7,
          color: '#1c2f4e',
          maxWidth: 620,
        }}>
          Science Orbit Forum brings together students, researchers, educators, innovators and curious minds to explore science through conversation, participation and shared learning in a community built for open inquiry and collaboration.
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