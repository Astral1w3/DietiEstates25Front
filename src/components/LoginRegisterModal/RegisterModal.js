import './LoginRegisterModal.css'; 
import React, { useState } from 'react';

const RegisterModal = ({ isOpen, onSwitch }) => {
  // Stati specifici per la registrazione
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  function registerToDb(){

  }

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setError('');
    registerToDb();
    onSwitch('none');
  };

  return (
    <div className="modal-overlay" onClick={() => onSwitch('none')}>
      <div className="modal-content" onClick={handleContentClick}>
        <button className="close-button" onClick={() => onSwitch('none')}>×</button>
        
        <h2>Create your account</h2>
        <form onSubmit={handleRegisterSubmit}>
          <label htmlFor="name">Full Name</label>
          <input 
            className='input-generic'
            type="text"
            id="name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="email">Email</label>
          <input 
            className='input-generic'
            type="email"
            id="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="reg-password">Password</label>
          <input 
            className='input-generic'
            type="password"
            id="reg-password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <label htmlFor="confirm-password">Confirm Password</label>
          <input 
            className='input-generic'
            type="password"
            id="confirm-password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn btn-primary btn-login">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;