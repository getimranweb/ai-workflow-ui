'use client';
import { useState } from 'react';

export default function Home() {
  const [user, setUser] = useState(null); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [city, setCity] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusLog, setStatusLog] = useState('');
  const [leadResults, setLeadResults] = useState([]);

  const handleAuth = (e) => {
    e.preventDefault();
    if (email && password) setUser({ email, id: 'usr_' + Date.now() });
  };

  const handleLogout = () => {
    setUser(null);
    setLeadResults([]);
    setCity('');
    setBusinessType('');
    setStatusLog('');
  };

  const handleHuntLeads = async (e) => {
    e.preventDefault();
    if (!city || !businessType) return;

    setIsLoading(true);
    setLeadResults([]);
    setStatusLog('📡 Connecting to live data engines...');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, businessType })
      });
      const data = await response.json();
      setLeadResults(data.leads || []);
      setStatusLog(`⚡ Isolated ${data.leadsGenerated || 0} high-value targets.`);
    } catch (error) {
      setStatusLog('❌ Lead hunting workflow interrupted.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (leadResults.length === 0) return;
    const headers = ['Business Name', 'Phone Number', 'Google Rating'];
    const csvRows = [
      headers.join(','),
      ...leadResults.map(l => [`"${l.name}"`, `"${l.phone}"`, `"${l.rating}"`].join(','))
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Leads_${businessType}_${city}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerEmailClient = (lead) => {
    const isSalon = businessType.toLowerCase().includes('salon') || businessType.toLowerCase().includes('hair') || businessType.toLowerCase().includes('nail');
    const isContractor = businessType.toLowerCase().includes('contractor') || businessType.toLowerCase().includes('plumb') || businessType.toLowerCase().includes('roof');

    let body = '';
    const subject = encodeURIComponent(`Website & Booking Proposal for ${lead.name}`);

    if (isSalon) {
      body = `Hi Team at ${lead.name},\n\nI noticed your great ${lead.rating}-star rating on Google Maps here in ${city}! Your clients love your work, but you don't have a website mobile page linked to your profile.\n\nIn 2026, salon clients look for 3 things:\n1. Photo Lookbooks showing your styling.\n2. Live Booking Calendars to schedule appointments.\n3. Clean Service Price Menus.\n\nI design modern mobile sites for local salons to secure these bookings. I would love to build a completely free visual layout draft mockup for you to review. Let me know if you are open to taking a quick look!\n\nBest regards,\nImran\nFull-Stack Developer`;
    } else if (isContractor) {
      body = `Hi Team at ${lead.name},\n\nI noticed your strong ${lead.rating}-star rating on Google Maps in ${city}. You have a great local trade reputation, but you are currently missing a primary business website to show off your projects.\n\nFor local trades, a custom website builds buyer trust by adding:\n1. Before/After Project Work Galleries.\n2. An Instant Quote Request Form allowing clients to submit job photos.\n3. Streaming Google Review Stars.\n\nI build fast, professional websites for contractors to secure steady jobs. I'd love to put together a basic visual layout plan for you completely free. Let me know if you want to take a look!\n\nBest regards,\nImran\nFull-Stack Developer`;
    } else {
      body = `Hi Team at ${lead.name},\n\nI noticed your business has a great ${lead.rating}-star review rating on Google Maps here in ${city}, but you don't have a website link active on your profile.\n\nI build clean landing pages that capture client attention and make it easy for new customers to buy, book, or call you directly from search results.\n\nI would love to put together a basic custom visual mockup plan for your business completely free. Let me know if you would be open to reviewing it!\n\nBest regards,\nImran\nFull-Stack Developer`;
    }

    window.location.href = `mailto:?subject=${subject}&body=${encodeURIComponent(body)}`;
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-2xl">
          <h1 className="text-3xl font-extrabold text-blue-400 mb-2 text-center">⚡ LeadHunter AI</h1>
          <p className="text-sm text-slate-400 mb-6 text-center">Locate local business client contracts</p>
          <form onSubmit={handleAuth} className="space-y-4">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="developer@agency.com" className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg text-sm transition-colors cursor-pointer">Sign In to Dashboard</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center py-12 px-4">
      <div className="max-w-3xl w-full flex items-center justify-between border-b border-slate-800 pb-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-blue-400">⚡ LeadHunter Framework</h1>
          <p className="text-xs text-slate-500">Operator: <span className="text-slate-300 font-mono">{user.email}</span></p>
        </div>
        <button onClick={handleLogout} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer">Sign Out</button>
      </div>

      <div className="max-w-3xl w-full bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
        <form onSubmit={handleHuntLeads} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="City (e.g., Waconia)" className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500" disabled={isLoading} />
          <input type="text" required value={businessType} onChange={(e) => setBusinessType(e.target.value)} placeholder="Niche (e.g., salon, contractor)" className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500" disabled={isLoading} />
          <button type="submit" disabled={isLoading || !city || !businessType} className="w-full md:col-span-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg text-sm transition-all cursor-pointer">
            {isLoading ? 'Scanning Mapping Registries...' : 'Scrape & Isolate Website-Less Leads'}
          </button>
        </form>
        {statusLog && (
          <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-blue-300 flex items-center gap-2">
            <span className="animate-pulse">●</span> {statusLog}
          </div>
        )}
      </div>

      {leadResults && leadResults.length > 0 && (
        <div className="max-w-3xl w-full mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-emerald-400">🎯 Isolated Client Opportunities</h2>
            <button onClick={handleExportCSV} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors cursor-pointer shadow-md">📊 Export Spreadsheet (.CSV)</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leadResults.map((lead, idx) => (
              <div key={idx} className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-md flex flex-col justify-between space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-red-950 text-red-400 font-mono uppercase text-[9px] font-black tracking-widest px-3 py-1 rounded-bl border border-slate-700">ALERT: Open Slot</div>
                <div>
                  <h3 className="text-lg font-black text-slate-100">{lead.name}</h3>
                  <div className="text-xs text-amber-400 font-bold mt-1">⭐ {lead.rating} Google Rating</div>
                  <p className="text-xs text-slate-400 mt-3 font-mono">Phone: <span className="text-slate-200">{lead.phone}</span></p>
                </div>
                <button onClick={() => triggerEmailClient(lead)} className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-4 rounded-lg text-center cursor-pointer shadow mt-4">✉️ Open Custom Email Pitch</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
