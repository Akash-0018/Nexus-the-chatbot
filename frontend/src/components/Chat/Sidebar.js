import React, { useState } from 'react';

const Sidebar = ({ 
  isOpen, 
  onClose, 
  chatHistory = [], 
  onLoadChat, 
  onDeleteChat, 
  onNewChat,
  currentSessionId,
  theme = 'light',
  isCollapsed = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = chatHistory.filter(chat =>
    chat.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.preview?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const groupChatsByDate = (chats) => {
    const groups = {};
    chats.forEach(chat => {
      const dateKey = formatDate(chat.timestamp);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(chat);
    });
    return groups;
  };

  const groupedChats = groupChatsByDate(filteredHistory);

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''} ${theme}`}>
      <div className="sidebar-content">
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-title">
            <span className="icon">💬</span>
            {!isCollapsed && <span>Chat History</span>}
          </div>
          <button className="close-sidebar" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* New Chat Button */}
        <button className="new-chat-btn" onClick={onNewChat}>
          <span className="icon">➕</span>
          {!isCollapsed && <span>New Chat</span>}
        </button>

        {/* Search */}
        {!isCollapsed && (
          <div className="search-container">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        )}

        {/* Chat History */}
        <div className="chat-history">
          {Object.keys(groupedChats).length === 0 ? (
            !isCollapsed && (
              <div className="no-chats">
                <div className="no-chats-icon">💭</div>
                <p>No conversations yet</p>
                <p className="no-chats-subtitle">Start a new chat to see your history here</p>
              </div>
            )
          ) : (
            Object.entries(groupedChats).map(([dateGroup, chats]) => (
              <div key={dateGroup} className="date-group">
                {!isCollapsed && <div className="date-group-header">{dateGroup}</div>}
                {chats.map(chat => (
                  <div
                    key={chat.id}
                    className={`chat-item ${chat.id === currentSessionId ? 'active' : ''}`}
                    onClick={() => onLoadChat && onLoadChat(chat)}
                    title={isCollapsed ? chat.title : ''}
                  >
                    <div className="chat-item-content">
                      <div className="chat-title">
                        {isCollapsed ? '💬' : chat.title}
                      </div>
                      {!isCollapsed && (
                        <>
                          <div className="chat-preview">{chat.preview}</div>
                          <div className="chat-time">
                            {new Date(chat.timestamp).toLocaleTimeString()}
                          </div>
                        </>
                      )}
                    </div>
                    {!isCollapsed && onDeleteChat && (
                      <button
                        className="delete-chat"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChat(chat.id);
                        }}
                        title="Delete conversation"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Sidebar Footer */}
        {!isCollapsed && (
          <div className="sidebar-footer">
            <div className="footer-item">
              <span className="icon">⚡</span>
              <span>Powered by Gemini AI</span>
            </div>
            <div className="footer-item">
              <span className="icon">🔧</span>
              <span>Version 1.0.0</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
