import React from 'react';
import AdCard from './AdCard';
import Loading from '../common/Loading';
import './AdsList.css';

const AdsList = ({ ads, loading, onFavoriteChange }) => {
  if (loading) {
    return <Loading />;
  }

  if (!ads || ads.length === 0) {
    return (
      <div className="ads-empty">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="38" stroke="#e0e0e0" strokeWidth="4"/>
          <path d="M28 40h24M40 28v24" stroke="#e0e0e0" strokeWidth="4" strokeLinecap="round"/>
        </svg>
        <h3>No ads found</h3>
        <p>Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="ads-grid">
      {ads.map((ad) => (
        <AdCard key={ad.id} ad={ad} onFavoriteChange={onFavoriteChange} />
      ))}
    </div>
  );
};

export default AdsList;
