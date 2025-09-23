import React from "react";
import { BOOKING_BASE_URL } from "../config";

const ProgramCard = ({ course, title, description, details, outcomes }) => (
  <div
    style={{
      background: "var(--color-surface)",
      borderRadius: "var(--radius-lg)",
      padding: "28px",
      border: "1px solid var(--color-border)",
      boxShadow: "var(--shadow-sm)",
      display: "flex",
      flexDirection: "column",
      gap: "18px",
    }}
  >
    <div className="badge">{course}</div>
    <h3 style={{ margin: "0" }}>{title}</h3>
    <p style={{ margin: 0, color: "var(--color-muted)" }}>{description}</p>
    <ul className="pricing-list">
      {details.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
    <div>
      <h4 style={{ marginBottom: "8px" }}>Focus This Session</h4>
      <ul className="pricing-list">
        {outcomes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
    <a
      className="btn btn-primary"
      href={${BOOKING_BASE_URL}/programs?course=}
    >
      View Availability
    </a>
  </div>
);

export default ProgramCard;
