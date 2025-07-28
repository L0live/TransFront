import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SelectGame from './pages/SelectGame';
import GameCanvas from './pages/Pong';
import PongScene from './pages/Pong3D';
import Blackjack from './pages/Blackjack';
import Tournament from './pages/Tournament';
import './App.css'

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/select-game" element={<SelectGame />} />
        <Route path="/pong" element={<GameCanvas />} />
        <Route path="/pong3d" element={<PongScene />} />
        <Route path="/blackjack" element={<Blackjack />} />
        <Route path="/tournament" element={<Tournament />} />
        <Route path="*" element={<h1>404 - Not Found</h1>} />
      </Routes>
    </div>
  );
}