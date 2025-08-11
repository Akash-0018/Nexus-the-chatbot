import React from 'react';
import MessageRenderer from './MessageRenderer';

const MessageList = ({ messages, isTyping, theme }) => {
  const getSubjectIcon = (subject) => {
    const icons = {
      'programming': '💻',
      'mathematics': '📊',
      'science': '🔬',
      'literature': '📖',
      'document_analysis': '📄',
      'history': '🏛️',
      'general': '🔮'
    };
    return icons[subject] || '🔮';
  };

  return (
    <div className={`messages-list ${theme}`}>
      {messages.map((message, index) => (
        <div key={message.id || index} className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}>
          <div className="message-content">
            {message.type === 'bot' && (
              <div className="bot-avatar">
                <span className="subject-icon">
                  {getSubjectIcon(message.subject_area)}
                </span>
              </div>
            )}
            <div className="message-text">
              <div className="message-bubble">
                {message.type === 'bot' ? (
                  <MessageRenderer 
                    content={message.content}
                    theme={theme}
                    contentType={message.subject_area || 'general'}
                  />
                ) : (
                  message.content
                )}
              </div>
              <small className="message-time">
                {message.timestamp ? message.timestamp.toLocaleTimeString() : new Date().toLocaleTimeString()}
                {message.detected_language && message.detected_language !== 'en' && (
                  <span className="language-indicator">
                    {' '}• {message.detected_language.toUpperCase()}
                  </span>
                )}
              </small>
            </div>
          </div>
        </div>
      ))}
      
      {isTyping && (
        <div className="typing-indicator">
          <div className="bot-avatar">
            <span className="subject-icon">🔮</span>
          </div>
          <div className="typing-bubble">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            Nexus is thinking...
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;
