import React from "react";
import CTASection from "../components/CTASection";
import { usePageMetadata } from "../hooks/usePageMetadata";
import { BOOKING_BASE_URL } from "../config";

const PLANS = [
  {
    name: "Group Session",
    price: "",
    cadence: "per 45-minute class",
    description: "Perfect for ages 6–14 who thrive with peers and live coaching.",
    items: [
      "Live Google Meet class (max 5 students)",
      "Typing.com drill plan tailored to the group",
      "Launchpad link with Meet + assignments",
      "Progress email with WPM, accuracy, goals",
    ],
    link: `${BOOKING_BASE_URL}/programs`,
  },
  {
    name: "Private Coaching",
    price: "",
    cadence: "per 45-minute class",
    description: "One-on-one support for accelerated goals or unique learning needs.",
    items: [
      "Custom schedule and pacing",
      "Personalized skill roadmap",
      "Weekly parent sync notes",
      "Flexible drills and advanced challenges",
    ],
    link: `${BOOKING_BASE_URL}/programs?course=${encodeURIComponent("private:all")}`,
  },
  {
    name: "Starter Pack",
    price: "",
    cadence: "8 group classes",
    description: "Commit to a month of progress with bundled savings.",
    items: [
      "All group session benefits",
      "Goal tracking across the pack",
      "Mid-pack check-in with coach",
      "Priority scheduling assistance",
    ],
    link: `${BOOKING_BASE_URL}/programs`,
  },
];

const Pricing = () => {
  usePageMetadata({
    title: "Pricing | Serenity's Keys",
    description: "Group typing classes from  per session and private coaching for accelerated goals. Progress email after every class.",
  });

  return (
    <main id="main-content">
      <section>
        <div className="container">
          <div className="section-label">Pricing</div>
          <h1 className="section-title">Simple pricing, crystal-clear value</h1>
          <p className="section-subtitle">
            Every plan includes Launchpad access, Typing.com drill alignment, and post-class progress reports for parents.
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
            We reserve seats each month for families that need reduced pricing. Email us with "Scholarship" in the subject and we’ll set up a plan that fits.
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
