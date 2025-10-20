
import React, { useState, useMemo } from 'react';
import type { Translation, Invoice, BillableService, PurchaseRecord, PayrollRecord, Patient, Employee, ServiceCategoryKey, InvoiceItem } from '../types';
import { mockInvoices, mockBillableServices, mockPurchaseRecords, mockPayrollRecords, mockPatients, mockEmployees } from '../constants';
import { BillingIcon, PlusIcon, XMarkIcon, TrashIcon, PencilIcon, PrinterIcon, DocumentChartBarIcon } from './icons';

interface BillingManagementProps {
    t: Translation;
}

type BillingView = 'invoicing' | 'services' | 'purchases' | 'payroll' | 'reports';

// Main Component
export const BillingManagement: React.FC<BillingManagementProps> = ({ t }) => {
    const [activeTab, setActiveTab] = useState<BillingView>('invoicing');
    const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
    const [services, setServices] = useState<BillableService[]>(mockBillableServices);
    const [purchases, setPurchases] = useState<PurchaseRecord[]>(mockPurchaseRecords);
    const [payroll, setPayroll] = useState<PayrollRecord[]>(mockPayrollRecords);
    const [employees] = useState<Employee[]>(mockEmployees);

    const tf = t.financialManagement;

    const handleSaveInvoice = (invoice: Invoice) => {
        setInvoices(prev => {
            const exists = prev.some(i => i.id === invoice.id);
            if (exists) {
                return prev.map(i => i.id === invoice.id ? invoice : i);
            }
            return [invoice, ...prev];
        });
    };
    
    const handleDeleteInvoice = (id: string) => {
        setInvoices(prev => prev.filter(i => i.id !== id));
    };

    const handleSaveService = (service: BillableService) => {
        setServices(prev => {
            const exists = prev.some(s => s.id === service.id);
            if (exists) {
                return prev.map(s => s.id === service.id ? service : s);
            }
            return [service, ...prev];
        });
    };

    const handleDeleteService = (id: string) => {
        setServices(prev => prev.filter(s => s.id !== id));
    };
    
    const handleSavePurchase = (purchase: PurchaseRecord) => {
        setPurchases(prev => {
            const exists = prev.some(p => p.id === purchase.id);
            if (exists) {
                return prev.map(p => p.id === purchase.id ? purchase : p);
            }
            return [purchase, ...prev];
        });
    };

     const handleSavePayroll = (record: PayrollRecord) => {
        setPayroll(prev => {
            const exists = prev.some(p => p.id === record.id);
            if (exists) {
                return prev.map(p => p.id === record.id ? record : p);
            }
            return [record, ...prev];
        });
    };

     const handleDeletePayroll = (id: string) => {
        setPayroll(prev => prev.filter(p => p.id !== id));
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'invoicing':
                return <InvoicingTab t={t} invoices={invoices} onSave={handleSaveInvoice} onDelete={handleDeleteInvoice} services={services} />;
            case 'services':
                return <ServicesTab t={t} services={services} onSave={handleSaveService} onDelete={handleDeleteService} />;
            case 'purchases':
                return <PurchasesTab t={t} purchases={purchases} onSave={handleSavePurchase} />;
            case 'payroll':
                return <PayrollTab t={t} payroll={payroll} onSave={handleSavePayroll} onDelete={handleDeletePayroll} employees={employees} />;
            case 'reports':
                return <FinancialReportsTab t={t} />;
            default:
                return null;
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <BillingIcon className="w-8 h-8 mr-3 text-amber-500" />
                {tf.title}
            </h1>
            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-6">
                    {(Object.keys(tf.tabs) as Array<keyof typeof tf.tabs>).map(key => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                activeTab === key
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tf.tabs[key]}
                        </button>
                    ))}
                </nav>
            </div>
            {renderContent()}
        </div>
    );
};


