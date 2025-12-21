import React from 'react';
import Intro from './pages/Intro';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* Renderizamos apenas a Intro para focar no design e animações da Homepage */}
      <Intro />
    </div>
  );
}

export default App;