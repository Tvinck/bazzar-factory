import React from 'react';
import { Users, LayoutDashboard, Database, CheckSquare, Settings, Activity } from 'lucide-react';

const Sidebar = () => (
  <div className="w-64 bg-slate-900 h-screen text-white p-6 fixed top-0 left-0">
    <h1 className="text-2xl font-bold mb-10 text-orange-500">BAZZAR AI</h1>
    <nav className="space-y-4">
      <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
      <NavItem icon={<Users size={20} />} label="Staff" />
      <NavItem icon={<CheckSquare size={20} />} label="Tasks" />
      <NavItem icon={<Database size={20} />} label="Database" />
      <NavItem icon={<Activity size={20} />} label="Live View" />
      <NavItem icon={<Settings size={20} />} label="Settings" />
    </nav>
  </div>
);

const NavItem = ({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <div className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${active ? 'bg-orange-600' : 'hover:bg-slate-800 text-slate-400'}`}>
    {icon}
    <span className="font-medium">{label}</span>
  </div>
);

const AgentCard = ({ name, role, status, task }: { name: string, role: string, status: string, task: string }) => (
  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg hover:border-orange-500 transition-all cursor-pointer">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-xl font-bold text-white">{name}</h3>
        <p className="text-slate-400 text-sm">{role}</p>
      </div>
      <span className={`px-2 py-1 rounded text-xs font-bold ${status === 'Online' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
        {status}
      </span>
    </div>
    <div className="space-y-2">
      <p className="text-slate-300 text-sm font-medium">Current Task:</p>
      <div className="bg-slate-900 p-3 rounded-lg text-xs text-orange-400 font-mono italic">
        {task}
      </div>
    </div>
    <button className="mt-4 w-full bg-slate-700 hover:bg-orange-600 text-white text-sm py-2 rounded-lg transition-colors">
      View Details / Chat
    </button>
  </div>
);

export default function Home() {
  return (
    <div className="flex bg-slate-950 min-h-screen font-sans antialiased text-slate-200">
      <Sidebar />
      <main className="ml-64 p-10 w-full">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white">Factory Overview</h2>
            <p className="text-slate-400">Welcome back, CEO. Systems are optimal.</p>
          </div>
          <div className="flex space-x-4">
            <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
              <span className="text-slate-500 text-xs block">Avito Balance</span>
              <span className="text-white font-bold font-mono">11.00 ₽</span>
            </div>
            <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
              <span className="text-slate-500 text-xs block">Profit (24h)</span>
              <span className="text-green-500 font-bold font-mono">+1,400 ₽</span>
            </div>
          </div>
        </header>

        <section className="mb-10">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <Users className="mr-2 text-orange-500" size={24} />
            AI Staff Members
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AgentCard 
              name="Jarvis" 
              role="Lead Manager / COO" 
              status="Online" 
              task="Synchronizing local database with Notion and STAFF Factory..." 
            />
            <AgentCard 
              name="Support-Avito" 
              role="Customer Service" 
              status="Online" 
              task="Monitoring incoming chats. Anti-bot filter cooldown: 15m remaining." 
            />
            <AgentCard 
              name="SMM-Bot" 
              role="Marketing" 
              status="Idle" 
              task="Waiting for inventory update to create next Telegram post." 
            />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <section>
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <CheckSquare className="mr-2 text-orange-500" size={24} />
              Recent System Tasks
            </h3>
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-700 flex justify-between items-center text-sm font-medium">
                <span className="text-slate-400">Task Name</span>
                <span className="text-slate-400">Status</span>
              </div>
              <div className="p-4 space-y-4">
                <TaskItem label="Update FaceApp Pro password for Arina" status="Done" />
                <TaskItem label="Initialize BAZZAR Factory Portal" status="In Progress" />
                <TaskItem label="Fetch Mafia Trilogy P3 price analytics" status="Done" />
                <TaskItem label="Enable multi-agent communication bridge" status="Queued" />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <Database className="mr-2 text-orange-500" size={24} />
              Database Health
            </h3>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl font-mono text-sm text-slate-400">
               {">"} Loading inventory.md... [OK] <br/>
               {">"} Loading accounts.md... [OK] <br/>
               {">"} Syncing with Notion... [85%] <br/>
               <span className="animate-pulse text-orange-500 mt-4 block">_</span>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

const TaskItem = ({ label, status }: { label: string, status: string }) => (
  <div className="flex justify-between items-center py-1">
    <span className="text-sm">{label}</span>
    <span className={`text-xs px-2 py-0.5 rounded ${status === 'Done' ? 'text-green-400 bg-green-400/10' : status === 'In Progress' ? 'text-orange-400 bg-orange-400/10' : 'text-slate-500 bg-slate-500/10'}`}>
      {status}
    </span>
  </div>
);
