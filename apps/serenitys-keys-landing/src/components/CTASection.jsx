import React from "react";
import { BOOKING_BASE_URL } from "../config";

const CTASection = () => (
  <section className="alt">
    <div className="container" style={{ textAlign: "center", maxWidth: "760px" }}>
      <div className="section-label">Ready when you are</div>
      <h2 className="section-title">Give your child a coach who understands tiny hands and big dreams.</h2>
      <p className="section-subtitle">
        Lock in your first class, connect the Google Calendar invite, and let us handle the Stripe checkout and Launchpad links while your child discovers the keyboard—age 3 and up.
      </p>
      <div className="hero-actions" style={{ justifyContent: "center" }}>
        <a className="btn btn-primary" href={`${BOOKING_BASE_URL}/programs`}>
          Choose a class time
        </a>
        <a className="btn btn-secondary" href="/pricing">
          View family-friendly pricing
        </a>
      </div>
    </div>
  </section>
);

export default CTASection;
