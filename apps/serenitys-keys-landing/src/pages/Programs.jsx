import React from "react";
import ProgramCard from "../components/ProgramCard";
import FAQ from "../components/FAQ";
import { usePageMetadata } from "../hooks/usePageMetadata";

const PROGRAMS = [
  {
    course: "group:3-5",
    title: "Mini Movers Ages 3–5",
    description: "Short, sensory-rich sessions that introduce letter positions through story, color, and rhythm.",
    details: ["30-minute class", "Max 3 learners", "Movement and music breaks"],
    outcomes: ["Letter awareness", "Confident finger placement", "Positive keyboard mindset"],
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
  {
    course: "group:12-14",
    title: "Group Ages 12–14",
    description: "Fluency for school, coding, and competitive typing challenges.",
    details: ["45-minute class", "Max 5 learners", "Mentor feedback"],
    outcomes: ["Speed for essays", "Coding-friendly accuracy", "Shortcut mastery"],
  },
  {
    course: "private:all",
    title: "Private Coaching",
    description: "1:1 coaching for custom pacing, neurodiverse learners, or fast-tracked goals.",
    details: ["Flexible schedule", "Personalized drills", "Weekly parent check-in"],
    outcomes: ["Custom WPM targets", "Confidence boost", "Time management"],
  },
];

const Programs = () => {
  usePageMetadata({
    title: "Programs | Serenity's Keys",
    description: "Find the right typing class—starting at age 3 with sensory-friendly micro sessions through teen fluency coaching.",
  });

  return (
    <main id="main-content">
      <section>
        <div className="container">
          <div className="section-label">Programs</div>
          <h1 className="section-title">Choose the typing experience that fits your learner</h1>
          <p className="section-subtitle">
            Every program meets live on Google Meet, taps Typing.com for guided drills, and ends with a progress summary emailed to you. Stripe checkout and Google Calendar invites are rolling out now for a seamless sign-up.
          </p>
          <div className="card-grid">
            {PROGRAMS.map((program) => (
              <ProgramCard key={program.course} {...program} />
            ))}
          </div>
        </div>
      </section>
      <FAQ />
    </main>
  );
};

export default Programs;
