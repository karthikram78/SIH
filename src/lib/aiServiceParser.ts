import { AIServiceAnalysis, UrgencyLevel } from '@/types';

interface ServicePattern {
  category: string;
  skills: string[];
  keywords: string[];
  emergencyKeywords?: string[];
  defaultProblem: string;
  defaultSkill: string;
  costRange: string;
  defaultUrgency: UrgencyLevel;
}

const SERVICE_PATTERNS: ServicePattern[] = [
  {
    category: 'Plumbing',
    skills: ['Pipe Repair', 'Tap Repair', 'Water Tank Repair', 'Drain Cleaning', 'Bathroom Fitting'],
    keywords: ['tap', 'pipe', 'leak', 'water', 'plumber', 'drain', 'toilet', 'flush', 'sink', 'faucet', 'tank', 'basin', 'geyser leak', 'plumbing', 'shower'],
    emergencyKeywords: ['pipe burst', 'flooding', 'overflowing', 'urgent leak', 'burst'],
    defaultProblem: 'Water Leakage & Sanitary Fixture Issue',
    defaultSkill: 'Pipe/Tap Repair',
    costRange: '₹250 - ₹500',
    defaultUrgency: 'medium',
  },
  {
    category: 'Electrical',
    skills: ['Wiring Repair', 'Switchboard Repair', 'Fan Installation', 'MCB Tripping Fault', 'Earthing Test'],
    keywords: ['electric', 'spark', 'current', 'shock', 'switch', 'light', 'fan', 'mcb', 'fuse', 'tripping', 'power cut', 'wire', 'short circuit', 'plug'],
    emergencyKeywords: ['sparking', 'smoke', 'burning smell', 'electric shock', 'fire risk', 'power down'],
    defaultProblem: 'Electrical Circuit or Appliance Fault',
    defaultSkill: 'Wiring Repair / MCB Check',
    costRange: '₹300 - ₹600',
    defaultUrgency: 'high',
  },
  {
    category: 'Puncture & Tyres',
    skills: ['Tubeless Puncture Fix', 'Tube Patching', 'Mobile Tyre Assistance', 'Wheel Balancing'],
    keywords: ['puncture', 'tyre', 'tire', 'flat tyre', 'air leak', 'wheel', 'stepney', 'deflated'],
    emergencyKeywords: ['stranded', 'highway', 'flat tire', 'roadside', 'puncture now'],
    defaultProblem: 'Deflated Tyre / Puncture on Road',
    defaultSkill: 'Tubeless Puncture Fix',
    costRange: '₹150 - ₹350',
    defaultUrgency: 'emergency',
  },
  {
    category: 'Mechanic & Vehicle Repair',
    skills: ['Bike Breakdown Help', 'Car Engine Diagnostics', 'Brake Pad Replacement', 'Chain Lubrication'],
    keywords: ['mechanic', 'bike', 'car', 'scooter', 'engine', 'breakdown', 'not starting', 'clutch', 'brake', 'chain', 'battery dead', 'jumpstart', 'two wheeler', 'vehicle'],
    emergencyKeywords: ['breakdown', 'wont start', 'engine stopped', 'stuck on road', 'roadside breakdown'],
    defaultProblem: 'Vehicle Breakdown & Engine/Brake Issue',
    defaultSkill: 'Bike/Car Breakdown Help',
    costRange: '₹350 - ₹800',
    defaultUrgency: 'high',
  },
  {
    category: 'Deep Cleaning',
    skills: ['Deep Home Cleaning', 'Bathroom Sanitization', 'Kitchen Degreasing', 'Sofa Shampooing'],
    keywords: ['clean', 'cleaning', 'dust', 'wash', 'bathroom clean', 'kitchen clean', 'deep clean', 'sanitize', 'sofa', 'house clean', 'maid', 'mop'],
    emergencyKeywords: [],
    defaultProblem: 'Intensive Space Deep Cleaning & Degreasing',
    defaultSkill: 'Deep Home Cleaning',
    costRange: '₹500 - ₹1,200',
    defaultUrgency: 'low',
  },
  {
    category: 'Appliance Repair',
    skills: ['AC Servicing', 'Refrigerator Repair', 'Washing Machine Repair', 'Geyser Installation'],
    keywords: ['ac', 'air conditioner', 'fridge', 'refrigerator', 'washing machine', 'geyser', 'cooler', 'oven', 'appliance', 'cooling', 'water heater'],
    emergencyKeywords: ['gas leakage', 'geyser spark', 'refrigerator stopped'],
    defaultProblem: 'Appliance Malfunction or Cooling Loss',
    defaultSkill: 'AC Servicing / Appliance Diagnosis',
    costRange: '₹400 - ₹850',
    defaultUrgency: 'medium',
  },
  {
    category: 'Carpenter',
    skills: ['Door Alignment', 'Lock Fitting', 'Furniture Assembly', 'Cupboard Repair', 'Wood Polishing'],
    keywords: ['carpenter', 'door', 'lock', 'wood', 'furniture', 'cupboard', 'table', 'chair', 'drawer', 'hinge', 'latch', 'key stuck'],
    emergencyKeywords: ['lock jammed', 'locked out', 'door stuck'],
    defaultProblem: 'Door, Lock or Wooden Furniture Fault',
    defaultSkill: 'Lock Fitting / Door Alignment',
    costRange: '₹300 - ₹650',
    defaultUrgency: 'medium',
  },
  {
    category: 'Painting',
    skills: ['Wall Touchup', 'Waterproofing', 'Emulsion Painting', 'Enamel Paint', 'Distemper'],
    keywords: ['paint', 'painter', 'wall', 'damp', 'waterproof', 'varnish', 'colour', 'color', 'whitewash'],
    emergencyKeywords: ['severe dampness', 'ceiling peeling'],
    defaultProblem: 'Wall Surface Repair & Painting',
    defaultSkill: 'Wall Touchup & Waterproofing',
    costRange: '₹500 - ₹1,500',
    defaultUrgency: 'low',
  },
  {
    category: 'Cook & Kitchen Help',
    skills: ['Vegetarian Cooking', 'South Indian Tiffin', 'Meal Prep Helper', 'Festival Sweets'],
    keywords: ['cook', 'cooking', 'chef', 'food', 'meals', 'kitchen help', 'tiffin', 'dinner', 'lunch'],
    emergencyKeywords: [],
    defaultProblem: 'Household Meal Preparation & Kitchen Assistance',
    defaultSkill: 'Vegetarian Cooking / Tiffin Prep',
    costRange: '₹400 - ₹800',
    defaultUrgency: 'low',
  },
  {
    category: 'Gardening & Lawn',
    skills: ['Tree Pruning', 'Lawn Mowing', 'Soil Fertilization', 'Terrace Garden Care'],
    keywords: ['garden', 'gardener', 'plant', 'lawn', 'grass', 'tree', 'pruning', 'pot', 'watering'],
    emergencyKeywords: ['fallen tree branch'],
    defaultProblem: 'Garden Maintenance & Tree Trimming',
    defaultSkill: 'Terrace Garden Care & Pruning',
    costRange: '₹300 - ₹600',
    defaultUrgency: 'low',
  }
];

