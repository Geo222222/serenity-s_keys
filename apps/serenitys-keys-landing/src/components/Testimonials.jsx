import React from "react";

const TESTIMONIALS = [
  {
    quote:
      "Serenity's Keys made typing approachable for our three-year-old. The coach sang through the keys and we saw real progress in a week.",
    name: "Danielle, Atlanta",
  },
  {
    quote:
      "Launchpad keeps everything in one link. The Google Calendar invite and Stripe receipt land in my inbox without me chasing anything.",
    name: "Jonathan, Austin",
  },
  {
    quote:
      "We went from 12 WPM to 32 WPM in a month. The structure and encouragement really work--even for my middle schooler who thought typing was boring before.",
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
