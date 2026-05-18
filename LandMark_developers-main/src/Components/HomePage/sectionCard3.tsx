import React from "react";

interface SectionCardProps {
  title: string;
  description: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, description }) => {
  return (
    // <div className="group relative bg-gradient-to-br from-green-900/70 to-green-900/80 backdrop-blur-lg border border-white/10 rounded-3xl p-10 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-black/40 overflow-hidden">
    <div className="group relative bg-gradient-to-br bg-white/10 bg-white/80 backdrop-blur-lg border border-white/10 rounded-3xl p-10 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-black/40 overflow-hidden">
      {/* Top Accent Line */}

      {/* Title */}
      <h3 className="text-2xl font-semibold text-black mb-2 tracking-wide">
        {title}
      </h3>

      {/* Divider */}

      {/* Description */}
      <p className="text-black leading-relaxed text-base">{description}</p>

      {/* Hover Glow Effect */} 
      <div className="absolute inset-0 rounded-3xl border border-yellow-500/0 group-hover:border-yellow-500/40 transition duration-500"></div>
    </div>
  );
};

export default SectionCard;
