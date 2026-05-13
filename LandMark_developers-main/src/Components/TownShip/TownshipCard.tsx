import React from "react";
import { Township } from "../../store/TownShip/townshipsData";

interface TownshipCardProps {
  item: Township;
  onSelect: (item: Township) => void;
}

const TownshipCard: React.FC<TownshipCardProps> = ({ item, onSelect }) => {
  const cityName =  item.name || 'Unknown';
  const propertiesCount = item.properties?.length || 0;
  const description = item.description ||  '';
   return (
    <div
      onClick={() => onSelect(item)}
      className="group bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition duration-300"
    >
      {/* City Image */}
      <div className="w-full aspect-[4/3] overflow-hidden">
        <img
          src={item.image || "https://images.unsplash.com/photo-1568605114967-8130f3a36994"}
          alt={cityName}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />
      </div>

      {/* City Info */}
      <div className="p-4 md:p-6 flex justify-between items-center">
        <h3 className="font-semibold text-lg text-gray-800">{cityName}</h3>


        <p className="text-sm text-gray-500">
          {propertiesCount} Properties
        </p>
      </div>

      <p className="px-4 pb-4 md:px-6 md:pb-6 text-left text-gray-600 line-clamp-3">{description}</p> 
    </div>
  );
};

export default TownshipCard;
