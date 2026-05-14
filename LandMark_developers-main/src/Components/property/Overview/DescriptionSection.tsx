import React from 'react';
import './DescriptionSection.css';

interface DescriptionSectionProps {
  description: string;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({ description }) => {
  return (
    <>
      <div className="description-divider"></div>
       <h3 className="description-header">About this property</h3>
      <div className="description-content-wrapper">
        <p className="description-text">{description}</p>
      </div>
    </>
  );
};

export default DescriptionSection;