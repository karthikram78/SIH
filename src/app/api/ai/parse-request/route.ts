import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = (body?.input || '').toLowerCase();

    let detectedService = 'Plumbing';
    let requiredSkill = 'Pipe Repair';
    let urgency: 'low' | 'medium' | 'high' | 'emergency' = 'medium';
    let estimatedCostRange = '₹350 - ₹500';
    let keywords = ['plumbing', 'leak', 'repair'];

    if (input.includes('spark') || input.includes('shock') || input.includes('switch') || input.includes('electric') || input.includes('mcb') || input.includes('fan')) {
      detectedService = 'Electrical';
      requiredSkill = input.includes('fan') ? 'Fan Installation' : 'Wiring Repair';
      urgency = input.includes('shock') || input.includes('smoke') ? 'emergency' : 'high';
      estimatedCostRange = '₹400 - ₹650';
      keywords = ['electrical', 'wiring', 'switchboard'];
    } else if (input.includes('clean') || input.includes('degrease') || input.includes('dust')) {
      detectedService = 'Deep Cleaning';
      requiredSkill = 'Deep Home Cleaning';
      urgency = 'low';
      estimatedCostRange = '₹650 - ₹1,200';
      keywords = ['cleaning', 'sanitization', 'kitchen'];
    } else if (input.includes('ac') || input.includes('fridge') || input.includes('cool')) {
      detectedService = 'Appliance Repair';
      requiredSkill = 'AC Servicing';
      urgency = 'medium';
      estimatedCostRange = '₹500 - ₹900';
      keywords = ['ac', 'refrigerator', 'appliance'];
    } else if (input.includes('door') || input.includes('wood') || input.includes('lock')) {
      detectedService = 'Carpenter';
      requiredSkill = 'Lock Fitting';
      urgency = 'low';
      estimatedCostRange = '₹450 - ₹700';
      keywords = ['carpentry', 'wood', 'door'];
    } else if (input.includes('puncture') || input.includes('tyre')) {
      detectedService = 'Puncture & Tyres';
      requiredSkill = 'Tubeless Puncture Fix';
      urgency = 'emergency';
      estimatedCostRange = '₹250 - ₹350';
      keywords = ['tyre', 'puncture', 'emergency'];
    }

    return NextResponse.json({
      detectedService,
      problem: body.input,
      urgency,
      requiredSkill,
      estimatedCostRange,
      recommendedKeywords: keywords,
      reasoning: `AI matched '${detectedService}' based on semantic symptoms in the problem description.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
