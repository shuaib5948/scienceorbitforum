export default function MissionPage() {
  return (
    <section className="statement-screen mission-page">
      <div className="statement-screen__container">
        <div className="statement-screen__content">
          <span className="statement-screen__eyebrow">
            Our Purpose & Drive
          </span>

          <h1 className="statement-screen__title">
            Our Mission
          </h1>

          <p className="statement-screen__desc">
            To promote scientific research, STEM education, technological innovation, skill development, entrepreneurship, and public engagement by providing education, mentorship, scholarships, research support, infrastructure, collaborations, and outreach programmes that empower individuals and communities to address societal challenges and drive sustainable development.
          </p>
        </div>

        <div className="statement-screen__media">
          <img
            src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=75"
            alt="Scientific research in laboratory advancing human knowledge"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}