
import React, { useEffect, useState } from 'react';
import { CheckCircle, Mail, ArrowRight, Monitor, Clock, ShieldCheck, Loader2, Copy, Check } from 'lucide-react';
import { Language, LicenseData } from '../types';
import { translations } from '../services/translations';
import { generateLicenseKey } from '../services/api';

interface SuccessViewProps {
  onReturn: () => void;
  lang: Language;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ onReturn, lang }) => {
  const t = translations[lang];
  const [data, setData] = useState<{ machineId: string; email: string } | null>(null);
  const [license, setLicense] = useState<LicenseData | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const steps = [t.step1, t.step2, t.step3, t.step4];

  useEffect(() => {
    const savedData = localStorage.getItem('pos_ai_activation_data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setData(parsed);
      
      // Lancer la séquence d'activation
      startActivationSequence(parsed.machineId);
    }
  }, []);

  const startActivationSequence = async (id: string) => {
    // Séquence d'animation
    for (let i = 0; i <= 100; i += 2) {
      await new Promise(r => setTimeout(r, 40));
      setProgress(i);
      if (i < 25) setCurrentStep(0);
      else if (i < 50) setCurrentStep(1);
      else if (i < 75) setCurrentStep(2);
      else setCurrentStep(3);

      // Appel API à mi-chemin
      if (i === 50) {
        const genLicense = await generateLicenseKey(id);
        setLicense(genLicense);
      }
    }
  };

  const handleCopy = () => {
    if (license) {
      navigator.clipboard.writeText(license.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center py-2">
        {progress < 100 ? (
          <div className="space-y-8 py-10">
            <div className="relative flex justify-center">
              <div className="h-24 w-24 rounded-full border-4 border-indigo-100 dark:border-slate-800 flex items-center justify-center relative">
                <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
                <span className="absolute -bottom-2 bg-indigo-600 text-[10px] text-white px-2 py-0.5 rounded-full font-bold">
                  {progress}%
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.activating}</h3>
              <p className="text-sm text-indigo-600 font-medium animate-pulse">{steps[currentStep]}</p>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-indigo-600 h-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="animate-in zoom-in duration-500">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/20 mb-4 border-2 border-green-200 dark:border-green-800 shadow-sm">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{t.paymentConfirmed}</h2>
            <p className="text-gray-500 dark:text-slate-400 text-xs mb-6 px-4">
              {t.paymentDesc}
            </p>

            {/* Carte de Licence */}
            <div className="bg-indigo-600 rounded-2xl p-6 text-left mb-6 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-16 w-16 text-white" />
              </div>
              
              <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-2">{t.licenseTitle}</p>
              <div className="flex items-center justify-between gap-2 bg-white/10 rounded-xl p-4 border border-white/20">
                <code className="text-lg font-mono font-bold text-white break-all">{license?.key || '---'}</code>
                <button 
                  onClick={handleCopy}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white flex-shrink-0"
                >
                  {copied ? <Check className="h-5 w-5 text-green-300" /> : <Copy className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-[10px] text-indigo-100 mt-3 flex items-center gap-1.5">
                <Monitor className="h-3 w-3" /> ID: {data?.machineId}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-xl p-4 text-left mb-6 flex gap-3 items-center">
              <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                <Mail className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] text-gray-400 font-bold uppercase">{t.emailLabel}</p>
                <p className="text-sm font-semibold text-gray-700 dark:text-slate-300 truncate">{data?.email}</p>
              </div>
            </div>

            <button onClick={onReturn} className="w-full inline-flex items-center justify-center px-6 py-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gray-900 dark:bg-slate-800 hover:bg-black transition-all shadow-lg group">
              {t.btnReturn}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
