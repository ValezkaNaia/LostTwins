import React, { useState } from 'react';
import { supabase } from './supabase'; 
import { motion } from 'framer-motion';
import { X, Mail, Lock, Chrome } from 'lucide-react';
import '../styles/login.css';

const LoginPage = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    let result;
    if (isSignUp) {
      result = await supabase.auth.signUp({ email, password });
    } else {
      result = await supabase.auth.signInWithPassword({ email, password });
    }
    const { error, data } = result;
    if (error) {
      alert(error.message);
    } else {
      if (isSignUp) alert("Verifica o email!");
      else {
        if (onLoginSuccess) onLoginSuccess(data.session);
        onClose();
      }
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  };

  return (
    <div className="login-overlay">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="login-card"
      >
        <button onClick={onClose} className="close-btn"><X size={24}/></button>

        <h2 className="login-title">{isSignUp ? 'Criar Conta' : 'Bem-vindo'}</h2>

        <button onClick={handleGoogle} className="google-btn">
          <Chrome size={20} color="#EA4335"/> Continuar com Google
        </button>

        <div className="divider">ou com email</div>

        <div className="input-group">
          <Mail className="input-icon" size={20} />
          <input className="custom-input" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        </div>

        <div className="input-group">
          <Lock className="input-icon" size={20} />
          <input className="custom-input" type="password" placeholder="Senha" onChange={e => setPassword(e.target.value)} />
        </div>

        <button onClick={handleAuth} className="primary-btn">
          {loading ? '...' : (isSignUp ? 'Registar' : 'Entrar')}
        </button>

        <div className="toggle-text">
          {isSignUp ? 'Já tens conta?' : 'Não tens conta?'}
          <span onClick={() => setIsSignUp(!isSignUp)} className="toggle-link">
            {isSignUp ? 'Entrar' : 'Registar'}
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;