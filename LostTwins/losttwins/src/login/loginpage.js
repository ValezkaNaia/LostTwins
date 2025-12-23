import React, { useState } from 'react';
import { supabase } from './supabase'; 
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import '../styles/login.css'; // <--- IMPORTANTE: Importa o CSS aqui

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
      if (isSignUp) alert("Verifica o email para confirmar!");
      else {
        if (onLoginSuccess) onLoginSuccess(data.session);
        onClose(); 
      }
    }
    setLoading(false);
  };

  return (
    <div className="login-overlay">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="login-card"
      >
        <button onClick={onClose} className="close-btn">
          <X size={24} />
        </button>

        <h2 className="login-title">
          {isSignUp ? 'Criar Conta' : 'Login'}
        </h2>
        
        <input 
          className="custom-input"
          type="email" placeholder="Email" 
          onChange={e => setEmail(e.target.value)}
        />
        <input 
          className="custom-input"
          type="password" placeholder="Senha" 
          onChange={e => setPassword(e.target.value)}
        />

        <button onClick={handleAuth} className="login-btn">
          {loading ? 'A processar...' : (isSignUp ? 'Registar' : 'Entrar')}
        </button>

        <div className="toggle-text">
          {isSignUp ? 'Já tens conta?' : 'Não tens conta?'}
          <span onClick={() => setIsSignUp(!isSignUp)} className="toggle-link">
            {isSignUp ? 'Faz Login' : 'Regista-te'}
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;