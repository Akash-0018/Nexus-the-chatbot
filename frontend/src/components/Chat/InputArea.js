import React, { useRef, useEffect, useState } from 'react';
import FileUpload from './FileUpload';

const InputArea = ({ 
  inputMessage, 
  setInputMessage, 
  onSendMessage, 
  isLoading, 
  theme,
  placeholder = "Ask Nexus anything about programming, math, science, or upload a file! 🔮"
}) => {
  const textareaRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if ((inputMessage.trim() || uploadedFile) && !isLoading) {
        onSendMessage(uploadedFile);
        setUploadedFile(null);
      }
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    autoResize();
  };

  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 120);
      textarea.style.height = newHeight + 'px';
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleSendMessage = () => {
    if ((inputMessage.trim() || uploadedFile) && !isLoading) {
      onSendMessage(uploadedFile);
      setUploadedFile(null);
    }
  };

  const handleFileProcessed = (fileData) => {
    setUploadedFile(fileData);
    
    const fileContext = `I've uploaded a ${fileData.file_type.toUpperCase()} file named "${fileData.filename}". `;
    setInputMessage(fileContext);
    
    textareaRef.current?.focus();
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    setInputMessage('');
  };

  useEffect(() => {
    autoResize();
  }, [inputMessage]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea && !isLoading) {
      textarea.focus();
    }
  }, [isLoading]);

  const charCount = inputMessage.length;

  return (
    <div className={`input-area ${theme} ${isFocused ? 'focused' : ''}`}>
      {uploadedFile && (
        <div className="uploaded-file-preview">
          <div className="file-preview-card">
            <div className="file-info">
              <span className="file-icon">
                {uploadedFile.file_type === 'pdf' ? '📄' : 
                 uploadedFile.file_type.includes('image') ? '🖼️' : 
                 uploadedFile.file_type.includes('word') || uploadedFile.file_type.includes('docx') ? '📝' :
                 uploadedFile.file_type.includes('excel') || uploadedFile.file_type.includes('xlsx') ? '📊' :
                 uploadedFile.file_type.includes('powerpoint') || uploadedFile.file_type.includes('pptx') ? '📽️' : '📁'}
              </span>
              <div className="file-details">
                <span className="file-name">{uploadedFile.filename}</span>
                <span className="file-type">{uploadedFile.file_type.toUpperCase()} • Ready for Nexus analysis</span>
              </div>
            </div>
            <button 
              className="remove-file-btn"
              onClick={removeUploadedFile}
              title="Remove file"
            >
              <span className="remove-icon">✕</span>
            </button>
          </div>
        </div>
      )}

      <div className="input-container">
        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            className="message-input"
            placeholder={uploadedFile ? `Ask Nexus anything about "${uploadedFile.filename}"...` : placeholder}
            value={inputMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={isLoading}
            rows="1"
            maxLength={2000}
            aria-label="Type your message"
          />
          
          {charCount > 1500 && (
            <div className="char-count">
              <span className={charCount > 1800 ? 'warning' : ''}>
                {charCount}/2000
              </span>
            </div>
          )}
          
          <div className="action-buttons">
            <FileUpload 
              onFileProcessed={handleFileProcessed}
              theme={theme}
              isLoading={isLoading}
            />
            
            <button
              className={`send-btn ${(inputMessage.trim() || uploadedFile) ? 'active' : ''}`}
              onClick={handleSendMessage}
              disabled={isLoading || (!inputMessage.trim() && !uploadedFile)}
              title={isLoading ? 'Sending...' : 'Send message (Enter)'}
              aria-label="Send message"
            >
              {isLoading ? (
                <div className="loading-spinner">
                  <div className="spinner" />
                </div>
              ) : (
                <span className="send-icon">🚀</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="input-footer">
        <div className="input-hints">
          <span className="hint-left">
            <kbd>Enter</kbd> to send • <kbd>Shift + Enter</kbd> for new line
          </span>
          <span className="hint-right">
            {charCount > 0 && `${charCount} characters`}
            {uploadedFile && (
              <span className="file-indicator">
                📎 File attached
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InputArea;
