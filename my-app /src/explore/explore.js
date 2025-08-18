import React, { useState, useEffect } from 'react';
import './explore.css'; // Styling (create this file separately)

const ExplorePage = () => {
  // State management
  const [activeAgeGroup, setActiveAgeGroup] = useState('early-learners');
  const [showFeeDetails, setShowFeeDetails] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [feeStructure, setFeeStructure] = useState(null);

  // Age groups data
  const ageGroups = [
    { id: 'early-learners', label: 'Ages 3-5' },
    { id: 'primary-grades', label: 'Ages 6-9' },
    { id: 'advanced-learners', label: 'Ages 10-12' }
  ];

  // Programs data
  const programs = {
    'early-learners': [
      { id: 'alphabet-phonics', name: 'Alphabet & Phonics' },
      { id: 'numbers-shapes', name: 'Numbers & Shapes' },
      { id: 'storytime', name: 'Storytime' }
    ],
    'primary-grades': [
      { id: 'math', name: 'Math & Problem-Solving' },
      { id: 'reading', name: 'Reading & Writing' },
      { id: 'science', name: 'Science Explorations' }
    ],
    'advanced-learners': [
      { id: 'coding', name: 'Coding & Robotics' },
      { id: 'advanced-math', name: 'Advanced Math' },
      { id: 'public-speaking', name: 'Public Speaking' }
    ]
  };

  // FAQ data
  const faqs = [
    {
      question: "What's your refund policy?",
      answer: "We offer a 30-day money-back guarantee on all subscriptions."
    },
    {
      question: "How do I track my child's progress?",
      answer: "Parents get access to a dashboard with detailed progress reports."
    }
  ];

  // Load fee structure (simulating API call)
  useEffect(() => {
    // In a real app, this would be an API call
    const loadFees = async () => {
      const mockFeeData = {
        "early-learners": {
          monthly: "$19.99",
          quarterly: "$49.99 (save 15%)",
          yearly: "$159.99 (save 30%)"
        },
        "primary-grades": {
          monthly: "$24.99",
          quarterly: "$64.99 (save 15%)",
          yearly: "$199.99 (save 30%)"
        },
        "advanced-learners": {
          monthly: "$29.99",
          quarterly: "$79.99 (save 15%)",
          yearly: "$249.99 (save 30%)"
        },
        "add-ons": {
          "coding-club": "+$9.99/month",
          "private-tutoring": "+$15.99/session"
        }
      };
      setFeeStructure(mockFeeData);
    };

    loadFees();
  }, []);

  // Handle enrollment
  const handleEnroll = (programId) => {
    // In a real app, this would redirect or show a modal
    alert(`Enrolling in ${programId}! Redirecting to checkout...`);
  };

  // Toggle FAQ item
  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="explore-page">
      <h1>Explore Our Learning Programs</h1>
      
      {/* Age Group Selector */}
      <div className="age-group-selector">
        {ageGroups.map(group => (
          <button
            key={group.id}
            className={`age-group-tab ${activeAgeGroup === group.id ? 'active' : ''}`}
            onClick={() => setActiveAgeGroup(group.id)}
          >
            {group.label}
          </button>
        ))}
      </div>

      {/* Programs Grid */}
      <div className="programs-grid">
        {programs[activeAgeGroup]?.map(program => (
          <div key={program.id} className="program-card">
            <h3>{program.name}</h3>
            <button onClick={() => handleEnroll(program.id)}>Enroll Now</button>
          </div>
        ))}
      </div>

      {/* Fee Structure */}
      <div className="fee-section">
        <h2>Our Fee Structure</h2>
        <button 
          className="fee-toggle"
          onClick={() => setShowFeeDetails(!showFeeDetails)}
        >
          {showFeeDetails ? 'Hide Fee Details' : 'Show Fee Details'}
        </button>
        
        {showFeeDetails && feeStructure && (
          <div className="fee-details">
            <h3>{ageGroups.find(g => g.id === activeAgeGroup)?.label} Pricing</h3>
            <ul>
              <li>Monthly: {feeStructure[activeAgeGroup].monthly}</li>
              <li>Quarterly: {feeStructure[activeAgeGroup].quarterly}</li>
              <li>Yearly: {feeStructure[activeAgeGroup].yearly}</li>
            </ul>
            
            <h3>Add-Ons</h3>
            <ul>
              <li>Coding Club: {feeStructure['add-ons']['coding-club']}</li>
              <li>Private Tutoring: {feeStructure['add-ons']['private-tutoring']}</li>
            </ul>
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`faq-item ${activeFaq === index ? 'active' : ''}`}
          >
            <div 
              className="faq-question"
              onClick={() => toggleFaq(index)}
            >
              {faq.question}
            </div>
            {activeFaq === index && (
              <div className="faq-answer">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;