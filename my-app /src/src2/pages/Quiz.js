import React, { useState } from "react";
import "../styles/quiz.css";

const Quiz = ({ quizType, questions, correctAnswers }) => {
  const [userAnswers, setUserAnswers] = useState(new Array(questions.length).fill(""));
  const [score, setScore] = useState(null);

  const handleChange = (index, value) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
  };

  const handleSubmit = () => {
    let newScore = 0;

    userAnswers.forEach((answer, index) => {
      if (Array.isArray(correctAnswers[index])) {
        if (answer === correctAnswers[index][0]) newScore++;
      } else {
        if (answer.toLowerCase() === correctAnswers[index].toLowerCase()) newScore++;
      }
    });

    setScore(newScore);
  };

  return (
    <div className="quiz-container">
      <h2>{quizType}</h2>
      {questions.map((question, index) => (
        <div key={index} className="quiz-question">
          <p>{question}</p>
          {Array.isArray(correctAnswers[index]) ? (
            <select onChange={(e) => handleChange(index, e.target.value)} defaultValue="">
              <option value="" disabled>Select an answer</option>
              {correctAnswers[index].map((option, i) => (
                <option key={i} value={option}>{option}</option>
              ))}
            </select>
          ) : (
            <input 
              type="text" 
              placeholder="Type your answer" 
              onChange={(e) => handleChange(index, e.target.value)}
            />
          )}
        </div>
      ))}
      <button onClick={handleSubmit}>Submit</button>
      {score !== null && <h3>Your Score: {score} / {questions.length}</h3>}
    </div>
  );
};

export default Quiz;
