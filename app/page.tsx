'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, LayoutDashboard, Database, CheckSquare, 
  Settings, Activity, MessageSquare, ShieldCheck,
  TrendingUp, Wallet, AlertCircle, ExternalLink
} from 'lucide-react';

// Types
type Tab = 'dashboard' | 'staff' | 'tasks' | 'database' | 'live';

export default function BazzarFactory() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  return (
    <div className="flex bg-slate-950 min-h-screen font-sans antialiased text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 h-screen text-white p-6 fixed border-r border-slate-800">
        <div className="flex items-center space-x-2 mb-10">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center font-bold">B</div>
          <h1 className="text-xl font-bold tracking-tight text-white">BAZZAR FACTORY</h1>
        </div>
        
        <nav className="space-y-1">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <NavItem 
            icon={<Users size={20} />} 
            label="AI Staff" 
            active={activeTab === 'staff'} 
            onClick={() => setActiveTab('staff')} 
          />
          <NavItem 
            icon={<CheckSquare size={20} />} 
            label="Task Board" 
            active={activeTab === 'tasks'} 
            onClick={() => setActiveTab('tasks')} 
          />
          <NavItem 
            icon={<Database size={20} />} 
            label="Inventory DB" 
            active={activeTab === 'database'} 
            onClick={() => setActiveTab('database')} 
          />
          <NavItem 
            icon={<Activity size={20} />} 
            label="System Logs" 
            active={activeTab === 'live'} 
            onClick={() => setActiveTab('live')} 
          />
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
             <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-slate-500 uppercase tracking-widest font-bold">System Status</span>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
             </div>
             <p className="text-[10px] text-slate-400 font-mono">Gateway: Connected</p>
             <p className="text-[10px] text-slate-400 font-mono">Agents: 3 Active</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8 w-full">
        {activeTab === 'dashboard' && <DashboardView onSelectAgent={(id) => { setSelectedAgent(id); setActiveTab('staff'); }} />}
        {activeTab === 'staff' && <StaffView selectedAgentId={selectedAgent} onBack={() => setSelectedAgent(null)} />}
        {activeTab === 'database' && <DatabaseView />}
        {activeTab === 'tasks' && <TasksView />}
        {activeTab === 'live' && <LogsView />}
      </main>
    </div>
  );
}

