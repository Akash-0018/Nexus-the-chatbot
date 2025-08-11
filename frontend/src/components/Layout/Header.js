import React, { useState, useEffect } from 'react';

const Header = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="row">
      <div className="col-12">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-lg">
          <div className="container">
            <span className="navbar-brand mb-0 h1 d-flex align-items-center">
              <span className="brand-icon">🤖</span>
              <span className="d-none d-md-inline">Nexus - Your AI Academic Companion</span>
              <span className="d-md-none">Nexus</span>
            </span>
            
            <div className="navbar-nav d-flex align-items-center">
              {!isOnline && (
                <span className="badge bg-warning me-2">
                  📡 Offline
                </span>
              )}
              <span className="nav-text d-none d-lg-inline">
                Powered by Google Gemini AI ✨
              </span>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;
