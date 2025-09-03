import React from 'react';

const WelcomeScreen = ({ theme, onSuggestionClick, userName }) => {
  const suggestions = [
    {
      icon: '💻',
      text: 'Help me with Python code',
      category: 'Programming',
      description: 'Debug, explain, or write code'
    },
    {
      icon: '📊',
      text: 'Solve a math problem',
      category: 'Mathematics',
      description: 'Equations, calculus, algebra'
    },
    {
      icon: '🔬',
      text: 'Explain a science concept',
      category: 'Science',
      description: 'Physics, chemistry, biology'
    },
    {
      icon: '📚',
      text: 'Analyze literature',
      category: 'Literature',
      description: 'Poems, novels, essays'
    },
    {
      icon: '📎',
      text: 'Analyze my uploaded file',
      category: 'File Analysis',
      description: 'Upload & analyze documents'
    },
    {
      icon: '🌐',
      text1: 'என்னுடன் தமிழில் பேசுங்கள்',
      text2: 'నాతో తెలుగులో మాట్లాడండి',
      text3: 'എന്നോടു മലയാളത്തിൽ സംസാരിക്കൂ',
      category: 'Language',
      description: 'Multilingual support'
    }
  ];

  const handleSuggestionClick = (suggestion) => {
    // For multilingual suggestion, use the first text option
    const textToUse = suggestion.text || suggestion.text1 || 'Ask in your language';
    onSuggestionClick && onSuggestionClick(textToUse);
  };

  return (
    <div className={`welcome-screen ${theme}`}>
      <div className="welcome-content">
        <div className="welcome-hero">
          <div className="welcome-icon">🔮</div>
          <h1 className="welcome-title">Welcome {userName}!</h1>
          <p className="welcome-subtitle">
            I'm Nexus, your advanced AI companion ready to help you excel in your studies and research
          </p>
        </div>

        <div className="features-section">
          <h2 className="features-title">What Nexus can do for you:</h2>
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">💻</span>
              <div className="feature-content">
                <h3>Programming & Code</h3>
                <p>Debug, explain, and write code in any language</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <div className="feature-content">
                <h3>Mathematics</h3>
                <p>From basic arithmetic to advanced calculus</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔬</span>
              <div className="feature-content">
                <h3>Science</h3>
                <p>Physics, Chemistry, Biology concepts</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📚</span>
              <div className="feature-content">
                <h3>Literature</h3>
                <p>Analysis, essays, and creative writing</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🌍</span>
              <div className="feature-content">
                <h3>Multiple Languages</h3>
                <p>Communicate in Tamil, Telugu, Malayalam & more</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📎</span>
              <div className="feature-content">
                <h3>File Analysis</h3>
                <p>Upload & analyze PDFs, documents, images</p>
              </div>
            </div>
          </div>
        </div>

        <div className="suggestions-section">
          <h2 className="suggestions-title">✨ Try asking Nexus:</h2>
          <div className="suggestions-grid">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="suggestion-card"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="suggestion-header">
                  <span className="suggestion-icon">{suggestion.icon}</span>
                  <span className="suggestion-category">{suggestion.category}</span>
                </div>
                <div className="suggestion-content">
                  {/* Handle multilingual text display */}
                  {suggestion.text ? (
                    <p className="suggestion-text">{suggestion.text}</p>
                  ) : (
                    <div className="multilingual-text">
                      <p className="suggestion-text tamil">{suggestion.text1}</p>
                      <p className="suggestion-text telugu">{suggestion.text2}</p>
                      <p className="suggestion-text malayalam">{suggestion.text3}</p>
                    </div>
                  )}
                  <p className="suggestion-description">{suggestion.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="tips-section">
          <h2 className="tips-title">💡 Pro Tips:</h2>
          <div className="tips-grid">
            <div className="tip-item">
              <span className="tip-icon">⚡</span>
              <p>Be specific with your questions for better answers</p>
            </div>
            <div className="tip-item">
              <span className="tip-icon">📎</span>
              <p>Upload files to let Nexus analyze documents and images</p>
            </div>
            <div className="tip-item">
              <span className="tip-icon">🌟</span>
              <p>Ask follow-up questions to dive deeper into topics</p>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <p className="cta-text">Ready to explore with Nexus? Type your question or upload a file! 🔮</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
