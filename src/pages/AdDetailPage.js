import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adsService } from '../services/ads';
import AdDetail from '../components/ads/AdDetail';
import Loading from '../components/common/Loading';
import { toast } from 'react-toastify';
import './AdDetailPage.css';

const AdDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAd();
  }, [slug]);

  const loadAd = async () => {
    setLoading(true);
    try {
      const data = await adsService.getAdBySlug(slug);
      setAd(data);
    } catch (error) {
      toast.error('Ad not found');
      navigate('/ads');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!ad) {
    return null;
  }

  return (
    <div className="ad-detail-page">
      <AdDetail ad={ad} />
    </div>
  );
};

export default AdDetailPage;
