export const getSubjectIcon = (subject) => {
  const icons = {
    'programming': '💻',
    'mathematics': '📊',
    'science': '🔬',
    'literature': '📖',
    'history': '🏛️',
    'general': '🎯'
  };
  return icons[subject] || '🎯';
};

export const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString();
};

export const truncateMessage = (message, maxLength = 100) => {
  if (message.length <= maxLength) return message;
  return message.substring(0, maxLength) + '...';
};

export const detectCodeBlock = (text) => {
  return text.includes('```') || text.includes('```');
};

// Additional helpful utility functions for your StudyBuddy app:

export const isValidMessage = (message) => {
  return message && message.trim().length > 0;
};

export const getLanguageEmoji = (langCode) => {
  const languageEmojis = {
    'en': '🇺🇸',
    'hi': '🇮🇳',
    'bn': '🇧🇩',
    'te': '🇮🇳',
    'mr': '🇮🇳',
    'ta': '🇮🇳',
    'gu': '🇮🇳',
    'kn': '🇮🇳',
    'ml': '🇮🇳',
    'pa': '🇮🇳',
    'or': '🇮🇳'
  };
  return languageEmojis[langCode] || '🌐';
};

export const formatMessageForDisplay = (message) => {
  // Replace code blocks with formatted version
  return message.replace(/```([\s\S]*?)```/g, (match, code) => {
    return `<pre><code>${code}</code></pre>`;
  });
};

export const extractCodeFromMessage = (message) => {
  const codeBlocks = message.match(/```([\s\S]*?)```/g);
  return codeBlocks ? codeBlocks.map(block => block.replace(/```/g, '')) : [];
};

export const getSubjectColor = (subject) => {
  const colors = {
    'programming': '#007bff',
    'mathematics': '#28a745',
    'science': '#dc3545',
    'literature': '#6f42c1',
    'history': '#fd7e14',
    'general': '#6c757d'
  };
  return colors[subject] || colors['general'];
};
