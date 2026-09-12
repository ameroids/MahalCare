import React, { useState } from "react";
import { Calendar, Apple, ShieldAlert, HeartPulse, Activity, ArrowRight, BookOpen, Clock, ActivitySquare } from "lucide-react";
import { useRoster } from "../../context/RosterContext.jsx";
import "./PregnancyGuide.css";

const TRIMESTERS = [
  {
    id: 1,
    title: "First Trimester",
    weeks: "Weeks 1 - 12",
    icon: <HeartPulse size={24} />,
    description: "The crucial period of early development where vital organs begin to form.",
    milestones: [
      "Baby's heart begins to beat.",
      "Brain and spinal cord start to form.",
      "Facial features start developing."
    ],
    tips: [
      "Start taking prenatal vitamins with folic acid.",
      "Stay hydrated and rest often to combat fatigue.",
      "Schedule your first prenatal checkup."
    ]
  },
  {
    id: 2,
    title: "Second Trimester",
    weeks: "Weeks 13 - 26",
    icon: <ActivitySquare size={24} />,
    description: "Often called the 'honeymoon phase' of pregnancy. Your baby is growing rapidly.",
    milestones: [
      "You may start feeling the baby move (quickening).",
      "Baby can hear your voice and swallow.",
      "Hair and fingerprints begin to form."
    ],
    tips: [
      "Sleep on your side, preferably the left.",
      "Start planning the nursery.",
      "Stay active with pregnancy-safe exercises like walking or swimming."
    ]
  },
  {
    id: 3,
    title: "Third Trimester",
    weeks: "Weeks 27 - End",
    icon: <Clock size={24} />,
    description: "The final stretch! Your baby is gaining weight and preparing for birth.",
    milestones: [
      "Baby's eyes can open and close.",
      "Rapid weight gain for the baby.",
      "Baby moves into a head-down position."
    ],
    tips: [
      "Pack your hospital bag.",
      "Attend childbirth and breastfeeding classes.",
      "Monitor baby's kicks and movements daily."
    ]
  }
];

