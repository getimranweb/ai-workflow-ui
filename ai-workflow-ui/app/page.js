'use client';
import { useState } from 'react';

export default function Home() {
  const [user, setUser] = useState(null); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // --- LEAD HUNTER STATE CONTROLS ---
  const [city, setCity] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusLog, setStatusLog] = useState('');
  const [leadResults, setLeadResults] = useState([]);

  const handleAuth = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setUser({ email: email, id: 'usr_' + Date.now() });
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
    setStatusLog('📡 Connecting to Google Places API mapping nodes...');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatusLog(`🔍 Scanning records for "${businessType}" inside "${city}"...`);
      
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, businessType })
      });

      const data = await response.json();
      
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatusLog(`🎯 Found ${data.totalFound} matching businesses. Filtering out accounts with active domains...`);
      
      await new Promise((resolve) => setTimeout(resolve, 800));
      setLeadResults(data.leads);
      setStatusLog(`⚡ Pipeline complete! Isolated ${data.leadsGenerated} high-value local targets.`);

    } catch (error) {
      setStatusLog('❌ Lead hunting workflow interrupted.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- NEW WORKFLOW NODE: AUTOMATED SPREADSHEET EXPORTER ---
  const handleExportCSV = () => {
    if (leadResults.length === 0) return;

    // 1. Define columns for spreadsheet headers
    const headers = ['Business Name', 'Phone Number', 'Google Rating', 'Website Status'];
    
    // 2. Loop through isolated data elements and build clean text rows
    const csvRows = [
      headers.join(','), // Drop the columns into line 1
      ...leadResults.map(lead => [
        `"${lead.name.replace(/"/g, '""')}"`, // Wrap in quotes to protect punctuation symbols
        `"${lead.phone}"`,
        `"${lead.rating}"`,
        `"No Website Linked"`
      ].join(','))
    ];

    // 3. Compile rows into a raw text blob file format
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // 4. Trigger an invisible background download link right inside browser
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Leads_${businessType.trim()}_${city.trim()}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 rounded-xl p-8 shadow-2xl border border-slate-700">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-blue-400 mb-1">⚡ LeadHunter AI</h1>
            <p className="text-sm text-slate-400">Locate high-value local business client contracts</p>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-2 text-slate-400">Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="developer@agency.com" className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2 text-slate-400">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg text-sm transition-colors cursor-pointer">Sign In to Engine</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center py-12 px-4">
      {/* Top Navbar Header */}
      <div className="max-w-3xl w-full flex items-center justify-between border-b border-slate-800 pb-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-blue-400">⚡ LeadHunter Framework</h1>
          <p className="text-xs text-slate-500">Pipeline operator: <span className="text-slate-300 font-mono">{user.email}</span></p>
        </div>
        <button onClick={handleLogout} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer">Disconnect Session</button>
      </div>

      {/* Input Box Card Panel Form */}
      <div className="max-w-3xl w-full bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
        <form onSubmit={handleHuntLeads} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-300">Target Region (City)</label>
            <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g., St. Cloud, Minneapolis" className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-blue-500" disabled={isLoading} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-300">Business Sector Niche</label>
            <input type="text" required value={businessType} onChange={(e) => setBusinessType(e.target.value)} placeholder="e.g., contractor, salon" className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-blue-500" disabled={isLoading} />
          </div>
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

      {/* Target Output Canvas */}
      {leadResults.length > 0 && (
        <div className="max-w-3xl w-full mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
              🎯 Isolated Target Client Opportunities
            </h2>
            {/* The Download Spreadsheet Button */}
            <button
              onClick={handleExportCSV}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              📊 Export Clean Spreadsheet (.CSV)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leadResults.map((lead, idx) => (
              <div key={idx} className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-md flex flex-col justify-between space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-red-950 text-red-400 font-mono uppercase text-[9px] font-black tracking-widest px-3 py-1 rounded-bl border-l border-b border-slate-700">
                  ⚠️ No Domain Found
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-100">{lead.name}</h3>
                  <div className="text-xs text-amber-400 font-bold mt-1">⭐ {lead.rating} Google Rating</div>
                  <p className="text-xs text-slate-400 mt-3 font-mono">Phone: <span className="text-slate-200">{lead.phone}</span></p>
                </div>
                <div className="bg-slate-950 border border-slate-900 rounded-lg p-3 text-xs text-slate-300 font-serif leading-relaxed italic">
                  "Hey, I noticed your amazing {lead.rating} rating on Google maps, but you don't have a mobile landing page linked for customer booking..."
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
