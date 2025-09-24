import React from "react";

const STORIES = [
  {
    name: "Alicia · Austin",
    copy: "We used to argue about typing homework. Now it is 45 calm minutes and she is proud of her speed.",
  },
  {
    name: "Jamal · Chicago",
    copy: "Coach DJ keeps things gentle and upbeat. My son asks if it is typing day yet.",
  },
  {
    name: "Priya · San Jose",
    copy: "The recap email makes it so easy to cheer her on. I know exactly what to practice.",
  },
];

const Testimonials = () => (
  <section className="alt">
    <div className="container">
      <div className="section-label">Parent voices</div>
      <h2 className="section-title">Real families, real calm</h2>
      <div className="testimonial-grid">
        {STORIES.map((story) => (
          <article key={story.name} className="card testimonial-card">
            <p>“{story.copy}”</p>
            <span>{story.name}</span>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
