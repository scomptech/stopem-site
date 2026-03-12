import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* The hidden login route */}
        <Route path="/admin" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
