import React, { useState } from 'react';
import { generateDiagnosticAnalysis } from '../services/geminiService';
import { BeakerIcon, SparklesIcon } from './icons';
import type { Translation } from '../types';

interface DiagnosticAssistantProps {
  t: Translation;
}

export const DiagnosticAssistant: React.FC<DiagnosticAssistantProps> = ({ t }) => {
  const [symptoms, setSymptoms] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      setError(t.diagnostic_assistant.enterSymptoms);
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis('');

    try {
      const result = await generateDiagnosticAnalysis(symptoms);
      setAnalysis(result);
    } catch (err) {
      const message = (err as Error).message || 'An unexpected error occurred.';
      setError(`${t.diagnostic_assistant.errorPrefix} ${message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderAnalysis = (text: string) => {
    // A simple markdown-like renderer
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let listItems: React.ReactNode[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(<ul key={`ul-${elements.length}`} className="list-disc pl-5 space-y-1">{listItems}</ul>);
        listItems = [];
      }
    };

    lines.forEach((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        flushList();
        elements.push(<p key={index} className="font-bold my-2">{line.substring(2, line.length - 2)}</p>);
      } else if (line.startsWith('* ')) {
        listItems.push(<li key={index}>{line.substring(2)}</li>);
      } else if (line.startsWith('### ')) {
        flushList();
        elements.push(<h3 key={index} className="text-lg font-semibold mt-4 mb-2">{line.substring(4)}</h3>);
      } else if (line.startsWith('## ')) {
        flushList();
        elements.push(<h2 key={index} className="text-xl font-bold mt-6 mb-3 border-b pb-2">{line.substring(3)}</h2>);
      } else if (line.startsWith('# ')) {
        flushList();
        elements.push(<h1 key={index} className="text-2xl font-bold mt-8 mb-4 border-b pb-2">{line.substring(2)}</h1>);
      } else {
        flushList();
        if (line.trim() !== '') {
          elements.push(<p key={index} className="mb-2">{line}</p>);
        } else {
           elements.push(<br key={index} />);
        }
      }
    });

    flushList(); // Add any remaining list items
    return elements;
  };


  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center mb-4">
        <BeakerIcon className="w-10 h-10 text-primary-600" />
        <h1 className="text-3xl font-bold text-gray-800 ml-3">{t.diagnostic_assistant.title}</h1>
      </div>
      <p className="text-gray-600 mb-6">{t.diagnostic_assistant.description}</p>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <p className="text-sm text-yellow-800">{t.diagnostic_assistant.disclaimer}</p>
      </div>

      <div>
        <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-2">
          {t.diagnostic_assistant.inputLabel}
        </label>
        <textarea
          id="symptoms"
          rows={8}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
          placeholder={t.diagnostic_assistant.inputPlaceholder}
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="mt-4">
        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t.diagnostic_assistant.loading}
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5 mr-2" />
              {t.diagnostic_assistant.analyzeButton}
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      <div className="mt-8 pt-6 border-t">
        <h2 className="text-2xl font-bold text-gray-800">{t.diagnostic_assistant.analysisTitle}</h2>
        {analysis ? (
          <div className="mt-4 prose max-w-none text-gray-700">
            {renderAnalysis(analysis)}
          </div>
        ) : (
          !isLoading && (
            <div className="mt-4 text-center text-gray-500 py-10 border-2 border-dashed rounded-lg">
              <p>{t.diagnostic_assistant.noAnalysis}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};