import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import './AIChatPlaceholder.css';

export default function AIChatPlaceholder() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="ai-chat">
      {isOpen && (
        <div className="ai-chat__window glass-card" role="dialog" aria-label="AI Health Assistant">
          <div className="ai-chat__header">
            <div className="ai-chat__header-info">
              <Bot size={20} className="ai-chat__icon" aria-hidden="true" />
              <div>
                <h4>Shifa Assistant</h4>
                <span>AI-powered support</span>
              </div>
            </div>
            <button className="ai-chat__close" onClick={() => setIsOpen(false)} aria-label="Close Chat">
              <X size={18} />
            </button>
          </div>
          
          <div className="ai-chat__body">
            <div className="ai-chat__message ai-chat__message--bot">
              <Bot size={16} className="ai-chat__msg-icon" aria-hidden="true" />
              <div className="ai-chat__msg-bubble">
                Hello! I am your AI Health Assistant. I can help you find specialists based on your symptoms or answer general queries. How can I assist you today?
              </div>
            </div>
            <div className="ai-chat__placeholder-badge">
              Preview Mode: AI Integration Coming Soon
            </div>
          </div>
          
          <div className="ai-chat__input-area">
            <input type="text" className="input" placeholder="Type your symptoms..." disabled aria-label="Type your message" />
            <button className="btn btn-primary btn-sm ai-chat__send" disabled aria-label="Send message">
              <Send size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      <button 
        className={`ai-chat__trigger ${isOpen ? 'ai-chat__trigger--hidden' : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Health Assistant"
      >
        <MessageSquare size={24} aria-hidden="true" />
      </button>
    </div>
  );
}
