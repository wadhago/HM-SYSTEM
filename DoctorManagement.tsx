import React, { useState, useEffect } from 'react';
import type { Translation, Doctor, Role, Specialty } from '../types';
import { mockDoctors, availableRoles, availableSpecialties } from '../constants';
import { DoctorsIcon, PlusIcon, PencilIcon, PrinterIcon, XMarkIcon, TrashIcon } from './icons';

interface DoctorManagementProps {
    t: Translation;
}

const DoctorModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    doctor: Doctor | null;
    onSave: (doctor: Doctor) => void;
    t: Translation;
}> = ({ isOpen, onClose, doctor, onSave, t }) => {
    const [formData, setFormData] = useState<Doctor | null>(null);

    useEffect(() => {
        if (doctor) {
            setFormData(doctor);
        } else {
            // Default for new doctor
            setFormData({
                id: `D${Math.floor(Math.random() * 900) + 100}`,
                name: '',
                age: 0,
                gender: 'Male',
                email: '',
                phone: '',
                role: availableRoles[0].id,
                specialty: availableSpecialties[0].id
            });
        }
    }, [doctor]);

    if (!isOpen || !formData) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => prev ? { ...prev, [name]: name === 'age' ? parseInt(value) || 0 : value } : null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData) {
            onSave(formData);
        }
    };
    
    const td = t.doctorManagement;
    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col">
                <div className="flex justify-between items-center p-5 border-b bg-white rounded-t-xl">
                    <h2 className="text-2xl font-bold text-gray-800">{doctor ? td.modalTitleEdit : td.modalTitleAdd}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="w-7 h-7" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">{td.formName} <span className="text-red-500">*</span></label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputStyle} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{td.formAge} <span className="text-red-500">*</span></label>
                            <input type="number" name="age" value={formData.age} onChange={handleChange} className={inputStyle} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{td.formGender}</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} className={inputStyle}>
                                <option value="Male">{td.formGenderMale}</option>
                                <option value="Female">{td.formGenderFemale}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{td.formEmail} <span className="text-red-500">*</span></label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputStyle} required />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">{td.formPhone} <span className="text-red-500">*</span></label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputStyle} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{td.formRole} <span className="text-red-500">*</span></label>
                            <select name="role" value={formData.role} onChange={handleChange} className={inputStyle}>
                                {availableRoles.map((role: Role) => (
                                    <option key={role.id} value={role.id}>{td.roles[role.labelKey]}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{td.formSpecialty} <span className="text-red-500">*</span></label>
                            <select name="specialty" value={formData.specialty} onChange={handleChange} className={inputStyle}>
                                {availableSpecialties.map((spec: Specialty) => (
                                     <option key={spec.id} value={spec.id}>{td.specialties[spec.labelKey]}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className="flex justify-end items-center pt-4 mt-4 border-t">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200">{td.cancel}</button>
                        <button type="submit" className="px-6 py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-200 ml-3">{td.save}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const DoctorManagement: React.FC<DoctorManagementProps> = ({ t }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

    const td = t.doctorManagement;

    const handleAddNew = () => {
        setEditingDoctor(null);
        setIsModalOpen(true);
    };

    const handleEdit = (doctor: Doctor) => {
        setEditingDoctor(doctor);
        setIsModalOpen(true);
    };

    const handleDelete = (doctorId: string) => {
        if (window.confirm(td.deleteConfirm)) {
            setDoctors(doctors.filter(d => d.id !== doctorId));
        }
    };

    const handlePrint = (doctor: Doctor) => {
        const printContent = `
            <h1>Doctor Record</h1>
            <p><strong>ID:</strong> ${doctor.id}</p>
            <p><strong>Name:</strong> ${doctor.name}</p>
            <p><strong>Age:</strong> ${doctor.age}</p>
            <p><strong>Gender:</strong> ${doctor.gender}</p>
            <p><strong>Phone:</strong> ${doctor.phone}</p>
            <p><strong>Email:</strong> ${doctor.email}</p>
            <p><strong>Role:</strong> ${td.roles[doctor.role]}</p>
            <p><strong>Specialty:</strong> ${td.specialties[doctor.specialty]}</p>
        `;
        const printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Print Doctor Record</title></head><body>');
            printWindow.document.write(printContent);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    };

    const handleSave = (doctorData: Doctor) => {
        if (editingDoctor) {
            setDoctors(doctors.map(d => d.id === doctorData.id ? doctorData : d));
        } else {
            setDoctors([doctorData, ...doctors]);
        }
        setIsModalOpen(false);
        setEditingDoctor(null);
    };

    const filteredDoctors = doctors.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        td.specialties[d.specialty].toLowerCase().includes(searchTerm.toLowerCase()) ||
        td.roles[d.role].toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <DoctorsIcon className="w-8 h-8 mr-3 text-indigo-500" />
                {td.title}
            </h1>

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                    <input
                        type="text"
                        placeholder={td.searchPlaceholder}
                        className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg mb-2 md:mb-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button onClick={handleAddNew} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        {td.addNewDoctor}
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{td.tableId}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{td.tableName}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{td.tableRole}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{td.tableSpecialty}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{td.tablePhone}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{td.tableEmail}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{td.tableActions}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredDoctors.map((doctor) => (
                                <tr key={doctor.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doctor.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{td.roles[doctor.role]}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{td.specialties[doctor.specialty]}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.phone}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                        <button onClick={() => handleEdit(doctor)} className="text-indigo-600 hover:text-indigo-900" title={td.edit}><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDelete(doctor.id)} className="text-red-600 hover:text-red-900" title={td.delete}><TrashIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handlePrint(doctor)} className="text-gray-600 hover:text-gray-900" title={td.print}><PrinterIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <DoctorModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    doctor={editingDoctor}
                    onSave={handleSave}
                    t={t}
                />
            )}
        </div>
    );
};