import React, { useState, useEffect } from "react";
import "../styles/quiz.css"; // Ensure this file contains the required styles

const allQuestions = [
  { id: 1, text: "Manila is the capital of the Philippines.", correct: true, color: "blue" },
  { id: 2, text: "Jakarta is the capital of Indonesia.", correct: true, color: "teal" },
  { id: 3, text: "Mumbai is the capital of India.", correct: false, color: "orange" },
  { id: 4, text: "Italy is the capital of Rome.", correct: false, color: "red" },
  { id: 5, text: "The Pacific Ocean is the largest ocean on Earth.", correct: true, color: "green" },
  { id: 6, text: "Albert Einstein discovered gravity.", correct: false, color: "purple" },
  { id: 7, text: "Shakespeare wrote 'Hamlet'.", correct: true, color: "cyan" },
  { id: 8, text: "Mount Everest is the tallest mountain on Earth.", correct: true, color: "yellow" },
  { id: 9, text: "The Sun revolves around the Earth.", correct: false, color: "brown" },
  { id: 10, text: "Water freezes at 0°C.", correct: true, color: "pink" },
];

const getRandomQuestions = () => {
  return [...allQuestions].sort(() => 0.5 - Math.random()).slice(0, 5);
};

const TrueFalseQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setQuestions(getRandomQuestions());
    setSelectedAnswers({});
    setScore(null);
    setSubmitted(false);
  }, []);

  const handleAnswerChange = (id, answer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [id]: answer,
    }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setSubmitted(true);
  };

  const handleNewQuiz = () => {
    setQuestions(getRandomQuestions());
    setSelectedAnswers({});
    setScore(null);
    setSubmitted(false);
  };

  return (
    <div className="quiz-container">
      <h2>True or False Quiz</h2>

      <div className="quiz-row">
  {questions.map((q, index) => (
    <div
      key={q.id}
      className={`quiz-card ${submitted ? (selectedAnswers[q.id] === q.correct ? "correct" : "wrong") : q.color}`}
    >
      <p>{q.text}</p>
      <div className="options">
        <button
          className={`option-btn ${selectedAnswers[q.id] === true ? "selected" : ""}`}
          onClick={() => handleAnswerChange(q.id, true)}
          disabled={submitted}
        >
          True
        </button>
        <button
          className={`option-btn ${selectedAnswers[q.id] === false ? "selected" : ""}`}
          onClick={() => handleAnswerChange(q.id, false)}
          disabled={submitted}
        >
          False
        </button>
      </div>
    </div>
  ))}
</div>

      {!submitted ? (
        <button className="submit-button" onClick={handleSubmit}>
          Submit Answers
        </button>
      ) : (
        <>
          <p className="score">Your Score: {score} / 5</p>
          <button className="retry-btn" onClick={handleNewQuiz}>
            Try New Quiz
          </button>
        </>
      )}
    </div>
  );
};

export default TrueFalseQuiz;
