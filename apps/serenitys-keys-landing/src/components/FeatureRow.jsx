import React from "react";
import { FiTarget, FiUsers, FiTrendingUp } from "react-icons/fi";

const FEATURES = [
  {
    icon: <FiTarget size={28} />,
    title: "Structure",
    description: "A real curriculum, not random practice.",
  },
  {
    icon: <FiUsers size={28} />,
    title: "Live Classes",
    description: "Small groups on Google Meet, guided by a teacher.",
  },
  {
    icon: <FiTrendingUp size={28} />,
    title: "Progress Reports",
    description: "WPM, accuracy, and goals in plain English.",
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
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "rgba(37, 99, 235, 0.12)",
              color: "var(--color-primary)",
              display: "grid",
              placeItems: "center",
              marginBottom: "16px",
            }}>
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
