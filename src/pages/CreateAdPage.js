import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import CreateAd from '../components/ads/CreateAd';
import './CreateAdPage.css';

const CreateAdPage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="create-ad-page">
      <CreateAd />
    </div>
  );
};

export default CreateAdPage;
