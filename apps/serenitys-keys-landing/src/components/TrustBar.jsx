import React from "react";

const stats = [
  { label: "Sessions taught", value: "100+" },
  { label: "Parent rating", value: "4.9/5" },
  { label: "Scholarships", value: "Available" },
];

const TrustBar = () => (
  <section className="trust-strip">
    <div className="container">
      <ul>
        {stats.map((item) => (
          <li key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default TrustBar;
