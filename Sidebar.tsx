import React from 'react';
import type { View, Translation, Language, SystemSettings } from '../types';
import { DashboardIcon, PatientsIcon, DoctorsIcon, EmergencyIcon, BillingIcon, LabIcon, XRayIcon, ScalpelIcon, BoxIcon, DocumentChartBarIcon, ShieldCheckIcon, UserGroupIcon, PillIcon, HospitalIcon, BeakerIcon } from './icons';

interface SidebarProps {
  view: View;
  setView: (view: View) => void;
  t: Translation;
  lang: Language;
  systemSettings: SystemSettings;
}

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  dashboard: DashboardIcon,
  diagnostic_assistant: BeakerIcon,
  patients: PatientsIcon,
  doctors: DoctorsIcon,
  emergency: EmergencyIcon,
  inpatient: HospitalIcon,
  lab: LabIcon,
  radiology: XRayIcon,
  pharmacy: PillIcon,
  surgery: ScalpelIcon,
  billing: BillingIcon,
  hr: UserGroupIcon,
  inventory: BoxIcon,
  reports: DocumentChartBarIcon,
  security: ShieldCheckIcon,
};

export const Sidebar: React.FC<SidebarProps> = ({ view, setView, t, lang, systemSettings }) => {
  const navItems: { id: View; label: string }[] = [
    { id: 'dashboard', label: t.modules.dashboard },
    { id: 'diagnostic_assistant', label: t.modules.diagnostic_assistant },
    { id: 'patients', label: t.modules.patients },
    { id: 'doctors', label: t.modules.doctors },
    { id: 'emergency', label: t.modules.emergency },
    { id: 'inpatient', label: t.modules.inpatient },
    { id: 'lab', label: t.modules.lab },
    { id: 'radiology', label: t.modules.radiology },
    { id: 'pharmacy', label: t.modules.pharmacy },
    { id: 'surgery', label: t.modules.surgery },
    { id: 'billing', label: t.modules.billing },
    { id: 'hr', label: t.modules.hr },
    { id: 'inventory', label: t.modules.inventory },
    { id: 'reports', label: t.modules.reports },
    { id: 'security', label: t.modules.security },
  ];

  return (
    <nav className={`flex flex-col bg-white text-gray-800 shadow-xl overflow-y-auto transition-all duration-300 ${lang === 'ar' ? 'border-l' : 'border-r'}`} style={{width: '280px'}}>
      <div className={`flex items-center justify-center h-20 ${lang === 'ar' ? 'border-b' : 'border-b'}`}>
        <img src={systemSettings.icon} className="h-10 w-10" alt="System Icon"/>
        <h1 
          className="font-bold mx-2"
          style={{ 
            fontFamily: systemSettings.font, 
            color: systemSettings.color,
            fontSize: `calc(${systemSettings.fontSize} * 0.85)`
          }}
        >
          {systemSettings.name}
        </h1>
      </div>
      <ul className="flex-1 px-4 py-2">
        {navItems.map((item) => {
          const Icon = iconMap[item.id] || DashboardIcon;
          const isActive = view === item.id;
          return (
            <li key={item.id}>
              <button
                onClick={() => setView(item.id)}
                className={`flex items-center w-full px-4 py-3 my-1 text-base font-medium rounded-lg transition-colors duration-200 
                  ${isActive 
                    ? 'bg-primary-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-primary-100 hover:text-primary-700'}
                  ${lang === 'ar' ? 'justify-start' : ''}
                  `}
              >
                <Icon className={`w-6 h-6 ${lang === 'ar' ? 'ml-4' : 'mr-4'}`} />
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};