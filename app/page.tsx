'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, LayoutDashboard, Database, CheckSquare, 
  Settings, Activity, MessageSquare, ShieldCheck,
  TrendingUp, Wallet, AlertCircle, ExternalLink, Send, Plus
} from 'lucide-react';

type Tab = 'dashboard' | 'staff' | 'tasks' | 'database' | 'live' | 'knowledge';

export default function BazzarFactory() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [screen, setScreen] = useState<string | null>(null);

  // Fetch Data & Stream
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, invRes] = await Promise.all([
          fetch('/api/tasks'),
          fetch('/api/inventory')
        ]);
        setTasks(await tasksRes.json());
        setInventory(await invRes.json());
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    const fetchStream = async () => {
      if (selectedAgent) {
        try {
          const res = await fetch(`/api/stream?id=${selectedAgent}`);
          const data = await res.json();
          if (data.screenshot) setScreen(data.screenshot);
        } catch (err) {
          console.error("Stream error:", err);
        }
      }
    };

    fetchData();
    const interval = setInterval(() => {
      fetchData();
      fetchStream();
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [selectedAgent]);

  const addTask = async (label: string) => {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label, status: 'Pending' })
    });
    const newTask = await res.json();
    setTasks([...tasks, newTask]);
  };

  const updateTaskStatus = async (id: string, status: string, comment?: string) => {
    await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, comment })
    });
    const updatedTasks = tasks.map(t => {
        if (t.id === id) {
            return { ...t, status, comments: comment ? [...(t.comments || []), comment] : t.comments };
        }
        return t;
    });
    setTasks(updatedTasks);
  };

  return (
    <div className="flex bg-slate-950 min-h-screen font-sans antialiased text-slate-200 text-left">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 h-screen text-white p-6 fixed border-r border-slate-800 top-0 left-0 z-50 text-left">
        <div className="flex items-center space-x-2 mb-10 text-left">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center font-bold">B</div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase">Bazzar Factory</h1>
        </div>
        
        <nav className="space-y-1">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<Users size={20} />} label="AI Staff" active={activeTab === 'staff'} onClick={() => setActiveTab('staff')} />
          <NavItem icon={<CheckSquare size={20} />} label="Task Board" active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} />
          <NavItem icon={<Database size={20} />} label="Inventory" active={activeTab === 'database'} onClick={() => setActiveTab('database')} />
          <NavItem icon={<ShieldCheck size={20} />} label="Knowledge Base" active={activeTab === 'knowledge'} onClick={() => setActiveTab('knowledge')} />
          <NavItem icon={<Activity size={20} />} label="System Logs" active={activeTab === 'live'} onClick={() => setActiveTab('live')} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8 w-full text-left">
        {activeTab === 'dashboard' && <DashboardView tasks={tasks} />}
        {activeTab === 'tasks' && <TasksView tasks={tasks} onAddTask={addTask} onUpdateStatus={updateTaskStatus} />}
        {activeTab === 'database' && <DatabaseView inventory={inventory} />}
        {activeTab === 'knowledge' && <KnowledgeView />}
        {activeTab === 'staff' && <StaffView selectedAgentId={selectedAgent} onBack={() => setSelectedAgent(null)} onSelectAgent={setSelectedAgent} screen={screen} />}
        {activeTab === 'live' && <LogsView />}
      </main>
    </div>
  );
}

// Components
function NavItem({ icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-orange-600/10 text-orange-500 border border-orange-600/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
      <span>{icon}</span>
      <span className="font-semibold text-sm text-left">{label}</span>
    </button>
  );
}

