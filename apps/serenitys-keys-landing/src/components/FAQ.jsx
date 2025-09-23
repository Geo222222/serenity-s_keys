import React, { useState } from "react";

const FAQ_ITEMS = [
  {
    question: "Can my 3-year-old really type?",
    answer:
      "Yes! We keep sessions to 30 minutes, use music and movement breaks, and celebrate every key press. Parents stay nearby for the first few classes to build confidence.",
  },
  {
    question: "Do we need a Typing.com account?",
    answer: "Yes. It's free, and we'll send your child the class code. We track progress by the username you share.",
  },
  {
    question: "What ages do you support?",
    answer:
      "Group classes start at ages 3-14. Private coaching flexes for younger siblings, accelerated teens, or specific learning needs.",
  },
  {
    question: "How will checkout and scheduling work?",
    answer:
      "We're finalizing Stripe payments and Google Calendar automation right now. Until then, we send invoices manually within 24 hours and block your spot immediately.",
  },
  {
    question: "What equipment is required?",
    answer:
      "A laptop or Chromebook with a full keyboard, stable internet, and a quiet space. Headphones help younger learners focus.",
  },
  {
    question: "Is this safe?",
    answer:
      "Sessions run on Google Meet - no recordings by default. We never store Typing.com passwords and only keep essentials like name and username.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section>
      <div className="container">
        <div className="section-label">FAQ</div>
        <h2 className="section-title">Questions parents ask most</h2>
        <div className="card-grid">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question} className="accordion-item">
                <button
                  className="accordion-header"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <span>{isOpen ? "-" : "+"}</span>
                </button>
                {isOpen && <div className="accordion-panel">{item.answer}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

