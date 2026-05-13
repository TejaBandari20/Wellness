import React, { useState, useEffect } from 'react';

const Icons = {
  Home: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Trends: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  Brain: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.97-3.06 2.5 2.5 0 0 1-2.51-4.58 2.5 2.5 0 0 1 1.4-4.44A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.97-3.06 2.5 2.5 0 0 0 2.51-4.58 2.5 2.5 0 0 0-1.4-4.44A2.5 2.5 0 0 0 14.5 2Z"/></svg>,
  Sparkle: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
};

export default function App() {
  const [view, setView] = useState('checkin'); // 'checkin', 'trends', 'memory'
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [note, setNote] = useState('');
  const [response, setResponse] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await fetch('http://localhost:8000/history');
      const data = await res.json();
      setHistory(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchHistory(); }, [view]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/submit-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood_score: parseInt(mood), energy_level: parseInt(energy), note }),
      });
      const data = await res.json();
      setResponse(data);
      fetchHistory();
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-['Inter'] text-slate-900 overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl">M</div>
          <span className="font-extrabold tracking-tighter text-2xl text-slate-800">Mindful</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <button onClick={() => setView('checkin')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${view === 'checkin' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400 hover:bg-slate-50'}`}>
            <Icons.Home /> Daily Check-in
          </button>
          <button onClick={() => setView('trends')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${view === 'trends' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400 hover:bg-slate-50'}`}>
            <Icons.Trends /> Wellness Trends
          </button>
          <button onClick={() => setView('memory')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${view === 'memory' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400 hover:bg-slate-50'}`}>
            <Icons.Brain /> AI Memory
          </button>
        </nav>

        <div className="p-4">
          <div className="bg-slate-900 rounded-2xl p-4 text-white">
            <p className="text-[10px] font-black text-slate-500 uppercase mb-1">AI Status</p>
            <p className="text-sm font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span> Gemini 2.0 Active
            </p>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-12">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            {view === 'checkin' && "Today's Reflection"}
            {view === 'trends' && "Wellness Analytics"}
            {view === 'memory' && "Semantic History"}
          </h2>
          <p className="text-slate-400 font-medium mt-1">
            {view === 'checkin' && "Log your vitals to receive AI coaching."}
            {view === 'trends' && "Visualizing your emotional trajectory over time."}
            {view === 'memory' && "Every thought, remembered and organized by AI."}
          </p>
        </header>

        {/* View Switcher Logic */}
        <div className="max-w-5xl mx-auto">
          {view === 'checkin' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Card */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-xs font-black text-slate-400 uppercase">Mood Intensity ({mood})</label>
                    <input type="range" min="1" max="10" value={mood} onChange={(e)=>setMood(e.target.value)} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none accent-indigo-600" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-black text-slate-400 uppercase">Energy Level ({energy})</label>
                    <input type="range" min="1" max="10" value={energy} onChange={(e)=>setEnergy(e.target.value)} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none accent-emerald-600" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-black text-slate-400 uppercase">Personal Journal</label>
                    <textarea 
                      value={note} 
                      onChange={(e)=>setNote(e.target.value)} 
                      className="w-full p-5 bg-slate-50 rounded-3xl min-h-[180px] border-none outline-none focus:ring-2 focus:ring-indigo-100 text-lg" 
                      placeholder="Be honest with yourself..."
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading || !note.trim()} 
                    className={`w-full py-5 rounded-3xl font-bold transition-all shadow-xl shadow-slate-200 ${
                      !note.trim() ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:scale-[1.02] active:scale-95'
                    }`}
                  >
                    {loading ? "Gemini is reflecting..." : "Publish Progress"}
                  </button>
                </form>
              </div>
              
              {/* AI Insight Pane */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
                {!response ? (
                  <div className="opacity-30 flex flex-col items-center">
                    <div className="p-6 bg-slate-50 rounded-full mb-4"><Icons.Sparkle /></div>
                    <p className="font-bold">Awaiting Input</p>
                  </div>
                ) : (
                  <div className="animate-in fade-in zoom-in-95 duration-500">
                    <div className="inline-flex p-3 bg-indigo-600 text-white rounded-2xl mb-6 shadow-lg shadow-indigo-100"><Icons.Sparkle /></div>
                    <p className="text-xl font-medium text-slate-700 italic leading-relaxed">"{response.trend_analysis}"</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {}
          {view === 'trends' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {history.slice(0, 3).map((log, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-4">{log.date}</p>
                  <div className="flex gap-2 items-end mb-4">
                    <div className="bg-indigo-600 w-3 rounded-full" style={{ height: `${log.mood * 10}px` }}></div>
                    <div className="bg-emerald-500 w-3 rounded-full" style={{ height: `${log.energy * 10}px` }}></div>
                  </div>
                  <p className="font-bold text-slate-800">Check-in Analysis</p>
                  <p className="text-sm text-slate-400 mt-2 line-clamp-2">{log.text}</p>
                </div>
              ))}
            </div>
          )}

          {}
          {view === 'memory' && (
            <div className="space-y-4">
              {history.map((log, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 flex justify-between items-center hover:border-indigo-200 transition-all cursor-default">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-400">{log.mood}</div>
                    <div>
                      <p className="font-bold text-slate-800">{log.text}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{log.date}</p>
                    </div>
                  </div>
                  <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${log.mood > 7 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {log.mood > 7 ? 'Positive' : 'Action Required'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}} />
    </div>
  );
}