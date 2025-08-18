import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import UploadedVideos from "./pages/UploadedVideos";
import Downloads from "./pages/Downloads";
import Quizzes from "./pages/Quizzes";
import PreviewVideos from "./pages/PreviewVideos";
import SavedVideos from "./pages/SavedVideos";
import GeneralKnowledgeQuiz from "./pages/GeneralKnowledge";
import MathQuiz from "./pages/MathQuiz";
import FillInTheBlanks from "./pages/FillInTheBlanks";
import TrueFalseQuiz from "./pages/TrueFalse";
import Contact from "./pages/Contact"; // Import the Contact component

function App() {
  const [quizKey, setQuizKey] = useState(0); // Unique key to force re-render

  return (
    <Router>
      <div className="app-container">
        <Dashboard /> {/* Sidebar that stays fixed */}
        <div className="content">
          <Routes>
            <Route path="/upload" element={<Upload />} />
            <Route path="/uploaded" element={<UploadedVideos />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/preview" element={<PreviewVideos />} />
            <Route path="/saved" element={<SavedVideos />} />
            <Route path="/contact" element={<Contact />} /> {/* New contact route */}

            {/* Quiz Routes */}
            <Route 
              path="/quizzes/general-knowledge" 
              element={<GeneralKnowledgeQuiz key={quizKey} />} 
            />
            <Route 
              path="/quizzes/math" 
              element={<MathQuiz key={quizKey} />} 
            />
            <Route 
              path="/quizzes/fill-in-the-blanks" 
              element={<FillInTheBlanks key={quizKey} />} 
            />
            <Route 
              path="/quizzes/true-false" 
              element={<TrueFalseQuiz key={quizKey} />} 
            />

            {/* Default Route */}
            <Route
              path="/"
              element={
                <div style={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center", 
                  height: "100vh", 
                  textAlign: "center" 
                }}>
                  <h1>Welcome to the Video Management System</h1>
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;