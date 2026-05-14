import React from 'react';
import { Share2, Heart } from 'lucide-react';
import './ActionButtons.css';

interface ActionButtonsProps {
  onShare?: () => void;
  onSave?: () => void;
  onAskDetails?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onShare, 
  onSave, 
  onAskDetails 
}) => {
  return (
    <div className="action-buttons-container">
      <div className="buttons-layout">
        
        <button
          onClick={onAskDetails}
          className="primary-button"
        >
          <span className="primary-button-text">
            Ask For Details
          </span>
        </button>

        <div className="secondary-buttons-wrapper">
          <button
            onClick={onShare}
            className="secondary-button"
          >
            <Share2 className="w-5 h-5" />
            <span className="secondary-button-text">
              Share
            </span>
          </button>

          <button
            onClick={onSave}
            className="secondary-button"
          >
            <Heart className="w-5 h-5" />
            <span className="secondary-button-text">
              Save
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ActionButtons;