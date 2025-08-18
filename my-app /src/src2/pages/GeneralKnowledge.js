import React, { useState, useEffect } from "react";
import "../styles/quiz.css";
import "../styles/general-knowlege.css"; // Ensure this file contains styles

const allQuestions = [
  { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], answer: "Paris" },
  { question: "Who wrote 'To Kill a Mockingbird'?", options: ["Harper Lee", "J.K. Rowling", "Ernest Hemingway", "Mark Twain"], answer: "Harper Lee" },
  { question: "What is the largest planet in our Solar System?", options: ["Earth", "Mars", "Jupiter", "Saturn"], answer: "Jupiter" },
  { question: "Which year did the Titanic sink?", options: ["1912", "1905", "1898", "1923"], answer: "1912" },
  { question: "Who painted the Mona Lisa?", options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"], answer: "Leonardo da Vinci" },
  { question: "What is the smallest country in the world?", options: ["Monaco", "Malta", "Vatican City", "Liechtenstein"], answer: "Vatican City" },
  { question: "Which is the longest river in the world?", options: ["Amazon", "Nile", "Yangtze", "Mississippi"], answer: "Nile" },
  { question: "Who discovered gravity?", options: ["Albert Einstein", "Galileo Galilei", "Isaac Newton", "Nikola Tesla"], answer: "Isaac Newton" },
  { question: "What is the chemical symbol for Iron?", options: ["Fe", "Ir", "In", "Io"], answer: "Fe" },
  { question: "Which continent has the most countries?", options: ["Africa", "Asia", "Europe", "South America"], answer: "Africa" }
];

const getRandomQuestions = () => {
  return [...allQuestions].sort(() => 0.5 - Math.random()).slice(0, 5);
};

const GeneralKnowledgeQuiz = () => {
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
    setSelectedAnswers((prev) => ({
      ...prev,
      [index]: option,
    }));
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
      <h1>General Knowledge Quiz</h1>

      {questions.map((q, index) => (
        <div key={index} className="question-box">
          <p className="question-text">{q.question}</p>
          <div className="options-container">
            {q.options.map((option, i) => (
              <label
                key={i}
                className={`quiz-radio-label 
                  ${submitted ? 
                    option === q.answer ? "correct" : 
                    option === selectedAnswers[index] ? "wrong" : ""
                  : selectedAnswers[index] === option ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option}
                  checked={selectedAnswers[index] === option}
                  onChange={() => handleAnswerChange(index, option)}
                  disabled={submitted}
                />
                {option}
              </label>
            ))}
          </div>

          {submitted && selectedAnswers[index] !== q.answer && (
            <p className="correct-answer-text">Correct Answer: <b>{q.answer}</b></p>
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
            Try New Quiz
          </button>
        </>
      )}
    </div>
  );
};

export default GeneralKnowledgeQuiz;
