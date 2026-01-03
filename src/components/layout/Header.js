import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="header-logo">
            <h1>Marketplace</h1>
          </Link>

          <nav className="header-nav">
            <Link to="/ads" className="nav-link">Browse Ads</Link>
            {isAuthenticated && (
              <Link to="/messages" className="nav-link">Messages</Link>
            )}
          </nav>

          <div className="header-actions">
            {isAuthenticated ? (
              <>
                <Link to="/create-ad">
                  <button className="btn btn-primary post-ad-btn">
                    + Post Ad
                  </button>
                </Link>
                
                <div className="user-menu profile-menu">
                  <button 
                    className="user-menu-trigger"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <div className="user-avatar">
                      {user?.first_name?.[0] || user?.email?.[0] || 'U'}
                    </div>
                    <span className="user-name">
                      {user?.first_name || user?.email}
                    </span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {showUserMenu && (
                    <div className="user-menu-dropdown">
                      <Link to="/profile" className="user-menu-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M13.3 14v-1.3A2.7 2.7 0 0 0 10.6 10H5.4a2.7 2.7 0 0 0-2.7 2.7V14M8 7.3A2.7 2.7 0 1 0 8 2a2.7 2.7 0 0 0 0 5.3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        My Profile
                      </Link>
                      <Link to="/profile/ads" className="user-menu-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M14 5H2M14 5a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1M14 5V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        My Ads
                      </Link>
                      <Link to="/profile/favorites" className="user-menu-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 14s6-4 6-8c0-2.21-1.79-4-4-4-1.39 0-2.61.71-3.33 1.78A3.988 3.988 0 0 0 3.67 2.78C1.79 2.78 0 4.57 0 6.78c0 4 6 8 6 8z" fill="currentColor"/>
                        </svg>
                        Favorites
                      </Link>
                      <div className="user-menu-divider"></div>
                      <button onClick={handleLogout} className="user-menu-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M6 14H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="btn btn-ghost">Login</button>
                </Link>
                <Link to="/register">
                  <button className="btn btn-primary">Sign Up</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
