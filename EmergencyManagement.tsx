import React, { useState, useMemo } from 'react';
import type { Translation, EmergencyCase, Patient, Doctor } from '../types';
import { mockEmergencyCases, mockPatients, mockDoctors } from '../constants';
import { EmergencyIcon, UserPlusIcon, ClipboardDocumentListIcon, XMarkIcon } from './icons';

interface EmergencyManagementProps {
    t: Translation;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-full">
                {icon}
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    </div>
);

// Main Component
export const EmergencyManagement: React.FC<EmergencyManagementProps> = ({ t }) => {
    const [cases, setCases] = useState<EmergencyCase[]>(mockEmergencyCases);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isRecordModalOpen, setRecordModalOpen] = useState(false);
    const [selectedCase, setSelectedCase] = useState<EmergencyCase | null>(null);

    const te = t.emergency;

    const patientMap = useMemo<Map<string, Patient>>(() => new Map(mockPatients.map(p => [p.id, p])), []);
    const doctorMap = useMemo<Map<string, Doctor>>(() => new Map(mockDoctors.map(d => [d.id, d])), []);

    const handleOpenRecord = (caseItem: EmergencyCase) => {
        setSelectedCase(caseItem);
        setRecordModalOpen(true);
    };

    const handleSaveRecord = (updatedCase: EmergencyCase) => {
        setCases(cases.map(c => c.id === updatedCase.id ? updatedCase : c));
        setRecordModalOpen(false);
    };

    const handleAddCase = (newCase: Omit<EmergencyCase, 'id'>) => {
        const fullCase: EmergencyCase = {
            id: `ER${Math.floor(Math.random() * 900) + 100}`,
            ...newCase
        };
        setCases([fullCase, ...cases]);
        setAddModalOpen(false);
    };

    const filteredCases = cases.filter(c => {
        const patient = patientMap.get(c.patientId);
        return patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || c.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    const getTriageChip = (level: EmergencyCase['triageLevel']) => {
        switch (level) {
            case 'Red': return <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded-full">{te.triageRed}</span>;
            case 'Yellow': return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">{te.triageYellow}</span>;
            case 'Green': return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">{te.triageGreen}</span>;
        }
    };

    const getStatusChip = (status: EmergencyCase['status']) => {
        switch (status) {
            case 'In Progress': return <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">{te.statusInProgress}</span>;
            case 'Admitted': return <span className="px-2 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">{te.statusAdmitted}</span>;
            case 'Discharged': return <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded-full">{te.statusDischarged}</span>;
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <EmergencyIcon className="w-8 h-8 mr-3 text-red-500" />
                {te.title}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard title={te.inProgressCases} value={cases.filter(c => c.status === 'In Progress').length} icon={<EmergencyIcon className="h-6 w-6 text-blue-500" />} />
                <StatCard title={te.redCases} value={cases.filter(c => c.triageLevel === 'Red' && c.status !== 'Discharged').length} icon={<EmergencyIcon className="h-6 w-6 text-red-700" />} />
                <StatCard title={te.yellowCases} value={cases.filter(c => c.triageLevel === 'Yellow' && c.status !== 'Discharged').length} icon={<EmergencyIcon className="h-6 w-6 text-yellow-500" />} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                 <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                    <input
                        type="text"
                        placeholder={te.searchPlaceholder}
                        className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg mb-2 md:mb-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button onClick={() => setAddModalOpen(true)} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                        <UserPlusIcon className="w-5 h-5 mr-2" />
                        {te.addNewCase}
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{te.tablePatientId}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{te.tablePatientName}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{te.tableTriage}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{te.tableAdmittedAt}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{te.tableAttending}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{te.tableStatus}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{te.tableActions}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCases.map((caseItem) => {
                                const patient = patientMap.get(caseItem.patientId);
                                const doctor = doctorMap.get(caseItem.attendingERPhysicianId || '');
                                return (
                                <tr key={caseItem.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{caseItem.patientId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient?.name || 'Unknown'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{getTriageChip(caseItem.triageLevel)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(caseItem.admittedAt).toLocaleTimeString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusChip(caseItem.status)}</td>
                                     <td className="px-6 py-4 whitespace-nowrap text-sm">
                                         <button onClick={() => handleOpenRecord(caseItem)} className="text-indigo-600 hover:text-indigo-900" title={te.medicalRecord}><ClipboardDocumentListIcon className="w-5 h-5"/></button>
                                     </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>

            {isAddModalOpen && (
                <AddCaseModal 
                    isOpen={isAddModalOpen}
                    onClose={() => setAddModalOpen(false)}
                    onSave={handleAddCase}
                    t={t}
                />
            )}

            {isRecordModalOpen && selectedCase && (
                 <MedicalRecordModal
                    isOpen={isRecordModalOpen}
                    onClose={() => setRecordModalOpen(false)}
                    caseData={selectedCase}
                    onSave={handleSaveRecord}
                    patient={patientMap.get(selectedCase.patientId)}
                    doctors={mockDoctors}
                    t={t}
                />
            )}
        </div>
    );
};


// AddCaseModal Component
const AddCaseModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (newCase: Omit<EmergencyCase, 'id'>) => void;
    t: Translation;
}> = ({ isOpen, onClose, onSave, t }) => {
    const [step, setStep] = useState(1);
    const [patientSearch, setPatientSearch] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [caseDetails, setCaseDetails] = useState({
        triageLevel: 'Green' as EmergencyCase['triageLevel'],
        status: 'In Progress' as EmergencyCase['status'],
    });

    const te = t.emergency;

    const filteredPatients = mockPatients.filter(p => 
        p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.id.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.patientPhone.includes(patientSearch)
    );

    const handleSelectPatient = (patient: Patient) => {
        setSelectedPatient(patient);
        setStep(2);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPatient) return;
        
        const newCase: Omit<EmergencyCase, 'id'> = {
            patientId: selectedPatient.id,
            admittedAt: new Date().toISOString(),
            triageLevel: caseDetails.triageLevel,
            status: caseDetails.status,
            symptoms: '', medicalHistory: '', vitalSigns: '', physicalExamFindings: '',
            labTestsRequested: '', radiologyRequested: '', ecgRequested: '',
            labResults: '', radiologyResults: '', ecgResults: '',
            treatmentPlan: '', consultationRequest: '', consultationResponse: '',
            attendingERPhysicianId: null, erSpecialistId: null, admittingPhysicianId: null,
        };
        onSave(newCase);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">{te.addCaseTitle}</h2>
                    <button onClick={onClose}><XMarkIcon className="w-6 h-6" /></button>
                </div>
                
                {step === 1 && (
                    <div className="p-6">
                        <h3 className="font-semibold mb-2">{te.step1}</h3>
                        <input
                            type="text"
                            placeholder={te.searchPatientPlaceholder}
                            value={patientSearch}
                            onChange={(e) => setPatientSearch(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                        <ul className="mt-2 max-h-60 overflow-y-auto">
                            {filteredPatients.length > 0 ? filteredPatients.map(p => (
                                <li key={p.id} className="flex justify-between items-center p-2 hover:bg-gray-100">
                                    <div>
                                        <p className="font-semibold">{p.name}</p>
                                        <p className="text-sm text-gray-500">{p.id} - {p.patientPhone}</p>
                                    </div>
                                    <button onClick={() => handleSelectPatient(p)} className="px-3 py-1 bg-primary-500 text-white text-sm rounded">{te.selectPatient}</button>
                                </li>
                            )) : <li className="p-2 text-center text-gray-500">{te.noPatientFound}</li>}
                        </ul>
                    </div>
                )}

                {step === 2 && selectedPatient && (
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 space-y-4">
                             <h3 className="font-semibold mb-2">{te.step2}</h3>
                             <div className="bg-gray-100 p-3 rounded">
                                <h4 className="font-bold">{te.patientDetails}</h4>
                                <p>{selectedPatient.name} ({selectedPatient.id})</p>
                                <p>{selectedPatient.age}, {selectedPatient.gender}</p>
                             </div>
                             <div>
                                <label className="block text-sm font-medium">{te.triage_level}</label>
                                <select value={caseDetails.triageLevel} onChange={(e) => setCaseDetails(prev => ({...prev, triageLevel: e.target.value as any}))} className="w-full p-2 border rounded">
                                    <option value="Green">{te.triageGreen}</option>
                                    <option value="Yellow">{te.triageYellow}</option>
                                    <option value="Red">{te.triageRed}</option>
                                </select>
                             </div>
                             <div>
                                <label className="block text-sm font-medium">{te.initial_status}</label>
                                 <select value={caseDetails.status} onChange={(e) => setCaseDetails(prev => ({...prev, status: e.target.value as any}))} className="w-full p-2 border rounded">
                                    <option value="In Progress">{te.statusInProgress}</option>
                                    <option value="Admitted">{te.statusAdmitted}</option>
                                    <option value="Discharged">{te.statusDischarged}</option>
                                </select>
                             </div>
                        </div>
                        <div className="p-4 border-t flex justify-between">
                            <button type="button" onClick={() => setStep(1)} className="px-4 py-2 bg-gray-200 rounded">{te.back}</button>
                            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded">{te.saveCase}</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};


// MedicalRecordModal Component
const MedicalRecordModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    caseData: EmergencyCase;
    onSave: (updatedCase: EmergencyCase) => void;
    patient?: Patient;
    doctors: Doctor[];
    t: Translation;
}> = ({ isOpen, onClose, caseData, onSave, patient, doctors, t }) => {
    const [record, setRecord] = useState(caseData);

    const te = t.emergency;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setRecord(prev => ({ ...prev, [name]: value === 'null' ? null : value }));
    };

    if (!isOpen) return null;
    
    const renderTextarea = (name: keyof EmergencyCase, label: string) => (
         <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <textarea name={name as string} value={String(record[name] ?? '')} onChange={handleChange} rows={3} className="mt-1 w-full p-2 border rounded-md"></textarea>
        </div>
    );
    
    const renderPhysicianSelect = (name: keyof EmergencyCase, label: string) => (
         <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
             <select name={name as string} value={String(record[name] ?? 'null')} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md">
                <option value="null">N/A</option>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-50 rounded-lg shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b bg-white rounded-t-lg">
                    <h2 className="text-2xl font-bold text-gray-800">{te.medicalRecordTitle}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><XMarkIcon className="w-7 h-7" /></button>
                </div>
                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                    {/* Patient Info Header */}
                    <div className="bg-white p-4 rounded-lg border">
                        <h3 className="text-lg font-bold mb-2">{te.patientInfo}</h3>
                        {patient ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div><strong>{te.patientId}:</strong> {patient.id}</div>
                                <div><strong>{te.name}:</strong> {patient.name}</div>
                                <div><strong>{te.age}:</strong> {patient.age}</div>
                                <div><strong>{te.gender}:</strong> {patient.gender}</div>
                                <div className="col-span-2 md:col-span-4"><strong>{te.address}:</strong> {patient.address}</div>
                            </div>
                        ) : <p>Patient not found.</p>}
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4 bg-white p-4 rounded-lg border">
                             <h3 className="text-lg font-bold mb-2">{te.clinicalAssessment}</h3>
                             {renderTextarea('symptoms', te.symptoms)}
                             {renderTextarea('medicalHistory', te.medicalHistory)}
                             {renderTextarea('vitalSigns', te.vitalSigns)}
                             {renderTextarea('physicalExamFindings', te.physicalExamFindings)}
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            {/* Investigations */}
                            <div className="bg-white p-4 rounded-lg border">
                                <h3 className="text-lg font-bold mb-2">{te.investigationsAndResults}</h3>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                                        {renderTextarea('labTestsRequested', `${te.labTests} - ${te.requested}`)}
                                        {renderTextarea('labResults', `${te.labTests} - ${te.results}`)}
                                    </div>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                                        {renderTextarea('radiologyRequested', `${te.radiology} - ${te.requested}`)}
                                        {renderTextarea('radiologyResults', `${te.radiology} - ${te.results}`)}
                                    </div>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                                        {renderTextarea('ecgRequested', `${te.ecg} - ${te.requested}`)}
                                        {renderTextarea('ecgResults', `${te.ecg} - ${te.results}`)}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Plan & Consultations */}
                            <div className="bg-white p-4 rounded-lg border">
                                <h3 className="text-lg font-bold mb-2">{te.planAndConsults}</h3>
                                {renderTextarea('treatmentPlan', te.treatmentPlan)}
                                {renderTextarea('consultationRequest', te.consultationRequest)}
                                {renderTextarea('consultationResponse', te.consultationResponse)}
                            </div>

                             {/* Physicians */}
                            <div className="bg-white p-4 rounded-lg border">
                                <h3 className="text-lg font-bold mb-2">{te.physicians}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {renderPhysicianSelect('attendingERPhysicianId', te.attendingERPhysician)}
                                    {renderPhysicianSelect('erSpecialistId', te.erSpecialist)}
                                    {renderPhysicianSelect('admittingPhysicianId', te.admittingPhysician)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end p-4 border-t bg-white rounded-b-lg">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-md mr-3">{te.close}</button>
                    <button onClick={() => onSave(record)} className="px-6 py-2 bg-primary-600 text-white rounded-md">{te.saveChanges}</button>
                </div>
            </div>
        </div>
    );
};