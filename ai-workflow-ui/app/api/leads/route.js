import { isAuthorized, unauthorized } from '@/lib/auth';

const PLACES_URL = 'https://places.googleapis.com/v1/places:searchText';
const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.nationalPhoneNumber',
  'places.websiteUri',
  'places.rating',
  'places.userRatingCount',
  'places.googleMapsUri',
  'places.businessStatus',
  'nextPageToken',
].join(',');

// Each page is one billed Text Search request (up to 20 results).
const MAX_PAGES = 3;

const SOCIAL_HOSTS = [
  'facebook.com', 'fb.com', 'instagram.com', 'linktr.ee', 'tiktok.com',
  'x.com', 'twitter.com', 'yelp.com', 'nextdoor.com',
];

const BOOKING_HOSTS = [
  'vagaro.com', 'booksy.com', 'fresha.com', 'styleseat.com', 'square.site',
  'squareup.com', 'glossgenius.com', 'schedulicity.com', 'setmore.com',
  'toasttab.com', 'doordash.com', 'grubhub.com', 'ubereats.com',
];

const DEAD_PAGE_MARKERS = [
  "isn't connected to a website yet",
  'domain is not connected',
  'this domain may be for sale',
  'domain is for sale',
  'buy this domain',
  'parked free',
  'domain has expired',
  'site not found',
  'account suspended',
  'website coming soon',
];

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
}

function matchesHost(host, list) {
  return list.some((h) => host === h || host.endsWith(`.${h}`));
}

async function searchPlaces(query, apiKey) {
  const places = [];
  let pageToken;

  for (let page = 0; page < MAX_PAGES; page++) {
    const res = await fetch(PLACES_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': FIELD_MASK,
      },
      body: JSON.stringify({ textQuery: query, pageSize: 20, ...(pageToken && { pageToken }) }),
      cache: 'no-store',
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error?.message || `Google Places error ${res.status}`);
    }

    places.push(...(data.places || []));
    pageToken = data.nextPageToken;
    if (!pageToken) break;
  }

  return places;
}

// Returns null when the site looks healthy, otherwise a short problem label.
async function checkWebsite(url) {
  const host = hostOf(url);
  if (matchesHost(host, SOCIAL_HOSTS)) return { problem: 'Social page only', detail: host };
  if (matchesHost(host, BOOKING_HOSTS)) return { problem: 'Booking/ordering page only', detail: host };

  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36' },
      cache: 'no-store',
    });

    // Bot walls (401/403/429) mean a real site is there; don't flag those.
    if (res.status === 404 || res.status === 410 || res.status >= 500) {
      return { problem: 'Broken website', detail: `Returns error ${res.status}` };
    }

    const finalHost = hostOf(res.url);
    if (matchesHost(finalHost, SOCIAL_HOSTS)) return { problem: 'Social page only', detail: finalHost };

    const html = (await res.text()).slice(0, 200_000).toLowerCase();
    const marker = DEAD_PAGE_MARKERS.find((m) => html.includes(m));
    if (marker) return { problem: 'Broken website', detail: `Page says “${marker}”` };

    return null;
  } catch (err) {
    const reason = err?.name === 'TimeoutError' ? 'Took over 8 seconds to load' : 'Could not be reached';
    return { problem: 'Broken website', detail: reason };
  }
}

async function mapWithLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

export async function POST(request) {
  if (!isAuthorized(request)) return unauthorized();

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'GOOGLE_MAPS_API_KEY is missing from .env.local' }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  const city = String(body.city || '').trim();
  const businessType = String(body.businessType || '').trim();
  const state = String(body.state || 'MN').trim();
  if (!city || !businessType) {
    return Response.json({ error: 'City and business type are required' }, { status: 400 });
  }

  const query = `${businessType} in ${city}, ${state}`;

  try {
    const places = (await searchPlaces(query, apiKey)).filter(
      (p) => !p.businessStatus || p.businessStatus === 'OPERATIONAL'
    );

    const checked = await mapWithLimit(places, 8, async (p) => {
      const issue = p.websiteUri
        ? await checkWebsite(p.websiteUri)
        : { problem: 'No website', detail: 'No website on Google listing' };

      return {
        id: p.id,
        name: p.displayName?.text || 'Unknown',
        address: p.formattedAddress || '',
        phone: p.nationalPhoneNumber || '',
        website: p.websiteUri || '',
        rating: p.rating ?? null,
        reviewCount: p.userRatingCount ?? 0,
        mapsUrl: p.googleMapsUri || '',
        problem: issue?.problem || null,
        problemDetail: issue?.detail || '',
      };
    });

    const leads = checked
      .filter((b) => b.problem)
      .sort((a, b) => b.reviewCount - a.reviewCount);

    return Response.json({
      searchQuery: query,
      totalFound: checked.length,
      leadsFound: leads.length,
      leads,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 502 });
  }
}
