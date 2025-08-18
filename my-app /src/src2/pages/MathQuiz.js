import React, { useState, useEffect } from "react";
import "../styles/quiz.css";
import "../styles/math-quiz.css";

const allQuestions = [
  { question: "2 + 2 = ?", options: ["3", "4", "5", "6"], answer: "4" },
  { question: "5 × 3 = ?", options: ["15", "10", "5", "20"], answer: "15" },
  { question: "12 ÷ 4 = ?", options: ["2", "3", "4", "6"], answer: "3" },
  { question: "7 - 3 = ?", options: ["2", "3", "4", "5"], answer: "4" },
  { question: "10 + 8 = ?", options: ["16", "18", "20", "22"], answer: "18" },
  { question: "9 × 2 = ?", options: ["16", "18", "20", "22"], answer: "18" },
  { question: "25 ÷ 5 = ?", options: ["4", "5", "6", "7"], answer: "5" },
  { question: "14 - 7 = ?", options: ["5", "6", "7", "8"], answer: "7" },
  { question: "3 + 9 = ?", options: ["10", "11", "12", "13"], answer: "12" },
  { question: "8 × 3 = ?", options: ["22", "24", "26", "28"], answer: "24" },
];

const getRandomQuestions = () => {
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 5);
};

const MathQuiz = () => {
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

  const handleAnswerChange = (index, option) => {
    if (!submitted) {
      setSelectedAnswers((prev) => ({
        ...prev,
        [index]: option,
      }));
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.answer) {
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
    <div className="quiz-page">
      <h1>Math Quiz</h1>

      {questions.map((q, index) => (
        <div key={index} className="question-box">
          <p className="question-text">{q.question}</p>
          <div className="options-container">
            {q.options.map((option, i) => {
              let labelClass = "math-radio-label";

              if (submitted) {
                if (option === q.answer) {
                  labelClass += " correct"; // Green for correct answer
                } else if (selectedAnswers[index] === option) {
                  labelClass += " wrong"; // Red for incorrect selection
                }
              }

              return (
                <label key={i} className={labelClass}>
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    checked={selectedAnswers[index] === option}
                    onChange={() => handleAnswerChange(index, option)}
                    disabled={submitted} // Disable after submission
                  />
                  {option}
                </label>
              );
            })}
          </div>
          {/* Show the correct answer if the user got it wrong */}
          {submitted && selectedAnswers[index] !== q.answer && (
            <p className="correct-answer">Correct Answer: {q.answer}</p>
          )}
        </div>
      ))}

      {!submitted ? (
        <button className="submit-button" onClick={handleSubmit}>
          Submit Answers
        </button>
      ) : (
        <>
          <p className="score">Your Score: {score} / 5</p>
          <button className="retry-btn" onClick={handleNewQuiz}>
            Try New Questions
          </button>
        </>
      )}
    </div>
  );
};

export default MathQuiz;
