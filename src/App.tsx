import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import './styles.css';

const App: React.FC = () => {
  return (
    <div className="container">
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/game">Mini Game</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </div>
  );
};

export default App;