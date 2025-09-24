import React from "react";
import { FiSmile, FiUsers, FiCheckCircle } from "react-icons/fi";

const FEATURES = [
  {
    icon: <FiSmile size={28} />,
    title: "Calm, tiny groups",
    description: "Three to five kids tops, so everyone feels safe to try and celebrate wins.",
  },
  {
    icon: <FiUsers size={28} />,
    title: "Coach + parent partnership",
    description: "You stay in the loop with short notes after class and gentle practice prompts.",
  },
  {
    icon: <FiCheckCircle size={28} />,
    title: "Flight plan for progress",
    description: "Typing.com missions matched to age. We keep it playful, you see the results.",
  },
];

const FeatureRow = () => (
  <section>
    <div className="container">
      <div className="card-grid cards-3 feature-row">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="feature-card card">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeatureRow;
