import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StethaChatInterface from './components/StethaChatInterface';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/stetha-ai" element={<StethaChatInterface />} />
      </Routes>
    </Router>
  );
}

export default App;