export default function PregnancyGuide({ onBookClick }) {
  const [activeTrimester, setActiveTrimester] = useState(1);
  const [activeTab, setActiveTab] = useState("nutrition");
  const { entries } = useRoster();

  // Check if a Gynecologist/Obstetrician is scheduled in the calendar
  const hasGynac = entries && entries.some(doc => {
    if (!doc.category) return false;
    const cat = doc.category.toLowerCase();
    return cat.includes('gyne') || cat.includes('gynae') || cat.includes('obste');
  });

  const currentTrim = TRIMESTERS.find(t => t.id === activeTrimester);

  return (
    <div className="pg-container">
      {/* Hero Section */}
      <div className="pg-hero">
        <div className="pg-hero-bg"></div>
        <div className="pg-glass-panel">
          <div className="pg-badge">Comprehensive Guide</div>
          <h1 className="pg-title">Pregnancy Journey</h1>
          <p className="pg-subtitle">Your step-by-step guide to a healthy pregnancy, from conception to birth.</p>
        </div>
      </div>

      <div className="pg-content">
        {/* Medical Disclaimer */}
        <div className="pg-disclaimer">
          <ShieldAlert size={20} className="pg-disclaimer-icon" />
          <p><strong>Medical Disclaimer:</strong> The information provided in this guide consists of general tips for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult your obstetrician for personalized care.</p>
        </div>

        {/* Interactive Timeline */}
        <section className="pg-section">
          <div className="pg-section-header">
            <Calendar className="pg-section-icon" size={28} />
            <h2>Interactive Timeline</h2>
          </div>
          
          <div className="pg-timeline-nav">
            {TRIMESTERS.map(trim => (
              <button 
                key={trim.id}
                className={`pg-timeline-btn ${activeTrimester === trim.id ? "active" : ""}`}
                onClick={() => setActiveTrimester(trim.id)}
              >
                <div className="pg-timeline-icon">{trim.icon}</div>
                <div className="pg-timeline-text">
                  <span className="pg-timeline-title">{trim.title}</span>
                  <span className="pg-timeline-weeks">{trim.weeks}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="pg-timeline-content" key={activeTrimester}>
            <div className="pg-timeline-header">
              <h3>{currentTrim.title}</h3>
              <p>{currentTrim.description}</p>
            </div>
            
            <div className="pg-timeline-grid">
              <div className="pg-card">
                <h4>Baby's Development</h4>
                <ul>
                  {currentTrim.milestones.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </div>
              <div className="pg-card">
                <h4>Tips for Mother</h4>
                <ul>
                  {currentTrim.tips.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Essential Info Tabs */}
        <section className="pg-section">
          <div className="pg-tabs-container">
            <div className="pg-tabs-sidebar">
              <button className={`pg-tab-btn ${activeTab === 'nutrition' ? 'active' : ''}`} onClick={() => setActiveTab('nutrition')}>
                <Apple size={20} /> Nutrition & Diet
              </button>
              <button className={`pg-tab-btn ${activeTab === 'dos' ? 'active' : ''}`} onClick={() => setActiveTab('dos')}>
                <Activity size={20} /> Do's & Don'ts
              </button>
              <button className={`pg-tab-btn ${activeTab === 'warning' ? 'active' : ''}`} onClick={() => setActiveTab('warning')}>
                <ShieldAlert size={20} /> Warning Signs
              </button>
            </div>
            
            <div className="pg-tabs-content">
              {activeTab === 'nutrition' && (
                <div className="pg-tab-pane slide-up">
                  <h3>Nutrition & Diet Guidelines</h3>
                  <div className="pg-list-group">
                    <div className="pg-list-item positive">
                      <strong>Do Eat:</strong> Leafy greens, lean proteins, dairy (pasteurized), complex carbs, and foods rich in iron and folate.
                    </div>
                    <div className="pg-list-item negative">
                      <strong>Avoid:</strong> Raw seafood/sushi, unpasteurized cheese, deli meats (unless heated steaming hot), and high-mercury fish.
                    </div>
                    <div className="pg-list-item warning">
                      <strong>Limit:</strong> Caffeine (keep under 200mg per day) and processed sugars.
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'dos' && (
                <div className="pg-tab-pane slide-up">
                  <h3>Lifestyle Do's & Don'ts</h3>
                  <div className="pg-list-group">
                    <div className="pg-list-item positive">
                      <strong>Do:</strong> Stay active with safe exercises (walking, prenatal yoga, swimming). Sleep on your side. Drink plenty of water.
                    </div>
                    <div className="pg-list-item negative">
                      <strong>Don't:</strong> Smoke, consume alcohol, or use illicit drugs. Avoid hot tubs and saunas. Don't change cat litter (toxoplasmosis risk).
                    </div>
                    <div className="pg-list-item info">
                      <strong>Medications:</strong> Always consult your doctor before taking any over-the-counter medications or supplements.
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'warning' && (
                <div className="pg-tab-pane slide-up">
                  <h3 style={{ color: '#ef4444' }}>Warning Signs: When to Call a Doctor</h3>
                  <p>Seek immediate medical attention if you experience any of the following:</p>
                  <ul className="pg-danger-list">
                    <li>Severe abdominal pain or cramping.</li>
                    <li>Vaginal bleeding or spotting.</li>
                    <li>Severe dizziness, fainting, or blurred vision.</li>
                    <li>Sudden, severe swelling in your hands, face, or feet.</li>
                    <li>A significant decrease in your baby's movements (in the third trimester).</li>
                    <li>Fever over 100.4°F (38°C).</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        {hasGynac ? (
          <div className="pg-cta">
            <BookOpen size={48} className="pg-cta-icon" />
            <h2>Ready for your next checkup?</h2>
            <p>Book an appointment with our experienced Obstetricians and Gynecologists today.</p>
            <button className="btn btn-primary pg-cta-btn" onClick={() => onBookClick()}>
              Book an Appointment <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div className="pg-cta" style={{ filter: 'grayscale(1)', opacity: 0.8 }}>
            <BookOpen size={48} className="pg-cta-icon" />
            <h2>No Gynecologist Scheduled Currently</h2>
            <p>Please check back later or consult the monthly roster for future availability.</p>
          </div>
        )}
      </div>
    </div>
  );
}
