export default function WhoWeArePage() {
  return (
    <section className="statement-screen who-we-are-page">
      <div className="statement-screen__container">
        <div className="statement-screen__content">
          <span className="statement-screen__eyebrow">
            About Science Orbit Forum
          </span>

          <h1 className="statement-screen__title">
            Who We Are
          </h1>

          <p className="statement-screen__desc">
            Science Orbit Forum brings together students, researchers, educators, innovators and curious minds to explore science through conversation, participation and shared learning in a community built for open inquiry and collaboration.
          </p>
        </div>

        <div className="statement-screen__media">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=75"
            alt="Science Orbit Forum community discussing research and collaboration"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}