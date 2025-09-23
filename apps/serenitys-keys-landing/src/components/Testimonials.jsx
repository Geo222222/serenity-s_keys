import React from "react";

const TESTIMONIALS = [
  {
    quote:
      "My daughter looks forward to typing class now. The email summary shows exactly what she improved.",
    name: "Amber, Chicago",
  },
  {
    quote:
      "The Launchpad made remote learning easy—Meet link, Typing.com, and notes all in one place.",
    name: "Jonathan, Austin",
  },
  {
    quote:
      "We went from 12 WPM to 32 WPM in a month. The structure and encouragement really work.",
    name: "Priya, Seattle",
  },
];

const Testimonials = () => (
  <section>
    <div className="container">
      <div className="section-label">Parent love</div>
      <h2 className="section-title">Results they feel, outcomes you can measure</h2>
      <div className="testimonial-stack">
        {TESTIMONIALS.map((testimonial) => (
          <figure key={testimonial.name} className="testimonial-card">
            <blockquote style={{ margin: 0, fontSize: "1.05rem" }}>
              “{testimonial.quote}”
            </blockquote>
            <figcaption style={{ marginTop: "18px", fontWeight: 600, color: "var(--color-muted)" }}>
              {testimonial.name}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
