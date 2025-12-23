import React from 'react';
import { motion } from 'framer-motion';
import { Home, Gamepad2, User, Settings } from 'lucide-react';
import '../styles/global.css'; // Para garantir acesso às variáveis CSS

const Dock = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', icon: <Home size={24} />, label: 'Home' },
    { id: 'game', icon: <Gamepad2 size={24} />, label: 'Jogar' },
    { id: 'profile', icon: <User size={24} />, label: 'Perfil' },
    { id: 'settings', icon: <Settings size={24} />, label: 'Opções' },
  ];

  return (
    <div className="dock-container">
      <nav className="dock-wrapper">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              className={`dock-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="icon-container">{tab.icon}</span>
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="active-indicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};

export default Dock;