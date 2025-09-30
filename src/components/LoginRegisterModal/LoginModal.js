import './LoginRegisterModal.css'; 
import React, { useState } from 'react';

const LoginModal = ({ isOpen, onSwitch }) => {

  const [view, setView] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); 
  
  if (!isOpen) {
    return null;
  }

  // Funzione per impedire che un click sul contenuto del modal chiuda il modal stesso (evita la bubble propagation)
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  //chiamate api
  function checkIfEmailExist(){
    return false;
  }

  function checkIfPasswordMatches(){
    return true;
  }


  const handleEmailSubmit = (e) => {
    //evita il refresh
    e.preventDefault();
    if(checkIfEmailExist()){
      setView('password');
    }else{

      setError(
        <span>
          Email not found. <a href="#!" className="register-link" onClick={(e) => {
            e.preventDefault(); 
            onSwitch('register');
          }}>
            Register now
          </a>
        </span>
      );

    }
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if(checkIfPasswordMatches()){
      alert(password);
      onSwitch('none');
    }else{
      alert("Ther password is wrong, try again");
    }
  }


  let content;


  if (view === 'email') {
    content = (
      <>
        <h2>Sign up or Log in</h2>
        <form onSubmit={handleEmailSubmit}> 
          <label htmlFor="email">Email</label>
          <input 
            className='input-generic' 
            type="email" 
            id="email" 
            placeholder="Enter email address"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <button type="submit" className="btn btn-primary btn-login">Submit</button>
          {error && <p className="error-message">{error}</p>}
        </form>
        
        <div className="divider">OR</div>
        
        <div className="social-login">
          <button className="social-btn facebook">Continue with Facebook</button>
          <button className="social-btn google">Sign in with Google</button>
          <button className="social-btn apple">Continue with Apple</button>
        </div>
        
        <p className="terms">
          I accept DietiEstates25's <a href="#!">Terms of Use</a> and <a href="#!">Privacy Notice</a>.
        </p>
      </>
    );
  } else { 
    content = (
      <>
        <h2>Enter your password to continue</h2>
        <form onSubmit={handlePasswordSubmit}>
          <label htmlFor="password">Password</label>
          <input 
            className='input-generic' 
            type="password" 
            id="password" 
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-login">Submit</button>
        </form>
      </>
    );
  }

  return (
    <div className="modal-overlay" onClick={() => onSwitch('none')}>
      <div className="modal-content" onClick={handleContentClick}>
        <button className="close-button" onClick={() => onSwitch('none')}>×</button>
        
        {content}
        
      </div>
    </div>
  );
};


export default LoginModal;