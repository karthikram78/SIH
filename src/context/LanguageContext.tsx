'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand & Hero
    brandName: 'Avadi Connect',
    tagline: 'Connecting Skills with Community Needs',
    heroTitle: 'Find Trusted Local Workers Near You',
    heroSubtitle: 'Connect with verified independent workers for household, personal, community and emergency services.',
    findService: 'Find a Service',
    joinAsWorker: 'Join as a Worker',
    needHelpNow: '🚨 Need Help Now',

    // Nav
    home: 'Home',
    about: 'About',
    services: 'Services',
    howItWorks: 'How It Works',
    login: 'Login',
    register: 'Register',
    dashboard: 'Dashboard',
    myBookings: 'My Bookings',
    nearbyWorkers: 'Nearby Workers',
    payments: 'Payments',
    reviews: 'Reviews',
    profile: 'Profile',
    notifications: 'Notifications',
    logout: 'Logout',
    cooperative: 'Cooperative',
    admin: 'Admin',
    worker: 'Worker',
    customer: 'Customer',

    // Value propositions
    verifiedWorkers: 'Verified Workers',
    smartMatching: 'Smart Matching',
    cooperativePowered: 'Cooperative Powered',
    localServices: 'Local Services',
    transparentEarnings: 'Transparent Earnings',

    // How It Works Steps
    step1Title: 'Request Service',
    step1Desc: 'Describe your issue or select a category with our smart AI assistant.',
    step2Title: 'Location Detection',
    step2Desc: 'GPS pinpoints your location to find nearby artisans in your neighborhood.',
    step3Title: 'Smart Matching',
    step3Desc: 'Ranked by skill, proximity, rating, and verified credentials.',
    step4Title: 'Verified Worker',
    step4Desc: 'Only cooperative-backed, 4-point verified workers arrive at your door.',
    step5Title: 'Job Completion',
    step5Desc: 'Worker finishes task with strict transparent hourly or fixed pricing.',
    step6Title: 'Fair Payment',
    step6Desc: 'Direct simulated transfer: 85% to worker, 10% to cooperative welfare fund, 5% platform fee.',
    step7Title: 'Community Rating',
    step7Desc: 'Leave genuine feedback to empower honest community tradespeople.',

    // Common labels
    searchPlaceholder: 'What service do you need? e.g., "My kitchen tap is leaking"',
    popularServices: 'Popular Services',
    activeBookings: 'Active Bookings',
    recentBookings: 'Recent Bookings',
    allServices: 'All Services',
    status: 'Status',
    date: 'Date',
    amount: 'Amount',
    action: 'Action',
    viewDetails: 'View Details',
    cancel: 'Cancel',
    confirm: 'Confirm',
    submit: 'Submit',
    available: 'Available',
    busy: 'Busy',
    offline: 'Offline',
    verified: 'Verified',
    pending: 'Pending Verification',
  },
  ta: {
    // Brand & Hero
    brandName: 'நம்ம சேவை',
    tagline: 'திறமைகளை சமூகத் தேவைகளுடன் இணைக்கிறோம்',
    heroTitle: 'உங்களுக்கு அருகிலுள்ள நம்பகமான உள்ளூர் தொழிலாளர்களைக் கண்டறியுங்கள்',
    heroSubtitle: 'வீட்டு வேலைகள், தனிநபர் சேவைகள் மற்றும் அவசரப் பணிகளுக்காக சரிபார்க்கப்பட்ட சுயாதீன தொழிலாளர்களுடன் இணையுங்கள்.',
    findService: 'சேவையைத் தேடுங்கள்',
    joinAsWorker: 'தொழிலாளராக இணையுங்கள்',
    needHelpNow: '🚨 அவசர உதவி தேவை',

    // Nav
    home: 'முகப்பு',
    about: 'எங்களை பற்றி',
    services: 'சேவைகள்',
    howItWorks: 'எவ்வாறு செயல்படுகிறது',
    login: 'உள்நுழைக',
    register: 'பதிவு செய்க',
    dashboard: 'டாஷ்போர்டு',
    myBookings: 'எனது முன்பதிவுகள்',
    nearbyWorkers: 'அருகிலுள்ள தொழிலாளர்கள்',
    payments: 'பணப்பரிவர்த்தனை',
    reviews: 'மதிப்புரைகள்',
    profile: 'சுயவிவரம்',
    notifications: 'அறிவிப்புகள்',
    logout: 'வெளியேறு',
    cooperative: 'கூட்டுறவு',
    admin: 'நிர்வாகி',
    worker: 'தொழிலாளி',
    customer: 'வாடிக்கையாளர்',

    // Value propositions
    verifiedWorkers: 'சரிபார்க்கப்பட்ட தொழிலாளர்கள்',
    smartMatching: 'நுண்ணறிவு பொருத்தம்',
    cooperativePowered: 'கூட்டுறவு ஆதரவு பெற்றது',
    localServices: 'உள்ளூர் சேவைகள்',
    transparentEarnings: 'வெளிப்படையான வருமானம்',

    // How It Works Steps
    step1Title: 'சேவை கோரிக்கை',
    step1Desc: 'உங்கள் பிரச்சனையை விவரிக்கவும் அல்லது வகையைத் தேர்ந்தெடுக்கவும்.',
    step2Title: 'இருப்பிட கண்டறிதல்',
    step2Desc: 'உங்கள் அருகில் உள்ள தொழிலாளர்களைக் கண்டறிய GPS பயன்பாடு.',
    step3Title: 'நுண்ணறிவு பொருத்தம்',
    step3Desc: 'திறன், தூரம், மதிப்பீடு மற்றும் சான்றிதழ்கள் அடிப்படையில் வரிசைப்படுத்துதல்.',
    step4Title: 'சரிபார்க்கப்பட்ட தொழிலாளி',
    step4Desc: 'கூட்டுறவால் 4 நிலைகளில் சரிபார்க்கப்பட்ட தொழிலாளர்கள்.',
    step5Title: 'வேலை நிறைவு',
    step5Desc: 'வெளிப்படையான கட்டணத்தில் வேலை நிறைவு செய்யப்படுகிறது.',
    step6Title: 'நியாயமான கட்டணம்',
    step6Desc: '85% தொழிலாளிக்கு, 10% கூட்டுறவு நல நிதிக்கு, 5% தளம் கட்டணம்.',
    step7Title: 'மதிப்பீடு அளித்தல்',
    step7Desc: 'தொழிலாளர்களை ஊக்கப்படுத்த உண்மையான மதிப்புரைகளை வழங்கவும்.',

    // Common labels
    searchPlaceholder: 'உங்களுக்கு என்ன சேவை தேவை? எ.கா., "குழாய் கசிகிறது"',
    popularServices: 'பிரபலமான சேவைகள்',
    activeBookings: 'செயலில் உள்ள முன்பதிவுகள்',
    recentBookings: 'சமீபத்திய முன்பதிவுகள்',
    allServices: 'அனைத்து சேவைகள்',
    status: 'நிலை',
    date: 'தேதி',
    amount: 'தொகை',
    action: 'செயல்',
    viewDetails: 'விவரங்களை காண்க',
    cancel: 'ரத்து செய்',
    confirm: 'உறுதி செய்',
    submit: 'சமர்ப்பி',
    available: 'கிடைக்கிறார்',
    busy: 'பணியில் உள்ளார்',
    offline: 'இணைப்பில் இல்லை',
    verified: 'சரிபார்க்கப்பட்டது',
    pending: 'சரிபார்ப்பு நிலுவையில்',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('namma_sevai_lang') as Language;
    if (saved === 'en' || saved === 'ta') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('namma_sevai_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
