import React, { useState } from "react";
import Hero from "../components/Hero";
import FeatureRow from "../components/FeatureRow";
import ProgramCard from "../components/ProgramCard";
import Testimonials from "../components/Testimonials";
import TrustBar from "../components/TrustBar";
import CTASection from "../components/CTASection";
import EarlyStartHighlights from "../components/EarlyStartHighlights";
import CoachBio from "../components/CoachBio";
import RoutinePanel from "../components/RoutinePanel";
import TestimonialStrip from "../components/TestimonialStrip";
import { usePageMetadata } from "../hooks/usePageMetadata";
import { BOOKING_BASE_URL } from "../config";
import { sendContactMessage } from "../utils/EmailService";

const HOME_PROGRAMS = [
  {
    course: "group:3-5",
    title: "Mini Movers Ages 3-5",
    description: "Short, playful sessions so little hands build good habits.",
    details: ["30 minute class", "Max 3 learners", "Movement and music cues"],
    outcomes: ["Curiosity on the keyboard", "Gentle finger strength", "Friendly coach support"],
  },
  {
    course: "group:6-8",
  title: "Key Explorers (Ages 6–8)",
    description: "Accuracy first - no more hunt and peck.",
    details: ["45 minute class", "Max 4 learners", "Teacher-led warm up"],
    outcomes: ["Home row mastery", "Correct finger reaches", "Positive posture"],
  },
  {
    course: "group:9-11",
  title: "Home Row Heroes (Ages 9–11)",
    description: "Speed with strong accuracy - confident for school projects.",
    details: ["45 minute class", "Max 5 learners", "Weekly goal tracking"],
    outcomes: ["+3 WPM monthly", "Accuracy above 95%", "Keyboard shortcuts"],
  },
];

const PROOF_POINTS = [
  {
    stat: "150+",
    label: "families coached so far",
    detail: "Parent feedback shapes every drill, email, and Launchpad tweak we make.",
  },
  {
    stat: "92%",
    label: "kids ask to come back",
    detail: "Small wins and gentle pacing keep learners excited for the next session.",
  },
  {
    stat: "4.9/5",
    label: "parent satisfaction",
    detail: "Parents love instant confirmations, dependable Meet links, and transparent metrics.",
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    title: "Book a spot",
    copy: "Choose the age group that fits. Checkout takes two minutes.",
  },
  {
    title: "Open the Launchpad",
    copy: "One link gives you Google Meet, Typing.com, and coach notes.",
  },
  {
    title: "30 minute class",
    copy: "Coach DJ keeps things calm with missions, wiggle breaks, and cheers.",
  },
  {
    title: "Progress note",
    copy: "You get a short email with wins and next steps the same day.",
  },
];

const FIRST_CLASS_CHECKLIST = [
  "Create a free Typing.com account and share the username.",
  "Laptop or Chromebook with camera and mic (no special software).",
  "A comfy chair, small snack, and a quiet-ish corner.",
];

const Home = () => {
  usePageMetadata({
    title: "Serenity's Keys | Live Typing Classes for Kids 3+",
    description:
      "Live Google Meet typing classes starting at age 3. Nurturing coaches, Stripe checkout, and progress emails parents trust.",
    openGraph: {
      title: "Live typing classes kids love. Progress parents can see.",
      description: "Serenity's Keys blends Typing.com adventures with warm coaching for ages 3 and up.",
      image: "/og-image.png",
  url: "https://serenitykeys.com/",
    },
  });

  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState({ state: "idle", message: "" });
  const privateUrl = `${BOOKING_BASE_URL}/programs?${new URLSearchParams({ course: "private" })}`;

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
      <TrustBar />
      <TestimonialStrip />
      <CoachBio />
      <FeatureRow />
      <EarlyStartHighlights />

      <section>
        <div className="container">
          <div className="section-label">Why families choose us</div>
          <h2 className="section-title">Built for parents who want calm, joyful progress</h2>
          <div className="proof-grid">
            {PROOF_POINTS.map((point) => (
              <article key={point.label} className="proof-card card">
                <strong>{point.stat}</strong>
                <div>
                  <h3>{point.label}</h3>
                  <p>{point.detail}</p>
                </div>
              </article>
            ))}
          </div>
          <a className="roadmap-highlight" href="/roadmap.pdf" target="_blank" rel="noopener">
            [PDF] Parents love our 12-Week Roadmap
          </a>
        </div>
      </section>

      <section className="alt">
        <div className="container programs-grid">
          <div className="card-grid">
            {HOME_PROGRAMS.map((program) => (
              <ProgramCard key={program.course} {...program} />
            ))}
            <div className="card program-extra">
              <div className="badge">Private coaching</div>
              <h3>Custom goals for siblings or neurodiverse learners.</h3>
              <p>
                1-on-1 sessions with personalized pacing, optional coding modules, and weekly parent syncs.
              </p>
              <a className="btn btn-primary" href={privateUrl}>
                View private options
              </a>
            </div>
          </div>
          <RoutinePanel />
        </div>
      </section>

      <section>
        <div className="container">
          <div className="section-label">How it works</div>
          <h2 className="section-title">Parents stay relaxed, kids stay engaged</h2>
          <div className="step-grid">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <article key={step.title} className="card step-card">
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
          <aside className="card checklist-card">
            <h3>First class checklist</h3>
            <ul>
              {FIRST_CLASS_CHECKLIST.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
          <div className="hero-actions" style={{ marginTop: 24 }}>
            <a className="btn btn-secondary" href="/try-typing">
              Try the Typing Playground
            </a>
          </div>
        </div>
      </section>

      <section>
        <div className="container ai-waitlist">
          <div>
            <div className="section-label">AI Mentor - Coming soon</div>
            <h2 className="section-title">Serenity AI will coach alongside our teachers.</h2>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Coming soon: a friendly AI mentor that cheers your child on between classes and reminds them to practice - like a calm coach in your corner.
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
      <CTASection />
    </main>
  );
};

export default Home;


