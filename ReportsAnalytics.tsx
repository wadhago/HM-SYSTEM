import React from 'react';
import type { Translation } from '../types';
import { DocumentChartBarIcon } from './icons';

interface ReportsAnalyticsProps {
    t: Translation;
}

const ChartPlaceholder: React.FC<{title: string, description: string}> = ({ title, description }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-md">
            <p className="text-gray-500">{description}</p>
        </div>
    </div>
);

export const ReportsAnalytics: React.FC<ReportsAnalyticsProps> = ({ t }) => {
    const tr = t.reports;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <DocumentChartBarIcon className="w-8 h-8 mr-3 text-lime-500" />
                {tr.title}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">{tr.financialOverview}</h2>
                    <div className="space-y-4">
                        <ChartPlaceholder title={tr.revenueVsExpense} description={tr.chartPlaceholder} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">{tr.patientDemographics}</h2>
                     <div className="space-y-4">
                        <ChartPlaceholder title={tr.ageDistribution} description={tr.chartPlaceholder} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                     <h2 className="text-xl font-bold text-gray-800 mb-4">{tr.departmentPerformance}</h2>
                     <div className="space-y-4">
                        <ChartPlaceholder title={tr.appointmentsByDept} description={tr.chartPlaceholder} />
                    </div>
                </div>

                 <div className="bg-white p-6 rounded-lg shadow">
                     <h2 className="text-xl font-bold text-gray-800 mb-4">{tr.occupancyRate}</h2>
                     <div className="space-y-4">
                        <ChartPlaceholder title={tr.bedOccupancy} description={tr.chartPlaceholder} />
                    </div>
                </div>
            </div>
        </div>
    );
};
