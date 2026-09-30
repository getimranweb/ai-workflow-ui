'use client';
import { useState } from 'react';

const PORTFOLIO_URL = 'https://www.getimranweb.com';
const SIGNATURE = `Imran Khan\nWebsites for local businesses\n${PORTFOLIO_URL}`;

const PROBLEM_STYLES = {
  'No website': 'bg-red-950 text-red-300',
  'Broken website': 'bg-orange-950 text-orange-300',
  'Social page only': 'bg-sky-950 text-sky-300',
  'Booking/ordering page only': 'bg-violet-950 text-violet-300',
};

function csvCell(value) {
  const text = String(value ?? '');
  return `"${text.replaceAll('"', '""')}"`;
}

function pitchOpening(lead, city) {
  const stars = lead.rating ? `${lead.rating}-star rating and ${lead.reviewCount} Google reviews` : 'Google listing';
  switch (lead.problem) {
    case 'Broken website':
      return `I was looking at ${lead.name} on Google Maps and saw your ${stars}. When I tapped the website link, though, it didn't load (${lead.problemDetail.toLowerCase()}). Customers who try it right now hit a dead end.`;
    case 'Social page only':
      return `I came across ${lead.name} on Google Maps and saw your ${stars}. Right now the website link goes to your social page, so people searching in ${city} don't get your hours, services, and a tap-to-call button in one place.`;
    case 'Booking/ordering page only':
      return `I came across ${lead.name} on Google Maps and saw your ${stars}. Your listing links straight to a booking/ordering page, so there's no page of your own that tells new customers who you are.`;
    default:
      return `I came across ${lead.name} on Google Maps and saw your ${stars}, but there's no website on your listing. People searching in ${city} can't see your services, prices, or photos before they call.`;
  }
}

function pitchIdeas(businessType) {
  const type = businessType.toLowerCase();
  if (/(salon|nail|hair|spa|barber|lash|brow)/.test(type)) {
    return 'For salons that usually means a service and price menu, photos of your work, and a Book Now button.';
  }
  if (/(contract|plumb|roof|electric|hvac|landscap|paint|remodel)/.test(type)) {
    return 'For trades that usually means before/after photos, your service area, and a quote request form.';
  }
  if (/(restaurant|cafe|coffee|bakery|pizza|grill|bar)/.test(type)) {
    return 'For restaurants that usually means your menu, hours, and a tap-to-call or order button that works on a phone.';
  }
  return 'That usually means your hours, services, photos, and a tap-to-call button that works on a phone.';
}

