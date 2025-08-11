import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="message bot-message">
      <div className="message-content">
        <div className="bot-avatar">
          <span className="subject-icon">🤖</span>
        </div>
        <div className="message-text">
          <div className="message-bubble typing-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            StudyBuddy is thinking...
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
