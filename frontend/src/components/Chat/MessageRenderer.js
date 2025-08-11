import React, { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import '../../styles/message-renderer.css';

const MessageRenderer = ({ content, theme, contentType = 'general' }) => {
  const [copiedCode, setCopiedCode] = useState('');
  const codeStyle = theme === 'dark' ? atomOneDark : atomOneLight;

  const parseMarkdown = (text) => {
    const lines = text.split('\n');
    const elements = [];
    let currentBlock = null;
    let codeLang = '';
    let codeLines = [];

    // ✅ FIXED: Using template literal approach to avoid string parsing issues
    const CODE_BLOCK_MARKER = '```'; 

    lines.forEach((line, index) => {
      // ✅ FIXED: Using properly terminated string comparison
      if (line.startsWith(CODE_BLOCK_MARKER)) {
        if (currentBlock === null) {
          currentBlock = index;
          codeLang = line.slice(3).trim() || 'text';
          codeLines = [];
          return;
        } else {
          const codeString = codeLines.join('\n');
          elements.push(
            <div key={`code-${currentBlock}`} className="nexus-code-container">
              <div className="nexus-code-header">
                <span className="nexus-code-language">{codeLang}</span>
                <button
                  className="nexus-copy-btn"
                  onClick={() => copyToClipboard(codeString)}
                  title="Copy code"
                >
                  {copiedCode === codeString ? '✅ Copied' : '📋 Copy'}
                </button>
              </div>
              <div className="nexus-code-content">
                <SyntaxHighlighter
                  language={codeLang}
                  style={codeStyle}
                  customStyle={{
                    margin: 0,
                    padding: '1.5rem 1.2rem',
                    background: 'transparent',
                    fontSize: '0.95rem',
                    lineHeight: '1.6'
                  }}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            </div>
          );
          currentBlock = null;
          codeLang = '';
          codeLines = [];
          return;
        }
      }

      // Handle content inside code blocks
      if (currentBlock !== null) {
        codeLines.push(line);
        return;
      }

      // Handle headers - Enhanced with modern styling
      if (line.startsWith('## ')) {
        elements.push(
          <div key={`header-section-${index}`} className="nexus-message-section">
            <h3 className="nexus-message-header">{line.slice(3).trim()}</h3>
          </div>
        );
        return;
      }

      if (line.startsWith('### ')) {
        elements.push(
          <h4 key={`subheader-${index}`} className="nexus-message-subheader">
            {line.slice(4).trim()}
          </h4>
        );
        return;
      }

      // Handle emoji headers for Nexus AI format
      if (line.startsWith('🔧 ') || line.startsWith('🚀 ') || line.startsWith('💡 ')) {
        elements.push(
          <div key={`emoji-section-${index}`} className="nexus-message-section">
            <h3 className="nexus-message-header">{line.trim()}</h3>
          </div>
        );
        return;
      }

      // Handle bullet points - Enhanced styling
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        const bulletText = line.replace(/^[-*]\s*/, '').trim();
        if (bulletText) {
          elements.push(
            <div key={`bullet-${index}`} className="nexus-bullet-point">
              <span className="nexus-bullet-icon">-  </span>
              <span className="nexus-bullet-text">{bulletText}</span>
            </div>
          );
        }
        return;
      }

      // Handle regular text
      if (line.trim() !== '') {
        elements.push(
          <p key={`text-${index}`} className="nexus-message-text">
            {line.trim()}
          </p>
        );
      } else {
        elements.push(
          <div key={`space-${index}`} className="nexus-message-spacer"></div>
        );
      }
    });

    return elements;
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(text);
      setTimeout(() => setCopiedCode(''), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="nexus-message-container">
      <div className={`nexus-message-content ${contentType}-content`}>
        {parseMarkdown(content)}
      </div>
    </div>
  );
};

export default MessageRenderer;
