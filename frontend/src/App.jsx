import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/Homepage" element={<Homepage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;