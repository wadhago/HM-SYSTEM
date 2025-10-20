import React, { useState } from 'react';
import type { Translation, UserLog } from '../types';
import { mockUserLogs } from '../constants';
import { ShieldCheckIcon, BugAntIcon } from './icons';

interface SecurityAccessProps {
    t: Translation;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
            <div className="bg-gray-200 p-3 rounded-full">
                {icon}
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    </div>
);

export const SecurityAccess: React.FC<SecurityAccessProps> = ({ t }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const ts = t.security;

    const filteredLogs = mockUserLogs.filter(log =>
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const getStatusChip = (status: UserLog['status']) => {
        switch (status) {
            case 'Success': return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">{ts.statusSuccess}</span>;
            case 'Failed': return <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">{ts.statusFailed}</span>;
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <ShieldCheckIcon className="w-8 h-8 mr-3 text-gray-700" />
                {ts.title}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard title={ts.totalEvents} value={mockUserLogs.length} icon={<ShieldCheckIcon className="h-6 w-6 text-gray-700" />} />
                <StatCard title={ts.successfulLogins} value={mockUserLogs.filter(l => l.action.toLowerCase().includes('login') && l.status === 'Success').length} icon={<ShieldCheckIcon className="h-6 w-6 text-green-500" />} />
                <StatCard title={ts.failedAttempts} value={mockUserLogs.filter(l => l.status === 'Failed').length} icon={<BugAntIcon className="h-6 w-6 text-red-500" />} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder={ts.searchPlaceholder}
                        className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{ts.tableId}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{ts.tableUser}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{ts.tableAction}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{ts.tableTimestamp}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{ts.tableStatus}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.user}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.action}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.timestamp}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusChip(log.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
