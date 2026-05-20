import React from 'react';
import { LucideIcon } from 'lucide-react';
import './OverviewItem.css';

interface OverviewItemProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  imageSrc?: string;
  subText?: string;
}

const OverviewItem: React.FC<OverviewItemProps> = ({ label, value, icon: Icon, imageSrc, subText }) => {
  return (
    <div className="overview-item-container">
      {(Icon || imageSrc) && (
        <div className="overview-icon-wrapper">
          {imageSrc ? (
            <img src={imageSrc} className="overview-icon" alt={label} loading="lazy" />
          ) : (
            Icon && <Icon className="overview-icon" />
          )}
        </div>
      )}
      <div className="overview-text-content">
        <p className="overview-label">{label}</p>
        <p className="overview-value">{value}</p>
        {subText && <p className="overview-subtext">{subText}</p>}
      </div>
    </div>
  );
};

export default OverviewItem;