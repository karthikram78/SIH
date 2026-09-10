/**
 * Avadi Connect — AI Classifier & ML Utilities
 * Sentiment analysis, feedback classification, demand forecasting
 */

// ──────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────

export type SentimentLabel = 'positive' | 'neutral' | 'negative';
export type FeedbackCategory = 'compliment' | 'suggestion' | 'complaint' | 'issue' | 'neutral';

export interface FeedbackAnalysis {
  sentiment: SentimentLabel;
  sentimentScore: number; // 0–100
  category: FeedbackCategory;
  keywords: string[];
  routing: 'worker_profile' | 'cooperative_review' | 'platform_escalation' | 'none';
  autoResponse: string;
}

export interface DemandDataPoint {
  day: string;
  actual: number;
  predicted: number;
}

// ──────────────────────────────────────────────────────────
// Sentiment Analysis (Rule-based NLP)
// ──────────────────────────────────────────────────────────

const POSITIVE_WORDS = [
  'excellent', 'great', 'good', 'amazing', 'outstanding', 'perfect', 'wonderful',
  'fantastic', 'helpful', 'professional', 'clean', 'fast', 'quick', 'friendly',
  'honest', 'skilled', 'expert', 'punctual', 'on time', 'happy', 'satisfied',
  'recommend', 'best', 'superb', 'polite', 'efficient', 'நல்ல', 'சிறப்பு', 'திறமை',
  'thank', 'thanks', 'appreciate', 'love', 'liked', 'impressed', 'neat', 'tidy',
  'affordable', 'worth', 'cooperative', 'kind', 'humble',
];

const NEGATIVE_WORDS = [
  'bad', 'poor', 'terrible', 'awful', 'worst', 'horrible', 'late', 'delayed',
  'rude', 'unprofessional', 'expensive', 'overcharge', 'dirty', 'damaged',
  'incomplete', 'broken', 'careless', 'negligent', 'slow', 'fraud', 'cheat',
  'disappointing', 'dissatisfied', 'complaint', 'refund', 'angry', 'upset',
  'wrong', 'mistake', 'problem', 'issue', 'failed', 'never', 'avoid',
  'மோசம்', 'தாமதம்', 'கஷ்டம்',
];

const COMPLAINT_KEYWORDS = ['overcharge', 'cheat', 'fraud', 'damage', 'broken', 'incomplete', 'refund', 'money back'];
const SUGGESTION_KEYWORDS = ['should', 'could', 'improve', 'suggest', 'recommend', 'better', 'if only', 'maybe'];
const COMPLIMENT_KEYWORDS = ['excellent', 'amazing', 'outstanding', 'best', 'superb', 'recommend', 'fantastic'];

export function analyzeFeedback(text: string, starRating: number): FeedbackAnalysis {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);

  let positiveCount = 0;
  let negativeCount = 0;
  const matchedKeywords: string[] = [];

  for (const word of POSITIVE_WORDS) {
    if (lower.includes(word)) {
      positiveCount++;
      matchedKeywords.push(word);
    }
  }
  for (const word of NEGATIVE_WORDS) {
    if (lower.includes(word)) {
      negativeCount++;
      matchedKeywords.push(word);
    }
  }

  // Incorporate star rating into score
  const ratingBonus = (starRating - 3) * 15; // -30 to +30
  const rawScore = ((positiveCount - negativeCount) / Math.max(words.length, 1)) * 100 + ratingBonus + 50;
  const sentimentScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  let sentiment: SentimentLabel = 'neutral';
  if (sentimentScore >= 65) sentiment = 'positive';
  else if (sentimentScore <= 40) sentiment = 'negative';

  // Category classification
  let category: FeedbackCategory = 'neutral';
  if (COMPLAINT_KEYWORDS.some((k) => lower.includes(k)) || starRating <= 2) {
    category = 'complaint';
  } else if (SUGGESTION_KEYWORDS.some((k) => lower.includes(k))) {
    category = 'suggestion';
  } else if (COMPLIMENT_KEYWORDS.some((k) => lower.includes(k)) || starRating >= 4) {
    category = 'compliment';
  } else if (negativeCount > positiveCount) {
    category = 'issue';
  }

  // Smart routing
  let routing: FeedbackAnalysis['routing'] = 'none';
  if (category === 'compliment') routing = 'worker_profile';
  else if (category === 'complaint' || category === 'issue') {
    routing = starRating <= 2 ? 'platform_escalation' : 'cooperative_review';
  }

  // Auto response
  const autoResponse =
    sentiment === 'positive'
      ? "Thank you for the great feedback! We have added a commendation to the worker's cooperative profile."
      : sentiment === 'negative'
      ? 'We sincerely apologize for the experience. Your feedback has been escalated to the cooperative quality team.'
      : 'Thank you for your feedback. It helps us improve our cooperative services.';

  return {
    sentiment,
    sentimentScore,
    category,
    keywords: matchedKeywords.slice(0, 5),
    routing,
    autoResponse,
  };
}

