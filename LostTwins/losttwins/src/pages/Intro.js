import React from 'react';
import { motion } from 'framer-motion';
import { storyData } from '../data/Story';
import '../styles/intro.css';

const Intro = ({ onStart }) => {
  // Configurações de animação para o título com efeito Staggered
  const titleContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 }
    }
  };

  const letterItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="slideshow-wrapper">
      {/* fundo tipo aura*/}
      <div className="aura-container">
        <div className="aura blue" />
        <div className="aura green" />
      </div>
      
      <div className="fuzzy-overlay" />

      {/* barra progesso */}
      <nav className="vertical-nav">
        {storyData.map((_, i) => (
          <div key={i} className="nav-dot" />
        ))}
      </nav>

      {/* slides*/}
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

      {/* hist */}
      {storyData.map((scene, index) => (
        <section key={index} className="slide story-slide">
          <div className="slide-content">
            <motion.div 
              className="visual-side"
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="img-container">
                <img src={scene.image} alt={scene.title} />
              </div>
            </motion.div>

            <div className="text-side">
              <motion.div 
                variants={titleContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false }}
              >
                {/* Divide o título em palavras para o efeito Staggered */}
                <h2 className="modern-title">
                  {scene.title.split(" ").map((word, i) => (
                    <motion.span key={i} variants={letterItem} style={{ display: 'inline-block', marginRight: '10px' }}>
                      {word}
                    </motion.span>
                  ))}
                </h2>
              </motion.div>

              <motion.div 
                className="glass-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <p>{scene.text}</p>
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* ultimo slide da hist */}
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