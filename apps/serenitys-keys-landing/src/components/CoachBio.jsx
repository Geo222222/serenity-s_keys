import React from "react";

const CoachBio = () => (
  <section>
    <div className="container">
      <div className="coach-card card">
        <div className="coach-card__header">
          <div className="coach-avatar" aria-hidden="true">DJ</div>
          <div>
            <h2>Coach DJ</h2>
            <p>Computer scientist, dad of two, and the voice behind every calm typing class.</p>
          </div>
        </div>
        <ul>
          <li>Gentle, encouraging pace that keeps shy kids engaged.</li>
          <li>Clear session targets so parents know exactly what improved.</li>
          <li>Lots of wins: wiggle breaks, quick cheers, and simple next steps.</li>
        </ul>
        <p className="coach-card__footnote">
          "I built Serenity's Keys after helping my own daughter fall in love with typing at age three."
        </p>
      </div>
    </div>
  </section>
);

export default CoachBio;

