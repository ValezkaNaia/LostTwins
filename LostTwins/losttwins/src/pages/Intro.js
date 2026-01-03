import React from 'react';
import { motion } from 'framer-motion';
import { storyData } from '../data/Story';
import '../styles/intro.css';

const Intro = ({ onStart }) => {

  return (
    <div className="slideshow-wrapper">
      {/* Fundo tipo aura */}
      <div className="aura-container">
        <div className="aura blue" />
        <div className="aura green" />
      </div>
      
      <div className="fuzzy-overlay" />

      {/* Barra progresso */}
      <nav className="vertical-nav">
        {storyData.map((_, i) => (
          <div key={i} className="nav-dot" />
        ))}
      </nav>

      {/* Hero Slide (Logo) - Mantemos a animação de entrada simples aqui */}
      <section className="slide hero-slide">
        <motion.img 
          src="/assets/images/Homepage.png" 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2 }}
          className="main-logo"
        />
        <div className="scroll-hint">
          <span>SCROLL TO BEGIN</span>
          <div className="line" />
        </div>
      </section>

      {/* Story Slides */}
      {storyData.map((scene, index) => (
        <section key={index} className="slide story-slide">
          {/* NOTA: Removemos o motion.div daqui.
             A classe .slide-content agora é controlada pelo CSS (view-timeline).
             Isso garante que a imagem e o texto se movam exatamente juntos.
          */}
          <div className="slide-content">
            
            <div className="visual-side">
              <div className="img-container">
                <img src={scene.image} alt={scene.title} />
              </div>
            </div>

            <div className="text-side">
              <h2 className="modern-title">
                {scene.title}
              </h2>

              <div className="glass-card">
                <p>{scene.text}</p>
              </div>
            </div>

          </div>
        </section>
      ))}

      {/* Último slide (Botão Start) */}
      <section className="slide final-slide">
        <motion.button 
          className="modern-play-btn"
          whileHover={{ scale: 1.05, letterSpacing: "8px" }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
        >
          START!
        </motion.button>
      </section>
    </div>
  );
};

export default Intro;