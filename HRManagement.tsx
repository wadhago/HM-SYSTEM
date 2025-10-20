
import React, { useState, useMemo, useEffect } from 'react';
import type { Translation, Employee, EmployeeLeave } from '../types';
import { mockEmployees, mockEmployeeLeaves } from '../constants';
import { UserGroupIcon, PlusIcon, XMarkIcon, TrashIcon, PencilIcon, PrinterIcon } from './icons';

type HRView = 'employees' | 'leaves';

interface HRManagementProps {
    t: Translation;
}

export const HRManagement: React.FC<HRManagementProps> = ({ t }) => {
    const [activeTab, setActiveTab] = useState<HRView>('employees');
    const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
    const [leaves, setLeaves] = useState<EmployeeLeave[]>(mockEmployeeLeaves);
    
    const th = t.hr;
    
    const employeeMap = useMemo(() => new Map(employees.map(e => [e.id, e])), [employees]);

    const handleSaveEmployee = (employee: Employee) => {
        setEmployees(prev => {
            const exists = prev.some(e => e.id === employee.id);
            if (exists) {
                return prev.map(e => e.id === employee.id ? employee : e);
            }
            return [employee, ...prev];
        });
    };
    
    const handleDeleteEmployee = (employeeId: string) => {
        setEmployees(prev => prev.filter(e => e.id !== employeeId));
        // Also remove any leave records for this employee
        setLeaves(prev => prev.filter(l => l.employeeId !== employeeId));
    };

    const handleSaveLeave = (leave: EmployeeLeave) => {
        setLeaves(prev => {
            const exists = prev.some(l => l.id === leave.id);
            if (exists) {
                return prev.map(l => l.id === leave.id ? leave : l);
            }
            return [leave, ...prev];
        });
    };

    const handleDeleteLeave = (leaveId: string) => {
        setLeaves(prev => prev.filter(l => l.id !== leaveId));
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'employees':
                return <EmployeeRecordsTab t={t} employees={employees} onSave={handleSaveEmployee} onDelete={handleDeleteEmployee} />;
            case 'leaves':
                return <LeaveManagementTab t={t} leaves={leaves} onSave={handleSaveLeave} onDelete={handleDeleteLeave} employeeMap={employeeMap} employees={employees}/>;
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <UserGroupIcon className="w-8 h-8 mr-3 text-cyan-500" />
                {th.title}
            </h1>
            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-6">
                    {/* FIX: Use a more direct type assertion for mapping Object.keys to component keys. */}
                    {(Object.keys(th.tabs) as Array<keyof typeof th.tabs>).map(key => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key as HRView)}
                            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                                activeTab === key
                                    ? 'border-primary-500 text-primary-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {th.tabs[key]}
                        </button>
                    ))}
                </nav>
            </div>
            {renderContent()}
        </div>
    );
};

// Employee Records Tab
const EmployeeRecordsTab: React.FC<{
    t: Translation,
    employees: Employee[],
    onSave: (employee: Employee) => void,
    onDelete: (employeeId: string) => void,
}> = ({ t, employees, onSave, onDelete }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const te = t.hr.employees;

    const handleEdit = (emp: Employee) => {
        setEditingEmployee(emp);
        setModalOpen(true);
    };

    const handlePrint = (emp: Employee) => {
        const printContent = `<h1>Employee Record</h1><p><strong>ID:</strong> ${emp.id}</p><p><strong>Name:</strong> ${emp.name}</p>...`; // Add more fields
        const printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow) {
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.print();
        }
    };
    
    const handlePrintAll = () => {
        // Similar to individual print but loop through all employees
        const printContent = `<h1>Employee List</h1>...`;
        const printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow) {
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.print();
        }
    };

    const filteredEmployees = employees.filter(e =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                 <input type="text" placeholder={te.searchPlaceholder} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-1/3 p-2 border rounded"/>
                 <div className="space-x-2">
                    <button onClick={handlePrintAll} className="px-4 py-2 bg-gray-600 text-white rounded-lg"><PrinterIcon className="w-5 h-5 inline mr-2"/>{te.printAll}</button>
                    <button onClick={() => { setEditingEmployee(null); setModalOpen(true); }} className="px-4 py-2 bg-primary-600 text-white rounded-lg"><PlusIcon className="w-5 h-5 inline mr-2"/>{te.addNew}</button>
                </div>
            </div>
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{te.tableId}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{te.tableName}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{te.tableDepartment}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{te.tableJobTitle}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{te.tablePhone}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{te.tableHireDate}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{te.tableActions}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredEmployees.map(emp => (
                            <tr key={emp.id}>
                                <td className="px-6 py-4 text-sm">{emp.id}</td>
                                <td className="px-6 py-4 text-sm">{emp.name}</td>
                                <td className="px-6 py-4 text-sm">{emp.department}</td>
                                <td className="px-6 py-4 text-sm">{emp.jobTitle}</td>
                                <td className="px-6 py-4 text-sm">{emp.phone}</td>
                                <td className="px-6 py-4 text-sm">{emp.hireDate}</td>
                                <td className="px-6 py-4 text-sm space-x-2">
                                     <button onClick={() => handlePrint(emp)} className="text-gray-600" title={te.print}><PrinterIcon className="w-5 h-5"/></button>
                                     <button onClick={() => handleEdit(emp)} className="text-indigo-600" title={te.edit}><PencilIcon className="w-5 h-5"/></button>
                                     <button onClick={() => window.confirm(te.deleteConfirm) && onDelete(emp.id)} className="text-red-600" title={te.delete}><TrashIcon className="w-5 h-5"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <EmployeeModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSave={onSave} employee={editingEmployee} t={t}/>}
        </div>
    );
};

