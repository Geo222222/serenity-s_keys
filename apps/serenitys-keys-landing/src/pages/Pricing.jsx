import React from "react";
import CTASection from "../components/CTASection";
import { usePageMetadata } from "../hooks/usePageMetadata";
import { BOOKING_BASE_URL } from "../config";

const PLANS = [
  {
    name: "Mini Movers (ages 3-5)",
    price: "$35",
    cadence: "per 30-minute class",
    description: "Sensory-rich adventures that build familiarity with letters and gentle motor control.",
    items: [
      "Live coach with early-childhood training",
      "Movement and music resets every 7 minutes",
      "Grown-up support cue sheet",
      "Progress snapshot emailed after class",
    ],
    link: `${BOOKING_BASE_URL}/programs`,
  },
  {
    name: "Core Group (ages 6-11)",
    price: "$45",
    cadence: "per 45-minute class",
    description: "Structured drills to boost speed, accuracy, and confidence for elementary learners.",
    items: [
      "Max 5 learners per class",
      "Typing.com mastery missions",
      "Weekly goal tracking",
      "Parent recap with at-home prompts",
    ],
    link: `${BOOKING_BASE_URL}/programs`,
  },
  {
    name: "Private Coaching",
    price: "$65",
    cadence: "per 45-minute class",
    description: "One-on-one coaching tailored to siblings, neurodiverse learners, or accelerated goals.",
    items: [
      "Flexible scheduling",
      "Custom curriculum",
      "Coach-parent sync every week",
      "Optional coding + productivity modules",
    ],
    link: `${BOOKING_BASE_URL}/programs?course=${encodeURIComponent("private:all")}`,
  },
];

const Pricing = () => {
  usePageMetadata({
    title: "Pricing | Serenity's Keys",
    description: "Group typing classes from $35 and private coaching from $65. Every session comes with a detailed progress email.",
  });

  return (
    <main id="main-content">
      <section>
        <div className="container">
          <div className="section-label">Pricing</div>
          <h1 className="section-title">Simple pricing, crystal-clear value</h1>
          <p className="section-subtitle">
            Every plan includes Launchpad access, Typing.com alignment, and post-class progress reports for parents. Stripe checkout and automated calendar invites will roll out shortly—reserve now and we will confirm within 24 hours.
          </p>
          <div className="table-pricing">
            {PLANS.map((plan) => (
              <div key={plan.name} className="pricing-card">
                <div className="badge">{plan.cadence}</div>
                <h3 style={{ margin: "8px 0" }}>{plan.name}</h3>
                <strong style={{ fontSize: "2rem" }}>{plan.price}</strong>
                <p style={{ color: "var(--color-muted)" }}>{plan.description}</p>
                <ul className="pricing-list">
                  {plan.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <a className="btn btn-primary" href={plan.link}>
                  Book this option
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="section-label">Financial access</div>
          <h2 className="section-title">Scholarships & community rates</h2>
          <p className="section-subtitle" style={{ maxWidth: "720px" }}>
            We reserve seats each month for families needing reduced pricing. Email us with "Scholarship" in the subject and we’ll set up a plan that fits.
          </p>
          <a className="btn btn-secondary" href="mailto:hello@serenityskeys.com">
            Contact us about scholarships
          </a>
        </div>
      </section>

      <CTASection />
    </main>
  );
};

export default Pricing;
