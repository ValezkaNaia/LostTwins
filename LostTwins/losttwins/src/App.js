import React, { useState, useEffect } from 'react';
import { supabase } from './login/supabase';
import { LogOut, User } from 'lucide-react';

// Importação das páginas e componentes
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleGameOver = async (score) => {
    setLastScore(score);
    if (session) {
      try {
        const { data: stats } = await supabase.from('player_stats').select('high_score').eq('user_id', session.user.id).maybeSingle();
        const oldHigh = stats?.high_score || 0;
        await supabase.from('player_stats').upsert({
          user_id: session.user.id,
          user_email: session.user.email,
          last_score: score,
          high_score: Math.max(oldHigh, score)
        });
      } catch (err) { console.error(err); }
    }
    fetchLeaderboard();
    setView('gameover');
  };

  const fetchLeaderboard = async () => {
    const { data } = await supabase.from('player_stats').select('user_email, high_score').order('high_score', { ascending: false }).limit(5);
    setLeaderboard(data || []);
  };

  return (
    <div className="App">
      
      {/* --- HEADER FIXO --- */}
      {/* Padding aumentado para afastar o botão dos cantos */}
      <div style={{ 
        position: 'fixed', top: 0, right: 0, 
        padding: '40px 60px', 
        zIndex: 2000, pointerEvents: 'none' 
      }}>
        <div style={{ pointerEvents: 'auto' }}>
          {session ? (
            <div className="glass-card" style={{ padding: '10px 25px', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <User size={18} color="#4a90e2"/>
              <span style={{color: 'white', fontWeight: 'bold'}}>{session.user.email.split('@')[0]}</span>
              <button onClick={() => supabase.auth.signOut()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4d4d', marginLeft: '5px' }}>
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            /* ... código anterior ... */
            view === 'intro' && (
              <button 
                onClick={() => setShowLogin(true)} 
                className="modern-play-btn"
                style={{ 
                  fontSize: '0.9rem', 
                  padding: '12px 35px',
                  background: 'transparent', 
                  color: '#4a90e2'          
                }} 
              >
                LOGIN
              </button>
            )

          )}
        </div>
      </div>

      {/* --- ROTEAMENTO --- */}
      {view === 'intro' && <Intro onStart={() => setView('game')} />}
      
      {view === 'game' && <Game onGameOver={handleGameOver} />}
      
      {view === 'gameover' && (
        <GameOver 
          score={lastScore} 
          leaderboard={leaderboard} 
          onRestart={() => setView('game')}
          onHome={() => setView('intro')}
        />
      )}

      {/* --- MODAL DE LOGIN --- */}
      {showLogin && <LoginPage onClose={() => setShowLogin(false)} />}
    </div>
  );
}

export default App;