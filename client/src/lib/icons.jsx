import React from 'react';
import { 
  FaLungs, 
  FaTint, 
  FaLeaf, 
  FaFilter, 
  FaBone, 
  FaUtensils, 
  FaFemale, 
  FaBaby, 
  FaBrain, 
  FaSearch,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaStar,
  FaStethoscope,
  FaHeartbeat,
  FaAward
} from 'react-icons/fa';

export const getTreatmentIcon = (identifier) => {
  if (!identifier) return <FaStethoscope />;
  
  const normalized = String(identifier).toLowerCase();
  
  // Emojis or words mapping
  if (normalized.includes('🫁') || normalized.includes('respiratory') || normalized.includes('asthma') || normalized.includes('cough') || normalized.includes('🤧')) {
    return <FaLungs className="text-blue-500" />;
  }
  if (normalized.includes('🩸') || normalized.includes('diabetes') || normalized.includes('sugar') || normalized.includes('insulin')) {
    return <FaTint className="text-red-500" />;
  }
  if (normalized.includes('🌿') || normalized.includes('skin') || normalized.includes('psoriasis') || normalized.includes('eczema') || normalized.includes('acne')) {
    return <FaLeaf className="text-green-500" />;
  }
  if (normalized.includes('🫘') || normalized.includes('kidney') || normalized.includes('creatinine')) {
    return <FaFilter className="text-indigo-500" />;
  }
  if (normalized.includes('🦴') || normalized.includes('joints') || normalized.includes('bones') || normalized.includes('arthritis') || normalized.includes('joint')) {
    return <FaBone className="text-amber-500" />;
  }
  if (normalized.includes('🍽️') || normalized.includes('digestive') || normalized.includes('stomach') || normalized.includes('acidity') || normalized.includes('ibs')) {
    return <FaUtensils className="text-teal-500" />;
  }
  if (normalized.includes('🌸') || normalized.includes('women') || normalized.includes('pcod') || normalized.includes('female')) {
    return <FaFemale className="text-pink-500" />;
  }
  if (normalized.includes('👶') || normalized.includes('child') || normalized.includes('pediatric') || normalized.includes('baby') || normalized.includes('immunity')) {
    return <FaBaby className="text-emerald-500" />;
  }
  if (normalized.includes('🧠') || normalized.includes('mind') || normalized.includes('stress') || normalized.includes('anxiety') || normalized.includes('wellness') || normalized.includes('🧘')) {
    return <FaBrain className="text-violet-500" />;
  }
  if (normalized.includes('💇') || normalized.includes('hair') || normalized.includes('scalp') || normalized.includes('alopecia')) {
    return <FaLeaf className="text-sky-500" />;
  }
  if (normalized.includes('🦋') || normalized.includes('thyroid')) {
    return <FaHeartbeat className="text-teal-600" />;
  }

  // Generic fallback
  return <FaStethoscope className="text-teal-600" />;
};
