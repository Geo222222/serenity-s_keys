import React from "react";
import { BOOKING_BASE_URL } from "../config";

const CTASection = () => (
  <section className="alt">
    <div className="container" style={{ textAlign: "center", maxWidth: "760px" }}>
      <div className="section-label">Ready when you are</div>
      <h2 className="section-title">Give your child a typing coach who sends progress you can trust.</h2>
      <p className="section-subtitle">
        Book your first class, join via Launchpad, and get a clear summary after. We do the work—your child sees the gain.
      </p>
      <div className="hero-actions" style={{ justifyContent: "center" }}>
        <a className="btn btn-primary" href={${BOOKING_BASE_URL}/programs}>
          Book a Class
        </a>
        <a className="btn btn-secondary" href="/pricing">
          See Pricing
        </a>
      </div>
    </div>
  </section>
);

export default CTASection;
