import React, { useState } from 'react';

const QuickActions = ({ setInputMessage, clearChat }) => {
  const [showAll, setShowAll] = useState(false);

  const quickActions = [
    { text: "Help with Python code 🐍", subject: "programming", icon: "💻" },
    { text: "Solve math problem 📐", subject: "mathematics", icon: "📊" },
    { text: "Explain science concept 🧬", subject: "science", icon: "🔬" },
    { text: "Literature analysis 📚", subject: "literature", icon: "📖" },
    { text: "Help with JavaScript 🟨", subject: "programming", icon: "💻" },
    { text: "Chemistry equation ⚗️", subject: "science", icon: "🔬" },
  ];

  const visibleActions = showAll ? quickActions : quickActions.slice(0, 4);

  return (
    <div className="row">
      <div className="col-12">
        <div className="quick-actions">
          <div className="d-flex flex-wrap gap-2 justify-content-center mb-3">
            {visibleActions.map((action, index) => (
              <button
                key={index}
                className="btn btn-outline-primary btn-sm quick-action-btn d-flex align-items-center gap-2"
                onClick={() => setInputMessage(action.text)}
              >
                <span>{action.icon}</span>
                <span className="d-none d-sm-inline">{action.text}</span>
                <span className="d-sm-none">{action.text.split(' ')[0]}</span>
              </button>
            ))}
          </div>
          
          <div className="text-center">
            <div className="btn-group" role="group">
              <button 
                className="btn btn-outline-light btn-sm me-2"
                onClick={clearChat}
              >
                🔄 New Chat
              </button>
              
              {quickActions.length > 4 && (
                <button 
                  className="btn btn-outline-light btn-sm"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? '🔼 Less' : '🔽 More'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
