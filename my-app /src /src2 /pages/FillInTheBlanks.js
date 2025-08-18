import React, { useState, useEffect } from "react";
import "../styles/quiz.css";
import "../styles/fillintheblanks.css";

const allQuestions = [
  { question: "The sun is a ______.", answer: "star" },
  { question: "Water boils at _____ degrees Celsius.", answer: "100" },
  { question: "The chemical symbol for water is _____.", answer: "H2O" },
  { question: "A baby frog is called a _____.", answer: "tadpole" },
  { question: "The fastest land animal is the _____.", answer: "cheetah" },
  { question: "The capital of France is _____.", answer: "Paris" },
  { question: "The square root of 64 is _____.", answer: "8" },
  { question: "The currency of Japan is _____.", answer: "Yen" },
  { question: "A hexagon has ____ sides.", answer: "6" },
  { question: "The human body has ____ bones.", answer: "206" },
];

const getRandomQuestions = () => {
  const shuffled = allQuestions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 5);
};

const FillInTheBlanks = () => {
  const [questions, setQuestions] = useState(getRandomQuestions());
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [answerStatus, setAnswerStatus] = useState({}); // Stores correct/wrong state

  useEffect(() => {
    setQuestions(getRandomQuestions());
    setUserAnswers({});
    setScore(null);
    setSubmitted(false);
    setAnswerStatus({});
  }, []);

  const handleSubmit = () => {
    if (submitted) return;

    let correctCount = 0;
    const newAnswerStatus = {};

    questions.forEach((q) => {
      const userAnswer = userAnswers[q.question]?.trim().toLowerCase();
      const correctAnswer = q.answer.toLowerCase();

      if (userAnswer === correctAnswer) {
        correctCount++;
        newAnswerStatus[q.question] = { status: "correct", correctAnswer: q.answer };
      } else {
        newAnswerStatus[q.question] = { status: "wrong", correctAnswer: q.answer };
      }
    });

    setScore(correctCount);
    setAnswerStatus(newAnswerStatus);
    setSubmitted(true);
  };

  return (
    <div className="quiz-page">
      <h1>Fill in the Blanks Quiz</h1>

      {questions.map((q, index) => (
        <div key={index} className="question-box">
          <p>{q.question}</p>
          <input
            type="text"
            className={`blank-input ${submitted ? answerStatus[q.question]?.status === "correct" ? "correct-answer" : "wrong-answer" : ""}`}
            value={userAnswers[q.question] || ""}
            onChange={(e) => setUserAnswers({ ...userAnswers, [q.question]: e.target.value })}
            disabled={submitted}
          />
          {submitted && answerStatus[q.question]?.status === "wrong" && (
            <p className="correct-answer-text">
              Correct Answer: <span className="wrong-answer-text">{answerStatus[q.question].correctAnswer}</span>
            </p>
          )}
        </div>
      ))}

      {!submitted ? (
        <button onClick={handleSubmit} className="submit-btn">
          Submit Answers
        </button>
      ) : (
        <>
          <p className="score">Your Score: {score} / 5</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Try New Questions
          </button>
        </>
      )}
    </div>
  );
};

export default FillInTheBlanks;
