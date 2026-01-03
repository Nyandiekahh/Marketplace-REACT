import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';
import Input from '../common/Input';
import Button from '../common/Button';
import { toast } from 'react-toastify';
import './Auth.css';

const VerifyEmail = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.verifyEmail(code);
      toast.success('Email verified successfully!');
      navigate('/login');
    } catch (error) {
      toast.error('Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Verify Email</h2>
        <p className="auth-subtitle">
          We've sent a verification code to your email
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            type="text"
            label="Verification Code"
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            fullWidth
            maxLength={6}
          />

          <Button type="submit" fullWidth loading={loading}>
            Verify Email
          </Button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
