import React from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, ArrowLeft } from 'lucide-react';

export const AdminDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const stats = [
    { label: 'Revenus (7j)', value: '1,437.60 €', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Activations', value: '24', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Taux Conv.', value: '12.5%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-indigo-600" />
          Admin Dashboard
        </h3>
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-slate-600">
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border dark:border-slate-800 dark:bg-slate-900/50">
            <div className={`p-3 rounded-xl ${stat.bg} dark:bg-slate-800`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
              <p className="text-lg font-bold dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Dernières Activations</p>
        <div className="space-y-2">
          {[1,2,3].map(i => (
            <div key={i} className="flex justify-between items-center text-xs border-b border-white/5 pb-2 last:border-0">
              <span className="font-mono text-indigo-300">POS-{(Math.random()*100000).toFixed(0)}</span>
              <span className="text-slate-400">Il y a {i*2}h</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};