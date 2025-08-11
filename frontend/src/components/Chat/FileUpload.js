import React, { useState, useRef } from 'react';
import ApiService from '../../Services/api';

const FileUpload = ({ onFileProcessed, theme, isLoading: parentLoading, sessionId }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const supportedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-powerpoint',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/tiff',
    'image/webp'
  ];

  const handleFiles = async (files) => {
    const file = files[0];
    if (!file) return;

    setUploadError(null);

    // Enhanced file validation
    if (!supportedTypes.includes(file.type)) {
      setUploadError(`File type "${file.type}" not supported! Please upload PDF, Word, Excel, PowerPoint, or image files.`);
      return;
    }

    if (file.size > 16 * 1024 * 1024) {
      setUploadError(`File size ${(file.size / (1024 * 1024)).toFixed(2)}MB is too large! Please upload files smaller than 16MB.`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Progress simulation
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 150);

      // Use optimized ApiService.uploadFile
      console.log('Starting file upload:', file.name);
      const uploadResult = await ApiService.uploadFile(file, sessionId);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (uploadResult.success) {
        console.log('Upload successful:', uploadResult);
        // Add file to chat as a message
        const fileMessage = {
          type: 'file',
          filename: file.name,
          content: uploadResult.content,
          timestamp: new Date()
        };
        onFileProcessed({ ...uploadResult, message: fileMessage });
        setUploadError(null);
        console.log(`✅ File "${file.name}" processed successfully by Nexus!`);
      } else {
        console.error('Upload response indicated failure:', uploadResult);
        throw new Error(uploadResult.error || 'Upload failed');
      }

    } catch (error) {
      console.error('File upload error:', error);
      setUploadError(error.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const openFileDialog = () => {
    if (!isDisabled) {
      fileInputRef.current?.click();
    }
  };

  const clearError = () => {
    setUploadError(null);
  };

  const isDisabled = isUploading || parentLoading || !sessionId;

  return (
    <div className={`file-upload-container ${theme}`}>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleInputChange}
        accept=".pdf,.docx,.doc,.xlsx,.xls,.pptx,.ppt,.txt,.jpg,.jpeg,.png,.gif,.bmp,.tiff,.webp"
        style={{ display: 'none' }}
        disabled={isDisabled}
      />

      <button
        className="file-upload-btn"
        onClick={openFileDialog}
        disabled={isDisabled}
        title={
          isUploading ? "Uploading..." : 
          !sessionId ? "Start a chat session first" :
          "Upload files (PDF, Word, Excel, PowerPoint, Images)"
        }
      >
        {isUploading ? (
          <div className="upload-progress">
            <div className="progress-ring">
              <svg width="18" height="18">
                <circle 
                  cx="9" cy="9" r="7" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  fill="none"
                  strokeDasharray="44"
                  strokeDashoffset={44 - (44 * uploadProgress) / 100}
                  style={{ transition: 'stroke-dashoffset 0.3s' }}
                />
              </svg>
            </div>
          </div>
        ) : (
          <span className="upload-icon">📎</span>
        )}
      </button>

      {uploadError && (
        <div className="upload-error">
          <span className="error-icon">⚠️</span>
          <div className="error-content">
            <span className="error-text">{uploadError}</span>
            <button 
              className="error-close"
              onClick={clearError}
              title="Close error"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div
        className={`drag-drop-overlay ${dragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="drag-drop-content">
          <div className="drag-animation">
            <div className="drag-icon">📁</div>
            <div className="drag-ripple"></div>
          </div>
          <h3>Drop your files here</h3>
          <p className="drag-subtitle">Let Nexus analyze your documents</p>
          <div className="supported-formats">
            <span>📄 PDF</span>
            <span>📝 Word</span>
            <span>📊 Excel</span>
            <span>📽️ PowerPoint</span>
            <span>🖼️ Images</span>
          </div>
          <p className="file-limit">Max size: 16MB</p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
