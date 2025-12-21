
import React, { useState, useEffect, useRef } from 'react';
import { Mail, Monitor, Loader2, ShieldCheck, XCircle, CreditCard, RefreshCw, HelpCircle, AlertTriangle, Info } from 'lucide-react';
import { ActivationFormData, Language } from '../types';
import { InputField } from './ui/InputField';
import { translations } from '../services/translations';

const getPaypalClientId = (): string => {
  let envId = '';
  try {
    envId = (process.env as any)?.VITE_PAYPAL_CLIENT_ID || (import.meta as any).env?.VITE_PAYPAL_CLIENT_ID;
  } catch (e) {}
  
  const fallbackId = 'EMHam-E8K2jdgdIGXjsyox5E6es7Gpu-_GNibJ-3pfEHCzM72UbdHmMLvQ6-9UPH2WNzKl1ewJIumyeW';
  return envId?.trim() || fallbackId;
};

const PAYPAL_CLIENT_ID = getPaypalClientId();

interface ActivationFormProps {
  onSuccess: () => void;
  lang: Language;
}

export const ActivationForm: React.FC<ActivationFormProps> = ({ onSuccess, lang }) => {
  const t = translations[lang];
  const [formData, setFormData] = useState<ActivationFormData>({ machineId: '', email: '' });
  const [errors, setErrors] = useState<Partial<ActivationFormData>>({});
  const [showPaypalButtons, setShowPaypalButtons] = useState(false);
  const [paypalError, setPaypalError] = useState<{msg: string, details?: string} | null>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const paypalButtonInstance = useRef<any>(null);

  const loadPayPalScript = () => {
    if ((window as any).paypal) {
      setSdkLoaded(true);
      return;
    }

    setIsSyncing(true);
    const scriptId = 'paypal-sdk-script';
    const existing = document.getElementById(scriptId);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=EUR&intent=capture&components=buttons`;
    script.async = true;
    
    script.onload = () => {
      setSdkLoaded(true);
      setIsSyncing(false);
      setPaypalError(null);
    };

    script.onerror = () => {
      setPaypalError({
        msg: lang === 'fr' 
          ? "Impossible de charger PayPal. Vérifiez votre connexion ou désactivez Adblock."
          : "PayPal failed to load. Check connection or disable Adblock."
      });
      setIsSyncing(false);
    };

    document.head.appendChild(script);
  };

  useEffect(() => {
    loadPayPalScript();
    return () => {
      if (paypalButtonInstance.current) {
        try { paypalButtonInstance.current.close(); } catch(e) {}
      }
    };
  }, []);

  const validate = (): boolean => {
    const newErrors: Partial<ActivationFormData> = {};
    if (!formData.machineId.trim()) newErrors.machineId = lang === 'fr' ? "ID requis" : "ID required";
    if (!formData.email.trim()) {
      newErrors.email = lang === 'fr' ? "Email requis" : "Email required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = lang === 'fr' ? "Format invalide" : "Invalid format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setPaypalError(null);
    localStorage.setItem('pos_ai_activation_data', JSON.stringify({ ...formData, timestamp: new Date().toISOString() }));
    
    setShowPaypalButtons(true);
    if (!sdkLoaded) loadPayPalScript();
  };

  useEffect(() => {
    if (showPaypalButtons && sdkLoaded && (window as any).paypal && paypalContainerRef.current) {
      paypalContainerRef.current.innerHTML = '';
      
      try {
        const buttons = (window as any).paypal.Buttons({
          style: { layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay', height: 45 },
          createOrder: (data: any, actions: any) => {
            // MODIFICATION ICI : On envoie MachineID et Email séparés par un pipe |
            const customData = `${formData.machineId}|${formData.email}`;
            
            return actions.order.create({
              purchase_units: [{ 
                description: `POS.AI License - Terminal: ${formData.machineId}`, 
                custom_id: customData, 
                amount: { currency_code: 'EUR', value: '59.90' } 
              }]
            });
          },
          onApprove: async (data: any, actions: any) => { 
            await actions.order.capture(); 
            onSuccess(); 
          },
          onCancel: () => setShowPaypalButtons(false),
          onError: (err: any) => { 
            console.error('PayPal Core Error:', err);
            setPaypalError({
              msg: lang === 'fr' ? "Erreur critique PayPal." : "Critical PayPal error.",
              details: err?.toString()
            });
            setShowPaypalButtons(false);
          }
        });
        
        if (buttons.isEligible()) {
          paypalButtonInstance.current = buttons;
          buttons.render(paypalContainerRef.current);
        } else {
          setPaypalError({
            msg: lang === 'fr' 
              ? "Échec d'éligibilité PayPal. Vérifiez si votre Client ID est bien en mode LIVE."
              : "PayPal eligibility failed. Ensure your Client ID is in LIVE mode."
          });
          setShowPaypalButtons(false);
        }
      } catch (err: any) { 
        console.error("Render Error:", err);
        setPaypalError({ msg: "Render Error", details: err.message });
        setShowPaypalButtons(false); 
      }
    }
  }, [showPaypalButtons, sdkLoaded, onSuccess, formData.machineId, formData.email, lang]);

  return (
    <div className="space-y-6">
      {paypalError && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-800 animate-in fade-in duration-300">
          <div className="flex gap-3 mb-3">
            <XCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
            <div>
              <p className="font-bold">{paypalError.msg}</p>
              {paypalError.details && (
                <p className="text-[10px] mt-1 opacity-70 font-mono break-all bg-red-100 p-1 rounded">
                  Log: {paypalError.details}
                </p>
              )}
            </div>
          </div>
          <button 
            onClick={() => { setPaypalError(null); loadPayPalScript(); }}
            className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase bg-white py-2 rounded-lg border border-red-200 shadow-sm transition-all active:scale-95"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {lang === 'fr' ? 'Réessayer' : 'Retry'}
          </button>
        </div>
      )}

      {!showPaypalButtons ? (
        <div className="animate-in fade-in duration-500">
          <div className="mb-6 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100/50 dark:border-indigo-900/20 rounded-2xl p-4 text-left">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2">
              <HelpCircle className="h-4 w-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">{t.findIdTitle}</h4>
            </div>
            <ul className="space-y-1.5">
              <li className="text-[12px] text-slate-600 dark:text-slate-400 leading-tight flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">•</span>
                {t.findIdStep1}
              </li>
              <li className="text-[12px] text-slate-600 dark:text-slate-400 leading-tight flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">•</span>
                {t.findIdStep2}
              </li>
            </ul>
          </div>

          <form onSubmit={handleAction} className="space-y-4 text-left">
            <InputField
              id="machineId"
              label={t.machineIdLabel}
              placeholder={t.machinePlaceholder}
              value={formData.machineId}
              onChange={(e) => setFormData({...formData, machineId: e.target.value})}
              error={errors.machineId}
              icon={<Monitor className="h-4 w-4 text-slate-400" />}
              required
            />
            <InputField
              id="email"
              label={t.emailLabel}
              type="email"
              placeholder={t.emailPlaceholder}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              error={errors.email}
              icon={<Mail className="h-4 w-4 text-slate-400" />}
              required
            />
            <button
              type="submit"
              disabled={isSyncing}
              className={`w-full flex justify-center rounded-xl px-4 py-4 text-sm font-bold text-white shadow-xl transition-all items-center active:scale-95 ${
                isSyncing ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isSyncing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t.btnTesting}</> : <><CreditCard className="mr-2 h-4 w-4" />{t.btnActivate}</>}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-5 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="inline-flex items-center gap-2 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-1.5 rounded-full">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider">{t.securePayment}</span>
          </div>

          <div className="relative min-h-[180px] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
            <div ref={paypalContainerRef} className="w-full relative z-10" id="paypal-button-container"></div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
               <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-2" />
               <p className="text-[10px] font-bold uppercase tracking-tighter">{lang === 'fr' ? 'Synchronisation...' : 'Syncing...'}</p>
            </div>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/30 flex gap-3 text-left">
            <Info className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-amber-800 dark:text-amber-400 leading-tight">
              {lang === 'fr' 
                ? "Si rien ne s'affiche, vérifiez que vous n'avez pas de bloqueur de publicité actif ou que votre clé PayPal est bien en mode LIVE." 
                : "If nothing appears, ensure no ad-blockers are active and your PayPal key is in LIVE mode."}
            </p>
          </div>

          <button onClick={() => setShowPaypalButtons(false)} className="text-xs text-slate-400 hover:text-indigo-600 font-bold transition-colors py-2 flex items-center justify-center gap-2 mx-auto">
            <RefreshCw className="h-3 w-3" />
            {t.changeInfo}
          </button>
        </div>
      )}
    </div>
  );
};