// ──────────────────────────────────────────────────────────
// ML Demand Forecasting (Simple Moving Average + Trend)
// ──────────────────────────────────────────────────────────

const SERVICE_NAMES = ['Electricians', 'Plumbers', 'Carpenters', 'Painters', 'Cleaners', 'Drivers', 'Technicians'];

/**
 * Generate realistic demand data with seasonal patterns for Avadi.
 * Uses sine wave + noise to mimic real weekly demand cycles.
 */
export function generateDemandData(days = 30, serviceName = 'Electricians'): DemandDataPoint[] {
  const seed = serviceName.charCodeAt(0);
  const baselineDemand = 20 + (seed % 20);
  const data: DemandDataPoint[] = [];

  for (let i = 0; i < days; i++) {
    const dayOfWeek = i % 7;
    // Weekends higher demand, mid-week lower
    const weekendBoost = dayOfWeek === 0 || dayOfWeek === 6 ? 8 : 0;
    const trend = i * 0.3; // slight upward trend over time
    const noise = (Math.sin(i * seed) * 5) + (Math.cos(i * 1.3) * 3);
    const actual = Math.max(5, Math.round(baselineDemand + weekendBoost + trend + noise));

    data.push({
      day: new Date(Date.now() - (days - i) * 86_400_000).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      actual,
      predicted: 0, // filled below
    });
  }

  // Simple Moving Average prediction (window=7)
  for (let i = 0; i < data.length; i++) {
    const windowStart = Math.max(0, i - 3);
    const window = data.slice(windowStart, i + 1);
    const avg = window.reduce((s, d) => s + d.actual, 0) / window.length;
    // Apply linear trend
    const trend = i > 0 ? (data[i].actual - data[0].actual) / data.length : 0;
    data[i].predicted = Math.max(5, Math.round(avg + trend));
  }

  return data;
}

/**
 * Predict next 7 days demand using linear regression on last 14 days.
 */
export function predictNextWeek(historicalData: DemandDataPoint[]): DemandDataPoint[] {
  const recent = historicalData.slice(-14);
  const n = recent.length;
  if (n < 2) return [];

  // Linear regression: y = mx + b
  const xMean = (n - 1) / 2;
  const yMean = recent.reduce((s, d) => s + d.actual, 0) / n;
  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < n; i++) {
    numerator += (i - xMean) * (recent[i].actual - yMean);
    denominator += (i - xMean) ** 2;
  }
  const slope = denominator !== 0 ? numerator / denominator : 0;
  const intercept = yMean - slope * xMean;

  return Array.from({ length: 7 }, (_, i) => {
    const x = n + i;
    const predicted = Math.max(5, Math.round(slope * x + intercept));
    return {
      day: new Date(Date.now() + (i + 1) * 86_400_000).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      actual: 0,
      predicted,
    };
  });
}

// ──────────────────────────────────────────────────────────
// AI Chatbot Knowledge Base
// ──────────────────────────────────────────────────────────

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

interface KBEntry {
  patterns: string[];
  response: string;
  tamilResponse?: string;
}

