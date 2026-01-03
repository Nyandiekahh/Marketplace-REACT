import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { adsService } from '../services/ads';
import AdsList from '../components/ads/AdsList';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('profile');
  const [myAds, setMyAds] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/ads')) setActiveTab('ads');
    else if (path.includes('/favorites')) setActiveTab('favorites');
    else setActiveTab('profile');
  }, [location]);

  useEffect(() => {
    if (activeTab === 'ads') {
      loadMyAds();
    } else if (activeTab === 'favorites') {
      loadFavorites();
    }
  }, [activeTab]);

  const loadMyAds = async () => {
    setLoading(true);
    try {
      const data = await adsService.getMyAds();
      setMyAds(data.results || data);
    } catch (error) {
      console.error('Failed to load ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const data = await adsService.getFavorites();
      setFavorites(data.results || data);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar-large">
            {user?.first_name?.[0] || user?.email?.[0] || 'U'}
          </div>
          <div className="profile-info">
            <h1>{user?.first_name} {user?.last_name}</h1>
            <p>{user?.email}</p>
            {user?.phone_number && <p>{user.phone_number}</p>}
          </div>
        </div>

        <div className="profile-tabs">
          <button
            className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`profile-tab ${activeTab === 'ads' ? 'active' : ''}`}
            onClick={() => setActiveTab('ads')}
          >
            My Ads
          </button>
          <button
            className={`profile-tab ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            Favorites
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'profile' && (
            <div className="profile-details">
              <h2>Profile Information</h2>
              <div className="profile-detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">
                  {user?.first_name} {user?.last_name}
                </span>
              </div>
              <div className="profile-detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{user?.email}</span>
              </div>
              <div className="profile-detail-item">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{user?.phone_number || 'Not provided'}</span>
              </div>
              <div className="profile-detail-item">
                <span className="detail-label">Member Since:</span>
                <span className="detail-value">
                  {new Date(user?.joined_date).toLocaleDateString()}
                </span>
              </div>
              <div className="profile-detail-item">
                <span className="detail-label">Verified:</span>
                <span className="detail-value">
                  {user?.is_verified ? '✓ Yes' : '✗ No'}
                </span>
              </div>
            </div>
          )}

          {activeTab === 'ads' && (
            <div className="profile-ads">
              <h2>My Ads ({myAds.length})</h2>
              <AdsList ads={myAds} loading={loading} />
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="profile-favorites">
              <h2>Favorite Ads ({favorites.length})</h2>
              <AdsList 
                ads={favorites} 
                loading={loading}
                onFavoriteChange={loadFavorites}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