export function analyzeServiceRequest(input: string): AIServiceAnalysis {
  const query = input.toLowerCase().trim();

  if (!query) {
    return {
      detectedService: 'Plumbing',
      problem: 'General Household Maintenance',
      urgency: 'medium',
      requiredSkill: 'Pipe/Tap Repair',
      estimatedCostRange: '₹300 - ₹500',
      recommendedKeywords: ['plumbing', 'repair', 'local worker']
    };
  }

  // Check emergency keywords across all
  const isEmergency = /emergency|urgent|now|danger|broken down|highway|stuck|sparking|fire|burst|jammed|flooding/i.test(query);

  let bestMatch: ServicePattern = SERVICE_PATTERNS[0];
  let highestScore = -1;
  let matchedSkill = '';

  for (const pattern of SERVICE_PATTERNS) {
    let score = 0;

    // Check category match
    if (query.includes(pattern.category.toLowerCase())) {
      score += 15;
    }

    // Check keywords
    for (const kw of pattern.keywords) {
      if (query.includes(kw)) {
        score += 5;
      }
    }

    // Check skills
    for (const skill of pattern.skills) {
      if (query.includes(skill.toLowerCase())) {
        score += 10;
        matchedSkill = skill;
      }
    }

    // Check emergency keywords
    if (pattern.emergencyKeywords) {
      for (const em of pattern.emergencyKeywords) {
        if (query.includes(em)) {
          score += 20;
        }
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = pattern;
    }
  }

  // Determine problem summary
  let problem = bestMatch.defaultProblem;
  if (/leak|drip/i.test(query)) {
    problem = 'Water Leakage / Pipe Dripping';
  } else if (/spark|short circuit/i.test(query)) {
    problem = 'Sparking Circuit / Fuse Issue';
  } else if (/flat|puncture|air/i.test(query)) {
    problem = 'Flat Tyre / Roadside Puncture';
  } else if (/not starting|breakdown/i.test(query)) {
    problem = 'Engine Breakdown / Vehicle Stalled';
  } else if (/lock|jammed/i.test(query)) {
    problem = 'Door Lock Jammed / Key Issue';
  } else if (/ac.*cool|cooling/i.test(query)) {
    problem = 'AC Not Cooling / Gas Refill Required';
  } else if (/deep clean|cleaning/i.test(query)) {
    problem = 'Deep Sanitization & Degreasing Request';
  }

  const urgency: UrgencyLevel = isEmergency 
    ? 'emergency' 
    : (/urgent|immediately|today|fast/i.test(query) ? 'high' : bestMatch.defaultUrgency);

  return {
    detectedService: bestMatch.category,
    problem,
    urgency,
    requiredSkill: matchedSkill || bestMatch.defaultSkill,
    estimatedCostRange: bestMatch.costRange,
    recommendedKeywords: bestMatch.keywords.slice(0, 4)
  };
}