// Leave Management Tab
const LeaveManagementTab: React.FC<{
    t: Translation,
    leaves: EmployeeLeave[],
    onSave: (leave: EmployeeLeave) => void,
    onDelete: (leaveId: string) => void,
    employeeMap: Map<string, Employee>,
    employees: Employee[],
}> = ({ t, leaves, onSave, onDelete, employeeMap, employees }) => {
     const [isModalOpen, setModalOpen] = useState(false);
    const [editingLeave, setEditingLeave] = useState<EmployeeLeave | null>(null);
    const tl = t.hr.leaves;

    const handleEdit = (leave: EmployeeLeave) => {
        setEditingLeave(leave);
        setModalOpen(true);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{tl.title}</h2>
                <div className="space-x-2">
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-lg"><PrinterIcon className="w-5 h-5 inline mr-2"/>{tl.printAll}</button>
                    <button onClick={() => { setEditingLeave(null); setModalOpen(true); }} className="px-4 py-2 bg-primary-600 text-white rounded-lg"><PlusIcon className="w-5 h-5 inline mr-2"/>{tl.addNew}</button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{tl.tableEmployee}</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{tl.tableDepartment}</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{tl.tableStartDate}</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{tl.tableDuration}</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{tl.tableEndDate}</th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{tl.tableActions}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                         {leaves.map(leave => {
                            const emp = employeeMap.get(leave.employeeId);
                            return (
                                <tr key={leave.id}>
                                    <td className="px-6 py-4 text-sm">{emp?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm">{emp?.department || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm">{leave.startDate}</td>
                                    <td className="px-6 py-4 text-sm">{leave.duration} {tl.days}</td>
                                    <td className="px-6 py-4 text-sm">{leave.endDate}</td>
                                    <td className="px-6 py-4 text-sm space-x-2">
                                         <button className="text-gray-600" title={tl.print}><PrinterIcon className="w-5 h-5"/></button>
                                         <button onClick={() => handleEdit(leave)} className="text-indigo-600" title={tl.edit}><PencilIcon className="w-5 h-5"/></button>
                                         <button onClick={() => window.confirm(tl.deleteConfirm) && onDelete(leave.id)} className="text-red-600" title={tl.delete}><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            )
                         })}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <LeaveModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSave={onSave} leave={editingLeave} employees={employees} t={t} />}
        </div>
    );
};