// InvoicingTab Component
const InvoicingTab: React.FC<{
    t: Translation,
    invoices: Invoice[],
    onSave: (invoice: Invoice) => void,
    onDelete: (id: string) => void,
    services: BillableService[]
}> = ({ t, invoices, onSave, onDelete, services }) => {
    const ti = t.financialManagement.invoicing;
    const patientMap = useMemo(() => new Map(mockPatients.map(p => [p.id, p])), []);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

    const handleEdit = (invoice: Invoice) => {
        setEditingInvoice(invoice);
        setModalOpen(true);
    };

    const getStatusChip = (status: Invoice['status']) => {
        switch(status) {
            case 'Paid': return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">{ti.statusPaid}</span>;
            case 'Unpaid': return <span className="px-2 py-1 text-xs font-semibold text-orange-800 bg-orange-100 rounded-full">{ti.statusUnpaid}</span>;
            case 'Overdue': return <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">{ti.statusOverdue}</span>;
        }
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{ti.title}</h2>
                <button onClick={() => {setEditingInvoice(null); setModalOpen(true)}} className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center"><PlusIcon className="w-5 h-5 mr-2"/>{ti.newInvoice}</button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ti.tableInvoiceId}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ti.tablePatient}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ti.tableDate}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ti.tableTotal}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ti.tableStatus}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ti.tableActions}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {invoices.map(inv => (
                            <tr key={inv.id}>
                                <td className="px-6 py-4 text-sm">{inv.id}</td>
                                <td className="px-6 py-4 text-sm">{patientMap.get(inv.patientId)?.name || 'N/A'}</td>
                                <td className="px-6 py-4 text-sm">{inv.invoiceDate}</td>
                                <td className="px-6 py-4 text-sm">${inv.totalAmount.toFixed(2)}</td>
                                <td className="px-6 py-4 text-sm">{getStatusChip(inv.status)}</td>
                                <td className="px-6 py-4 text-sm space-x-2">
                                    <button title={ti.print} className="text-gray-600"><PrinterIcon className="w-5 h-5"/></button>
                                    <button onClick={() => handleEdit(inv)} title={ti.edit} className="text-indigo-600"><PencilIcon className="w-5 h-5"/></button>
                                    <button onClick={() => window.confirm(ti.deleteConfirm) && onDelete(inv.id)} title={ti.delete} className="text-red-600"><TrashIcon className="w-5 h-5"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <InvoiceModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSave={onSave} invoice={editingInvoice} services={services} t={t} />}
        </div>
    );
};

// Services Tab
const ServicesTab: React.FC<{t: Translation, services: BillableService[], onSave: (s: BillableService) => void, onDelete: (id: string) => void}> = ({t, services, onSave, onDelete}) => {
    const ts = t.financialManagement.services;
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<BillableService | null>(null);

    const handleEdit = (service: BillableService) => {
        setEditingService(service);
        setModalOpen(true);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{ts.title}</h2>
                <button onClick={() => {setEditingService(null); setModalOpen(true)}} className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center"><PlusIcon className="w-5 h-5 mr-2"/>{ts.addService}</button>
            </div>
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ts.tableServiceId}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ts.tableName}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ts.tableCategory}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ts.tablePrice}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ts.tableActions}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {services.map(srv => (
                            <tr key={srv.id}>
                                <td className="px-6 py-4 text-sm">{srv.id}</td>
                                <td className="px-6 py-4 text-sm">{srv.name}</td>
                                <td className="px-6 py-4 text-sm">{ts.categories[srv.category]}</td>
                                <td className="px-6 py-4 text-sm">${srv.price.toFixed(2)}</td>
                                <td className="px-6 py-4 text-sm space-x-2">
                                    <button onClick={() => handleEdit(srv)} title={ts.edit} className="text-indigo-600"><PencilIcon className="w-5 h-5"/></button>
                                    <button onClick={() => window.confirm(ts.deleteConfirm) && onDelete(srv.id)} title={ts.delete} className="text-red-600"><TrashIcon className="w-5 h-5"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <ServiceModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSave={onSave} service={editingService} t={t} />}
        </div>
    );
};

