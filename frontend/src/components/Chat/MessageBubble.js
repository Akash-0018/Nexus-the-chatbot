import React from 'react';
import MessageRenderer from './MessageRenderer';
import { getSubjectIcon } from '../../utils/helpers';

const MessageBubble = ({ message }) => {
  return (
    <div className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}>
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
              <MessageRenderer content={message.content} type={message.subject_area} />
            ) : (
              <div className="user-content">{message.content}</div>
            )}
          </div>
          <small className="message-time">
            {message.timestamp.toLocaleTimeString()}
            {message.detected_language && message.detected_language !== 'en' && (
              <span className="language-indicator">
                {' '}• {message.detected_language.toUpperCase()}
              </span>
            )}
          </small>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
