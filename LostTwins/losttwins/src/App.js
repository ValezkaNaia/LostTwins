import React, { useState, useEffect } from 'react';
import { supabase } from './login/supabase';
import { motion } from 'framer-motion';
import { LogOut, User } from 'lucide-react';

// Importa as tuas páginas existentes
import Intro from './pages/Intro';
import Game from './pages/Game'; 
import GameOver from './pages/GameOver';
import LoginPage from './login/loginpage';

import './App.css';

function App() {
  const [session, setSession] = useState(null);
  const [view, setView] = useState('intro'); // 'intro', 'game', 'gameover'
  const [showLogin, setShowLogin] = useState(false);
  const [lastScore, setLastScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);

  // 1. Gestão de Sessão Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // 2. Função chamada quando o jogador perde
  const handleGameOver = async (score) => {
    setLastScore(score);
    
    // Se estiver logado, guarda na base de dados
    if (session) {
      try {
        const { data: currentStats } = await supabase
          .from('player_stats')
          .select('high_score')
          .eq('user_id', session.user.id)
          .maybeSingle();

        const oldHigh = currentStats?.high_score || 0;
        const newHigh = Math.max(oldHigh, score);

        await supabase.from('player_stats').upsert({
          user_id: session.user.id,
          user_email: session.user.email,
          last_score: score,
          high_score: newHigh
        });
      } catch (error) {
        console.error("Erro ao salvar score:", error);
      }
    }

    // Busca a leaderboard atualizada
    await fetchLeaderboard();
    setView('gameover');
  };

  const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from('player_stats')
      .select('user_email, high_score')
      .order('high_score', { ascending: false })
      .limit(5);
    setLeaderboard(data || []);
  };

  return (
    <div className="App">
      
      {/* --- HEADER (Barra de Topo) --- */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', padding: '20px', display: 'flex', justifyContent: 'flex-end', zIndex: 2000, pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }}>
          {session ? (
            <div className="glass-card" style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '50px' }}>
              <User size={16} color="#4a90e2"/>
              <span style={{fontSize: '0.9rem', color: 'white'}}>{session.user.email.split('@')[0]}</span>
              <button onClick={() => supabase.auth.signOut()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4d4d', marginLeft: '10px' }}>
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            view === 'intro' && (
              <button 
                onClick={() => setShowLogin(true)} 
                className="modern-play-btn" 
                style={{ padding: '10px 30px', fontSize: '0.9rem' }}
              >
                LOGIN
              </button>
            )
          )}
        </div>
      </div>

      {/* --- GESTÃO DE TELAS --- */}
      
      {view === 'intro' && (
        <Intro onStart={() => setView('game')} />
      )}

      {view === 'game' && (
        <Game onGameOver={handleGameOver} />
      )}

      {view === 'gameover' && (
        <GameOver 
          score={lastScore} 
          leaderboard={leaderboard} 
          onRestart={() => setView('game')}
          onHome={() => setView('intro')}
        />
      )}

      {/* --- MODAL DE LOGIN --- */}
      {showLogin && (
        <LoginPage onClose={() => setShowLogin(false)} />
      )}

    </div>
  );
}

export default App;