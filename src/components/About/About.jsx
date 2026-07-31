import React from "react";
import "./About.css";

const ROADMAP = [
  "Login & role-based access",
  "Token-based session management",
  "Doctor profiles",
  "Reports & analytics",
  "Health advice",
  "WhatsApp support",
  "Emergency assistance",
  "Event calendar",
  "Admin dashboard",
];

const STEPS = [
  {
    title: "Admin uploads a file",
    body: "A single .xlsx, .xls, or .json file with dates, doctor names, specialties, and timings.",
  },
  {
    title: "The system reads it instantly",
    body: "Rows are matched to the right fields automatically — no manual coding or re-typing.",
  },
  {
    title: "The roster updates everywhere",
    body: "Tomorrow's carousel and the full monthly calendar refresh immediately, for every visitor.",
  },
];

export default function About() {
  return (
    <section id="about" className="section about">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">About the system</span>
          <h2 className="section-title">Built to stay out of the way</h2>
          <p className="section-sub">
            MahalCare Appointment System exists to answer one question quickly:
            which doctor is available, and when. The schedule is never hand-coded —
            it comes entirely from the file an admin uploads.
          </p>
        </div>

        <div className="about__steps">
          {STEPS.map((step, i) => (
            <div className="about__step glass-card" key={step.title}>
              <span className="about__step-num">{String(i + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          ))}
        </div>

        <div className="about__roadmap glass-card">
          <div className="about__roadmap-copy">
            <h3>Built to grow</h3>
            <p>
              The system is organized in modular, self-contained pieces, so
              these features can be added later without a redesign:
            </p>
          </div>
          <div className="about__roadmap-chips">
            {ROADMAP.map((item) => (
              <span className="about__chip" key={item}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
