
import React, { useState, useMemo, useEffect } from 'react';
import type { Translation, Medication, PharmacySale, SaleItem, StockPurchase, StockRequisition } from '../types';
import { mockMedications, mockPharmacySales, mockStockPurchases, mockStockRequisitions } from '../constants';
import { PillIcon, PlusIcon, XMarkIcon, TrashIcon, PencilIcon, PrinterIcon } from './icons';

type PharmacyView = 'sales' | 'medications' | 'inventory';

interface PharmacyManagementProps {
    t: Translation;
}

const NewSaleModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (sale: PharmacySale) => void;
    medications: Medication[];
    t: Translation;
    sale: PharmacySale | null;
}> = ({ isOpen, onClose, onSave, medications, t, sale }) => {
    const [items, setItems] = useState<SaleItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const ts = t.pharmacy.sales;
    const medicationMap = useMemo(() => new Map(medications.map(m => [m.id, m])), [medications]);

    useEffect(() => {
        if (sale) {
            setItems(sale.items);
        } else {
            setItems([]);
        }
    }, [sale]);

    if (!isOpen) return null;

    const filteredMeds = medications.filter(m => 
        m.tradeName.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !items.some(i => i.medicationId === m.id)
    );

    const handleAddItem = (medId: string) => {
        const med = medicationMap.get(medId);
        if (med) {
            setItems(prev => [...prev, { medicationId: medId, quantity: 1, unitPrice: med.unitPrice }]);
        }
    };

    const handleQuantityChange = (medId: string, quantity: number) => {
        setItems(prev => prev.map(item => item.medicationId === medId ? { ...item, quantity } : item).filter(i => i.quantity > 0));
    };

    const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return;

        const finalSale: PharmacySale = {
            id: sale?.id || `SALE${Date.now()}`,
            date: sale?.date || new Date().toISOString(),
            items,
            totalAmount
        };
        onSave(finalSale);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">{sale ? ts.editSaleTitle : ts.newSaleTitle}</h2>
                    <button onClick={onClose}><XMarkIcon className="w-6 h-6"/></button>
                </div>
                <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
                    <div className="p-6 space-y-4 overflow-y-auto">
                        <div>
                            <input 
                                type="text" 
                                placeholder={ts.searchPlaceholder} 
                                value={searchTerm} 
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                            <ul className="mt-2 max-h-40 overflow-y-auto border rounded">
                                {filteredMeds.map(med => (
                                    <li key={med.id} className="flex justify-between items-center p-2 hover:bg-gray-100">
                                        <span>{med.tradeName} (Stock: {med.pharmacyStock})</span>
                                        <button type="button" onClick={() => handleAddItem(med.id)} className="px-2 py-1 bg-primary-500 text-white text-xs rounded">{ts.addSelectedItems}</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left">{ts.medication}</th>
                                        <th className="px-4 py-2 text-left">{ts.quantity}</th>
                                        <th className="px-4 py-2 text-right">{ts.lineTotal}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map(item => {
                                        const med = medicationMap.get(item.medicationId);
                                        return (
                                        <tr key={item.medicationId}>
                                            <td className="px-4 py-2">{med?.tradeName}</td>
                                            <td className="px-4 py-2">
                                                <input 
                                                    type="number" 
                                                    value={item.quantity} 
                                                    onChange={e => handleQuantityChange(item.medicationId, Number(e.target.value))}
                                                    className="w-20 p-1 border rounded"
                                                    min="1"
                                                    max={med?.pharmacyStock}
                                                />
                                            </td>
                                            <td className="px-4 py-2 text-right">${(item.quantity * item.unitPrice).toFixed(2)}</td>
                                        </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                         <div className="text-right font-bold text-xl">{ts.invoiceTotal}: ${totalAmount.toFixed(2)}</div>
                    </div>
                    <div className="p-4 border-t flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">{ts.cancel}</button>
                        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded">{ts.saveSale}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const MedicationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (med: Medication) => void;
    t: Translation;
    medication: Medication | null;
}> = ({ isOpen, onClose, onSave, t, medication }) => {
    const [formData, setFormData] = useState({
        tradeName: '',
        scientificName: '',
        unitPrice: 0,
    });
    const tm = t.pharmacy.medications;

    useEffect(() => {
        if (medication) {
            setFormData({
                tradeName: medication.tradeName,
                scientificName: medication.scientificName,
                unitPrice: medication.unitPrice,
            });
        } else {
             setFormData({
                tradeName: '',
                scientificName: '',
                unitPrice: 0,
            });
        }
    }, [medication]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(p => ({ ...p, [name]: type === 'number' ? Number(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalMed: Medication = {
            id: medication?.id || `MED${Date.now()}`,
            pharmacyStock: medication?.pharmacyStock || 0,
            mainStock: medication?.mainStock || 0,
            ...formData,
        };
        onSave(finalMed);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">{medication ? tm.editMedTitle : tm.addMedTitle}</h2>
                    <button onClick={onClose}><XMarkIcon className="w-6 h-6"/></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm">{tm.tradeName}</label>
                        <input name="tradeName" type="text" value={formData.tradeName} onChange={handleChange} className="w-full p-2 border rounded" required/>
                    </div>
                    <div>
                        <label className="block text-sm">{tm.scientificName}</label>
                        <input name="scientificName" type="text" value={formData.scientificName} onChange={handleChange} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-sm">{tm.unitPrice}</label>
                        <input name="unitPrice" type="number" step="0.01" min="0" value={formData.unitPrice} onChange={handleChange} className="w-full p-2 border rounded" required/>
                    </div>
                     <div className="flex justify-end pt-4 space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">{tm.cancel}</button>
                        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded">{tm.saveMedication}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const PharmacyManagement: React.FC<PharmacyManagementProps> = ({ t }) => {
    const [activeTab, setActiveTab] = useState<PharmacyView>('sales');
    const [medications, setMedications] = useState<Medication[]>(mockMedications);
    const [sales, setSales] = useState<PharmacySale[]>(mockPharmacySales);
    const [purchases, setPurchases] = useState<StockPurchase[]>(mockStockPurchases);
    const [requisitions, setRequisitions] = useState<StockRequisition[]>(mockStockRequisitions);

    const medicationMap = useMemo(() => new Map(medications.map(m => [m.id, m])), [medications]);
    const tp = t.pharmacy;

    const handleSaveMedication = (med: Medication) => {
        setMedications(prev => {
            const exists = prev.some(m => m.id === med.id);
            if (exists) {
                return prev.map(m => m.id === med.id ? med : m);
            }
            return [med, ...prev];
        });
    };
    
    const handleDeleteMedication = (medId: string) => {
        setMedications(prev => prev.filter(m => m.id !== medId));
    };

    const handleSaveSale = (sale: PharmacySale) => {
        // Update stock
        setMedications(currentMeds => {
            const medsToUpdate: Map<string, Medication> = new Map(currentMeds.map(m => [m.id, {...m}]));
            sale.items.forEach(item => {
                const med = medsToUpdate.get(item.medicationId);
                if (med) {
                    med.pharmacyStock -= item.quantity;
                }
            });
            return Array.from(medsToUpdate.values());
        });

        // Save sale
        setSales(prev => {
            const exists = prev.some(s => s.id === sale.id);
            if (exists) {
                return prev.map(s => s.id === sale.id ? sale : s);
            }
            return [sale, ...prev];
        });
    };
    
    const handleDeleteSale = (saleId: string) => {
        // Logic to return stock could be added here if needed
        setSales(prev => prev.filter(s => s.id !== saleId));
    };
    
    const handleSavePurchase = (purchase: StockPurchase) => {
        setPurchases(prev => [purchase, ...prev]);
        setMedications(prev => prev.map(m => 
            m.id === purchase.medicationId ? { ...m, mainStock: m.mainStock + purchase.quantity } : m
        ));
    };
    
    const handleSaveRequisition = (req: StockRequisition) => {
        setRequisitions(prev => [req, ...prev]);
    };

    const handleFulfillRequisition = (reqId: string) => {
        const req = requisitions.find(r => r.id === reqId);
        if (!req) return;

        setMedications(prev => prev.map(m => {
            if (m.id === req.medicationId) {
                if (m.mainStock >= req.quantity) {
                    return {
                        ...m,
                        mainStock: m.mainStock - req.quantity,
                        pharmacyStock: m.pharmacyStock + req.quantity
                    };
                }
                // Handle insufficient stock if necessary
            }
            return m;
        }));

        setRequisitions(prev => prev.map(r => r.id === reqId ? { ...r, status: 'Fulfilled' } : r));
    };


    const renderContent = () => {
        switch (activeTab) {
            case 'sales':
                return <SalesTab t={t} sales={sales} medicationMap={medicationMap} onSave={handleSaveSale} onDelete={handleDeleteSale} medications={medications} />;
            case 'medications':
                return <MedicationsTab t={t} medications={medications} onSave={handleSaveMedication} onDelete={handleDeleteMedication} />;
            case 'inventory':
                return <InventoryTab t={t} purchases={purchases} requisitions={requisitions} medicationMap={medicationMap} onSavePurchase={handleSavePurchase} onSaveRequisition={handleSaveRequisition} onFulfill={handleFulfillRequisition} medications={medications}/>;
        }
    };
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <PillIcon className="w-8 h-8 mr-3 text-green-500" />
                {tp.title}
            </h1>
            
            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-6">
                    {(Object.keys(tp.tabs) as Array<keyof typeof tp.tabs>).map(key => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key as PharmacyView)}
                            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                activeTab === key
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tp.tabs[key]}
                        </button>
                    ))}
                </nav>
            </div>

            {renderContent()}
        </div>
    );
};


// Sales Tab
const SalesTab: React.FC<{
    t: Translation,
    sales: PharmacySale[],
    medicationMap: Map<string, Medication>,
    onSave: (sale: PharmacySale) => void,
    onDelete: (saleId: string) => void,
    medications: Medication[],
}> = ({ t, sales, medicationMap, onSave, onDelete, medications }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingSale, setEditingSale] = useState<PharmacySale | null>(null);
    const ts = t.pharmacy.sales;
    
    const handleEdit = (sale: PharmacySale) => {
        setEditingSale(sale);
        setModalOpen(true);
    };
    
    const handlePrint = (sale: PharmacySale) => {
        const receiptContent = `
            <div style="font-family: monospace; width: 300px; padding: 10px;">
                <h2 style="text-align: center;">MediSys Pharmacy</h2>
                <p><strong>${ts.tableSaleId}:</strong> ${sale.id}</p>
                <p><strong>${ts.tableDate}:</strong> ${new Date(sale.date).toLocaleString()}</p>
                <hr/>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="text-align: left;">Item</th>
                            <th style="text-align: right;">Qty</th>
                            <th style="text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sale.items.map(item => `
                            <tr>
                                <td>${medicationMap.get(item.medicationId)?.tradeName || 'N/A'}</td>
                                <td style="text-align: right;">${item.quantity}</td>
                                <td style="text-align: right;">$${(item.quantity * item.unitPrice).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <hr/>
                <p style="text-align: right; font-weight: bold;">
                    ${ts.invoiceTotal}: $${sale.totalAmount.toFixed(2)}
                </p>
            </div>
        `;
        const printWindow = window.open('', '', 'height=400,width=400');
        if (printWindow) {
            printWindow.document.write(receiptContent);
            printWindow.document.close();
            printWindow.print();
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{ts.title}</h2>
                <button onClick={() => { setEditingSale(null); setModalOpen(true); }} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    {ts.newSale}
                </button>
            </div>
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ts.tableSaleId}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ts.tableDate}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ts.tableItems}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ts.tableTotal}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ts.tableActions}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sales.map(sale => (
                            <tr key={sale.id}>
                                <td className="px-6 py-4 text-sm font-medium">{sale.id}</td>
                                <td className="px-6 py-4 text-sm">{new Date(sale.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-sm">{sale.items.length}</td>
                                <td className="px-6 py-4 text-sm">${sale.totalAmount.toFixed(2)}</td>
                                <td className="px-6 py-4 text-sm space-x-2">
                                    <button onClick={() => handlePrint(sale)} className="text-gray-600 hover:text-gray-900" title={ts.print}><PrinterIcon className="w-5 h-5"/></button>
                                    <button onClick={() => handleEdit(sale)} className="text-indigo-600 hover:text-indigo-900" title={ts.view}><PencilIcon className="w-5 h-5"/></button>
                                    <button onClick={() => window.confirm(ts.deleteConfirm) && onDelete(sale.id)} className="text-red-600 hover:text-red-900" title={ts.delete}><TrashIcon className="w-5 h-5"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
             {isModalOpen && <NewSaleModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSave={onSave} medications={medications} t={t} sale={editingSale}/>}
        </div>
    );
};

// Medications Tab
const MedicationsTab: React.FC<{
    t: Translation,
    medications: Medication[],
    onSave: (med: Medication) => void,
    onDelete: (medId: string) => void,
}> = ({ t, medications, onSave, onDelete }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingMed, setEditingMed] = useState<Medication | null>(null);
    const tm = t.pharmacy.medications;

    const handleEdit = (med: Medication) => {
        setEditingMed(med);
        setModalOpen(true);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{tm.title}</h2>
                <button onClick={() => { setEditingMed(null); setModalOpen(true); }} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    {tm.addMedication}
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{tm.tableMedId}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{tm.tableTradeName}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{tm.tableScientificName}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{tm.tableUnitPrice}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{tm.tablePharmacyStock}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{tm.tableMainStock}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{tm.tableActions}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {medications.map(med => (
                            <tr key={med.id}>
                                <td className="px-6 py-4 text-sm font-medium">{med.id}</td>
                                <td className="px-6 py-4 text-sm">{med.tradeName}</td>
                                <td className="px-6 py-4 text-sm">{med.scientificName}</td>
                                <td className="px-6 py-4 text-sm">${med.unitPrice.toFixed(2)}</td>
                                <td className="px-6 py-4 text-sm">{med.pharmacyStock}</td>
                                <td className="px-6 py-4 text-sm">{med.mainStock}</td>
                                <td className="px-6 py-4 text-sm space-x-2">
                                     <button onClick={() => handleEdit(med)} className="text-indigo-600 hover:text-indigo-900" title={tm.edit}><PencilIcon className="w-5 h-5"/></button>
                                     <button onClick={() => window.confirm(tm.deleteConfirm) && onDelete(med.id)} className="text-red-600 hover:text-red-900" title={tm.delete}><TrashIcon className="w-5 h-5"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <MedicationModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSave={onSave} t={t} medication={editingMed}/>}
        </div>
    );
};

// Inventory Tab
const InventoryTab: React.FC<{
    t: Translation,
    purchases: StockPurchase[],
    requisitions: StockRequisition[],
    medicationMap: Map<string, Medication>,
    onSavePurchase: (purchase: StockPurchase) => void,
    onSaveRequisition: (req: StockRequisition) => void,
    onFulfill: (reqId: string) => void,
    medications: Medication[],
}> = ({ t, purchases, requisitions, medicationMap, onSavePurchase, onSaveRequisition, onFulfill, medications }) => {
    const [subView, setSubView] = useState<'purchases' | 'requisitions'>('purchases');
    const [isPurchaseModalOpen, setPurchaseModalOpen] = useState(false);
    const [isRequisitionModalOpen, setRequisitionModalOpen] = useState(false);
    const ti = t.pharmacy.inventory;

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-4 border-b">
                    <button onClick={() => setSubView('purchases')} className={`py-2 px-4 text-sm ${subView === 'purchases' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}>{ti.purchases}</button>
                    <button onClick={() => setSubView('requisitions')} className={`py-2 px-4 text-sm ${subView === 'requisitions' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}>{ti.requisitions}</button>
                </div>
                 <div>
                    {subView === 'purchases' && <button onClick={() => setPurchaseModalOpen(true)} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"><PlusIcon className="w-5 h-5 mr-2"/>{ti.recordPurchase}</button>}
                    {subView === 'requisitions' && <button onClick={() => setRequisitionModalOpen(true)} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"><PlusIcon className="w-5 h-5 mr-2"/>{ti.newRequisition}</button>}
                </div>
            </div>
            
            {subView === 'purchases' && (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                         <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ti.tablePurchaseId}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ti.tableDate}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ti.tableMedication}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ti.tableQuantity}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ti.tableSupplier}</th>
                            </tr>
                        </thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                            {purchases.map(p => (
                                <tr key={p.id}>
                                    <td className="px-6 py-4 text-sm">{p.id}</td>
                                    <td className="px-6 py-4 text-sm">{new Date(p.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-sm">{medicationMap.get(p.medicationId)?.tradeName || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm">{p.quantity}</td>
                                    <td className="px-6 py-4 text-sm">{p.supplier}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

             {subView === 'requisitions' && (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                         <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ti.tableReqId}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ti.tableDate}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ti.tableMedication}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ti.tableQuantity}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ti.tableStatus}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ti.actions}</th>
                            </tr>
                        </thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                            {requisitions.map(r => (
                                <tr key={r.id}>
                                    <td className="px-6 py-4 text-sm">{r.id}</td>
                                    <td className="px-6 py-4 text-sm">{new Date(r.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-sm">{medicationMap.get(r.medicationId)?.tradeName || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm">{r.quantity}</td>
                                    <td className="px-6 py-4 text-sm">
                                        {r.status === 'Pending' ? <span className="text-orange-600">{ti.statusPending}</span> : <span className="text-green-600">{ti.statusFulfilled}</span>}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {r.status === 'Pending' && <button onClick={() => onFulfill(r.id)} className="text-primary-600">{ti.fulfill}</button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};