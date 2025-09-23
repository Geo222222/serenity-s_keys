import React, { useState } from "react";
import Hero from "../components/Hero";
import FeatureRow from "../components/FeatureRow";
import ProgramCard from "../components/ProgramCard";
import Testimonials from "../components/Testimonials";
import TrustBar from "../components/TrustBar";
import CTASection from "../components/CTASection";
import { usePageMetadata } from "../hooks/usePageMetadata";
import { BOOKING_BASE_URL } from "../config";
import { sendContactMessage } from "../utils/EmailService";

const HOME_PROGRAMS = [
  {
    course: "group:6-8",
    title: "Group Ages 6–8",
    description: "Home-row mastery with fun drills and lots of confidence building.",
    details: ["45-minute sessions", "Max 4 students", "Teacher-guided warm-ups"],
    outcomes: ["Home row accuracy", "Keyboard posture", "Positive typing habits"],
  },
  {
    course: "group:9-11",
    title: "Group Ages 9–11",
    description: "Build speed without losing accuracy. Perfect for school projects.",
    details: ["45-minute sessions", "Max 5 students", "Goal tracking each class"],
    outcomes: ["Speed +3 WPM each month", "Accuracy above 95%", "Keyboard shortcuts"],
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    title: "Book a class",
    description: "Pick a program and checkout through Stripe—your spot is reserved instantly.",
  },
  {
    title: "Open the Launchpad",
    description: "We send one link that holds the Meet, Typing.com, and notes together.",
  },
  {
    title: "Learn on Typing.com",
    description: "Teachers run live drills and timed sprints matched to your child’s goals.",
  },
  {
    title: "Progress email",
    description: "Parents get WPM, accuracy, and next steps right after class.",
  },
];

const Home = () => {
  usePageMetadata({
    title: "Serenity's Keys | Live Typing Classes for Kids",
    description:
      "Live Google Meet typing classes using Typing.com. Structured curriculum, teachers who care, and progress emails parents trust.",
    openGraph: {
      title: "Live typing classes kids love. Progress parents can see.",
      description: "Serenity's Keys blends Typing.com drills with live coaching and Launchpad convenience.",
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
                One-on-one sessions for learners who need a custom pace or specific goals—siblings, neurodiverse learners, or future coders.
              </p>
              <ul className="pricing-list">
                <li>Flexible schedule</li>
                <li>Customized drills</li>
                <li>Weekly parent check-ins</li>
              </ul>
              <a className="btn btn-primary" href={${BOOKING_BASE_URL}/programs?course=private:all}>
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
            <h2 className="section-title">Serenity AI will run the session while cheering your child on.</h2>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              An AI coach that joins Meet, greets your child, sets goals, runs drills, and emails you the summary. Join the waitlist to get notified when invites open.
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
