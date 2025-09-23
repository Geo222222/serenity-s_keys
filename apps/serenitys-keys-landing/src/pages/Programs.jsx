import React from "react";
import ProgramCard from "../components/ProgramCard";
import FAQ from "../components/FAQ";
import { usePageMetadata } from "../hooks/usePageMetadata";

const PROGRAMS = [
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
    description: "Find the right typing class—group sessions for ages 6–14 and private coaching for custom goals.",
  });

  return (
    <main id="main-content">
      <section>
        <div className="container">
          <div className="section-label">Programs</div>
          <h1 className="section-title">Choose the typing experience that fits your learner</h1>
          <p className="section-subtitle">
            Every program meets for 45 minutes on Google Meet, uses Typing.com for guided drills, and ends with a progress summary to your inbox.
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
