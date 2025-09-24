import React, { useState } from "react";
import { usePageMetadata } from "../hooks/usePageMetadata";
import { sendContactMessage } from "../utils/EmailService";

const INITIAL_FORM = {
  parent_name: "",
  parent_email: "",
  parent_phone: "",
  message: "",
};

const Contact = () => {
  usePageMetadata({
    title: "Contact Us | Serenity's Keys",
    description: "Reach the Serenity's Keys team for enrollment questions, scholarships, or AI Mentor updates.",
  });

  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.parent_name || !form.parent_email || !form.message) {
      setStatus({ state: "error", message: "Please complete name, email, and message." });
      return;
    }

    setStatus({ state: "loading", message: "" });

    try {
      const payload = {
        ...form,
        origin: "landing",
        topic: "general",
      };
      const result = await sendContactMessage(payload);
      if (result.success) {
        setStatus({ state: "success", message: "Got it -- we'll reply within 24 hours." });
        setForm(INITIAL_FORM);
      } else {
        setStatus({ state: "error", message: result.message ?? "Something went wrong." });
      }
    } catch (error) {
      setStatus({ state: "error", message: error.message });
    }
  };

  return (
    <main id="main-content">
      <section>
        <div className="container contact-grid">
          <div>
            <div className="section-label">Contact</div>
            <h1 className="section-title">Let's make typing class your child's calmest 45 minutes</h1>
            <p className="section-subtitle">
              We answer weekday emails within 24 hours. Tell us how we can help - enrollment, scholarships, or AI Mentor invites.
            </p>
            <div
              style={{
                background: "var(--color-surface)",
                borderRadius: "var(--radius-lg)",
                padding: "24px",
                border: "1px solid var(--color-border)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Prefer email?</h3>
              <p style={{ color: "var(--color-muted)" }}>hello@serenityskeys.com</p>
              <h4 style={{ marginBottom: 8 }}>Hours</h4>
              <p style={{ color: "var(--color-muted)" }}>Monday-Friday | 9am-5pm Central</p>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="parent_name">Parent name</label>
              <input
                id="parent_name"
                name="parent_name"
                value={form.parent_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="parent_email">Email</label>
              <input
                id="parent_email"
                type="email"
                name="parent_email"
                value={form.parent_email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="parent_phone">Phone (optional)</label>
              <input
                id="parent_phone"
                name="parent_phone"
                value={form.parent_phone}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="message">How can we help?</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={status.state === "loading"}>
              {status.state === "loading" ? "Sending..." : "Send message"}
            </button>
            {status.state === "success" && (
              <div className="alert alert-success">Got it -- we'll reply within 24 hours.</div>
            )}
            {status.state === "error" && (
              <div className="alert alert-error">{status.message}</div>
            )}
          </form>
        </div>
      </section>
    </main>
  );
};

export default Contact;
