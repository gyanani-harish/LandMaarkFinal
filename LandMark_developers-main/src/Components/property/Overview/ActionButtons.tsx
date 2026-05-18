import React, { useState } from 'react';
import { Share2, Bookmark, CheckCircle2 } from 'lucide-react';
import './ActionButtons.css';

interface ActionButtonsProps {
  onShare?: () => void;
  onSave?: () => void;
  onAskDetails?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onShare,
  onSave,
  onAskDetails,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: '', visible: false }), 2500);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: document.title,
      text: 'Check out this property on LandMaark!',
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        showToast('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
    onShare?.();
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !isSaved;
    setIsSaved(next);
    showToast(next ? 'Property saved!' : 'Removed from saved');
    onSave?.();
  };

  return (
    <div className="action-buttons-container">
      {/* Toast Notification */}
      <div className={`action-toast ${toast.visible ? 'action-toast-visible' : ''}`}>
        <CheckCircle2 size={16} />
        <span>{toast.message}</span>
      </div>

      <div className="buttons-layout">
        <button onClick={onAskDetails} className="primary-button" type="button">
          <span className="primary-button-text">Ask For Details</span>
        </button>

        <div className="secondary-buttons-wrapper">
          <button onClick={handleShare} className="secondary-button" type="button">
            <Share2 size={16} />
            <span className="secondary-button-text">
              {copied ? 'Copied!' : 'Share'}
            </span>
          </button>

          <button
            onClick={handleSave}
            className="secondary-button"
            type="button"
            style={{ color: isSaved ? '#5e40e0' : undefined }}
          >
            <Bookmark
              size={16}
              fill={isSaved ? '#5e40e0' : 'none'}
              stroke={isSaved ? '#5e40e0' : 'currentColor'}
            />
            <span className="secondary-button-text">
              {isSaved ? 'Saved' : 'Save'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons;