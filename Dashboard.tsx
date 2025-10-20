import React from 'react';
import type { Translation, View } from '../types';
import { 
    PatientsIcon, DoctorsIcon, EmergencyIcon, BillingIcon, LabIcon, XRayIcon, 
    ScalpelIcon, BoxIcon, DocumentChartBarIcon, ShieldCheckIcon, UserGroupIcon, 
    PillIcon, HospitalIcon, BeakerIcon 
} from './icons';

interface DashboardProps {
  t: Translation;
  setView: (view: View) => void;
}

const ModuleCard: React.FC<{
    title: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    color: string;
    hoverColor: string;
    onClick: () => void;
}> = ({ title, Icon, color, hoverColor, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`group flex flex-col items-center justify-center p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-white ${color} ${hoverColor}`}
        >
            <Icon className="w-16 h-16 mb-4 opacity-90 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-lg font-bold text-center">{title}</h3>
        </button>
    );
};

export const Dashboard: React.FC<DashboardProps> = ({ t, setView }) => {

    const modules = [
        { id: 'patients', title: t.modules.patients, Icon: PatientsIcon, color: 'bg-sky-500', hover: 'hover:bg-sky-600' },
        { id: 'doctors', title: t.modules.doctors, Icon: DoctorsIcon, color: 'bg-indigo-500', hover: 'hover:bg-indigo-600' },
        { id: 'emergency', title: t.modules.emergency, Icon: EmergencyIcon, color: 'bg-red-500', hover: 'hover:bg-red-600' },
        { id: 'inpatient', title: t.modules.inpatient, Icon: HospitalIcon, color: 'bg-blue-500', hover: 'hover:bg-blue-600' },
        { id: 'lab', title: t.modules.lab, Icon: LabIcon, color: 'bg-purple-500', hover: 'hover:bg-purple-600' },
        { id: 'radiology', title: t.modules.radiology, Icon: XRayIcon, color: 'bg-slate-500', hover: 'hover:bg-slate-600' },
        { id: 'pharmacy', title: t.modules.pharmacy, Icon: PillIcon, color: 'bg-green-500', hover: 'hover:bg-green-600' },
        { id: 'surgery', title: t.modules.surgery, Icon: ScalpelIcon, color: 'bg-rose-500', hover: 'hover:bg-rose-600' },
        { id: 'billing', title: t.modules.billing, Icon: BillingIcon, color: 'bg-amber-500', hover: 'hover:bg-amber-600' },
        { id: 'hr', title: t.modules.hr, Icon: UserGroupIcon, color: 'bg-cyan-500', hover: 'hover:bg-cyan-600' },
        { id: 'inventory', title: t.modules.inventory, Icon: BoxIcon, color: 'bg-orange-500', hover: 'hover:bg-orange-600' },
        { id: 'reports', title: t.modules.reports, Icon: DocumentChartBarIcon, color: 'bg-lime-500', hover: 'hover:bg-lime-600' },
        { id: 'security', title: t.modules.security, Icon: ShieldCheckIcon, color: 'bg-gray-700', hover: 'hover:bg-gray-800' },
        { id: 'diagnostic_assistant', title: t.modules.diagnostic_assistant, Icon: BeakerIcon, color: 'bg-teal-500', hover: 'hover:bg-teal-600' },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{t.modules.dashboard}</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-6">
                {modules.map(module => (
                    <ModuleCard 
                        key={module.id}
                        title={module.title}
                        Icon={module.Icon}
                        color={module.color}
                        hoverColor={module.hover}
                        onClick={() => setView(module.id as View)}
                    />
                ))}
            </div>
        </div>
    );
};