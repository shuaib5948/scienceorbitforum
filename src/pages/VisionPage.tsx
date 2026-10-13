export default function VisionPage() {
  return (
    <section className="statement-screen vision-page">
      <div className="statement-screen__container">
        <div className="statement-screen__content">
          <span className="statement-screen__eyebrow">
            Our Aspiration
          </span>

          <h1 className="statement-screen__title">
            Our Vision
          </h1>

          <p className="statement-screen__desc">
            To advance humanity by fostering scientific excellence, technological innovation, and lifelong learning, enabling every talented individual to contribute meaningfully to a more equitable, sustainable, and technologically advanced world.
          </p>
        </div>

        <div className="statement-screen__media">
          <img
            src="https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1000&q=75"
            alt="Futuristic science and technology vision for human progress"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}