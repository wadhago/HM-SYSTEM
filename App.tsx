
import React, { useState, useMemo } from 'react';
import type { View, Language, UserRole, SystemSettings } from './types';
import { translations } from './constants';

import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { DiagnosticAssistant } from './components/DiagnosticAssistant';
import { PatientManagement } from './components/PatientManagement';
import { DoctorManagement } from './components/DoctorManagement';
import { EmergencyManagement } from './components/EmergencyManagement';
import { InpatientManagement } from './components/InpatientManagement';
import { LabManagement } from './components/LabManagement';
import { RadiologyManagement } from './components/RadiologyManagement';
import { PharmacyManagement } from './components/PharmacyManagement';
import { SurgeryManagement } from './components/SurgeryManagement';
import { BillingManagement } from './components/BillingManagement';
import { HRManagement } from './components/HRManagement';
import { InventoryManagement } from './components/InventoryManagement';
import { ReportsAnalytics } from './components/ReportsAnalytics';
import { SecurityAccess } from './components/SecurityAccess';
import { PlaceholderContent } from './components/PlaceholderContent';


const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [lang, setLang] = useState<Language>('en');
  const [userRole] = useState<UserRole>('admin');
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    name: "MediSys",
    icon: "/logo.svg",
    color: "#0284c7",
    font: "'Roboto', sans-serif",
    fontSize: '1.75rem',
  });

  const t = useMemo(() => translations[lang], [lang]);

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard t={t} setView={setView} />;
      case 'diagnostic_assistant':
        return <DiagnosticAssistant t={t} />;
      case 'patients':
        return <PatientManagement t={t} />;
      case 'doctors':
        return <DoctorManagement t={t} />;
      case 'emergency':
        return <EmergencyManagement t={t} />;
      case 'inpatient':
        return <InpatientManagement t={t} />;
      case 'lab':
        return <LabManagement t={t} />;
      case 'radiology':
        return <RadiologyManagement t={t} />;
      case 'pharmacy':
        return <PharmacyManagement t={t} />;
      case 'surgery':
        return <SurgeryManagement t={t} />;
      case 'billing':
        return <BillingManagement t={t} />;
      case 'hr':
        return <HRManagement t={t} />;
      case 'inventory':
        return <InventoryManagement t={t} />;
      case 'reports':
        return <ReportsAnalytics t={t} />;
      case 'security':
        return <SecurityAccess t={t} />;
      default:
        return <Dashboard t={t} setView={setView} />;
    }
  };

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="h-screen bg-gray-100 font-sans">
      <div className="flex flex-col overflow-hidden h-full">
        <Header t={t} lang={lang} setLang={setLang} systemSettings={systemSettings} setSystemSettings={setSystemSettings} userRole={userRole} view={view} setView={setView} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;