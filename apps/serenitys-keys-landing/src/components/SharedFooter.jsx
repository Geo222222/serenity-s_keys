import React from "react";
import { BOOKING_BASE_URL } from "../config";
import logoMark from "../assets/serenity-keys-logo.png";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "/programs" },
  { label: "Why Typing Early", href: "/why-typing" },
  { label: "How it Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

const SharedFooter = () => (
  <footer className="footer">
    <div className="container footer-grid">
      <div className="footer-column">
        <div className="footer-brand">
          <img src={logoMark} alt="Serenity's Keys logo" />
          <div>
            <h4>Serenity's Keys</h4>
            <p style={{ color: "var(--color-muted)", margin: 0 }}>
              Live typing classes that blend structure, coaching, and clear results for families.
            </p>
          </div>
        </div>
        <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
          <a className="btn btn-secondary" href={`${BOOKING_BASE_URL}/programs`}>
            Book a Class
          </a>
        </div>
      </div>
      <div className="footer-column">
        <h4>Navigate</h4>
        <ul>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </div>
      <div className="footer-column">
        <h4>Resources</h4>
        <ul>
          <li>
            <a href="/policies">Policies &amp; Privacy</a>
          </li>
          <li>
            <a href="/why-typing#research">Research &amp; benefits</a>
          </li>
          <li>
            <a href={`${BOOKING_BASE_URL}/launchpad`}>Launchpad</a>
          </li>
          <li>
            <a href="mailto:hello@serenityskeys.com">hello@serenityskeys.com</a>
          </li>
        </ul>
      </div>
      <div className="footer-column">
        <h4>Stay in the loop</h4>
        <p style={{ color: "var(--color-muted)", marginBottom: "12px" }}>
          AI Mentor is on the horizon. Join the waitlist from our Home page to get early access.
        </p>
      </div>
    </div>
    <div className="container footer-bottom">
      <span>&copy; {new Date().getFullYear()} Serenity's Keys. All rights reserved.</span>
      <span>Powered by Google Meet · Typing.com · Stripe</span>
    </div>
  </footer>
);

export default SharedFooter;

