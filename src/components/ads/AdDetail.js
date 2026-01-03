import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatPrice, formatDate, getImageUrl } from '../../utils/helpers';
import { adsService } from '../../services/ads';
import { messagesService } from '../../services/messages';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { toast } from 'react-toastify';
import './AdDetail.css';

const AdDetail = ({ ad }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const images = ad.images?.length > 0 
    ? ad.images.map(img => getImageUrl(img.image))
    : ['https://via.placeholder.com/800x600?text=No+Image'];

  const isOwner = user && ad.seller?.id === user.id;

  const handleContactSeller = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to contact seller');
      navigate('/login');
      return;
    }

    if (isOwner) {
      toast.info('This is your own ad');
      return;
    }

    setShowContactModal(true);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setSending(true);

    try {
      await messagesService.createConversation({
        recipient_id: ad.seller.id,
        ad_id: ad.id,
        initial_message: message,
      });

      toast.success('Message sent!');
      setShowContactModal(false);
      navigate('/messages');
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleMarkAsSold = async () => {
    try {
      await adsService.markAsSold(ad.slug);
      toast.success('Ad marked as sold!');
      window.location.reload();
    } catch (error) {
      toast.error('Failed to mark as sold');
    }
  };

  return (
    <div className="ad-detail">
      <div className="ad-detail-gallery">
        <div className="ad-detail-main-image">
          <img src={images[currentImageIndex]} alt={ad.title} />
        </div>
        {images.length > 1 && (
          <div className="ad-detail-thumbnails">
            {images.map((img, index) => (
              <div
                key={index}
                className={`ad-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <img src={img} alt={`${ad.title} ${index + 1}`} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="ad-detail-info">
        <div className="ad-detail-header">
          <h1 className="ad-detail-title">{ad.title}</h1>
          <p className="ad-detail-price">{formatPrice(ad.price, ad.currency)}</p>
        </div>

        <div className="ad-detail-meta">
          <span className="ad-meta-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M13 7c0 4-5 8-5 8S3 11 3 7a5 5 0 0 1 10 0z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            {ad.location?.city}, {ad.location?.county}
          </span>
          <span className="ad-meta-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {formatDate(ad.created_at)}
          </span>
          <span className="ad-meta-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            {ad.views_count} views
          </span>
        </div>

        <div className="ad-detail-description">
          <h3>Description</h3>
          <p>{ad.description}</p>
        </div>

        <div className="ad-detail-specs">
          <div className="ad-spec">
            <span className="ad-spec-label">Condition</span>
            <span className="ad-spec-value">{ad.condition}</span>
          </div>
          <div className="ad-spec">
            <span className="ad-spec-label">Category</span>
            <span className="ad-spec-value">{ad.category?.name}</span>
          </div>
          {ad.is_negotiable && (
            <div className="ad-spec">
              <span className="ad-spec-label">Negotiable</span>
              <span className="ad-spec-value">Yes</span>
            </div>
          )}
        </div>

        <div className="ad-detail-seller">
          <h3>Seller Information</h3>
          <div className="seller-card">
            <div className="seller-avatar">
              {ad.seller?.first_name?.[0] || ad.seller?.email?.[0] || 'S'}
            </div>
            <div className="seller-info">
              <p className="seller-name">
                {ad.seller?.first_name} {ad.seller?.last_name}
              </p>
              {ad.seller?.phone_number && (
                <p className="seller-phone">{ad.seller.phone_number}</p>
              )}
            </div>
          </div>
        </div>

        <div className="ad-detail-actions">
          {isOwner ? (
            <>
              {ad.status === 'active' && (
                <Button onClick={handleMarkAsSold} variant="primary" fullWidth>
                  Mark as Sold
                </Button>
              )}
              {ad.status === 'sold' && (
                <div className="sold-badge">SOLD</div>
              )}
            </>
          ) : (
            <Button onClick={handleContactSeller} variant="primary" fullWidth>
              Contact Seller
            </Button>
          )}
        </div>
      </div>

      <Modal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        title="Contact Seller"
      >
        <div className="contact-modal">
          <p>Send a message to the seller about this item:</p>
          <textarea
            className="contact-textarea"
            placeholder="Hi, is this item still available?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
          />
          <Button onClick={handleSendMessage} loading={sending} fullWidth>
            Send Message
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdDetail;