export default function Home() {
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [authError, setAuthError] = useState('');

  const [city, setCity] = useState('');
  const [state, setState] = useState('MN');
  const [businessType, setBusinessType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusLog, setStatusLog] = useState('');
  const [leadResults, setLeadResults] = useState([]);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    'x-app-password': password,
  });

  const handleAuth = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth', { method: 'POST', headers: authHeaders() });
    if (res.ok) {
      setUnlocked(true);
      setAuthError('');
    } else {
      setAuthError('Wrong password.');
    }
  };

  const handleLogout = () => {
    setUnlocked(false);
    setPassword('');
    setLeadResults([]);
    setStatusLog('');
  };

  const handleHuntLeads = async (e) => {
    e.preventDefault();
    if (!city || !businessType) return;

    setIsLoading(true);
    setLeadResults([]);
    setStatusLog('Searching Google Maps and checking each website…');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ city, state, businessType }),
      });
      const data = await response.json();

      if (!response.ok) {
        setStatusLog(`Search failed: ${data.error || response.statusText}`);
        return;
      }

      setLeadResults(data.leads);
      setStatusLog(`Found ${data.totalFound} businesses for “${data.searchQuery}”. ${data.leadsFound} have a website problem.`);
    } catch {
      setStatusLog('Search failed: could not reach the server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (leadResults.length === 0) return;
    const headers = ['Business', 'Problem', 'Details', 'Phone', 'Address', 'Website', 'Rating', 'Reviews', 'Google Maps', 'Status'];
    const rows = leadResults.map((l) =>
      [l.name, l.problem, l.problemDetail, l.phone, l.address, l.website, l.rating ?? '', l.reviewCount, l.mapsUrl, 'New'].map(csvCell).join(',')
    );
    const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Leads_${businessType}_${city}.csv`.replace(/\s+/g, '-');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const triggerEmailClient = (lead) => {
    const subject = encodeURIComponent(`Quick note about ${lead.name}'s website`);
    const body =
      `Hi ${lead.name} team,\n\n` +
      `${pitchOpening(lead, city)}\n\n` +
      `I build websites for local businesses here in Minnesota. ${pitchIdeas(businessType)} ` +
      `You can see a couple of shops I've built for at ${PORTFOLIO_URL}.\n\n` +
      `Would you be open to a 10-minute call this week?\n\n` +
      SIGNATURE;
    window.location.assign(`mailto:?subject=${subject}&body=${encodeURIComponent(body)}`);
  };

  if (!unlocked) {
    return (
      <main className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-2xl">
          <h1 className="text-3xl font-extrabold text-blue-400 mb-2 text-center">Lead Finder</h1>
          <p className="text-sm text-slate-400 mb-6 text-center">Local businesses with a missing or broken website</p>
          <form onSubmit={handleAuth} className="space-y-4">
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg text-sm transition-colors cursor-pointer">Unlock</button>
            {authError && <p className="text-xs text-red-400 text-center">{authError}</p>}
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center py-12 px-4">
      <div className="max-w-3xl w-full flex items-center justify-between border-b border-slate-800 pb-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-blue-400">Lead Finder</h1>
          <p className="text-xs text-slate-500">Live Google Maps data · website check on every result</p>
        </div>
        <button onClick={handleLogout} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer">Lock</button>
      </div>

      <div className="max-w-3xl w-full bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
        <form onSubmit={handleHuntLeads} className="grid grid-cols-1 md:grid-cols-[1fr_5rem_1fr] gap-4">
          <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="City (e.g., Waconia)" className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500" disabled={isLoading} />
          <input type="text" required value={state} onChange={(e) => setState(e.target.value)} placeholder="MN" maxLength={2} className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 uppercase focus:outline-none focus:border-blue-500" disabled={isLoading} />
          <input type="text" required value={businessType} onChange={(e) => setBusinessType(e.target.value)} placeholder="Business type (e.g., nail salon)" className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500" disabled={isLoading} />
          <button type="submit" disabled={isLoading || !city || !businessType} className="w-full md:col-span-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg text-sm transition-all cursor-pointer">
            {isLoading ? 'Searching…' : 'Find Businesses With Website Problems'}
          </button>
        </form>
        {statusLog && (
          <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-blue-300">
            {statusLog}
          </div>
        )}
      </div>

      {leadResults.length > 0 && (
        <div className="max-w-3xl w-full mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-emerald-400">Leads ({leadResults.length})</h2>
            <button onClick={handleExportCSV} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors cursor-pointer shadow-md">Export Spreadsheet (.CSV)</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leadResults.map((lead) => (
              <div key={lead.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-md flex flex-col justify-between gap-4">
                <div>
                  <span className={`inline-block font-mono uppercase text-[10px] font-bold tracking-wider px-2 py-1 rounded ${PROBLEM_STYLES[lead.problem] || 'bg-slate-700 text-slate-200'}`}>{lead.problem}</span>
                  <h3 className="text-lg font-black text-slate-100 mt-3">{lead.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{lead.problemDetail}</p>
                  <div className="text-xs text-amber-400 font-bold mt-2">
                    {lead.rating ? `★ ${lead.rating} · ${lead.reviewCount} reviews` : 'No reviews yet'}
                  </div>
                  <p className="text-xs text-slate-300 mt-2">{lead.phone || 'No phone listed'}</p>
                  <p className="text-xs text-slate-500 mt-1">{lead.address}</p>
                  <div className="flex gap-3 mt-2 text-xs">
                    {lead.mapsUrl && <a href={lead.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google Maps</a>}
                    {lead.website && <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Their link</a>}
                  </div>
                </div>
                <button onClick={() => triggerEmailClient(lead)} className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-4 rounded-lg cursor-pointer shadow">Open Email Pitch</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
