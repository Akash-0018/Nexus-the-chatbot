import React from 'react';
import ChatContainer from './components/Chat/ChatContainer';
import ErrorBoundary from './components/Common/ErrorBoundary';
import './styles/chat-interface.css';

function App() {
  return (
    <ErrorBoundary>
      <ChatContainer />
    </ErrorBoundary>
  );
}

export default App;
