import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadResume from './pages/UploadResume';
import Careers from './pages/Careers';
import CareerDetails from './pages/CareerDetails';
import SkillAnalysis from './pages/SkillAnalysis';
import PersonalizedRoadmap from './pages/PersonalizedRoadmap';
import DetailedRoadmap from './pages/DetailedRoadmap';
import AIChatbot from './pages/AIChatbot';

function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/upload-resume" element={<ProtectedRoute><UploadResume /></ProtectedRoute>} />
          <Route path="/careers" element={<ProtectedRoute><Careers /></ProtectedRoute>} />
          <Route path="/careers/:name" element={<ProtectedRoute><CareerDetails /></ProtectedRoute>} />
          <Route path="/analysis" element={<ProtectedRoute><SkillAnalysis /></ProtectedRoute>} />
          <Route path="/roadmap" element={<ProtectedRoute><PersonalizedRoadmap /></ProtectedRoute>} />
          <Route path="/roadmap/:career/:skill" element={<ProtectedRoute><DetailedRoadmap /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><AIChatbot /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
