import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SidebarLayout from './components/SidebarLayout';
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
import ResumeImprovement from './pages/ResumeImprovement';
import MockInterviewSetup from './pages/MockInterviewSetup';
import MockInterviewSession from './pages/MockInterviewSession';
import Settings from './pages/Settings';
import AppBackground from './components/AppBackground';

function App() {
  return (
    <>
      <AppBackground />
      <Routes>
        {/* Public Routes with standalone Navbar */}
      <Route path="/" element={<div className="min-h-screen flex flex-col"><Navbar /><main className="flex-grow"><LandingPage /></main></div>} />
      <Route path="/login" element={<div className="min-h-screen flex flex-col"><Navbar /><main className="flex-grow"><Login /></main></div>} />
      <Route path="/register" element={<div className="min-h-screen flex flex-col"><Navbar /><main className="flex-grow"><Register /></main></div>} />
      
      {/* Protected Routes with Sidebar Layout */}
      <Route element={<ProtectedRoute><SidebarLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload-resume" element={<UploadResume />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/careers/:name" element={<CareerDetails />} />
        <Route path="/analysis" element={<SkillAnalysis />} />
        <Route path="/roadmap" element={<PersonalizedRoadmap />} />
        <Route path="/roadmap/:career/:skill" element={<DetailedRoadmap />} />
        <Route path="/chat" element={<AIChatbot />} />
        <Route path="/resume-improvement" element={<ResumeImprovement />} />
        <Route path="/mock-interview" element={<MockInterviewSetup />} />
        <Route path="/mock-interview/:id" element={<MockInterviewSession />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
    </>
  );
}

export default App;
