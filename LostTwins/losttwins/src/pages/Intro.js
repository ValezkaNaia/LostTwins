import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { storyData } from '../data/Story';
import '../styles/intro.css';

const Intro = ({ onStart }) => {
  // Referência para o contentor do scroll
  const containerRef = useRef(null);
  
  // Lógica da Barra de Progresso
  const { scrollYProgress } = useScroll({ container: containerRef });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div className="slideshow-wrapper" ref={containerRef}>
      <div className="fuzzy-overlay"></div>
      
      {/* BARRA DE PROGRESSO LATERAL */}
      <motion.div className="side-progress-bar" style={{ scaleY }} />
      <div className="side-progress-track" />

      {/* SLIDE DO LOGO */}
      <section className="slide hero-slide">
        <motion.img 
          src="/assets/images/Homepage.png" 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="main-logo"
        />
        <div className="mouse-scroll-icon" />
      </section>

      {/* SLIDES DA HISTÓRIA */}
      {storyData.map((scene, index) => (
        <section key={index} className="slide story-slide">
          <div className="slide-content">
            <div className="visual-side">
              <motion.div 
                className="img-container"
                initial={{ rotateY: 90, opacity: 0 }}
                whileInView={{ rotateY: 0, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <img src={scene.image} alt={scene.title} />
              </motion.div>
            </div>

            <div className="text-side">
              {/* Título com animação de letras inspirada no React Bits */}
              <motion.h2 
                className="modern-title"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                {scene.title}
              </motion.h2>

              <motion.div 
                className="glass-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p>{scene.text}</p>
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* BOTÃO FINAL MAGNÉTICO */}
      <section className="slide final-slide">
        <motion.button 
          className="modern-play-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onStart}
        >
         Começa a tua aventura!
        </motion.button>
      </section>
    </div>
  );
};

export default Intro;