import React from 'react';
import ChatContainer from './components/Chat/ChatContainer';
import ErrorBoundary from './components/Common/ErrorBoundary';
import './styles/chat-interface.css';

const MainApp = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="App">
      {user ? (
        <ErrorBoundary>
          <ChatContainer user={user} />
        </ErrorBoundary>
      ) : (
        <Login />
      )}
    </div>
  );
};

const AuthSuccess = () => {
  const { checkAuthStatus, user, isLoading } = useAuth();
  const [retryCount, setRetryCount] = React.useState(0);

  React.useEffect(() => {
    const maxRetries = 3;
    const retryInterval = 1000; // 1 second

    const attemptAuth = async () => {
      console.log('Attempting authentication check...');
      const isAuthenticated = await checkAuthStatus();
      
      if (isAuthenticated) {
        console.log('Successfully authenticated, redirecting...');
        window.location.href = '/';
      } else if (retryCount < maxRetries) {
        console.log(`Auth check failed, retrying... (${retryCount + 1}/${maxRetries})`);
        setTimeout(() => setRetryCount(prev => prev + 1), retryInterval);
      } else {
        console.log('Max retries reached, redirecting to login...');
        window.location.href = '/';
      }
    };

    if (!user && !isLoading) {
      attemptAuth();
    } else if (user) {
      window.location.href = '/';
    }
  }, [checkAuthStatus, retryCount, user, isLoading]);

  return (
    <div className="auth-success-container">
      <div className="auth-success-message">
        <h2>Authentication successful!</h2>
        <p>Please wait while we redirect you...</p>
        {/* Optional: Add a loading spinner here */}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div className="App">
      <ErrorBoundary>
        <ChatContainer />
      </ErrorBoundary>
    </div>
  );
};

export default App;