// Purchases Tab
const PurchasesTab: React.FC<{
    t: Translation,
    purchases: PurchaseRecord[],
    onSave: (purchase: PurchaseRecord) => void
}> = ({ t, purchases, onSave }) => {
    const tp = t.financialManagement.purchases;
    return <div className="bg-white p-6 rounded-lg shadow"><h2 className="text-xl font-bold">{tp.title}</h2><p className="mt-4 text-gray-500">This section is under development.</p></div>;
};

// Payroll Tab
const PayrollTab: React.FC<{
    t: Translation,
    payroll: PayrollRecord[],
    onSave: (record: PayrollRecord) => void,
    onDelete: (id: string) => void,
    employees: Employee[]
}> = ({ t, payroll, onSave, onDelete, employees }) => {
    const tp = t.financialManagement.payroll;
    const employeeMap = useMemo(() => new Map(employees.map(e => [e.id, e])), [employees]);
    return <div className="bg-white p-6 rounded-lg shadow"><h2 className="text-xl font-bold">{tp.title}</h2><p className="mt-4 text-gray-500">This section is under development.</p></div>;
};


// Financial Reports Tab
const FinancialReportsTab: React.FC<{ t: Translation }> = ({ t }) => {
    const tr = t.financialManagement.reports;
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 <div className="bg-blue-100 p-4 rounded-lg"><h3 className="text-sm font-medium">{tr.totalRevenue}</h3><p className="text-2xl font-bold">$125,000</p></div>
                 <div className="bg-red-100 p-4 rounded-lg"><h3 className="text-sm font-medium">{tr.totalExpenses}</h3><p className="text-2xl font-bold">$75,000</p></div>
                 <div className="bg-yellow-100 p-4 rounded-lg"><h3 className="text-sm font-medium">{tr.totalPayroll}</h3><p className="text-2xl font-bold">$30,000</p></div>
                 <div className="bg-green-100 p-4 rounded-lg"><h3 className="text-sm font-medium">{tr.netProfit}</h3><p className="text-2xl font-bold">$20,000</p></div>
            </div>
            <div className="mt-6">
                <div className="h-64 bg-gray-200 flex items-center justify-center rounded-lg">
                    <DocumentChartBarIcon className="w-12 h-12 text-gray-400"/>
                    <p className="ml-4 text-gray-500">{tr.revenueVsExpenses} Chart Area</p>
                </div>
            </div>
        </div>
    );
};

// Modals
const InvoiceModal: React.FC<{isOpen: boolean, onClose: () => void, onSave: (inv: Invoice) => void, invoice: Invoice | null, services: BillableService[], t: Translation}> = ({isOpen, onClose, onSave, invoice, services, t}) => {
     if(!isOpen) return null;
     return (
         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl"><div className="p-4">Invoice Modal Under Construction</div><button onClick={onClose} className="p-2">Close</button></div>
        </div>
    );
};

const ServiceModal: React.FC<{isOpen: boolean, onClose: () => void, onSave: (srv: BillableService) => void, service: BillableService | null, t: Translation}> = ({isOpen, onClose, onSave, service, t}) => {
    const ts = t.financialManagement.services;
    const [formData, setFormData] = useState({
        name: service?.name || '',
        category: service?.category || 'consultation' as ServiceCategoryKey,
        price: service?.price || 0,
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value, type} = e.target;
        setFormData(p => ({...p, [name]: type === 'number' ? parseFloat(value) || 0 : value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: service?.id || `SRV-${Date.now()}`,
            ...formData
        });
        onClose();
    };

    if(!isOpen) return null;
     return (
         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center p-4 border-b"><h2 className="text-xl font-bold">{service ? ts.modalTitleEdit : ts.modalTitleNew}</h2><button onClick={onClose}><XMarkIcon className="w-6 h-6"/></button></div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <input name="name" placeholder={ts.formName} value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded">
                        {(Object.keys(ts.categories) as ServiceCategoryKey[]).map(key => (
                            <option key={key} value={key}>{ts.categories[key]}</option>
                        ))}
                    </select>
                    <input name="price" type="number" step="0.01" placeholder={ts.formPrice} value={formData.price} onChange={handleChange} className="w-full p-2 border rounded" required />
                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">{ts.cancel}</button>
                        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded">{ts.save}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
