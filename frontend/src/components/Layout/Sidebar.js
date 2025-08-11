import React, { useState } from 'react';
import '../../styles/Sidebar.css';

const Sidebar = ({ 
  isCollapsed, 
  toggleSidebar, 
  chatHistory, 
  currentChatId, 
  onChatSelect, 
  onNewChat,
  theme,
  toggleTheme,
  isMobile,
  isOpen
}) => {
  const [hoveredChat, setHoveredChat] = useState(null);

  const formatChatTitle = (chat) => {
    if (chat.messages && chat.messages.length > 0) {
      const firstMessage = chat.messages.find(m => m.type === 'user');
      if (firstMessage) {
        return firstMessage.content.length > 30 
          ? firstMessage.content.substring(0, 30) + '...'
          : firstMessage.content;
      }
    }
    return `Chat ${chat.id.substring(0, 8)}`;
  };

  const getChatIcon = (chat) => {
    if (chat.messages && chat.messages.length > 0) {
      const botMessage = chat.messages.find(m => m.type === 'bot' && m.subject_area);
      if (botMessage) {
        const icons = {
          'programming': '💻',
          'mathematics': '📊',
          'science': '🔬',
          'literature': '📖',
          'history': '🏛️',
          'general': '💭'
        };
        return icons[botMessage.subject_area] || '💭';
      }
    }
    return '💭';
  };

  return (
    <>
      {isMobile && isOpen && (
        <div className="sidebar-overlay show" onClick={toggleSidebar} />
      )}
      
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobile && isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-title">
            <span className="brand-icon">🤖</span>
            Nexus
          </div>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {isCollapsed ? '→' : '←'}
          </button>
        </div>

        <button className="new-chat-btn" onClick={onNewChat}>
          <span>➕</span>
          <span className="btn-text">New Chat</span>
        </button>

        <div className="chat-history">
          {chatHistory.map((chat) => (
            <div
              key={chat.id}
              className={`chat-history-item ${currentChatId === chat.id ? 'active' : ''}`}
              onClick={() => onChatSelect(chat.id)}
              onMouseEnter={() => setHoveredChat(chat.id)}
              onMouseLeave={() => setHoveredChat(null)}
            >
              <span className="chat-icon">{getChatIcon(chat)}</span>
              <span className="chat-title">{formatChatTitle(chat)}</span>
              {hoveredChat === chat.id && !isCollapsed && (
                <button 
                  className="chat-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle delete chat
                  }}
                >
                  🗑️
                </button>
              )}
            </div>
          ))}
          
          {chatHistory.length === 0 && !isCollapsed && (
            <div className="no-chats">
              <p style={{ 
                color: 'var(--text-secondary)', 
                textAlign: 'center', 
                padding: '20px',
                fontSize: '0.9rem'
              }}>
                No chat history yet. Start a new conversation!
              </p>
            </div>
          )}
        </div>

        <div className="sidebar-footer">
          <button className="theme-toggle" onClick={toggleTheme}>
            <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span className="theme-text">
              {theme === 'dark' ? 'Light' : 'Dark'}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