// Modals
const EmployeeModal: React.FC<{isOpen: boolean, onClose: () => void, onSave: (emp: Employee) => void, employee: Employee | null, t: Translation}> = ({ isOpen, onClose, onSave, employee, t }) => {
    const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
        name: employee?.name || '',
        age: employee?.age || 0,
        gender: employee?.gender || 'Male',
        phone: employee?.phone || '',
        address: employee?.address || '',
        department: employee?.department || '',
        jobTitle: employee?.jobTitle || '',
        jobGrade: employee?.jobGrade || '',
        hireDate: employee?.hireDate || new Date().toISOString().split('T')[0],
        salary: employee?.salary || 0,
    });
    const te = t.hr.employees;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(p => ({...p, [name]: type === 'number' ? parseFloat(value) || 0 : value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: employee?.id || `E${Date.now()}`, ...formData });
        onClose();
    };

    if(!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b"><h2 className="text-xl font-bold">{employee ? te.modalTitleEdit : te.modalTitleAdd}</h2><button onClick={onClose}><XMarkIcon className="w-6 h-6"/></button></div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="name" placeholder={te.formName} value={formData.name} onChange={handleChange} className="p-2 border rounded"/>
                        <input name="age" type="number" placeholder={te.formAge} value={formData.age} onChange={handleChange} className="p-2 border rounded"/>
                        <select name="gender" value={formData.gender} onChange={handleChange} className="p-2 border rounded">
                            <option value="Male">{te.formGenderMale}</option>
                            <option value="Female">{te.formGenderFemale}</option>
                        </select>
                        <input name="phone" placeholder={te.formPhone} value={formData.phone} onChange={handleChange} className="p-2 border rounded"/>
                        <input name="address" placeholder={te.formAddress} value={formData.address} onChange={handleChange} className="p-2 border rounded md:col-span-2"/>
                        <input name="department" placeholder={te.formDepartment} value={formData.department} onChange={handleChange} className="p-2 border rounded"/>
                        <input name="jobTitle" placeholder={te.formJobTitle} value={formData.jobTitle} onChange={handleChange} className="p-2 border rounded"/>
                        <input name="jobGrade" placeholder={te.formJobGrade} value={formData.jobGrade} onChange={handleChange} className="p-2 border rounded"/>
                        <input name="hireDate" type="date" placeholder={te.formHireDate} value={formData.hireDate} onChange={handleChange} className="p-2 border rounded"/>
                        <input name="salary" type="number" placeholder={te.formSalary} value={formData.salary} onChange={handleChange} className="p-2 border rounded"/>
                    </div>
                    <div className="flex justify-end pt-4 space-x-2"><button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">{t.hr.cancel}</button><button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded">{t.hr.save}</button></div>
                </form>
            </div>
        </div>
    );
};

const LeaveModal: React.FC<{isOpen: boolean, onClose: () => void, onSave: (l: EmployeeLeave) => void, leave: EmployeeLeave | null, employees: Employee[], t: Translation}> = ({ isOpen, onClose, onSave, leave, employees, t }) => {
    const [formData, setFormData] = useState({
        employeeId: leave?.employeeId || (employees[0]?.id || ''),
        startDate: leave?.startDate || new Date().toISOString().split('T')[0],
        duration: leave?.duration || 1,
    });
    const tl = t.hr.leaves;
    
    const calculateEndDate = (start: string, duration: number) => {
        const date = new Date(start);
        date.setDate(date.getDate() + duration - 1);
        return date.toISOString().split('T')[0];
    };
    
    const endDate = calculateEndDate(formData.startDate, formData.duration);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(p => ({...p, [name]: type === 'number' ? parseInt(value) || 0 : value}));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: leave?.id || `L${Date.now()}`, ...formData, endDate });
        onClose();
    };

    if(!isOpen) return null;
    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center p-4 border-b"><h2 className="text-xl font-bold">{leave ? tl.modalTitleEdit : tl.modalTitleAdd}</h2><button onClick={onClose}><XMarkIcon className="w-6 h-6"/></button></div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <select name="employeeId" value={formData.employeeId} onChange={handleChange} className="w-full p-2 border rounded"><option value="">{tl.formEmployee}</option>{employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select>
                    <input name="startDate" type="date" value={formData.startDate} onChange={handleChange} className="w-full p-2 border rounded"/>
                    <input name="duration" type="number" min="1" value={formData.duration} onChange={handleChange} className="w-full p-2 border rounded" placeholder={tl.formDuration}/>
                    <input name="endDate" type="date" value={endDate} readOnly className="w-full p-2 border rounded bg-gray-100" placeholder={tl.formEndDate}/>
                    <div className="flex justify-end pt-4 space-x-2"><button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">{t.hr.cancel}</button><button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded">{t.hr.save}</button></div>
                </form>
            </div>
        </div>
    );
};