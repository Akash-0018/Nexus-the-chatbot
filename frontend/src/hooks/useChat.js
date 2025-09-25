import { useState, useEffect, useCallback } from 'react';
import ApiService from '../Services/api';

const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      initializeChat();
    }
  }, [sessionId]);

  const initializeChat = async () => {
    try {
      const session = await ApiService.createNewSession();
      setSessionId(session.session_id);
      
      setMessages([{
        id: 'welcome',
        type: 'bot',
        content: "Hello! I'm Nexus, your AI assistant. How can I help you today?",
        timestamp: new Date(),
        subject_area: 'general'
      }]);
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      setMessages([{
        id: 'welcome-fallback',
        type: 'bot',
        content: "Welcome to Nexus! I'm here to help you with your questions.",
        timestamp: new Date(),
        subject_area: 'general'
      }]);
    }
  };

  const sendMessage = useCallback(async (uploadedFile = null) => {
    if (!inputMessage.trim() && !uploadedFile) return;

    // Add file message if uploading
    if (uploadedFile) {
      const fileMessage = {
        id: `file-${Date.now()}`,
        type: 'user',
        content: `📎 Uploaded: ${uploadedFile.filename} (${uploadedFile.file_type})`,
        fileInfo: uploadedFile,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fileMessage]);
    }

    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      let fileContent = null;

      // Extract file content for AI processing
      if (uploadedFile && uploadedFile.content) {
        if (uploadedFile.content.text_content) {
          fileContent = uploadedFile.content.text_content;
        } else if (uploadedFile.content.summary) {
          fileContent = uploadedFile.content.summary;
        } else {
          fileContent = JSON.stringify(uploadedFile.content);
        }
      }

      const response = await ApiService.sendMessage(currentMessage, sessionId, fileContent);
      
      setTimeout(() => {
        const botMessage = {
          id: `bot-${Date.now()}`,
          type: 'bot',
          content: response.response || "I couldn't process that request.",
          timestamp: new Date(),
          detected_language: response.detected_language,
          subject_area: response.subject_area || 'general'
        };

        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
        setIsTyping(false);
      }, 800);

    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage = {
        id: `error-${Date.now()}`,
        type: 'bot',
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
        subject_area: 'general'
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [inputMessage, sessionId]);

  const clearChat = useCallback(async () => {
    try {
      if (sessionId) {
        await ApiService.clearSession(sessionId);
      }
      
      setMessages([{
        id: `cleared-${Date.now()}`,
        type: 'bot',
        content: "Chat cleared. How can I help you?",
        timestamp: new Date(),
        subject_area: 'general'
      }]);
      
      const session = await ApiService.createNewSession();
      setSessionId(session.session_id);
      
    } catch (error) {
      console.error('Failed to clear chat:', error);
      setMessages([{
        id: `cleared-fallback-${Date.now()}`,
        type: 'bot',
        content: "Chat cleared. Ready for your next question.",
        timestamp: new Date(),
        subject_area: 'general'
      }]);
    }
  }, [sessionId]);

  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    isTyping,
    sessionId,
    sendMessage,
    clearChat
  };
};

export default useChat;
