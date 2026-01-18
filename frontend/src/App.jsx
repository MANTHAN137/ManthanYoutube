import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { YouTubeProvider } from './context/YouTubeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Videos from './pages/Videos';
import Shorts from './pages/Shorts';
import Games from './pages/Games';
import About from './pages/About';
import './App.css';

function App() {
  return (
    <YouTubeProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/shorts" element={<Shorts />} />
              <Route path="/games" element={<Games />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </YouTubeProvider>
  );
}

export default App;
