
import React, { useState, useMemo, useEffect } from 'react';
import type { Translation, InpatientRecord, Patient, Doctor, Bed, InpatientLocationKey, AdmissionReasonKey, SurgicalDepartmentKey } from '../types';
import { mockInpatientRecords, mockPatients, mockDoctors, mockBeds, availableLocations, availableAdmissionReasons, availableSurgeryTypes } from '../constants';
import { HospitalIcon, UserGroupIcon, UserPlusIcon, BedIcon, XMarkIcon, TrashIcon } from './icons';

interface InpatientManagementProps {
    t: Translation;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
                {icon}
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    </div>
);

export const InpatientManagement: React.FC<InpatientManagementProps> = ({ t }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [inpatientRecords, setInpatientRecords] = useState<InpatientRecord[]>(mockInpatientRecords);
    const [beds, setBeds] = useState<Bed[]>(mockBeds);
    const [isAdmitModalOpen, setAdmitModalOpen] = useState(false);
    const [isBedModalOpen, setBedModalOpen] = useState(false);

    const ti = t.inpatient;

    const patientMap = useMemo<Map<string, Patient>>(() => new Map(mockPatients.map(p => [p.id, p])), []);
    const doctorMap = useMemo<Map<string, Doctor>>(() => new Map(mockDoctors.map(d => [d.id, d])), []);
    const bedMap = useMemo<Map<string, Bed>>(() => new Map(beds.map(b => [b.id, b])), [beds]);

    const handleSaveAdmission = (newRecord: Omit<InpatientRecord, 'id'>) => {
        const fullRecord: InpatientRecord = {
            id: `IP${Math.floor(Math.random() * 900) + 100}`,
            ...newRecord,
        };
        setInpatientRecords([fullRecord, ...inpatientRecords]);
        setBeds(beds.map(b => b.id === newRecord.bedId ? { ...b, isOccupied: true } : b));
        setAdmitModalOpen(false);
    };

    const handleSaveBeds = (newBeds: Bed[]) => {
        setBeds(newBeds);
    };

    const filteredRecords = inpatientRecords.filter(rec => {
        const patient = patientMap.get(rec.patientId);
        return patient?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const avgStay = useMemo(() => {
        if (inpatientRecords.length === 0) return 0;
        const totalStay = inpatientRecords.reduce((sum, rec) => sum + rec.stayDuration, 0);
        return (totalStay / inpatientRecords.length).toFixed(1);
    }, [inpatientRecords]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <HospitalIcon className="w-8 h-8 mr-3 text-blue-500" />
                {ti.title}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard title={ti.admittedPatients} value={inpatientRecords.filter(r => !r.dischargeDate).length} icon={<UserGroupIcon className="h-6 w-6 text-blue-500" />} />
                <StatCard title={ti.avgStay} value={`${avgStay} ${ti.days}`} icon={<BedIcon className="h-6 w-6 text-blue-500" />} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                    <input
                        type="text"
                        placeholder={ti.searchPlaceholder}
                        className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg mb-2 md:mb-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="flex items-center space-x-2">
                         <button onClick={() => setBedModalOpen(true)} className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                            <BedIcon className="w-5 h-5 mr-2" />
                            {ti.manageBeds}
                        </button>
                        <button onClick={() => setAdmitModalOpen(true)} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                            <UserPlusIcon className="w-5 h-5 mr-2" />
                            {ti.admitNewPatient}
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{ti.tablePatientId}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{ti.tablePatientName}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{ti.tableAdmissionDate}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{ti.tableLocation}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{ti.tableBed}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{ti.tableReason}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{ti.tableAttending}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{ti.tableStay}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredRecords.map((record) => {
                                const patient = patientMap.get(record.patientId);
                                const bed = bedMap.get(record.bedId);
                                const doctor = doctorMap.get(record.attendingPhysicianId);
                                return (
                                <tr key={record.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.patientId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.admissionDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bed ? ti.locations[bed.location] : 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bed?.number || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ti.reasons[record.admissionReason]}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.stayDuration} {ti.days}</td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>

            {isAdmitModalOpen && <AdmitPatientModal isOpen={isAdmitModalOpen} onClose={() => setAdmitModalOpen(false)} onSave={handleSaveAdmission} beds={beds} doctors={mockDoctors} t={t}/>}
            {isBedModalOpen && <ManageBedsModal isOpen={isBedModalOpen} onClose={() => setBedModalOpen(false)} onSave={handleSaveBeds} initialBeds={beds} t={t}/>}

        </div>
    );
};


// AdmitPatientModal
const AdmitPatientModal: React.FC<{
    isOpen: boolean,
    onClose: () => void,
    onSave: (record: Omit<InpatientRecord, 'id'>) => void,
    beds: Bed[],
    doctors: Doctor[],
    t: Translation
}> = ({ isOpen, onClose, onSave, beds, doctors, t }) => {
    const [step, setStep] = useState(1);
    const [patientSearch, setPatientSearch] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [admissionDetails, setAdmissionDetails] = useState({
        location: availableLocations[0],
        bedId: '',
        reason: availableAdmissionReasons[0],
        surgeryType: availableSurgeryTypes[0],
        physicianId: doctors[0]?.id || '',
        stayDuration: 1,
    });

    const ti = t.inpatient;
    const filteredPatients = mockPatients.filter(p => 
        p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.id.toLowerCase().includes(patientSearch.toLowerCase())
    );

    const availableBeds = beds.filter(b => b.location === admissionDetails.location && !b.isOccupied);

    useEffect(() => {
        setAdmissionDetails(prev => ({ ...prev, bedId: '' }));
    }, [admissionDetails.location]);

    const handleSelectPatient = (patient: Patient) => {
        setSelectedPatient(patient);
        setStep(2);
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setAdmissionDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPatient || !admissionDetails.bedId || !admissionDetails.physicianId) return;

        const newRecord: Omit<InpatientRecord, 'id'> = {
            patientId: selectedPatient.id,
            admissionDate: new Date().toISOString().split('T')[0],
            dischargeDate: null,
            bedId: admissionDetails.bedId,
            attendingPhysicianId: admissionDetails.physicianId,
            admissionReason: admissionDetails.reason as AdmissionReasonKey,
            surgeryType: admissionDetails.reason === 'surgery' ? (admissionDetails.surgeryType as SurgicalDepartmentKey) : undefined,
            stayDuration: Number(admissionDetails.stayDuration),
            extensionDays: 0,
        };
        onSave(newRecord);
    };

    if (!isOpen) return null;

     return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">{ti.admitPatientTitle}</h2>
                    <button onClick={onClose}><XMarkIcon className="w-6 h-6" /></button>
                </div>

                {step === 1 && (
                     <div className="p-6">
                        <h3 className="font-semibold mb-2">{ti.step1}</h3>
                        <input type="text" placeholder={ti.searchPatientPlaceholder} value={patientSearch} onChange={(e) => setPatientSearch(e.target.value)} className="w-full p-2 border rounded" />
                        <ul className="mt-2 max-h-60 overflow-y-auto">
                            {filteredPatients.length > 0 ? filteredPatients.map(p => (
                                <li key={p.id} className="flex justify-between items-center p-2 hover:bg-gray-100">
                                    <div><p className="font-semibold">{p.name}</p><p className="text-sm text-gray-500">{p.id} - {p.patientPhone}</p></div>
                                    <button onClick={() => handleSelectPatient(p)} className="px-3 py-1 bg-primary-500 text-white text-sm rounded">{ti.selectPatient}</button>
                                </li>
                            )) : <li className="p-2 text-center text-gray-500">{ti.noPatientFound}</li>}
                        </ul>
                    </div>
                )}

                {step === 2 && selectedPatient && (
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <h3 className="font-semibold">{ti.step2}</h3>
                             <div className="bg-gray-100 p-4 rounded-lg">
                                <h4 className="font-bold text-lg mb-2">{ti.patientDetails}</h4>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                    <p><span className="font-semibold">Name:</span> {selectedPatient.name}</p>
                                    <p><span className="font-semibold">ID:</span> {selectedPatient.id}</p>
                                    <p><span className="font-semibold">Age:</span> {selectedPatient.age}</p>
                                    <p><span className="font-semibold">Gender:</span> {selectedPatient.gender}</p>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg border">
                                <h4 className="font-bold text-lg mb-2">{ti.admissionDetails}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><label className="block text-sm font-medium">{ti.admissionLocation}</label><select name="location" value={admissionDetails.location} onChange={handleChange} className="w-full p-2 border rounded mt-1">{(Object.keys(ti.locations) as Array<keyof typeof ti.locations>).map(key => <option key={key} value={key}>{ti.locations[key]}</option>)}</select></div>
                                    <div><label className="block text-sm font-medium">{ti.bedNumber}</label><select name="bedId" value={admissionDetails.bedId} onChange={handleChange} className="w-full p-2 border rounded mt-1" disabled={availableBeds.length === 0}>{availableBeds.length > 0 ? availableBeds.map(b => <option key={b.id} value={b.id}>{b.number}</option>) : <option>{ti.noBedsAvailable}</option>}</select></div>
                                    <div><label className="block text-sm font-medium">{ti.admissionReason}</label><select name="reason" value={admissionDetails.reason} onChange={handleChange} className="w-full p-2 border rounded mt-1">{(Object.keys(ti.reasons) as Array<keyof typeof ti.reasons>).map(key => <option key={key} value={key}>{ti.reasons[key]}</option>)}</select></div>
                                    {admissionDetails.reason === 'surgery' && (<div><label className="block text-sm font-medium">{ti.surgeryType}</label><select name="surgeryType" value={admissionDetails.surgeryType} onChange={handleChange} className="w-full p-2 border rounded mt-1">{(Object.keys(ti.surgeries) as Array<keyof typeof ti.surgeries>).map(key => <option key={key} value={key}>{ti.surgeries[key]}</option>)}</select></div>)}
                                    <div><label className="block text-sm font-medium">{ti.attendingPhysician}</label><select name="physicianId" value={admissionDetails.physicianId} onChange={handleChange} className="w-full p-2 border rounded mt-1">{doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
                                    <div><label className="block text-sm font-medium">{ti.estimatedStay}</label><input type="number" name="stayDuration" value={admissionDetails.stayDuration} onChange={handleChange} className="w-full p-2 border rounded mt-1" min="1"/></div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t flex justify-between">
                            <button type="button" onClick={() => setStep(1)} className="px-4 py-2 bg-gray-200 rounded">{ti.back}</button>
                            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded" disabled={!admissionDetails.bedId}>{ti.saveAdmission}</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

const ManageBedsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (beds: Bed[]) => void;
    initialBeds: Bed[];
    t: Translation;
}> = ({ isOpen, onClose, onSave, initialBeds, t }) => {
    const [localBeds, setLocalBeds] = useState(initialBeds);
    const [newBedNumber, setNewBedNumber] = useState('');
    const [newBedLocation, setNewBedLocation] = useState<InpatientLocationKey>('general_ward');
    const ti = t.inpatient;

    if (!isOpen) return null;

    const handleAddBed = () => {
        if (!newBedNumber.trim()) return;
        const newBed: Bed = {
            id: `B${Math.floor(Math.random() * 9000) + 100}`,
            number: newBedNumber,
            location: newBedLocation,
            isOccupied: false,
        };
        const updatedBeds = [...localBeds, newBed];
        setLocalBeds(updatedBeds);
        onSave(updatedBeds);
        setNewBedNumber('');
    };

    const handleDeleteBed = (bedId: string) => {
        if (window.confirm(ti.deleteBedConfirm)) {
            const updatedBeds = localBeds.filter(b => b.id !== bedId);
            setLocalBeds(updatedBeds);
            onSave(updatedBeds);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">{ti.manageBeds}</h2>
                    <button onClick={onClose}><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end">
                        <input
                            type="text"
                            placeholder={ti.bedNumber}
                            value={newBedNumber}
                            onChange={e => setNewBedNumber(e.target.value)}
                            className="p-2 border rounded"
                        />
                        <select
                            value={newBedLocation}
                            onChange={e => setNewBedLocation(e.target.value as InpatientLocationKey)}
                            className="p-2 border rounded"
                        >
                            {availableLocations.map(loc => (
                                <option key={loc} value={loc}>{ti.locations[loc]}</option>
                            ))}
                        </select>
                        <button onClick={handleAddBed} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Add Bed</button>
                    </div>
                </div>
                <div className="p-6 border-t max-h-80 overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{ti.tableBed}</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{ti.tableLocation}</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{ti.tableStatus}</th>
                                <th className="px-4 py-2"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {localBeds.map(bed => (
                                <tr key={bed.id}>
                                    <td className="px-4 py-2 text-sm">{bed.number}</td>
                                    <td className="px-4 py-2 text-sm">{ti.locations[bed.location]}</td>
                                    <td className="px-4 py-2 text-sm">
                                        {bed.isOccupied ? 
                                            <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">Occupied</span> : 
                                            <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Available</span>
                                        }
                                    </td>
                                    <td className="px-4 py-2 text-sm text-right">
                                        <button 
                                            onClick={() => handleDeleteBed(bed.id)} 
                                            className="text-red-500 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                                            disabled={bed.isOccupied}
                                            title={bed.isOccupied ? "Cannot delete an occupied bed." : ti.delete}
                                        >
                                            <TrashIcon className="w-5 h-5"/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 <div className="p-4 border-t flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-md">{t.header.close}</button>
                </div>
            </div>
        </div>
    );
};