const KNOWLEDGE_BASE: KBEntry[] = [
  {
    patterns: ['book', 'booking', 'how to book', 'request service', 'hire', 'எப்படி'],
    response: '📋 To book a service:\n1. Go to **Customer Dashboard**\n2. Describe your problem in plain language (e.g. "tap is leaking")\n3. Our AI will match you with verified workers\n4. Confirm the booking and track live!',
    tamilResponse: '📋 சேவை பதிவு செய்ய:\n1. Customer Dashboard-க்கு செல்லுங்கள்\n2. உங்கள் பிரச்சனையை தமிழில் சொல்லுங்கள்\n3. AI நம்பகமான தொழிலாளியை கண்டுபிடிக்கும்\n4. உடனடியாக Live tracking தொடங்கும்!',
  },
  {
    patterns: ['85', 'fee', 'payment', 'commission', 'charge', 'money', 'கட்டணம்'],
    response: '💚 **Avadi Connect Fair Pay Model:**\n• **85%** → Worker takes home directly\n• **10%** → Cooperative welfare fund (health, insurance)\n• **5%** → Platform infrastructure\n\nNo hidden charges. Full transparency guaranteed!',
    tamilResponse: '💚 **நம்ம சேவை நியாயமான கட்டணம்:**\n• **85%** → தொழிலாளிக்கு நேரடியாக\n• **10%** → கூட்டுறவு நல நிதி\n• **5%** → Platform maintenance',
  },
  {
    patterns: ['verify', 'verification', 'safe', 'trust', 'சரிபார்ப்பு', 'நம்பகம்'],
    response: '🛡️ **4-Point Cooperative Verification:**\n1. ✅ Identity (Aadhaar / Govt ID)\n2. ✅ Trade Skill (ITI / NCVT Certificate)\n3. ✅ Background Check (Police Clearance)\n4. ✅ Mobile OTP Verification\n\nAll workers are endorsed by their local cooperative society.',
  },
  {
    patterns: ['emergency', 'urgent', 'help', 'sos', 'அவசர'],
    response: '🚨 **Emergency Help:**\nTap the **red 🚨 Need Help Now** button on your dashboard for instant dispatch.\n\nWe support:\n• Electrical sparking / power failure\n• Burst pipe / flooding\n• Vehicle puncture on road\n• Emergency locksmith\n\nA verified worker will be dispatched within minutes!',
  },
  {
    patterns: ['electrician', 'electrical', 'plumber', 'carpenter', 'painter', 'worker', 'service'],
    response: '🔧 **Services Available in Avadi:**\n• ⚡ Electricians\n• 🔧 Plumbers\n• 🪚 Carpenters\n• 🎨 Painters\n• 🚗 Drivers\n• 🌿 Gardeners\n• 🧹 Cleaners\n• 🔌 Appliance Repair\n• 🏠 Domestic Helpers\n• 👴 Caregivers\n\nAll verified by Avadi cooperative societies!',
  },
  {
    patterns: ['cooperative', 'kautshal', 'worker join', 'register worker', 'enroll'],
    response: '🤝 **Join as a Worker:**\n1. Go to **Register → Worker**\n2. Upload your skill certificate (ITI/NCVT)\n3. Cooperative secretary verifies your documents\n4. Get your digital verified badge\n5. Start earning 85% of every booking!\n\nJoin 500+ artisans already on Avadi Connect.',
  },
  {
    patterns: ['track', 'live', 'location', 'gps', 'where', 'status'],
    response: '📡 **Live Job Tracking:**\nOnce your worker is dispatched:\n• See their real-time GPS position on map\n• Live ETA countdown\n• Speed and route displayed\n• Security 4-digit OTP for safe job start\n\nAll powered by cooperative-grade telemetry!',
  },
  {
    patterns: ['cancel', 'reschedule', 'change'],
    response: '📅 You can cancel or reschedule from **My Bookings** up to 30 minutes before the worker arrives. Emergency cancellations are handled by the cooperative secretary.',
  },
  {
    patterns: ['rating', 'review', 'feedback', 'stars', 'rate'],
    response: "⭐ After your service is completed and paid, you can rate your experience with 1–5 stars and leave a review. Your feedback directly improves the worker's cooperative standing and helps other customers!",
  },
  {
    patterns: ['hello', 'hi', 'vanakkam', 'வணக்கம்', 'help', 'உதவி'],
    response: '👋 Vanakkam! I am the **Avadi Connect AI Assistant**.\n\nI can help you with:\n• Booking a service\n• Understanding payments\n• Tracking your worker\n• Emergency help\n• Joining as a worker\n\nWhat do you need help with today?',
  },
];

export function getChatbotResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase().trim();

  for (const entry of KNOWLEDGE_BASE) {
    if (entry.patterns.some((p) => lower.includes(p))) {
      return entry.response;
    }
  }

  // Fallback
  return '🤔 I am not sure about that. Please try asking about:\n• **Booking a service**\n• **Payments & fees**\n• **Worker verification**\n• **Emergency help**\n• **Live tracking**\n\nOr call our cooperative helpline: **1800-XXX-XXXX** (Toll Free)';
}
