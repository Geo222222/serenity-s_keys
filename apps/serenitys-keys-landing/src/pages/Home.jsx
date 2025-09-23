import React, { useState } from "react";
import Hero from "../components/Hero";
import FeatureRow from "../components/FeatureRow";
import ProgramCard from "../components/ProgramCard";
import Testimonials from "../components/Testimonials";
import TrustBar from "../components/TrustBar";
import CTASection from "../components/CTASection";
import EarlyStartHighlights from "../components/EarlyStartHighlights";
import { usePageMetadata } from "../hooks/usePageMetadata";
import { BOOKING_BASE_URL } from "../config";
import { sendContactMessage } from "../utils/EmailService";

const HOME_PROGRAMS = [
  {
    course: "group:3-5",
    title: "Mini Movers Ages 3–5",
    description: "Playful stories, finger stretches, and picture-backed keys that make first typing moments magical.",
    details: ["30-minute class", "Max 3 learners", "Movement + music cues"],
    outcomes: ["Curiosity on the keyboard", "Gentle finger strength", "Early letter-location awareness"],
  },
  {
    course: "group:6-8",
    title: "Group Ages 6–8",
    description: "Home-row mastery with games, accuracy focus, and a calm pace.",
    details: ["45-minute class", "Max 4 learners", "Teacher-led warm-up"],
    outcomes: ["Home row accuracy", "Correct finger reaches", "Positive posture"],
  },
  {
    course: "group:9-11",
    title: "Group Ages 9–11",
    description: "Speed building with strong accuracy—perfect for school projects.",
    details: ["45-minute class", "Max 5 learners", "Weekly goal tracking"],
    outcomes: ["+3 WPM monthly", "Accuracy above 95%", "Keyboard shortcuts"],
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    title: "Pick a class",
    description: "Choose an age-fit session, complete Stripe checkout (setup in progress), and secure your seat instantly.",
  },
  {
    title: "Receive Launchpad",
    description: "We drop a Google Calendar invite with Meet + Typing.com links so you and your child are one click away.",
  },
  {
    title: "Coach-led adventure",
    description: "Teachers mix movement, music, and mastery drills tuned to your child’s attention span and goals.",
  },
  {
    title: "Celebrate progress",
    description: "Parents get WPM, accuracy, coach notes, and at-home practice ideas minutes after class.",
  },
];

const Home = () => {
  usePageMetadata({
    title: "Serenity's Keys | Live Typing Classes for Kids 3+",
    description:
      "Live Google Meet typing classes starting at age 3. Nurturing coaches, Stripe-ready checkout, and progress emails parents trust.",
    openGraph: {
      title: "Live typing classes kids love. Progress parents can see.",
      description: "Serenity's Keys blends Typing.com adventures with warm coaching for ages 3 and up.",
      image: "/og-image.png",
      url: "https://serenityskeys.com/",
    },
  });

  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState({ state: "idle", message: "" });

  const handleWaitlistSubmit = async (event) => {
    event.preventDefault();
    if (!waitlistEmail) return;
    setWaitlistStatus({ state: "loading", message: "" });

    const payload = {
      parent_name: "AI Mentor Waitlist",
      parent_email: waitlistEmail,
      parent_phone: "",
      message: "Please notify me when AI Mentor launches.",
      origin: "landing",
      topic: "AI_MENTOR_WAITLIST",
    };

    try {
      const result = await sendContactMessage(payload);
      if (result.success) {
        setWaitlistStatus({ state: "success", message: "You're on the list. We'll reach out soon." });
        setWaitlistEmail("");
      } else {
        setWaitlistStatus({ state: "error", message: result.message ?? "Something went wrong." });
      }
    } catch (error) {
      setWaitlistStatus({ state: "error", message: error.message });
    }
  };

  return (
    <main id="main-content">
      <Hero />
      <FeatureRow />
      <EarlyStartHighlights />

      <section>
        <div className="container">
          <div className="section-label">How it works</div>
          <h2 className="section-title">Launch, learn, and see the progress in one link</h2>
          <div className="step-list">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <div key={step.title} className="step">
                <h3 style={{ marginTop: 0 }}>{step.title}</h3>
                <p style={{ marginBottom: 0, color: "var(--color-muted)" }}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="alt">
        <div className="container">
          <div className="section-label">Age groups</div>
          <h2 className="section-title">Programs tuned to the way kids actually learn</h2>
          <div className="card-grid">
            {HOME_PROGRAMS.map((program) => (
              <ProgramCard key={program.course} {...program} />
            ))}
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
              <div className="badge">private:all</div>
              <h3 style={{ margin: 0 }}>Private coaching</h3>
              <p style={{ margin: 0, color: "var(--color-muted)" }}>
                One-on-one sessions for siblings, neurodiverse learners, or families who want a custom mix of music, coding, and speed drills.
              </p>
              <ul className="pricing-list">
                <li>Flexible schedule</li>
                <li>Personalized drills</li>
                <li>Weekly parent check-ins</li>
              </ul>
              <a className="btn btn-primary" href={`${BOOKING_BASE_URL}/programs?course=${encodeURIComponent("private:all")}`}>
                View private options
              </a>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container ai-waitlist">
          <div>
            <div className="section-label">AI Mentor · Coming soon</div>
            <h2 className="section-title">Serenity AI will coach alongside our teachers.</h2>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              We are wiring Stripe and Google Calendar right now so your automation is seamless. Join the waitlist to hear when the AI co-teacher pilot opens.
            </p>
          </div>
          <form onSubmit={handleWaitlistSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Parent email"
              value={waitlistEmail}
              onChange={(event) => setWaitlistEmail(event.target.value)}
              required
            />
            <button className="btn btn-primary" type="submit" disabled={waitlistStatus.state === "loading"}>
              {waitlistStatus.state === "loading" ? "Joining..." : "Join the waitlist"}
            </button>
            {waitlistStatus.state === "success" && (
              <div className="alert alert-success">{waitlistStatus.message}</div>
            )}
            {waitlistStatus.state === "error" && (
              <div className="alert alert-error">{waitlistStatus.message}</div>
            )}
          </form>
        </div>
      </section>

      <Testimonials />
      <TrustBar />
      <CTASection />
    </main>
  );
};

export default Home;
