import React, { useState, useEffect } from 'react';
import type { Translation, Patient, Service } from '../types';
import { mockPatients, availableServices } from '../constants';
import { PatientsIcon, UserGroupIcon, PlusIcon, PencilIcon, PrinterIcon, XMarkIcon } from './icons';

interface PatientManagementProps {
    t: Translation;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
            <div className="bg-sky-100 p-3 rounded-full">
                {icon}
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    </div>
);

const PatientModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    patient: Patient | null;
    onSave: (patient: Patient) => void;
    t: Translation;
}> = ({ isOpen, onClose, patient, onSave, t }) => {
    const [formData, setFormData] = useState<Patient | null>(null);

    useEffect(() => {
        if (patient) {
            setFormData(patient);
        } else {
            // Default for new patient
            const today = new Date().toISOString().split('T')[0];
            setFormData({
                id: `P${Math.floor(Math.random() * 900) + 100}`,
                name: '',
                age: 0,
                gender: 'Male',
                address: '',
                patientPhone: '',
                emergencyContact: '',
                registrationDate: today,
                lastVisitDate: today,
                services: []
            });
        }
    }, [patient]);

    if (!isOpen || !formData) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => prev ? { ...prev, [name]: name === 'age' ? parseInt(value) || 0 : value } : null);
    };
    
    const handleServiceChange = (serviceId: keyof Translation['modules']) => {
        setFormData(prev => {
            if (!prev) return null;
            const newServices = prev.services.includes(serviceId)
                ? prev.services.filter(s => s !== serviceId)
                : [...prev.services, serviceId];
            return { ...prev, services: newServices };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData) {
            onSave(formData);
        }
    };
    
    const tp = t.patientManagement;

    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col">
                <div className="flex justify-between items-center p-5 border-b bg-white rounded-t-xl">
                    <h2 className="text-2xl font-bold text-gray-800">{patient ? tp.modalTitleEdit : tp.modalTitleAdd}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="w-7 h-7" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
                    {/* Personal Information Section */}
                    <div className="p-5 bg-white rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">المعلومات الشخصية</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">{tp.formName} <span className="text-red-500">*</span></label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputStyle} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{tp.formAge} <span className="text-red-500">*</span></label>
                                <input type="number" name="age" value={formData.age} onChange={handleChange} className={inputStyle} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{tp.formGender}</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className={inputStyle}>
                                    <option value="Male">{tp.formGenderMale}</option>
                                    <option value="Female">{tp.formGenderFemale}</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{tp.formPatientPhone} <span className="text-red-500">*</span></label>
                                <input type="tel" name="patientPhone" value={formData.patientPhone} onChange={handleChange} className={inputStyle} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{tp.formEmergencyContact}</label>
                                <input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} className={inputStyle} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">{tp.formAddress} <span className="text-red-500">*</span></label>
                                <input type="text" name="address" value={formData.address} onChange={handleChange} className={inputStyle} required />
                            </div>
                        </div>
                    </div>

                    {/* Visit Details Section */}
                    <div className="p-5 bg-white rounded-lg border border-gray-200">
                         <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">تفاصيل الزيارة</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{tp.formRegDate}</label>
                                <input type="date" name="registrationDate" value={formData.registrationDate} onChange={handleChange} className={inputStyle}/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">{tp.formLastVisit}</label>
                                <input type="date" name="lastVisitDate" value={formData.lastVisitDate} onChange={handleChange} className={inputStyle}/>
                            </div>
                         </div>
                    </div>

                    {/* Required Services Section */}
                    <div className="p-5 bg-white rounded-lg border border-gray-200">
                        <label className="block text-lg font-semibold text-gray-700 mb-4 border-b pb-2">{tp.formServices}</label>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                            {availableServices.map((service: Service) => (
                                <label key={service.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.services.includes(service.id)}
                                        onChange={() => handleServiceChange(service.id)}
                                        className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-2"
                                    />
                                    <span className="text-sm font-medium text-gray-800">{t.modules[service.labelKey]}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex justify-end items-center p-5 border-t bg-white rounded-b-xl sticky bottom-0">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200">{tp.cancel}</button>
                        <button type="submit" className="px-6 py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-200 ml-3">{tp.save}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export const PatientManagement: React.FC<PatientManagementProps> = ({ t }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState<Patient[]>(mockPatients);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

    const tp = t.patientManagement;

    const handleAddNew = () => {
        setEditingPatient(null);
        setIsModalOpen(true);
    };

    const handleEdit = (patient: Patient) => {
        setEditingPatient(patient);
        setIsModalOpen(true);
    };
    
    const handlePrint = (patient: Patient) => {
        const printContent = `
            <h1>Patient Record</h1>
            <p><strong>ID:</strong> ${patient.id}</p>
            <p><strong>Name:</strong> ${patient.name}</p>
            <p><strong>Age:</strong> ${patient.age}</p>
            <p><strong>Gender:</strong> ${patient.gender}</p>
            <p><strong>Phone:</strong> ${patient.patientPhone}</p>
            <p><strong>Emergency Contact:</strong> ${patient.emergencyContact}</p>
            <p><strong>Registration Date:</strong> ${patient.registrationDate}</p>
            <p><strong>Last Visit:</strong> ${patient.lastVisitDate}</p>
            <p><strong>Services:</strong> ${patient.services.map(s => t.modules[s]).join(', ')}</p>
        `;
        const printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Print Patient Record</title></head><body>');
            printWindow.document.write(printContent);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    };

    const handleSave = (patientData: Patient) => {
        if (editingPatient) {
            setPatients(patients.map(p => p.id === patientData.id ? patientData : p));
        } else {
            setPatients([patientData, ...patients]);
        }
        setIsModalOpen(false);
        setEditingPatient(null);
    };

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <PatientsIcon className="w-8 h-8 mr-3 text-sky-500" />
                {tp.title}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard title={tp.totalPatients} value={patients.length} icon={<UserGroupIcon className="h-6 w-6 text-sky-500" />} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                    <input
                        type="text"
                        placeholder={tp.searchPlaceholder}
                        className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg mb-2 md:mb-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button onClick={handleAddNew} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        {tp.addNewPatient}
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tp.tableId}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tp.tableName}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tp.tablePatientPhone}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tp.tableEmergencyContact}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tp.tableRegDate}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tp.tableLastVisit}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tp.tableServices}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tp.tableActions}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPatients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.patientPhone}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.emergencyContact}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.registrationDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.lastVisitDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {patient.services.map(s => t.modules[s]).join(', ')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                        <button onClick={() => handleEdit(patient)} className="text-indigo-600 hover:text-indigo-900" title={tp.edit}><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handlePrint(patient)} className="text-gray-600 hover:text-gray-900" title={tp.print}><PrinterIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <PatientModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                patient={editingPatient}
                onSave={handleSave}
                t={t}
            />
        </div>
    );
};