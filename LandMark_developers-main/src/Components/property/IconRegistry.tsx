import React from 'react';
import { 
  Building2, 
  ShoppingBag, 
  Utensils, 
  Stethoscope, 
  School, 
  MapPin, 
  Bus, 
  Plane, 
  Route, 
  Waves, 
  Dumbbell, 
  Trees, 
  Shield, 
  Zap, 
  ParkingCircle, 
  Home,
  Landmark,
  Pill,
  Coffee,
  Train,
  Wind,
  Hospital,
  Map,
  Milestone
} from 'lucide-react';

export interface IconConfig {
  icon: React.ElementType;
  color: string;
  bg: string;
}

export const getCategoryIcon = (category: string): IconConfig => {
  const cat = category.toLowerCase();

  // Nearby Places
  if (cat.includes('hospital') || cat.includes('medical') || cat.includes('clinic')) 
    return { icon: Hospital, color: '#ef4444', bg: '#fef2f2' };
  
  if (cat.includes('school') || cat.includes('college') || cat.includes('education') || cat.includes('university')) 
    return { icon: School, color: '#3b82f6', bg: '#eff6ff' };
  
  if (cat.includes('mall') || cat.includes('shop') || cat.includes('market') || cat.includes('store')) 
    return { icon: ShoppingBag, color: '#8b5cf6', bg: '#f5f3ff' };
  
  if (cat.includes('restaurant') || cat.includes('food') || cat.includes('dining')) 
    return { icon: Utensils, color: '#f59e0b', bg: '#fffbeb' };

  if (cat.includes('cafe') || cat.includes('coffee')) 
    return { icon: Coffee, color: '#92400e', bg: '#fff7ed' };
  
  if (cat.includes('highway') || cat.includes('road') || cat.includes('expressway') || cat.includes('flyover')) 
    return { icon: Milestone, color: '#475569', bg: '#f1f5f9' };
  
  if (cat.includes('bus') || cat.includes('metro') || cat.includes('station') || cat.includes('stop')) 
    return { icon: Bus, color: '#10b981', bg: '#ecfdf5' };
  
  if (cat.includes('train') || cat.includes('railway')) 
    return { icon: Train, color: '#059669', bg: '#ecfdf5' };
  
  if (cat.includes('airport') || cat.includes('flight')) 
    return { icon: Plane, color: '#6366f1', bg: '#eef2ff' };

  if (cat.includes('bank') || cat.includes('atm')) 
    return { icon: Landmark, color: '#1e40af', bg: '#dbeafe' };

  if (cat.includes('pharmacy') || cat.includes('medicine')) 
    return { icon: Pill, color: '#db2777', bg: '#fce7f3' };

  // Amenities
  if (cat.includes('gym') || cat.includes('fitness') || cat.includes('workout')) 
    return { icon: Dumbbell, color: '#f97316', bg: '#fff7ed' };

  if (cat.includes('pool') || cat.includes('swim') || cat.includes('water')) 
    return { icon: Waves, color: '#0ea5e9', bg: '#f0f9ff' };

  if (cat.includes('park') || cat.includes('garden') || cat.includes('green') || cat.includes('trees')) 
    return { icon: Trees, color: '#22c55e', bg: '#f0fdf4' };

  if (cat.includes('security') || cat.includes('guard')) 
    return { icon: Shield, color: '#64748b', bg: '#f1f5f9' };

  if (cat.includes('power') || cat.includes('electricity') || cat.includes('backup')) 
    return { icon: Zap, color: '#eab308', bg: '#fefce8' };

  if (cat.includes('parking') || cat.includes('car')) 
    return { icon: ParkingCircle, color: '#334155', bg: '#f1f5f9' };

  if (cat.includes('club') || cat.includes('community')) 
    return { icon: Building2, color: '#6366f1', bg: '#eef2ff' };

  if (cat.includes('kitchen') || cat.includes('modular')) 
    return { icon: Home, color: '#f97316', bg: '#fff7ed' };

  if (cat.includes('balcony') || cat.includes('terrace')) 
    return { icon: Home, color: '#8b5cf6', bg: '#f5f3ff' };

  if (cat.includes('bathroom') || cat.includes('washroom') || cat.includes('toilet')) 
    return { icon: Waves, color: '#0ea5e9', bg: '#f0f9ff' };

  if (cat.includes('lift') || cat.includes('elevator') || cat.includes('stairs')) 
    return { icon: Route, color: '#475569', bg: '#f1f5f9' };

  if (cat.includes('surveillance') || cat.includes('cctv') || cat.includes('camera')) 
    return { icon: Shield, color: '#ef4444', bg: '#fef2f2' };

  if (cat.includes('play area') || cat.includes('kids') || cat.includes('park')) 
    return { icon: Trees, color: '#22c55e', bg: '#f0fdf4' };

  if (cat.includes('ventilation') || cat.includes('air')) 
    return { icon: Wind, color: '#06b6d4', bg: '#ecfeff' };

  // Default
  return { icon: Map, color: '#94a3b8', bg: '#f8fafc' };
};
