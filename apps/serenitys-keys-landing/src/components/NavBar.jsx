import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { BOOKING_BASE_URL } from "../config";
import logoMark from "../assets/serenity-keys-logo.png";

const links = [
  { to: "/programs", label: "Programs" },
  { to: "/why-typing", label: "Why Typing Early" },
  { to: "/how-it-works", label: "How it Works" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
];

const NavBar = () => {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <a href="/" className="brand" onClick={closeMenu}>
          <img src={logoMark} alt="Serenity's Keys logo" className="brand-logo" />
          <span className="brand-wordmark">Serenity's Keys</span>
        </a>
        <button
          className="mobile-nav-toggle"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {open ? "Close" : "Menu"}
        </button>
        <nav>
          <ul className={open ? "open" : ""}>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                onClick={closeMenu}
              >
                Home
              </NavLink>
            </li>
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                  onClick={closeMenu}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li>
              <a className="btn btn-primary" href={`${BOOKING_BASE_URL}/programs`} rel="noreferrer">
                Book a Class
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;

