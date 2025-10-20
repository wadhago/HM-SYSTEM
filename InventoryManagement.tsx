import React, { useState } from 'react';
import type { Translation, InventoryItem } from '../types';
import { mockInventory } from '../constants';
import { BoxIcon } from './icons';

interface InventoryManagementProps {
    t: Translation;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-full">
                {icon}
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    </div>
);

export const InventoryManagement: React.FC<InventoryManagementProps> = ({ t }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const ti = t.inventory;

    const filteredItems = mockInventory.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const getStatusChip = (item: InventoryItem) => {
        if (item.quantity === 0) {
            return <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">{ti.statusOutOfStock}</span>;
        }
        if (item.quantity <= item.lowStockThreshold) {
            return <span className="px-2 py-1 text-xs font-semibold text-orange-800 bg-orange-100 rounded-full">{ti.statusLowStock}</span>;
        }
        return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">{ti.statusInStock}</span>;
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <BoxIcon className="w-8 h-8 mr-3 text-orange-500" />
                {ti.title}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard title={ti.totalItems} value={mockInventory.length} icon={<BoxIcon className="h-6 w-6 text-orange-500" />} />
                <StatCard title={ti.lowStock} value={mockInventory.filter(i => i.quantity > 0 && i.quantity <= i.lowStockThreshold).length} icon={<BoxIcon className="h-6 w-6 text-yellow-500" />} />
                <StatCard title={ti.outOfStock} value={mockInventory.filter(i => i.quantity === 0).length} icon={<BoxIcon className="h-6 w-6 text-red-500" />} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder={ti.searchPlaceholder}
                        className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{ti.tableId}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{ti.tableName}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{ti.tableCategory}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{ti.tableQuantity}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{ti.tableStatus}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredItems.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusChip(item)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
