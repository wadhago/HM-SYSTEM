import React from 'react';
import { translations } from '../constants';

interface PlaceholderContentProps {
    title: string;
}

export const PlaceholderContent: React.FC<PlaceholderContentProps> = ({ title }) => {
    // A bit of a hack to get the base 'en' translations for the placeholder text
    // since the title prop will be already translated.
    const t = translations.en.placeholders;

    return (
        <div className="flex flex-col items-center justify-center h-full text-center bg-white rounded-xl shadow-lg p-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-primary-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h1 className="text-4xl font-bold text-gray-700">{title}</h1>
            <h2 className="text-2xl font-semibold text-primary-500 mt-2">{t.underDevelopment}</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-md">
                {t.featureComingSoon}
            </p>
        </div>
    );
};