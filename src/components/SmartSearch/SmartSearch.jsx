import React, { useState } from 'react';
import { Search, Sparkles, X, Activity } from 'lucide-react';
import './SmartSearch.css';

export default function SmartSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  return (
    <>
      <button 
        className="btn btn-outline smart-search__trigger"
        onClick={() => setIsOpen(true)}
        aria-label="Open Smart Search"
      >
        <Search size={16} aria-hidden="true" />
        <span>Search doctors, symptoms...</span>
        <div className="smart-search__shortcut">⌘K</div>
      </button>

      {isOpen && (
        <div className="smart-search__backdrop" onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}>
          <div className="smart-search__modal glass-card" role="dialog" aria-modal="true" aria-label="Smart Search">
            <div className="smart-search__input-wrapper">
              <Search size={20} className="smart-search__icon" aria-hidden="true" />
              <input
                type="text"
                autoFocus
                placeholder="Describe your symptoms or search for a specialty..."
                className="smart-search__input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="btn btn-ghost btn-sm smart-search__close" onClick={() => setIsOpen(false)} aria-label="Close search">
                <X size={20} />
              </button>
            </div>

            <div className="smart-search__results">
              {query ? (
                <div className="smart-search__loading">
                  <Activity size={24} className="spin" />
                  <p>AI is analyzing your query...</p>
                  <span className="badge badge-teal">Preview Feature</span>
                </div>
              ) : (
                <div className="smart-search__suggestions">
                  <h4 className="eyebrow">Smart Suggestions</h4>
                  <ul role="list">
                    <li><Sparkles size={14} className="text-teal" /> "I have a severe headache and blurred vision"</li>
                    <li><Sparkles size={14} className="text-teal" /> "Pediatrician available this weekend"</li>
                    <li><Sparkles size={14} className="text-teal" /> "Cardiologist for regular checkup"</li>
                  </ul>
                </div>
              )}
            </div>
            
            <div className="smart-search__footer">
              <Sparkles size={14} /> Powered by Shifa AI (Coming Soon)
            </div>
          </div>
        </div>
      )}
    </>
  );
}
