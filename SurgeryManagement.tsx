
import React, { useState, useMemo, useEffect } from 'react';
import type { Translation, SurgicalProcedureRecord, Patient, Doctor, AvailableSurgicalProcedure, SurgicalDepartmentKey, SurgeryClassificationKey } from '../types';
import { mockSurgicalProcedures, mockPatients, mockDoctors, mockAvailableSurgicalProcedures } from '../constants';
import { ScalpelIcon, PlusIcon, XMarkIcon, TrashIcon, PencilIcon, PrinterIcon } from './icons';

interface SurgeryManagementProps {
    t: Translation;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
            <div className="bg-rose-100 p-3 rounded-full">
                {icon}
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    </div>
);

export const SurgeryManagement: React.FC<SurgeryManagementProps> = ({ t }) => {
    const [surgeries, setSurgeries] = useState<SurgicalProcedureRecord[]>(mockSurgicalProcedures);
    const [availableProcedures, setAvailableProcedures] = useState<AvailableSurgicalProcedure[]>(mockAvailableSurgicalProcedures);
    const [searchTerm, setSearchTerm] = useState('');
    const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
    const [isManageModalOpen, setManageModalOpen] = useState(false);
    const [editingSurgery, setEditingSurgery] = useState<SurgicalProcedureRecord | null>(null);

    const ts = t.surgery;

    const patientMap = useMemo(() => new Map(mockPatients.map(p => [p.id, p])), []);
    const doctorMap = useMemo(() => new Map(mockDoctors.map(d => [d.id, d])), []);
    const procedureMap = useMemo(() => new Map(availableProcedures.map(p => [p.id, p])), [availableProcedures]);

    const handleSaveSurgery = (surgery: SurgicalProcedureRecord) => {
        setSurgeries(prev => {
            const exists = prev.some(s => s.id === surgery.id);
            if (exists) {
                return prev.map(s => s.id === surgery.id ? surgery : s);
            }
            return [surgery, ...prev];
        });
        setRegisterModalOpen(false);
    };

    const handleSaveProcedures = (procedures: AvailableSurgicalProcedure[]) => {
        setAvailableProcedures(procedures);
    };

    const handleEdit = (surgery: SurgicalProcedureRecord) => {
        setEditingSurgery(surgery);
        setRegisterModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm(ts.deleteConfirm)) {
            setSurgeries(prev => prev.filter(s => s.id !== id));
        }
    };

    const filteredSurgeries = surgeries.filter(s => {
        const patient = patientMap.get(s.patientId);
        const procedure = procedureMap.get(s.procedureId);
        return (
            patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            procedure?.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const getStatusChip = (status: SurgicalProcedureRecord['status']) => {
        switch (status) {
            case 'Scheduled': return <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">{ts.statusScheduled}</span>;
            case 'In Progress': return <span className="px-2 py-1 text-xs font-semibold text-orange-800 bg-orange-100 rounded-full">{ts.statusInProgress}</span>;
            case 'Completed': return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">{ts.statusCompleted}</span>;
            case 'Cancelled': return <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded-full">{ts.statusCancelled}</span>;
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <ScalpelIcon className="w-8 h-8 mr-3 text-rose-500" />
                {ts.title}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard title={ts.scheduledSurgeries} value={surgeries.filter(s => s.status === 'Scheduled').length} icon={<ScalpelIcon className="h-6 w-6 text-blue-500" />} />
                <StatCard title={ts.surgeriesToday} value={surgeries.filter(s => new Date(s.scheduledDateTime).toDateString() === new Date().toDateString()).length} icon={<ScalpelIcon className="h-6 w-6 text-green-500" />} />
                <StatCard title={ts.operatingRooms} value={new Set(surgeries.map(s => s.operatingRoom)).size} icon={<ScalpelIcon className="h-6 w-6 text-rose-500" />} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <input
                        type="text"
                        placeholder={ts.searchPlaceholder}
                        className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <div className="space-x-2">
                        <button onClick={() => setManageModalOpen(true)} className="px-4 py-2 bg-gray-600 text-white rounded-lg">{ts.manageProcedures}</button>
                        <button onClick={() => { setEditingSurgery(null); setRegisterModalOpen(true); }} className="px-4 py-2 bg-primary-600 text-white rounded-lg">{ts.registerNew}</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ts.tablePatient}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ts.tableProcedure}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ts.tableSurgeon}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ts.tableDateTime}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ts.tableRoom}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ts.tableStatus}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{ts.tableActions}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredSurgeries.map(s => (
                                <tr key={s.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{patientMap.get(s.patientId)?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{procedureMap.get(s.procedureId)?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{doctorMap.get(s.surgeonId)?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(s.scheduledDateTime).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{s.operatingRoom}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusChip(s.status)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                        <button onClick={() => handleEdit(s)} className="text-indigo-600" title={ts.edit}><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDelete(s.id)} className="text-red-600" title={ts.delete}><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {isManageModalOpen && <ManageProceduresModal isOpen={isManageModalOpen} onClose={() => setManageModalOpen(false)} onSave={handleSaveProcedures} initialProcedures={availableProcedures} t={t} />}
            {isRegisterModalOpen && <RegisterSurgeryModal isOpen={isRegisterModalOpen} onClose={() => setRegisterModalOpen(false)} onSave={handleSaveSurgery} surgery={editingSurgery} availableProcedures={availableProcedures} t={t} />}

        </div>
    );
};

// Modals
const ManageProceduresModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (p: AvailableSurgicalProcedure[]) => void; initialProcedures: AvailableSurgicalProcedure[]; t: Translation; }> = ({ isOpen, onClose, onSave, initialProcedures, t }) => {
    const [procedures, setProcedures] = useState(initialProcedures);
    const [editingProcedure, setEditingProcedure] = useState<AvailableSurgicalProcedure | null>(null);
    const [formData, setFormData] = useState({ name: '', department: 'general' as SurgicalDepartmentKey, classification: 'minor' as SurgeryClassificationKey, price: 0 });
    const ts = t.surgery;

    const handleEdit = (proc: AvailableSurgicalProcedure) => {
        setEditingProcedure(proc);
        setFormData({ name: proc.name, department: proc.department, classification: proc.classification, price: proc.price });
    };

    const handleCancelEdit = () => {
        setEditingProcedure(null);
        setFormData({ name: '', department: 'general', classification: 'minor', price: 0 });
    };

    const handleSave = () => {
        if (editingProcedure) {
            const updated = procedures.map(p => p.id === editingProcedure.id ? { ...editingProcedure, ...formData } : p);
            setProcedures(updated);
            onSave(updated);
        } else {
            const newProc = { id: `PROC${Date.now()}`, ...formData };
            const updated = [...procedures, newProc];
            setProcedures(updated);
            onSave(updated);
        }
        handleCancelEdit();
    };

    const handleDelete = (id: string) => {
        if (window.confirm(ts.deleteProcedureConfirm)) {
            const updated = procedures.filter(p => p.id !== id);
            setProcedures(updated);
            onSave(updated);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">{ts.manageProceduresTitle}</h2>
                    <button onClick={onClose}><XMarkIcon className="w-6 h-6"/></button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder={ts.procedureName} value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="p-2 border rounded"/>
                        <input type="number" placeholder={ts.price} value={formData.price} onChange={e => setFormData(p => ({ ...p, price: Number(e.target.value) }))} className="p-2 border rounded"/>
                        <select value={formData.department} onChange={e => setFormData(p => ({...p, department: e.target.value as SurgicalDepartmentKey}))} className="p-2 border rounded">
                             {(Object.keys(ts.departments) as SurgicalDepartmentKey[]).map(key => <option key={key} value={key}>{ts.departments[key]}</option>)}
                        </select>
                         <select value={formData.classification} onChange={e => setFormData(p => ({...p, classification: e.target.value as SurgeryClassificationKey}))} className="p-2 border rounded">
                             {(Object.keys(ts.classifications) as SurgeryClassificationKey[]).map(key => <option key={key} value={key}>{ts.classifications[key]}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2">
                        {editingProcedure && <button onClick={handleCancelEdit} className="px-4 py-2 bg-gray-200 rounded">{ts.cancel}</button>}
                        <button onClick={handleSave} className="px-4 py-2 bg-primary-600 text-white rounded">{editingProcedure ? ts.updateProcedure : ts.addProcedure}</button>
                    </div>
                </div>
                <div className="p-6 border-t overflow-y-auto">
                    <table className="min-w-full">
                        <tbody>
                            {procedures.map(p => (
                                <tr key={p.id} className="border-b">
                                    <td className="py-2">{p.name}</td>
                                    <td className="py-2">{ts.departments[p.department]}</td>
                                    <td className="py-2">${p.price}</td>
                                    <td className="py-2 space-x-2 text-right">
                                        <button onClick={() => handleEdit(p)} className="text-indigo-600"><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDelete(p.id)} className="text-red-600"><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const RegisterSurgeryModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (s: SurgicalProcedureRecord) => void; surgery: SurgicalProcedureRecord | null; availableProcedures: AvailableSurgicalProcedure[]; t: Translation; }> = ({ isOpen, onClose, onSave, surgery, availableProcedures, t }) => {
    const [step, setStep] = useState(surgery ? 2 : 1);
    const [patientSearch, setPatientSearch] = useState('');
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(surgery?.patientId || null);
    
    const initialProcedure = useMemo(() => {
        return surgery ? availableProcedures.find(p => p.id === surgery.procedureId) : null;
    }, [surgery, availableProcedures]);

    const [formData, setFormData] = useState({
        diagnosis: surgery?.diagnosis || '',
        department: initialProcedure ? initialProcedure.department : 'general' as SurgicalDepartmentKey,
        procedureId: surgery?.procedureId || '',
        surgeonId: surgery?.surgeonId || '',
        anesthetistId: surgery?.anesthetistId || '',
        scheduledDateTime: surgery?.scheduledDateTime ? surgery.scheduledDateTime.substring(0, 16) : '',
        operatingRoom: surgery?.operatingRoom || 'OR 1',
        status: surgery?.status || 'Scheduled',
        notes: surgery?.notes || '',
    });
    
    const ts = t.surgery;
    const patient = useMemo(() => mockPatients.find(p => p.id === selectedPatientId), [selectedPatientId]);
    const procedure = useMemo(() => availableProcedures.find(p => p.id === formData.procedureId), [formData.procedureId, availableProcedures]);
    
    const filteredPatients = mockPatients.filter(p => p.name.toLowerCase().includes(patientSearch.toLowerCase()) || p.id.includes(patientSearch) || p.patientPhone.includes(patientSearch));
    const surgeons = mockDoctors.filter(d => d.specialty === 'surgery');
    const proceduresInDept = useMemo(() => availableProcedures.filter(p => p.department === formData.department), [formData.department, availableProcedures]);

    useEffect(() => {
        // Reset procedure if department changes
        setFormData(p => ({ ...p, procedureId: '' }));
    }, [formData.department]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(p => ({ ...p, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPatientId) return;

        const finalSurgery: SurgicalProcedureRecord = {
            id: surgery?.id || `SURG${Date.now()}`,
            patientId: selectedPatientId,
            procedureId: formData.procedureId,
            surgeonId: formData.surgeonId,
            anesthetistId: formData.anesthetistId,
            diagnosis: formData.diagnosis,
            scheduledDateTime: new Date(formData.scheduledDateTime).toISOString(),
            status: formData.status as SurgicalProcedureRecord['status'],
            operatingRoom: formData.operatingRoom,
            notes: formData.notes,
        };
        onSave(finalSurgery);
    };
    
    if(!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b"><h2 className="text-xl font-bold">{surgery ? ts.editModalTitle : ts.registerModalTitle}</h2><button onClick={onClose}><XMarkIcon className="w-6 h-6"/></button></div>
                {step === 1 && (
                     <div className="p-6">
                        <h3 className="font-semibold mb-2">{ts.step1}</h3>
                        <input type="text" placeholder={ts.searchPatientPlaceholder} value={patientSearch} onChange={(e) => setPatientSearch(e.target.value)} className="w-full p-2 border rounded" />
                        <ul className="mt-2 max-h-60 overflow-y-auto">
                            {filteredPatients.map(p => (
                                <li key={p.id} className="flex justify-between items-center p-2 hover:bg-gray-100">
                                    <div><p>{p.name}</p><p className="text-sm text-gray-500">{p.id}</p></div>
                                    <button onClick={() => { setSelectedPatientId(p.id); setStep(2); }} className="px-3 py-1 bg-primary-500 text-white text-sm rounded">{ts.selectPatient}</button>
                                </li>
                            ))}
                        </ul>
                     </div>
                )}

                {step === 2 && patient && (
                    <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
                        <div className="p-6 space-y-4 overflow-y-auto">
                            <h3 className="font-semibold mb-2">{ts.step2}</h3>
                            <div className="bg-gray-100 p-3 rounded"><h4>{ts.patientDetails}:</h4><p>{patient.name} ({patient.id})</p></div>
                            <input name="diagnosis" placeholder={ts.diagnosis} value={formData.diagnosis} onChange={handleChange} className="w-full p-2 border rounded" />
                            <input name="scheduledDateTime" type="datetime-local" value={formData.scheduledDateTime} onChange={handleChange} className="w-full p-2 border rounded"/>
                            <div className="grid grid-cols-2 gap-4">
                                <select name="department" value={formData.department} onChange={handleChange} className="w-full p-2 border rounded">
                                    {(Object.keys(ts.departments) as SurgicalDepartmentKey[]).map(key => <option key={key} value={key}>{ts.departments[key]}</option>)}
                                </select>
                                <select name="procedureId" value={formData.procedureId} onChange={handleChange} className="w-full p-2 border rounded">
                                    <option value="">{ts.procedure}</option>
                                    {proceduresInDept.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            {procedure && (
                                <div className="bg-gray-100 p-2 rounded text-sm grid grid-cols-2">
                                    <p><strong>{ts.classification}:</strong> {ts.classifications[procedure.classification]}</p>
                                    <p><strong>{ts.price}:</strong> ${procedure.price}</p>
                                </div>
                            )}
                            <select name="surgeonId" value={formData.surgeonId} onChange={handleChange} className="w-full p-2 border rounded"><option value="">{ts.surgeon}</option>{surgeons.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
                            <input name="operatingRoom" value={formData.operatingRoom} onChange={handleChange} placeholder={ts.operatingRoom} className="w-full p-2 border rounded"/>
                        </div>
                        <div className="p-4 border-t flex justify-between">
                            {!surgery && <button type="button" onClick={() => setStep(1)} className="px-4 py-2 bg-gray-200 rounded">{ts.back}</button>}
                            <div/>
                            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded">{ts.save}</button>
                        </div>
                    </form>
                )}
             </div>
        </div>
    );
};