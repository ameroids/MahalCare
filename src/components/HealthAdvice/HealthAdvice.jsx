import React from 'react';
import { Droplet, Moon, Stethoscope, Apple, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import './HealthAdvice.css';

const ADVICES = [
  {
    title: "Stay Hydrated",
    description: "Drink at least 8 glasses of water a day to maintain your body's vital functions and keep your energy levels high.",
    icon: <Droplet size={28} />
  },
  {
    title: "Prioritize Sleep",
    description: "Aim for 7-9 hours of quality sleep each night. A well-rested body has a stronger immune system.",
    icon: <Moon size={28} />
  },
  {
    title: "Routine Checkups",
    description: "Don't wait to get sick. Regular health checkups help identify potential issues early when they are easiest to treat.",
    icon: <Stethoscope size={28} />
  },
  {
    title: "Balanced Diet",
    description: "Incorporate a variety of fruits, vegetables, and whole grains into your daily meals for sustained vitality.",
    icon: <Apple size={28} />
  }
];

export default function HealthAdvice() {
  return (
    <section id="health-advice" className="section health-advice" aria-labelledby="health-advice-heading">
      <div className="container">
        <header className="section-head text-center">
          <span className="eyebrow" aria-hidden="true">Wellness & Care</span>
          <h2 id="health-advice-heading" className="section-title">Essential Health Habits</h2>
          <p className="section-sub mx-auto">Elevate your daily routine with these core pillars of well-being.</p>
        </header>

        <div className="health-timeline" role="list">
          {ADVICES.map((advice, index) => (
            <motion.article 
              key={index} 
              className="health-timeline__item" 
              role="listitem"
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 100 }}
            >
              <div className="health-timeline__number" aria-hidden="true">0{index + 1}</div>
              <div className="health-timeline__content glass-card">
                <div className="health-timeline__icon-blob" aria-hidden="true">
                  {advice.icon}
                </div>
                <div className="health-timeline__text">
                  <h3>{advice.title}</h3>
                  <p>{advice.description}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        
        <motion.aside 
          className="health-advice__footer-banner glass-card" 
          aria-label="Health Disclaimer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Info className="banner-icon" aria-hidden="true" />
          <p>These are general wellness tips. For specific medical conditions, always consult our doctors through the Appointment System.</p>
        </motion.aside>
      </div>
    </section>
  );
}

