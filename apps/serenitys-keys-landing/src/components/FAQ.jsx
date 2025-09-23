import React, { useState } from "react";

const FAQ_ITEMS = [
  {
    question: "Do we need a Typing.com account?",
    answer: "Yes. It's free, and we'll send your child the class code. We track progress by the username you share.",
  },
  {
    question: "What ages do you support?",
    answer: "Group classes serve ages 6–14. Private coaching is available for other ages or specific goals.",
  },
  {
    question: "What equipment is required?",
    answer: "A laptop or Chromebook with a full keyboard, stable internet, and a quiet space. Headphones help younger learners focus.",
  },
  {
    question: "How do refunds and rescheduling work?",
    answer: "24 hours' notice earns a full credit. Same-day cancellations receive a partial credit, and missed sessions can be rescheduled.",
  },
  {
    question: "Is this safe?",
    answer: "Sessions run on Google Meet—no recordings by default. We never store Typing.com passwords and only keep essentials like name and username.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
                {isOpen && (
                  <div className="accordion-panel">{item.answer}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
