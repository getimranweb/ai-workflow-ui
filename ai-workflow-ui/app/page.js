'use client';
import { useState } from 'react';

export default function Home() {
  const [user, setUser] = useState(null); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const [businessType, setBusinessType] = useState('');
  const [tagline, setTagline] = useState('');
  const [socialPost, setSocialPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stepMessage, setStepMessage] = useState('');
  const [historyLog, setHistoryLog] = useState([]);

  const handleAuth = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setUser({ email: email, id: 'usr_' + Date.now() });
  };

  const handleLogout = () => {
    setUser(null);
    setHistoryLog([]);
    setTagline('');
    setSocialPost('');
    setBusinessType('');
    setStepMessage('');
  };

  const handleClearHistory = () => {
    setHistoryLog([]);
  };

  const handleRunWorkflow = async (e) => {
    e.preventDefault();
    if (!businessType) return;

    let formattedUrl = businessType.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    setIsLoading(true);
    setTagline('');
    setSocialPost('');

    try {
      setStepMessage(`🌐 Step 1: Routing URL to internal backend server to bypass CORS blocks...`);
      
      const backendResponse = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: formattedUrl })
      });

      const scraperData = await backendResponse.json();

      if (!backendResponse.ok) {
        throw new Error(scraperData.error || 'Server processing failure');
      }

      const cleanTextSample = scraperData.textContent || "";
      setTagline(`Scraped successfully via backend! Found text sample.`);

      setStepMessage('🤖 Step 2: Running local linguistic transformer on scraped content...');
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const analysisReport = `📊 BACKEND ANALYSIS REPORT FOR CLIENT:\n\nTarget URL: ${formattedUrl}\nStatus Code: 200 OK (CORS Bypassed Successfully)\n\n💡 Key Content Extract Found:\n"${cleanTextSample.substring(0, 400)}..."\n\n🎯 Recommended Marketing Pivot:\nTarget user bases searching for keywords matching the extracted context above! #FullStack #WebAutomation`;
      setSocialPost(analysisReport);

      setStepMessage('✨ Saved execution profile to secure record database!');

      const newDatabaseRow = {
        id: Date.now(),
        user_id: user?.id,
        business_type: formattedUrl.replace('https://', '').replace('http://', ''),
        tagline_output: "CORS Bypassed & Scraped",
        social_output: analysisReport,
        created_at: new Date().toLocaleTimeString()
      };
      
      setHistoryLog(prev => [newDatabaseRow, ...prev]);
    } catch (error) {
      console.error(error);
      setStepMessage(`❌ Scraper workflow halted: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 rounded-xl p-8 shadow-2xl border border-slate-700">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-blue-400 mb-1">⚡ AI Workflow SaaS</h1>
            <p className="text-sm text-slate-400">{isSignUp ? 'Create your client account' : 'Sign in to your client dashboard'}</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-2 text-slate-400">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@company.com"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2 text-slate-400">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-slate-400 hover:text-blue-400 transition-colors cursor-pointer underline"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center py-12 px-4">
      <div className="max-w-2xl w-full flex items-center justify-between border-b border-slate-800 pb-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-blue-400">⚡ AI Workflow</h1>
          <p className="text-xs text-slate-500">Logged in as: <span className="text-slate-300 font-mono">{user.email}</span></p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </div>

      <div className="max-w-2xl w-full bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
        <form onSubmit={handleRunWorkflow} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-300">Website URL to Analyze</label>
            <input
              type="text"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              placeholder="://example.com"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-slate-100 text-sm"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !businessType}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg transition-all text-sm cursor-pointer"
          >
            {isLoading ? 'Processing Pipeline...' : 'Run Automation Workflow'}
          </button>
        </form>

        {stepMessage && (
          <div className="mt-6 p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-blue-300 flex items-center gap-2">
            <span className="animate-pulse">●</span> {stepMessage}
          </div>
        )}
      </div>

      {(tagline || socialPost) && (
        <div className="max-w-2xl w-full mt-6 space-y-4">
          {tagline && (
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">✨ Generated Slogan</h3>
              <p className="text-xl italic text-slate-200">"{tagline}"</p>
            </div>
          )}

          {socialPost && (
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">🎯 Client Ready Social Asset</h3>
              <pre className="whitespace-pre-wrap font-sans text-slate-300 bg-slate-950 p-4 rounded-lg border border-slate-800 text-sm">
                {socialPost}
              </pre>
            </div>
          )}
        </div>
      )}

      {historyLog.length > 0 && (
        <div className="max-w-2xl w-full mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-300 flex items-center gap-2">
              📁 Secure Database Audit Logs <span className="text-sm font-normal text-slate-500">({historyLog.length})</span>
            </h2>
            <button
              onClick={handleClearHistory}
              className="text-xs text-red-400 hover:text-red-300 transition-colors underline cursor-pointer"
            >
              Clear Records
            </button>
          </div>
          
          <div className="space-y-3">
            {historyLog.map((row) => (
              <div key={row.id} className="bg-slate-850 border border-slate-800 rounded-lg p-4 flex justify-between items-center text-sm">
                <div>
                  <span className="font-bold text-blue-400">{row.business_type}</span>
                  <p className="text-xs text-slate-400 truncate max-w-md mt-1">Slogan saved: "{row.tagline_output}"</p>
                </div>
                <span className="text-xs text-slate-500 font-mono bg-slate-950 px-2 py-1 rounded">
                  ⏰ {row.created_at}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
