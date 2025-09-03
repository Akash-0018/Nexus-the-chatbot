import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import InputArea from './InputArea';
import WelcomeScreen from './WelcomeScreen';
import useChat from '../../hooks/useChat';
import '../../styles/chat-interface.css';

const ChatContainer = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState('light');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    isTyping,
    sendMessage,
    clearChat,
    sessionId
  } = useChat();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch chat history when component mounts
  useEffect(() => {
    fetchChatHistory();
  }, []);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/history', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setChatHistory(data.chat_history);
      }
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.title = 'Nexus - AI Academic Companion';
  }, [theme]);

  useEffect(() => {
    if (messages.length > 1 && sessionId) {
      setChatHistory(prev => {
        const existingChatIndex = prev.findIndex(chat => chat.id === sessionId);
        const firstUserMessage = messages.find(m => m.type === 'user');
        const lastBotMessage = messages.filter(m => m.type === 'bot').pop();
        
        const chatData = {
          id: sessionId,
          messages: messages,
          timestamp: new Date(),
          title: firstUserMessage?.content?.substring(0, 50) + (firstUserMessage?.content?.length > 50 ? '...' : '') || 'New Chat',
          preview: (lastBotMessage?.content?.substring(0, 80) || firstUserMessage?.content?.substring(0, 80)) + '...' || 'No preview'
        };

        if (existingChatIndex >= 0) {
          const updated = [...prev];
          updated[existingChatIndex] = chatData;
          return updated;
        } else {
          return [chatData, ...prev];
        }
      });
      setCurrentChatId(sessionId);
    }
  }, [messages, sessionId]);

  useEffect(() => {
    if (messages.length > 1) {
      setShowSuggestions(false);
    }
  }, [messages]);

  const filteredChatHistory = chatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupChatsByDate = (chats) => {
    const groups = {};
    chats.forEach(chat => {
      const date = new Date(chat.timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let dateKey;
      if (date.toDateString() === today.toDateString()) {
        dateKey = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateKey = 'Yesterday';
      } else {
        dateKey = date.toLocaleDateString();
      }
      
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(chat);
    });
    return groups;
  };

  const groupedChats = groupChatsByDate(filteredChatHistory);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleNewChat = () => {
    clearChat();
    setShowSuggestions(true);
    setCurrentChatId(null);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleChatSelect = (chatId) => {
    const selectedChat = chatHistory.find(chat => chat.id === chatId);
    if (selectedChat) {
      setCurrentChatId(chatId);
      setShowSuggestions(false);
    }
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleDeleteChat = (chatId) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      handleNewChat();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    setShowSuggestions(false);
  };

  const handleSendMessage = async (uploadedFile = null) => {
    if ((inputMessage.trim() || uploadedFile) && !isLoading) {
      setShowSuggestions(false);
      
      if (uploadedFile) {
        console.log('Sending message with file:', uploadedFile);
        // Add file context to the message
        const fileContext = `\n\n[File uploaded: ${uploadedFile.filename} (${uploadedFile.file_type})]`;
        setInputMessage(prev => prev + fileContext);
      }
      
      await sendMessage();
    }
  };

  return (
    <div className={`chat-interface ${theme}`} data-theme={theme}>
      {/* Mobile Header */}
      {isMobile && (
        <div className="mobile-header">
          <button 
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <span className="hamburger-icon">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
          
          <div className="header-title">
            <span className="brand-icon">🔮</span>
            <span>Nexus</span>
          </div>
          
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''} ${sidebarCollapsed ? 'collapsed' : ''} ${theme}`}>
        <div className="sidebar-content">
          <div className="sidebar-header">
            <div className="sidebar-title">
              <span className="icon">💬</span>
              {!sidebarCollapsed && <span>Chat History</span>}
            </div>
            {isMobile && (
              <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
                ✕
              </button>
            )}
          </div>

          {/* User info section removed */}

          <button className="new-chat-btn" onClick={handleNewChat}>
            <span className="icon">➕</span>
            {!sidebarCollapsed && <span>New Chat</span>}
          </button>

          {!sidebarCollapsed && (
            <div className="search-container">
              <input
                type="text"
                placeholder="Search conversations..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
          )}

          <div className="chat-history">
            {Object.keys(groupedChats).length === 0 ? (
              !sidebarCollapsed && (
                <div className="no-chats">
                  <div className="no-chats-icon">💭</div>
                  <p>No conversations found</p>
                  <p className="no-chats-subtitle">
                    {searchTerm ? 'Try a different search term' : 'Start a new chat to see your history here'}
                  </p>
                </div>
              )
            ) : (
              Object.entries(groupedChats).map(([dateGroup, chats]) => (
                <div key={dateGroup} className="date-group">
                  {!sidebarCollapsed && (
                    <div className="date-group-header">{dateGroup}</div>
                  )}
                  {chats.map(chat => (
                    <div
                      key={chat.id}
                      className={`chat-item ${chat.id === currentChatId ? 'active' : ''}`}
                      onClick={() => handleChatSelect(chat.id)}
                      title={sidebarCollapsed ? chat.title : ''}
                    >
                      <div className="chat-item-content">
                        <div className="chat-title">
                          {sidebarCollapsed ? '💬' : chat.title}
                        </div>
                        {!sidebarCollapsed && (
                          <>
                            <div className="chat-preview">{chat.preview}</div>
                            <div className="chat-time">
                              {chat.timestamp.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </>
                        )}
                      </div>
                      {!sidebarCollapsed && (
                        <button
                          className="delete-chat"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteChat(chat.id);
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

          {!sidebarCollapsed && (
            <div className="sidebar-footer">
              <div className="footer-item">
                <span className="icon">⚡</span>
                <span>Powered by Nexus AI</span>
              </div>
              <div className="footer-item">
                <span className="icon">📊</span>
                <span>{chatHistory.length} total conversations</span>
              </div>
              <div className="footer-item">
                <span className="icon">🎨</span>
                <span>Theme: {theme === 'dark' ? 'Dark' : 'Light'}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {sidebarOpen && isMobile && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Chat Area */}
      <div className={`main-chat-area ${sidebarOpen ? 'sidebar-open' : ''} ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {!isMobile && (
          <div className="desktop-header">
            <div className="header-left">
              <button 
                className="sidebar-toggle desktop"
                onClick={toggleSidebar}
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <span className="toggle-icon">
                  {sidebarCollapsed ? '☰' : '✕'}
                </span>
              </button>
              <div className="header-title">
                <span className="brand-icon">🔮</span>
                <span>Nexus - AI Academic Companion</span>
              </div>
            </div>
            
            <div className="header-right">
              {/* Desktop user info removed */}
              <button 
                className="theme-toggle desktop"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
              </button>
            </div>
          </div>
        )}

        <div className="message-area">
          <div className="messages-container">
            {messages.length <= 1 ? (
              <WelcomeScreen 
                onSuggestionClick={handleSuggestionClick} 
                theme={theme}
              />
            ) : (
              <div className="messages-list">
                <MessageList 
                  messages={messages} 
                  isTyping={isTyping} 
                  theme={theme}
                />
              </div>
            )}
          </div>
        </div>

        {showSuggestions && messages.length <= 1 && (
          <div className={`suggestion-chips ${theme}`}>
            <div className="suggestions-header">
              <span className="suggestions-title">✨ Try asking Nexus:</span>
            </div>
            <div className="suggestions-grid">
              {[
                { icon: '💻', text: 'Help me with Python code', category: 'Programming' },
                { icon: '📊', text: 'Solve a math problem', category: 'Mathematics' },
                { icon: '🔬', text: 'Explain a science concept', category: 'Science' },
                { icon: '📚', text: 'Analyze literature', category: 'Literature' },
                { icon: '📎', text: 'Analyze my uploaded file', category: 'File Analysis' },
                { icon: '🌐', text: 'Ask in Hindi/हिंदी', category: 'Language' }
              ].map((suggestion, index) => (
                <button
                  key={index}
                  className="suggestion-chip"
                  onClick={() => handleSuggestionClick(suggestion.text)}
                >
                  <span className="suggestion-icon">{suggestion.icon}</span>
                  <span className="suggestion-text">{suggestion.text}</span>
                  <span className="suggestion-category">{suggestion.category}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <InputArea
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          theme={theme}
          placeholder="Ask Nexus anything about programming, math, science, or upload a file! 🔮"
        />
      </div>
    </div>
  );
};

export default ChatContainer;
