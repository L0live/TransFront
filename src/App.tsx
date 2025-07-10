import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import SelectGame from './pages/SelectGame';
import Pong from './pages/Pong';
import Blackjack from './pages/Blackjack';
import Tournament from './pages/Tournament';
import './App.css'

export default function App() {
  return (
    <div> {/*avec du relative pour allee dessus le background*/}
      {/* <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/background.gif')",
        }}
      /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/select-game" element={<SelectGame />} />
        <Route path="/pong" element={<Pong />} />
        <Route path="/blackjack" element={<Blackjack />} />
        <Route path="/tournament" element={<Tournament />} />
        <Route path="*" element={<h1>404 - Not Found</h1>} />
      </Routes>
    </div>
  );
}