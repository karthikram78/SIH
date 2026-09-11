import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message = '', history = [] } = body;
    const text = message.toLowerCase().trim();

    let reply = '';
    let intent = 'general_faq';
    let detectedService = '';
    let urgency = 'medium';
    let estimatedCostRange = '₹350 - ₹600';
    let suggestedAction = 'browse_services';

    if (text.includes('leak') || text.includes('pipe') || text.includes('tap') || text.includes('plumb') || text.includes('drain') || text.includes('flush')) {
      reply = 'I detected a Plumbing issue. We have verified plumbers available in Avadi right now who can arrive within 15-30 minutes with transparent cooperative rates.';
      intent = 'service_inquiry';
      detectedService = 'Plumbing';
      urgency = text.includes('burst') || text.includes('flood') ? 'emergency' : 'medium';
      estimatedCostRange = '₹350 - ₹550';
      suggestedAction = 'book_plumber';
    } else if (text.includes('spark') || text.includes('switch') || text.includes('shock') || text.includes('light') || text.includes('fan') || text.includes('wire') || text.includes('fuse') || text.includes('mcb') || text.includes('power')) {
      reply = 'This sounds like an Electrical fault. Electrical hazards should be resolved by certified electricians. I can connect you with licensed technicians in Avadi.';
      intent = 'service_inquiry';
      detectedService = 'Electrical';
      urgency = text.includes('shock') || text.includes('smoke') || text.includes('fire') ? 'emergency' : 'high';
      estimatedCostRange = '₹400 - ₹750';
      suggestedAction = 'book_electrician';
    } else if (text.includes('clean') || text.includes('sanitize') || text.includes('cockroach') || text.includes('wash') || text.includes('dust')) {
      reply = 'I can help arrange professional Deep Cleaning or sanitization for your home or office in Avadi. Our cooperative cleaning teams provide specialized tools and eco-friendly products.';
      intent = 'service_inquiry';
      detectedService = 'Deep Cleaning';
      urgency = 'low';
      estimatedCostRange = '₹650 - ₹1,400';
      suggestedAction = 'book_cleaning';
    } else if (text.includes('ac') || text.includes('fridge') || text.includes('refrigerator') || text.includes('washing machine') || text.includes('geyser') || text.includes('appliance')) {
      reply = 'This is an Appliance Repair request. We have certified technicians specialized in AC servicing, gas refilling, and PCB board diagnosis.';
      intent = 'service_inquiry';
      detectedService = 'Appliance Repair';
      urgency = 'medium';
      estimatedCostRange = '₹500 - ₹1,200';
      suggestedAction = 'book_appliance';
    } else if (text.includes('door') || text.includes('lock') || text.includes('wood') || text.includes('table') || text.includes('furniture') || text.includes('cupboard') || text.includes('hinge')) {
      reply = 'This is a Carpentry task. Skilled artisan carpenters in Avadi can handle door alignment, lock repair, and bespoke modular fittings.';
      intent = 'service_inquiry';
      detectedService = 'Carpenter';
      urgency = 'low';
      estimatedCostRange = '₹450 - ₹800';
      suggestedAction = 'book_carpenter';
    } else if (text.includes('tyre') || text.includes('puncture') || text.includes('air') || text.includes('flat')) {
      reply = 'Emergency puncture support detected! Mobile puncture doctors with portable compressors can reach your location in Avadi.';
      intent = 'emergency_service';
      detectedService = 'Puncture & Tyres';
      urgency = 'emergency';
      estimatedCostRange = '₹250 - ₹400';
      suggestedAction = 'book_puncture';
    } else if (text.includes('status') || text.includes('track') || text.includes('where is')) {
      reply = 'You can check real-time job status and live worker GPS tracking directly from your Customer Dashboard.';
      intent = 'track_order';
      suggestedAction = 'open_dashboard';
    } else if (text.includes('price') || text.includes('fee') || text.includes('split') || text.includes('cost')) {
      reply = 'AvadiConnect operates on a transparent statutory model: 85% goes directly to the worker, 10% to the cooperative welfare fund, and 5% platform maintenance fee. No hidden surge charges!';
      intent = 'pricing_info';
      suggestedAction = 'view_pricing';
    } else {
      reply = 'Hello! I am your AvadiConnect AI Assistant. How can I assist you today? Tell me what problem you are facing (e.g., "my kitchen tap is leaking" or "need an electrician for switchboard fault").';
      intent = 'greeting';
    }

    return NextResponse.json({
      reply,
      intent,
      detectedService,
      urgency,
      estimatedCostRange,
      suggestedAction,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
