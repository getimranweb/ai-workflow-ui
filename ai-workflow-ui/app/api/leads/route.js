import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { city, businessType } = await request.json();
    
    if (!city || !businessType) {
      return NextResponse.json({ error: 'City and Business Type are required' }, { status: 400 });
    }

    console.log(`📡 Server hunting for ${businessType} in ${city}...`);

    // --- EXPANDED LOCAL DATABASE INDEX ---
    // A broader collection of local businesses across distinct industry niches
    const mockGooglePlacesDatabase = [
      // Contractors / Trades
      { name: "Apex Local Trades & Plumbing", phone: "(612) 555-0143", website: null, rating: 4.2, niche: "contractor" },
      { name: "Young America Landscaping", phone: "(612) 555-0177", website: null, rating: 4.0, niche: "contractor" },
      { name: "Midwest Roofing Specialists", phone: "(952) 555-0322", website: "https://midwestroof.com", rating: 4.6, niche: "contractor" },
      
      // Salons / Spas
      { name: "Downtown Nail Salon & Spa", phone: "(320) 555-0122", website: null, rating: 4.5, niche: "salon" },
      { name: "Elite Hair Design Studio", phone: "(612) 555-0988", website: null, rating: 4.8, niche: "salon" },
      { name: "Radiant Glow Skincare Lounge", phone: "(952) 555-0411", website: "https://radiantglow.com", rating: 4.4, niche: "salon" },
      
      // Restaurants / Cafes
      { name: "Norwood Bakery & Cafe", phone: "(952) 555-0188", website: "https://norwoodbakery.com", rating: 4.9, niche: "restaurant" },
      { name: "St. Cloud Deli & Grill", phone: "(320) 555-0761", website: null, rating: 4.1, niche: "restaurant" }
    ];

    // --- DYNAMIC PIPELINE FILTERS ---
    const cleanSearchQuery = businessType.trim().toLowerCase();

    const filteredLeads = mockGooglePlacesDatabase.filter(business => {
      // 1. Must match the user's specific business sector niche query string
      const matchesNiche = business.niche === cleanSearchQuery;
      // 2. Must be missing a domain listing completely (website column equals null)
      const isMissingWebsite = business.website === null;
      
      return matchesNiche && isMissingWebsite;
    });

    return NextResponse.json({ 
      success: true,
      searchQuery: `${businessType} in ${city}`,
      totalFound: mockGooglePlacesDatabase.filter(b => b.niche === cleanSearchQuery).length,
      leadsGenerated: filteredLeads.length,
      leads: filteredLeads 
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
