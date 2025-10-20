import React, { useState, useEffect } from 'react';
import type { Language, SystemSettings, Translation, UserRole, View } from '../types';
import { ServerIcon, ArrowLeftIcon, Cog6ToothIcon, XMarkIcon } from './icons';

interface HeaderProps {
    t: Translation;
    lang: Language;
    setLang: (lang: Language) => void;
    systemSettings: SystemSettings;
    setSystemSettings: (settings: SystemSettings) => void;
    userRole: UserRole;
    view: View;
    setView: (view: View) => void;
}

const BellIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
    </svg>
);

const EnvelopeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
);

const SystemSettingsModal: React.FC<{
    isOpen: boolean,
    onClose: () => void,
    settings: SystemSettings,
    onSave: (settings: SystemSettings) => void,
    t: Translation
}> = ({ isOpen, onClose, settings, onSave, t }) => {
    const [formData, setFormData] = useState(settings);
    const th = t.header;
    const fonts = ['Inter', 'Roboto', 'Cairo', 'Lato', 'Montserrat', 'Open Sans', 'Poppins', 'Oswald'];
    const fontSizes = ['1.25rem', '1.5rem', '1.75rem', '2rem', '2.25rem'];

    const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, icon: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    }

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg m-4"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-gray-800 mb-4">{th.systemSettingsModalTitle}</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{th.systemName}</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">{th.systemIcon}</label>
                        <div className="mt-1 flex items-center space-x-4">
                            <img src={formData.icon} alt="icon preview" className="h-12 w-12 rounded-full object-cover bg-gray-100"/>
                             <label className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                                <span>{th.uploadIcon}</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleIconChange} />
                            </label>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">{th.font}</label>
                        <select name="font" value={formData.font.split(',')[0].replace(/'/g, "")} onChange={e => setFormData(p=>({...p, font: `'${e.target.value}', sans-serif`}))} className="mt-1 w-full p-2 border rounded-md">
                            {fonts.map(font => <option key={font} value={font} style={{fontFamily: font}}>{font}</option>)}
                        </select>
                    </div>
                     <div className="flex items-center space-x-4">
                         <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">{th.fontSize}</label>
                            <select name="fontSize" value={formData.fontSize} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md">
                                {fontSizes.map(size => <option key={size} value={size}>{size}</option>)}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">{th.fontColor}</label>
                            <input type="color" name="color" value={formData.color} onChange={handleChange} className="mt-1 w-full h-10 p-1 border rounded-md"/>
                        </div>
                    </div>
                </div>
                 <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">{th.close}</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">{th.save}</button>
                </div>
            </div>
        </div>
    );
};


export const Header: React.FC<HeaderProps> = ({ t, lang, setLang, systemSettings, setSystemSettings, userRole, view, setView }) => {
    const [isServerModalOpen, setServerModalOpen] = useState(false);
    const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setServerModalOpen(false);
                setSettingsModalOpen(false);
            }
        };

        if (isServerModalOpen || isSettingsModalOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isServerModalOpen, isSettingsModalOpen]);
    
    return (
        <>
            <header className="flex items-center justify-between px-6 py-4 bg-white border-b-4">
                <div className="flex items-center">
                    <img src={systemSettings.icon} className="h-10 w-10" alt="System Logo" />
                    <h1 
                        className="font-bold mx-3"
                        style={{
                            fontFamily: systemSettings.font,
                            color: systemSettings.color,
                            fontSize: systemSettings.fontSize,
                        }}
                    >
                        {systemSettings.name}
                    </h1>
                    {view !== 'dashboard' && (
                        <button
                            onClick={() => setView('dashboard')}
                            className={`flex items-center text-gray-600 hover:text-primary-700 font-semibold transition-colors duration-200 ${lang === 'ar' ? 'mr-4' : 'ml-4'}`}
                        >
                            <ArrowLeftIcon className={`w-5 h-5 ${lang === 'ar' ? 'ml-2' : 'mr-2'}`} />
                            {t.header.backToDashboard}
                        </button>
                    )}
                </div>

                <div className="flex items-center space-x-2 md:space-x-4">
                     <div className="relative hidden md:block">
                        <input
                            type="text"
                            placeholder={t.header.searchPlaceholder}
                            className="bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg py-2 pl-10 pr-4 w-64"
                        />
                        <div className={`absolute inset-y-0 flex items-center ${lang === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setLang('en')}
                            className={`px-3 py-1 text-sm rounded-md ${lang === 'en' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => setLang('ar')}
                            className={`px-3 py-1 text-sm rounded-md ${lang === 'ar' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
                        >
                            AR
                        </button>
                    </div>
                     <button 
                        onClick={() => setSettingsModalOpen(true)}
                        className="p-2 text-gray-500 hover:text-primary-600 rounded-full hover:bg-gray-100"
                        title={t.header.systemSettings}
                    >
                        <Cog6ToothIcon className="h-6 w-6" />
                    </button>
                    {userRole === 'admin' && (
                        <button 
                            onClick={() => setServerModalOpen(true)}
                            className="p-2 text-gray-500 hover:text-primary-600 rounded-full hover:bg-gray-100"
                            title={t.header.serverSettings}
                        >
                            <ServerIcon className="h-6 w-6" />
                        </button>
                    )}
                    
                    <button className="p-2 text-gray-500 hover:text-primary-600 rounded-full hover:bg-gray-100 hidden md:inline-block">
                        <EnvelopeIcon className="h-6 w-6" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-primary-600 rounded-full hover:bg-gray-100 hidden md:inline-block">
                        <BellIcon className="h-6 w-6" />
                    </button>
                    <div className="flex items-center">
                        <img
                            className="h-10 w-10 rounded-full object-cover"
                            src="https://randomuser.me/api/portraits/women/75.jpg"
                            alt="User"
                        />
                        <div className={`mx-2 text-sm ${lang === 'ar' ? 'text-right' : 'text-left'} hidden lg:block`}>
                            <p className="font-semibold text-gray-800">Dr. Aisha Khan</p>
                            <p className="text-gray-500">Cardiologist</p>
                        </div>
                    </div>
                </div>
            </header>

            {isServerModalOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
                    onClick={() => setServerModalOpen(false)}
                >
                    <div 
                        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-4">{t.header.serverModalTitle}</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="serverUrl" className="block text-sm font-medium text-gray-700">{t.header.serverUrl}</label>
                                <input type="text" id="serverUrl" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="e.g., https://api.medisys.com"/>
                            </div>
                            <div>
                                <label htmlFor="port" className="block text-sm font-medium text-gray-700">{t.header.port}</label>
                                <input type="number" id="port" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="e.g., 443"/>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setServerModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            >
                                {t.header.close}
                            </button>
                            <button
                                // Add connect logic here
                                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                            >
                                {t.header.connect}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <SystemSettingsModal 
                isOpen={isSettingsModalOpen}
                onClose={() => setSettingsModalOpen(false)}
                settings={systemSettings}
                onSave={setSystemSettings}
                t={t}
            />
        </>
    );
};