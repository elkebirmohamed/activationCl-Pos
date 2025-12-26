import React, { useState, useEffect } from 'react';
import { ActivationForm } from './components/ActivationForm';
import { SuccessView } from './components/SuccessView';
import { AdminDashboard } from './components/AdminDashboard';
import { Terminal, Globe, LayoutDashboard } from 'lucide-react';
import { Language, AppView } from './types';
import { translations } from './services/translations';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('FORM');
  const [lang, setLang] = useState<Language>('fr');
  const queryParams = new URLSearchParams(window.location.search);
  const priceParam = queryParams.get('price');
  const amountToPay = priceParam ? priceParam : "59.90";

  // Auto-détection de la langue du navigateur
  useEffect(() => {
    const userLang = navigator.language.split('-')[0];
    if (userLang === 'en' || userLang === 'fr') {
      setLang(userLang as Language);
    }
  }, []);

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header Utilities */}
      <div className="fixed top-4 right-4 flex gap-2">
        <button 
          onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
          className="p-2 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-full shadow-sm flex items-center gap-2 px-3 text-xs font-bold dark:text-slate-300 hover:bg-slate-50 transition-colors"
        >
          <Globe className="h-3.5 w-3.5" />
          {lang.toUpperCase()}
        </button>
        <button 
          onClick={() => setView(view === 'ADMIN' ? 'FORM' : 'ADMIN')}
          className="p-2 bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-full shadow-sm flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"
          title="Admin Access"
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
             <Terminal className="h-7 w-7 text-white" />
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {t.title}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-slate-400 px-4">
          {view === 'SUCCESS' ? t.successSubtitle : view === 'ADMIN' ? t.adminTitle : t.subtitle}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-xl shadow-slate-200/50 dark:shadow-none sm:rounded-3xl sm:px-10 border border-slate-100 dark:border-slate-800 mx-4 sm:mx-0">
          {view === 'SUCCESS' && <SuccessView onReturn={() => setView('FORM')} lang={lang} />}
         {view === 'FORM' && (
      <ActivationForm 
        onSuccess={() => setView('SUCCESS')} 
        lang={lang} 
        amount={amountToPay} // <--- ON ENVOIE LE PRIX AU FORMULAIRE
      />
    )}
          {view === 'ADMIN' && <AdminDashboard onBack={() => setView('FORM')} />}
        </div>
        
        <p className="text-center text-[10px] text-gray-400 mt-8 uppercase tracking-widest font-medium">
          &copy; 2024 POS.AI Global Systems
        </p>
      </div>
    </div>
  );
};

export default App;