// Components
function NavItem({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        active 
          ? 'bg-orange-600/10 text-orange-500 border border-orange-600/20' 
          : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
      }`}
    >
      <span className={active ? 'text-orange-500' : ''}>{icon}</span>
      <span className="font-semibold text-sm">{label}</span>
    </button>
  );
}

function DashboardView({ onSelectAgent }: { onSelectAgent: (id: string) => void }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">COMMAND CENTER</h2>
          <p className="text-slate-500 mt-1">Real-time performance monitoring for BAZZAR project.</p>
        </div>
        <div className="flex space-x-3">
           <StatCard icon={<Wallet size={16} />} label="Avito Balance" value="11.00 ₽" sub="Critical" alert />
           <StatCard icon={<TrendingUp size={16} />} label="Net Profit (24h)" value="+1,400 ₽" sub="Optimal" />
        </div>
      </header>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-400 uppercase tracking-widest flex items-center">
            <Users className="mr-2" size={18} />
            Live AI Agents
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AgentSummaryCard 
            id="jarvis"
            name="Jarvis" 
            role="Factory Manager" 
            status="Online" 
            task="Synchronizing database and coordinating sub-agents..." 
            onClick={() => onSelectAgent('jarvis')}
          />
          <AgentSummaryCard 
            id="support"
            name="Support-Avito" 
            role="Sales Assistant" 
            status="Online" 
            task="Monitoring incoming messages. Cooldown: 12m." 
            onClick={() => onSelectAgent('support')}
          />
          <AgentSummaryCard 
            id="smm"
            name="SMM-Bot" 
            role="Content Creator" 
            status="Idle" 
            task="Awaiting new product data for Telegram channel..." 
            onClick={() => onSelectAgent('smm')}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
          <h4 className="font-bold mb-4 flex items-center text-slate-300">
            <CheckSquare className="mr-2 text-orange-500" size={18} />
            Active Roadmap
          </h4>
          <div className="space-y-4">
             <TaskItem label="Setup BAZZAR AI Factory Portal" status="Completed" date="Today" />
             <TaskItem label="Automate FaceApp Pro delivery on Avito" status="Running" date="In Progress" />
             <TaskItem label="Sync local inventory with Notion DB" status="Running" date="85%" />
             <TaskItem label="Enable PlayStation Games listings" status="Pending" date="Queued" />
          </div>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <Database size={100} />
           </div>
           <h4 className="font-bold mb-4 flex items-center text-slate-300">
            <Activity className="mr-2 text-orange-500" size={18} />
            Recent Activity Feed
          </h4>
          <div className="space-y-2 font-mono text-[11px] text-slate-500">
             <p><span className="text-orange-900">[19:12]</span> Jarvis: Deployed Factory v1.0.0 to Vercel.</p>
             <p><span className="text-orange-900">[18:45]</span> Support-Avito: Received message from 'Arina'.</p>
             <p><span className="text-orange-900">[18:46]</span> Support-Avito: Sent FaceApp Pro credentials.</p>
             <p><span className="text-green-900">[18:30]</span> System: Avito balance updated +500₽ (User Deposit).</p>
             <p><span className="text-orange-900">[17:15]</span> Jarvis: Initialized Inventory Database in Notion.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StaffView({ selectedAgentId, onBack }: { selectedAgentId: string | null, onBack: () => void }) {
  const [msg, setMsg] = useState('');
  
  if (!selectedAgentId) {
    return (
      <div className="animate-in fade-in duration-300">
        <h2 className="text-3xl font-black mb-8">AI STAFF DIRECTORY</h2>
        <p className="text-slate-400 mb-8">Select an agent to view their live screen, chat history, and assign tasks.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
           {['Jarvis', 'Support-Avito', 'SMM-Bot'].map(name => (
             <div key={name} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-orange-500 transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-slate-800 rounded-full mb-4 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform font-bold">{name[0]}</div>
                <h3 className="text-xl font-bold">{name}</h3>
                <p className="text-slate-500 text-sm mb-4">Click to open control panel</p>
                <button className="text-orange-500 text-xs font-bold uppercase tracking-widest flex items-center">Open Portal <ExternalLink size={12} className="ml-1"/></button>
             </div>
           ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in slide-in-from-right-4 duration-300">
      <button onClick={onBack} className="text-slate-500 hover:text-white mb-6 flex items-center text-sm font-bold uppercase tracking-wider">
        ← Back to Staff list
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Info & Tasks */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h2 className="text-2xl font-black mb-2 uppercase">{selectedAgentId === 'jarvis' ? 'Jarvis' : 'Support-Avito'}</h2>
              <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-[10px] font-black uppercase tracking-widest">Active & Online</span>
              <div className="mt-6 space-y-4">
                 <div className="text-sm">
                    <span className="text-slate-500 block mb-1 uppercase text-[10px] font-bold">Current Objective</span>
                    <p className="text-slate-200 italic font-mono text-xs">"Automating BAZZAR Factory data flow and providing real-time CEO visibility."</p>
                 </div>
                 <div className="text-sm">
                    <span className="text-slate-500 block mb-1 uppercase text-[10px] font-bold">Memory Health</span>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full">
                       <div className="bg-orange-500 w-[72%] h-full rounded-full"></div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h3 className="font-bold mb-4 uppercase text-xs tracking-widest text-slate-500">Agent Task Board</h3>
              <div className="space-y-2">
                 <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
                    <span className="text-xs">Update Inventory Prices</span>
                    <span className="text-[9px] bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded">DONE</span>
                 </div>
                 <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
                    <span className="text-xs">Publish Mafia Trilogy</span>
                    <span className="text-[9px] bg-orange-500/20 text-orange-500 px-1.5 py-0.5 rounded">NEXT</span>
                 </div>
              </div>
              <button className="w-full mt-4 py-2 border-2 border-dashed border-slate-800 rounded-xl text-slate-500 text-xs hover:border-orange-500 hover:text-orange-500 transition-all font-bold uppercase tracking-wider">
                + Add Task to Queue
              </button>
           </div>
        </div>

        {/* Center: Live View */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-black border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative group">
              <div className="absolute top-4 left-4 z-10 bg-red-600 px-2 py-0.5 rounded flex items-center space-x-1.5 shadow-lg">
                 <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                 <span className="text-[10px] font-black text-white uppercase tracking-tighter">Live Stream</span>
              </div>
              <div className="aspect-video bg-slate-800 flex items-center justify-center relative">
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                 {/* Placeholder for live screenshot */}
                 <div className="text-center p-10">
                    <Activity size={48} className="text-slate-700 mx-auto mb-4 animate-spin duration-[4000ms]" />
                    <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">Awaiting Video Link...</p>
                    <p className="text-[10px] text-slate-600 mt-2">OpenClaw Browser Relay Active</p>
                 </div>
              </div>
           </div>

           {/* Chat Interaction */}
           <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-64 overflow-hidden">
              <div className="p-3 border-b border-slate-800 bg-slate-800/30 flex justify-between items-center">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Secure Direct Link</span>
                 <span className="text-[9px] text-green-500 font-mono">Encrypted 256-bit</span>
              </div>
              <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-3">
                 <div className="text-orange-500">{"<"} Jarvis: Welcome to the Factory, Sir. How can I assist you with the BAZZAR operations today?</div>
                 <div className="text-slate-400">{"<"} Jarvis: Status: Inventory synced. Avito monitor: Active.</div>
              </div>
              <div className="p-3 bg-slate-950 border-t border-slate-800 flex space-x-2">
                 <input 
                  type="text" 
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Enter command or task for the agent..." 
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-orange-600 transition-colors"
                 />
                 <button className="bg-orange-600 px-4 py-2 rounded-lg text-white font-bold text-xs uppercase tracking-widest hover:bg-orange-500 transition-colors">
                    Send
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function DatabaseView() {
  const items = [
    { name: 'FaceApp Pro', price: '350₽', type: 'Sub', status: 'Active' },
    { name: 'Minecraft (iOS)', price: '1000₽', type: 'Game', status: 'Active' },
    { name: 'Mafia Trilogy', price: '1190₽', type: 'PS4/5', status: 'Draft' },
    { name: 'It Takes Two', price: '690₽', type: 'PS4/5', status: 'Draft' },
    { name: 'TG Premium', price: 'Formula', type: 'TG', status: 'Active' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter">Bazzar Inventory</h2>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800">
              <th className="p-4">Item Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Market Price</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {items.map(item => (
              <tr key={item.name} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                <td className="p-4 font-bold text-slate-200">{item.name}</td>
                <td className="p-4 text-slate-500 font-mono text-xs">{item.type}</td>
                <td className="p-4 text-orange-500 font-black">{item.price}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-slate-500/10 text-slate-500'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-4">
                  <button className="text-slate-600 hover:text-white transition-colors"><Settings size={14}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TasksView() {
  return (
    <div className="flex items-center justify-center h-[70vh]">
       <div className="text-center">
          <CheckSquare size={48} className="mx-auto text-slate-800 mb-4" />
          <h2 className="text-2xl font-bold text-slate-700 uppercase italic">Kanban Board Under Construction</h2>
          <p className="text-slate-600 text-sm">Managing 12 active tasks in background...</p>
       </div>
    </div>
  );
}

function LogsView() {
  return (
    <div className="bg-black border border-slate-800 rounded-2xl p-6 h-[80vh] font-mono text-[11px] overflow-y-auto">
       <div className="text-green-500 mb-1 tracking-tighter">SUCCESS: Gateway secure connection established.</div>
       <div className="text-slate-500 mb-1">...</div>
       <div className="text-slate-400 mb-1 uppercase font-bold text-[9px] tracking-widest mt-4">--- Agent Initializations ---</div>
       <div className="text-slate-200 mb-1">JARVIS-L-01: Waking up in workspace /root/.openclaw/workspace/BAZZAR_FACTORY</div>
       <div className="text-slate-200 mb-1">SUPPORT-A-01: Session active on Avito. Loading cookies... OK.</div>
       <div className="text-slate-200 mb-1">SMM-M-01: Waiting for Cron trigger (21:00).</div>
       <div className="text-slate-400 mb-1 uppercase font-bold text-[9px] tracking-widest mt-4">--- Live Telemetry ---</div>
       <div className="text-orange-500/80 mb-1">DEBUG [16:45]: Memory flush initiated. Cache size 45MB.</div>
       <div className="text-orange-500/80 mb-1">WARNING [16:40]: Avito IP filter engaged. Retrying in 600s.</div>
       <div className="text-blue-500 mb-1">INFO [16:35]: Notion DB Sync (124/124 items). Status: Success.</div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, alert = false }: { icon: any, label: string, value: string, sub?: string, alert?: boolean }) {
  return (
    <div className={`p-4 rounded-2xl border transition-all duration-300 ${alert ? 'bg-red-950/20 border-red-500/30' : 'bg-slate-900 border-slate-800'}`}>
      <div className="flex items-center space-x-2 text-slate-500 mb-1">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <div className={`text-2xl font-black ${alert ? 'text-red-500' : 'text-white'}`}>{value}</div>
      <div className={`text-[10px] font-bold uppercase ${alert ? 'text-red-700' : 'text-slate-600'}`}>{sub}</div>
    </div>
  );
}

function AgentSummaryCard({ id, name, role, status, task, onClick }: { id: string, name: string, role: string, status: string, task: string, onClick: () => void }) {
  return (
    <div onClick={onClick} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-orange-600 hover:bg-slate-800/30 transition-all cursor-pointer group">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-orange-500 group-hover:bg-orange-600 group-hover:text-white transition-colors">{name[0]}</div>
          <div>
            <h4 className="font-bold text-white leading-tight">{name}</h4>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{role}</p>
          </div>
        </div>
        <div className={`w-2 h-2 rounded-full ${status === 'Online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-700'}`}></div>
      </div>
      <div className="p-3 bg-slate-950 rounded-xl">
        <p className="text-[10px] text-slate-400 font-mono italic leading-relaxed line-clamp-2">
          "{task}"
        </p>
      </div>
    </div>
  );
}

function TaskItem({ label, status, date }: { label: string, status: string, date: string }) {
  return (
    <div className="flex justify-between items-center group cursor-default">
      <div className="flex flex-col">
        <span className="text-xs font-bold text-slate-200 group-hover:text-orange-500 transition-colors">{label}</span>
        <span className="text-[9px] text-slate-500 font-mono uppercase">{date}</span>
      </div>
      <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${
        status === 'Completed' ? 'text-green-500 bg-green-500/10' : 
        status === 'Running' ? 'text-orange-500 bg-orange-500/10 animate-pulse' : 
        'text-slate-600 bg-slate-800'
      }`}>
        {status}
      </span>
    </div>
  );
}
