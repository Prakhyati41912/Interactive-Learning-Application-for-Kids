import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useMemo } from "react";
import Navbar from "../src/navbar/navbar";
import Hero from "../src/hero/hero";
import Signup from "../src/signup/sign";
import Login from "../src/login/login";
import Terms from "./terms";
import Permissions from "./permissions";
import Contact from "./contact/contact";
import ChildDashboard from "../src/dashboards/childDashboard";
import ParentDashboard from "../src/dashboards/parentDashboard";
import TeacherDashboard from "../src/dashboards/teacherDashboard";
import AdminDashboard from "../src/dashboards/adminDashboard";
import Dashboard from "./src2/pages/Dashboard"; 
import Upload from "./src2/pages/Upload";
import UploadedVideos from "./src2/pages/UploadedVideos";
import Downloads from "./src2/pages/Downloads";
import Quizzes from "./src2/pages/Quizzes";
import PreviewVideos from "./src2/pages/PreviewVideos";
import SavedVideos from "./src2/pages/SavedVideos";
import GeneralKnowledgeQuiz from "./src2/pages/GeneralKnowledge"; 
import MathQuiz from "./src2/pages/MathQuiz"; 
import FillInTheBlanks from "./src2/pages/FillInTheBlanks";
import TrueFalseQuiz from "./src2/pages/TrueFalse";
import ExplorePage from "./explore/explore"; // Import the ExplorePage component

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const [quizKey, setQuizKey] = useState(0);

  // Memoized array to avoid re-creating on each render
  const hideNavbarRoutes = useMemo(() => [
    "/login", "/signup", "/dashboard", "/parent-dashboard","/contact",
    "/teacher-dashboard", "/admin-dashboard", "/upload", "/uploaded", "/downloads", 
    "/quizzes", "/preview", "/saved", "/quizzes/general-knowledge", "/quizzes/math", 
    "/quizzes/fill-in-the-blanks", "/quizzes/true-false", "/explore"
  ], []);

  return (
    <div className="app-container">
      {/* Conditionally render Navbar */}
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      
      <div className="content">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/child-dashboard" element={<ChildDashboard />} />
          <Route path="/parent-dashboard" element={<ParentDashboard />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/permissions" element={<Permissions />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/uploaded" element={<UploadedVideos />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/preview" element={<PreviewVideos />} />
          <Route path="/saved" element={<SavedVideos />} />
          <Route path="/quizzes/general-knowledge" element={<GeneralKnowledgeQuiz key={quizKey} />} />
          <Route path="/quizzes/math" element={<MathQuiz key={quizKey} />} />
          <Route path="/quizzes/fill-in-the-blanks" element={<FillInTheBlanks key={quizKey} />} />
          <Route path="/quizzes/true-false" element={<TrueFalseQuiz key={quizKey} />} />
          {/* New Explore Page Route */}
          <Route path="/explore" element={<ExplorePage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;