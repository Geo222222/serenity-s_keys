import React from "react";
import { FiCreditCard, FiVideo, FiAward, FiShield } from "react-icons/fi";

const TrustBar = () => (
  <section>
    <div className="container">
      <div className="trust-bar">
        <div className="trust-item">
          <FiCreditCard size={26} color="#2563eb" />
          <span>Secure checkout powered by Stripe</span>
        </div>
        <div className="trust-item">
          <FiVideo size={26} color="#22c55e" />
          <span>Live classes hosted on Google Meet</span>
        </div>
        <div className="trust-item">
          <FiAward size={26} color="#0ea5e9" />
          <span>Typing.com drills tailored to every session</span>
        </div>
        <div className="trust-item">
          <FiShield size={26} color="#818cf8" />
          <span>Privacy-first: no Typing.com passwords stored</span>
        </div>
      </div>
    </div>
  </section>
);

export default TrustBar;
