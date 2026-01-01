import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ArtistPage } from './pages/ArtistPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/artist/:slug" element={<ArtistPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