function DashboardView({ tasks }: any) {
  return (
    <div className="animate-in fade-in duration-500 text-left">
      <header className="flex justify-between items-end mb-10 text-left">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Command Center</h2>
          <p className="text-slate-500">Master Control for BAZZAR AI Operations.</p>
        </div>
        <div className="flex space-x-3">
           <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Avito Balance</span>
              <span className="text-2xl font-black text-white">11.00 ₽</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 text-left">
           <h3 className="font-bold mb-4 text-orange-500 uppercase text-sm tracking-widest text-left">Active Tasks</h3>
           <div className="space-y-3 text-left">
              {tasks.filter((t:any) => t.status !== 'Completed').slice(-4).reverse().map((t: any) => (
                <div key={t.id} className="flex justify-between items-center p-3 bg-slate-900 rounded-xl border border-slate-800 text-left">
                   <span className="text-sm font-medium text-left">{t.label}</span>
                   <span className="text-[10px] font-black uppercase text-orange-400">{t.status}</span>
                </div>
              ))}
              {tasks.length === 0 && <p className="text-slate-600 italic text-sm">No tasks assigned yet.</p>}
           </div>
        </div>
      </div>
    </div>
  );
}

function TasksView({ tasks, onAddTask, onUpdateStatus }: any) {
  const [input, setInput] = useState('');

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500 text-left">
      <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter text-white">Task Assignment</h2>
      
      <div className="flex space-x-2 mb-8 text-left">
        <input 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter new task for Jarvis..." 
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 text-white text-left"
        />
        <button 
          onClick={() => { if(input) { onAddTask(input); setInput(''); } }}
          className="bg-orange-600 hover:bg-orange-500 px-6 py-3 rounded-xl font-bold flex items-center space-x-2 text-white"
        >
          <Plus size={18} />
          <span>Assign Task</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 text-left">
        {tasks.slice().reverse().map((t: any) => (
          <div key={t.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col group hover:border-slate-600 transition-all text-left">
            <div className="flex justify-between items-center w-full text-left">
              <div className="text-left">
                <p className="font-bold text-slate-200 text-left">{t.label}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase text-left">{new Date(t.date).toLocaleString()}</p>
              </div>
              <div className="flex space-x-2 text-left">
                {t.status === 'Pending' && (
                  <button onClick={() => onUpdateStatus(t.id, 'Running')} className="px-3 py-1 bg-orange-600/10 text-orange-500 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all text-left">Start</button>
                )}
                {t.status === 'Running' && (
                  <button onClick={() => onUpdateStatus(t.id, 'Completed')} className="px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all text-left">Complete</button>
                )}
                <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest ${t.status === 'Completed' ? 'bg-green-500/20 text-green-500' : t.status === 'Running' ? 'bg-orange-500/20 text-orange-500' : 'bg-slate-800 text-slate-500'}`}>
                  {t.status}
                </span>
              </div>
            </div>
            
            {t.comments && t.comments.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-800 space-y-2 text-left">
                {t.comments.map((c: string, i: number) => (
                  <p key={i} className="text-xs text-slate-400 font-mono italic text-left">
                    <span className="text-orange-900 mr-2">/ jarvis:</span> {c}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function DatabaseView({ inventory }: any) {
  return (
    <div className="animate-in fade-in duration-500 text-left text-left">
      <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter text-white">Inventory Sync</h2>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl text-left">
        <table className="w-full text-left border-collapse text-left">
          <thead>
            <tr className="bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800 text-left">
              <th className="p-4 text-left">Item Name</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item: any) => (
              <tr key={item.id} className="border-b border-slate-800/50 hover:bg-slate-800/10 transition-colors text-left">
                <td className="p-4 font-bold text-slate-300 text-left">{item.name}</td>
                <td className="p-4 text-slate-500 text-xs font-mono text-left">{item.type}</td>
                <td className="p-4 text-orange-500 font-black text-left">{item.price}</td>
                <td className="p-4 italic text-xs text-slate-600 text-left">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KnowledgeView() {
    return (
        <div className="animate-in fade-in duration-500 text-left text-left">
            <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter text-white">Project Knowledge</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-left">
                    <h3 className="font-bold text-orange-500 mb-4 flex items-center uppercase text-sm tracking-widest text-left"><Wallet className="mr-2" size={18}/> Payment Requisites</h3>
                    <p className="font-mono text-sm text-slate-300 bg-black p-4 rounded-xl border border-slate-800 text-left">
                        Card: 2200 7006 0562 6794<br/>
                        Bank: T-Bank<br/>
                        Owner: Artem K.
                    </p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-left">
                    <h3 className="font-bold text-orange-500 mb-4 flex items-center uppercase text-sm tracking-widest text-left"><ShieldCheck className="mr-2" size={18}/> 2FA Protocols</h3>
                    <ul className="space-y-2 text-sm text-slate-400 font-mono text-left">
                        <li>- PS: artyomkoshelev.04@gmail.com (Ask CEO for code)</li>
                        <li>- Xbox: +79065612544 (Ask CEO for code)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

function StaffView({ selectedAgentId, onBack, onSelectAgent, screen }: any) {
  const agents = [
    { id: 'jarvis', name: 'Jarvis', role: 'Lead Manager', status: 'Online' },
    { id: 'support', name: 'Support-Avito', role: 'Sales Bot', status: 'Online' },
    { id: 'smm', name: 'SMM-Bot', role: 'Marketing', status: 'Idle' }
  ];

  if (!selectedAgentId) {
    return (
      <div className="animate-in fade-in duration-300 text-left text-left">
        <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter text-white text-left">AI Personnel</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {agents.map(a => (
            <div key={a.id} onClick={() => onSelectAgent(a.id)} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-orange-500 transition-all cursor-pointer group text-left text-left">
               <div className="w-12 h-12 bg-slate-800 rounded-full mb-4 flex items-center justify-center text-orange-500 font-bold group-hover:scale-110 transition-transform text-left text-left">{a.name[0]}</div>
               <h3 className="text-xl font-bold text-white text-left text-left">{a.name}</h3>
               <p className="text-slate-500 text-sm text-left text-left">{a.role}</p>
               <div className="mt-4 flex items-center space-x-2 text-left text-left">
                 <div className={`w-2 h-2 rounded-full ${a.status === 'Online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-slate-700'}`}></div>
                 <span className="text-[10px] font-bold uppercase text-slate-400 text-left text-left">{a.status}</span>
               </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-right-4 duration-300 text-left text-left">
      <button onClick={onBack} className="text-slate-500 hover:text-white mb-6 uppercase text-xs font-black text-left text-left">← Return to Staff</button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left text-left">
        <div className="lg:col-span-1 space-y-6 text-left text-left text-left">
           <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-left text-left text-left">
              <h2 className="text-2xl font-black mb-2 uppercase text-white text-left text-left text-left">{selectedAgentId}</h2>
              <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-[10px] font-black uppercase tracking-widest text-left text-left text-left">Connected</span>
           </div>
        </div>

        <div className="lg:col-span-2 space-y-6 text-left text-left">
           <div className="bg-black border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative text-left">
              <div className="absolute top-4 left-4 z-10 bg-red-600 px-2 py-0.5 rounded flex items-center space-x-1.5 shadow-lg">
                 <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                 <span className="text-[10px] font-black text-white uppercase tracking-tighter">Live Transmission</span>
              </div>
              <div className="aspect-video bg-slate-900 flex items-center justify-center text-left">
                 {screen ? (
                    <img src={screen} alt="Agent Screen" className="w-full h-full object-contain" />
                 ) : (
                    <div className="text-center text-left text-left text-left">
                       <Activity size={32} className="text-slate-700 mx-auto mb-2 animate-spin text-left text-left text-left" />
                       <p className="text-slate-500 font-mono text-xs uppercase tracking-widest text-left text-left text-left text-left">Handshaking Gateway...</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function LogsView() {
  return (
    <div className="bg-black border border-slate-800 rounded-2xl p-6 h-[80vh] font-mono text-[11px] text-slate-500 overflow-y-auto text-left text-left">
       <p className="text-green-500">[SYSTEM] Connection secured. All agents reporting.</p>
       <p>[INFO] BAZZAR Factory Portal v1.3.0 active.</p>
       <p>[INFO] Custom Redis Host: Connected.</p>
       <p className="text-orange-500">[SYNC] Transferring data from Notion to Factory DB...</p>
    </div>
  );
}
