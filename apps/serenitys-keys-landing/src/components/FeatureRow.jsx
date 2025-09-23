import React from "react";
import { FiTarget, FiUsers, FiTrendingUp } from "react-icons/fi";

const FEATURES = [
  {
    icon: <FiTarget size={28} />,
    title: "Age-smart curriculum",
    description: "Sensory-rich play for ages 3-5, mastery drills for big kids—all mapped lesson by lesson.",
  },
  {
    icon: <FiUsers size={28} />,
    title: "Live, nurturing coaches",
    description: "Tiny class sizes with teachers trained in early-childhood cues and teen motivation.",
  },
  {
    icon: <FiTrendingUp size={28} />,
    title: "Progress parents trust",
    description: "Stripe receipts, Google Calendar invites, and after-class emails ready for your fridge.",
  },
];

const FeatureRow = () => (
  <section>
    <div className="container">
      <div className="card-grid cards-3">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            style={{
              background: "var(--color-surface)",
              borderRadius: "var(--radius-lg)",
              padding: "28px",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background: "rgba(37, 99, 235, 0.12)",
                color: "var(--color-primary)",
                display: "grid",
                placeItems: "center",
                marginBottom: "16px",
              }}
            >
              {feature.icon}
            </div>
            <h3 style={{ margin: "0 0 10px" }}>{feature.title}</h3>
            <p style={{ margin: 0, color: "var(--color-muted)" }}>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeatureRow;
