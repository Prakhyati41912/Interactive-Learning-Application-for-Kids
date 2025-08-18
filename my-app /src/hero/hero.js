import React from 'react';
import './hero.css';
import dark_arrow from '../assets/download.png';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/explore');
  };

  return (
    <div className='hero container'>
      <div className='hero-text'>
        <h1>Unlock the Joy of Learning!</h1>
        <p>At KidQuest, we make learning an exciting adventure for kids by combining interactive activities, fun quizzes, and engaging lessons that spark curiosity.
           Most importantly, KidQuest provides a safe and child-friendly environment where young minds can learn, discover, and grow with confidence.</p>
        <button className='btn' onClick={handleExploreClick}>
          Explore More <img src={dark_arrow} alt="" />
        </button>
      </div>
    </div>
  );
};

export default Hero;