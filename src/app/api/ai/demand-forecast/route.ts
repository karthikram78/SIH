import { NextResponse } from 'next/server';

export async function GET() {
  const forecasts = [
    {
      category: 'Electrical',
      predictedDemandChange: '+42%',
      urgencyNotice: 'High Expected Surge',
      reason: 'Monsoon season grid fluctuations & increased ceiling fan/wiring repairs across Avadi.',
      affectedZones: ['Avadi Main Road', 'Gandhi Nagar', 'Nehru Street', 'Military Road'],
      recommendedAction: 'Alert standby electrical workers and ensure adequate MCB inventory.',
    },
    {
      category: 'Plumbing',
      predictedDemandChange: '+28%',
      urgencyNotice: 'Moderate Surge',
      reason: 'Morning peak water pressure cycles causing tap leakage & tank overflow reports.',
      affectedZones: ['Kamaraj Nagar', 'Venkateshwara Nagar', 'Avadi Bazaar'],
      recommendedAction: 'Pre-schedule morning dispatch slots with cooperative plumbers.',
    },
    {
      category: 'Appliance Repair',
      predictedDemandChange: '+35%',
      urgencyNotice: 'Seasonal Surge',
      reason: 'Summer heatwave driving AC servicing, filter cleaning, and gas refilling requests.',
      affectedZones: ['Sector 3', 'Anna Nagar Extn', 'Pattabiram'],
      recommendedAction: 'Notify certified AC technicians to prepare copper brazing kits.',
    },
    {
      category: 'Puncture & Roadside',
      predictedDemandChange: '+19%',
      urgencyNotice: 'Steady Demand',
      reason: 'High commuter traffic near Avadi Railway Station & Outer Ring Road junctions.',
      affectedZones: ['Railway Station Road', 'CTH Road', 'Checkpost Junction'],
      recommendedAction: 'Maintain 2 mobile puncture doctors on active duty near station.',
    },
  ];

  return NextResponse.json(forecasts);
}
