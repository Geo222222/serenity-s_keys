import React from "react";

const testimonials = [
  {
    quote: "My six year old went from pecking to home row in two weeks.",
    name: "- Alicia, Austin",
  },
  {
    quote: "Calmest 45 minutes of our week. No more laptop battles.",
    name: "- Jamal, Chicago",
  },
  {
    quote: "The recap email makes at-home practice simple.",
    name: "- Priya, San Jose",
  },
];

const TestimonialStrip = () => (
  <section>
    <div className="container">
      <div className="testimonial-strip card">
        <ul>
          {testimonials.map((t, index) => (
            <li key={index}>
              "{t.quote}" <span>{t.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default TestimonialStrip;

