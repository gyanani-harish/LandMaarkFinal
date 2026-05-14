import React from 'react';
import './QASection.css';

const QASection = () => {
  return (
    <div className="qa-section-container qa-section-hidden">
      <h2 className="qa-title">
        <span className="qa-title-underline">
          Questions & Answer
        </span>
      </h2>
      <div className="qa-list">
        <div className="qa-item">
          <p className="qa-question">Q: What is the total carpet area of units in the project?</p>
          <p className="qa-answer">A: Carpet area of 1 BHK flat starts from 248.86 sqft, 2 BHK flat starts from 407.74 sqft.</p>
          <p className="qa-date">Answered 6 years ago</p>
        </div>
        <div className="qa-item">
          <p className="qa-question">Q: Is there water harvesting in the society?</p>
          <p className="qa-answer">A: Yes, water harvesting facility is available.</p>
          <p className="qa-date">Answered 6 years ago</p>
        </div>
      </div>
      <button className="qa-button">
        <span className="qa-button-text">View All Questions → </span>
      </button>
    </div>
  );
};

export default QASection;