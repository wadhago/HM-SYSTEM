
import React, { useState, useMemo, useEffect } from 'react';
import type { Translation, RadiologyScan, Patient, AvailableRadiologyScan, ResultFile, TestResult, RadiologyScanType } from '../types';
import { mockRadiologyScans, mockPatients, mockAvailableRadiologyScans } from '../constants';
import { XRayIcon, PlusIcon, XMarkIcon, TrashIcon, Cog6ToothIcon, ClipboardDocumentCheckIcon, PencilIcon, DocumentTextIcon, PrinterIcon } from './icons';

interface RadiologyManagementProps {
    t: Translation;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
            <div className="bg-slate-100 p-3 rounded-full">
                {icon}
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    </div>
);

export const RadiologyManagement: React.FC<RadiologyManagementProps> = ({ t }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [scanRequests, setScanRequests] = useState<RadiologyScan[]>(mockRadiologyScans);
    const [availableScans, setAvailableScans] = useState<AvailableRadiologyScan[]>(mockAvailableRadiologyScans);
    const [isManageModalOpen, setManageModalOpen] = useState(false);
    const [isRequestModalOpen, setRequestModalOpen] = useState(false);
    const [isReportModalOpen, setReportModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<RadiologyScan | null>(null);
    
    const tr = t.radiology;

    const patientMap = useMemo(() => new Map(mockPatients.map(p => [p.id, p])), []);
    const availableScanMap = useMemo(() => new Map(availableScans.map(s => [s.id, s])), [availableScans]);

    const handleSaveAvailableScans = (newScans: AvailableRadiologyScan[]) => {
        setAvailableScans(newScans);
    };

    const handleSaveNewRequest = (newRequest: Omit<RadiologyScan, 'id'>) => {
        const fullRequest: RadiologyScan = {
            id: `RAD${Math.floor(Math.random() * 900) + 100}`,
            ...newRequest,
        };
        setScanRequests([fullRequest, ...scanRequests]);
        setRequestModalOpen(false);
    };
    
    const handleOpenReport = (request: RadiologyScan) => {
        setSelectedRequest(request);
        setReportModalOpen(true);
    };

    const handleDeleteRequest = (requestId: string) => {
        if (window.confirm(tr.deleteRequestConfirm)) {
            setScanRequests(scanRequests.filter(req => req.id !== requestId));
        }
    };

    const handleSaveReport = (updatedRequest: RadiologyScan) => {
        setScanRequests(scanRequests.map(r => r.id === updatedRequest.id ? updatedRequest : r));
        setReportModalOpen(false);
    };

    const filteredRequests = scanRequests.filter(req => {
        const patient = patientMap.get(req.patientId);
        return patient?.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const getStatusChip = (status: RadiologyScan['status']) => {
        switch (status) {
            case 'Pending': return <span className="px-2 py-1 text-xs font-semibold text-orange-800 bg-orange-100 rounded-full">{tr.statusPending}</span>;
            case 'Completed': return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">{tr.statusCompleted}</span>;
            case 'In Progress': return <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">{tr.statusInProgress}</span>;
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <XRayIcon className="w-8 h-8 mr-3 text-slate-500" />
                {tr.title}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                 <StatCard title={tr.pendingScans} value={scanRequests.filter(s => s.status === 'Pending').length} icon={<XRayIcon className="h-6 w-6 text-orange-500" />} />
                 <StatCard title={tr.completedToday} value={scanRequests.filter(s => s.status === 'Completed' && s.requestDate === new Date().toISOString().split('T')[0]).length} icon={<XRayIcon className="h-6 w-6 text-green-500" />} />
                 <StatCard title={tr.inProgress} value={scanRequests.filter(s => s.status === 'In Progress').length} icon={<XRayIcon className="h-6 w-6 text-blue-500" />} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                    <input
                        type="text"
                        placeholder={tr.searchPlaceholder}
                        className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg mb-2 md:mb-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                     <div className="flex items-center space-x-2">
                        <button onClick={() => setManageModalOpen(true)} className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                            <Cog6ToothIcon className="w-5 h-5 mr-2" />
                            {tr.manageScans}
                        </button>
                        <button onClick={() => setRequestModalOpen(true)} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                            <ClipboardDocumentCheckIcon className="w-5 h-5 mr-2" />
                            {tr.newScanRequest}
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tr.tableId}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tr.tablePatient}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tr.tableScans}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tr.tableDate}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tr.tableStatus}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tr.tableActions}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredRequests.map((req) => (
                                <tr key={req.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patientMap.get(req.patientId)?.name || 'Unknown'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {req.scanIds.map(id => availableScanMap.get(id)?.name).join(', ')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.requestDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusChip(req.status)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                        <button onClick={() => handleOpenReport(req)} className="text-indigo-600 hover:text-indigo-900" title={tr.viewEditReport}><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDeleteRequest(req.id)} className="text-red-600 hover:text-red-900" title={tr.delete}><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {isManageModalOpen && <ManageScansModal isOpen={isManageModalOpen} onClose={() => setManageModalOpen(false)} scans={availableScans} onSave={handleSaveAvailableScans} t={t} />}
            {isRequestModalOpen && <NewRequestModal isOpen={isRequestModalOpen} onClose={() => setRequestModalOpen(false)} onSave={handleSaveNewRequest} availableScans={availableScans} t={t} />}
            {isReportModalOpen && selectedRequest && (
                <ReportModal 
                    isOpen={isReportModalOpen}
                    onClose={() => setReportModalOpen(false)}
                    request={selectedRequest}
                    onSave={handleSaveReport}
                    patient={patientMap.get(selectedRequest.patientId)}
                    availableScanMap={availableScanMap}
                    t={t}
                />
            )}
        </div>
    );
};


// ManageScansModal Component
const ManageScansModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    scans: AvailableRadiologyScan[];
    onSave: (scans: AvailableRadiologyScan[]) => void;
    t: Translation;
}> = ({ isOpen, onClose, scans, onSave, t }) => {
    const [localScans, setLocalScans] = useState(scans);
    const [newScanName, setNewScanName] = useState('');
    const [newScanPrice, setNewScanPrice] = useState(0);
    const [newScanType, setNewScanType] = useState<RadiologyScanType>('x-ray');
    const [editingScan, setEditingScan] = useState<AvailableRadiologyScan | null>(null);
    const tr = t.radiology;

    const handleSaveScan = () => {
        if (!newScanName.trim() || newScanPrice <= 0) return;

        if (editingScan) {
            const updatedScans = localScans.map(s => s.id === editingScan.id ? {...s, name: newScanName, price: newScanPrice, scanType: newScanType} : s);
            setLocalScans(updatedScans);
            onSave(updatedScans);
        } else {
            const newScan: AvailableRadiologyScan = {
                id: `SCAN${Math.floor(Math.random() * 900) + 10}`,
                name: newScanName,
                price: newScanPrice,
                scanType: newScanType
            };
            const updatedScans = [...localScans, newScan];
            setLocalScans(updatedScans);
            onSave(updatedScans);
        }
        
        setNewScanName('');
        setNewScanPrice(0);
        setNewScanType('x-ray');
        setEditingScan(null);
    };
    
    const handleEdit = (scan: AvailableRadiologyScan) => {
        setEditingScan(scan);
        setNewScanName(scan.name);
        setNewScanPrice(scan.price);
        setNewScanType(scan.scanType);
    };
    
    const cancelEdit = () => {
        setEditingScan(null);
        setNewScanName('');
        setNewScanPrice(0);
        setNewScanType('x-ray');
    };

    const handleDeleteScan = (scanId: string) => {
        if(window.confirm(tr.deleteScanConfirm)) {
            const updatedScans = localScans.filter(s => s.id !== scanId);
            setLocalScans(updatedScans);
            onSave(updatedScans);
        }
    };
    
    if(!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">{tr.manageScansTitle}</h2>
                    <button onClick={onClose}><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-center">
                        <input type="text" placeholder={tr.scanName} value={newScanName} onChange={e => setNewScanName(e.target.value)} className="p-2 border rounded col-span-2"/>
                        <input type="number" placeholder={tr.scanPrice} value={newScanPrice} onChange={e => setNewScanPrice(Number(e.target.value))} className="p-2 border rounded"/>
                        <select value={newScanType} onChange={e => setNewScanType(e.target.value as RadiologyScanType)} className="p-2 border rounded">
                             {(Object.keys(tr.scanTypes) as Array<keyof typeof tr.scanTypes>).map(key => (
                                <option key={key} value={key}>{tr.scanTypes[key]}</option>
                             ))}
                        </select>
                    </div>
                     <div className="flex justify-end space-x-2">
                        {editingScan && <button onClick={cancelEdit} className="px-4 py-2 bg-gray-200 text-black rounded-lg">{tr.cancelEdit}</button>}
                        <button onClick={handleSaveScan} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">{editingScan ? tr.updateScan : tr.addScan}</button>
                    </div>
                </div>
                 <div className="p-6 border-t max-h-80 overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium">{tr.scanId}</th>
                                <th className="px-4 py-2 text-left text-xs font-medium">{tr.scanName}</th>
                                <th className="px-4 py-2 text-left text-xs font-medium">{tr.scanPrice}</th>
                                <th className="px-4 py-2 text-left text-xs font-medium">{tr.scanType}</th>
                                <th className="px-4 py-2 text-left text-xs font-medium">{tr.tableActions}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {localScans.map(scan => (
                                <tr key={scan.id}>
                                    <td className="px-4 py-2 text-sm">{scan.id}</td>
                                    <td className="px-4 py-2 text-sm">{scan.name}</td>
                                    <td className="px-4 py-2 text-sm">${scan.price.toFixed(2)}</td>
                                    <td className="px-4 py-2 text-sm">{tr.scanTypes[scan.scanType]}</td>
                                    <td className="px-4 py-2 text-sm text-right space-x-2">
                                        <button onClick={() => handleEdit(scan)} className="text-indigo-500 hover:text-indigo-700" title={tr.edit}><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDeleteScan(scan.id)} className="text-red-500 hover:text-red-700" title={tr.delete}><TrashIcon className="w-5 h-5"/></button>
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

// NewRequestModal Component
const NewRequestModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (request: Omit<RadiologyScan, 'id'>) => void;
    availableScans: AvailableRadiologyScan[];
    t: Translation;
}> = ({ isOpen, onClose, onSave, availableScans, t }) => {
    const [step, setStep] = useState(1);
    const [patientSearch, setPatientSearch] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [selectedScanIds, setSelectedScanIds] = useState<string[]>([]);
    const [activeScanType, setActiveScanType] = useState<RadiologyScanType>('x-ray');
    const tr = t.radiology;
    
    const filteredPatients = mockPatients.filter(p => 
        p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.id.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.patientPhone.includes(patientSearch)
    );

    const scansByType = useMemo(() => {
        return availableScans.reduce((acc, scan) => {
            if (!acc[scan.scanType]) {
                acc[scan.scanType] = [];
            }
            acc[scan.scanType].push(scan);
            return acc;
        }, {} as Record<RadiologyScanType, AvailableRadiologyScan[]>);
    }, [availableScans]);

    const handleSelectPatient = (patient: Patient) => {
        setSelectedPatient(patient);
        setStep(2);
    };

    const handleScanSelection = (scanId: string) => {
        setSelectedScanIds(prev => 
            prev.includes(scanId) ? prev.filter(id => id !== scanId) : [...prev, scanId]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPatient || selectedScanIds.length === 0) return;
        
        const newRequest: Omit<RadiologyScan, 'id'> = {
            patientId: selectedPatient.id,
            scanIds: selectedScanIds,
            requestDate: new Date().toISOString().split('T')[0],
            status: 'Pending',
            results: selectedScanIds.reduce((acc, id) => ({...acc, [id]: { text: '', files: [] } }), {})
        };
        onSave(newRequest);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">{tr.newRequestTitle}</h2>
                    <button onClick={onClose}><XMarkIcon className="w-6 h-6" /></button>
                </div>

                {step === 1 && (
                    <div className="p-6">
                        <h3 className="font-semibold mb-2">{tr.step1}</h3>
                        <input type="text" placeholder={tr.searchPatientPlaceholder} value={patientSearch} onChange={(e) => setPatientSearch(e.target.value)} className="w-full p-2 border rounded" />
                        <ul className="mt-2 max-h-60 overflow-y-auto">
                            {filteredPatients.length > 0 ? filteredPatients.map(p => (
                                <li key={p.id} className="flex justify-between items-center p-2 hover:bg-gray-100">
                                    <div><p className="font-semibold">{p.name}</p><p className="text-sm text-gray-500">{p.id} - {p.patientPhone}</p></div>
                                    <button onClick={() => handleSelectPatient(p)} className="px-3 py-1 bg-primary-500 text-white text-sm rounded">{tr.selectPatient}</button>
                                </li>
                            )) : <li className="p-2 text-center text-gray-500">{tr.noPatientFound}</li>}
                        </ul>
                    </div>
                )}

                {step === 2 && selectedPatient && (
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <h3 className="font-semibold mb-2">{tr.step2}</h3>
                            <div className="bg-gray-100 p-3 rounded"><h4 className="font-bold">{tr.patientDetails}</h4><p>{selectedPatient.name} ({selectedPatient.id})</p></div>
                            <div>
                                <h4 className="font-bold mb-2">{tr.selectScans}</h4>
                                <div className="border-b border-gray-200">
                                    <nav className="-mb-px flex space-x-4">
                                         {(Object.keys(tr.scanTypes) as Array<keyof typeof tr.scanTypes>).map(key => (
                                            <button
                                                type="button"
                                                key={key}
                                                onClick={() => setActiveScanType(key)}
                                                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                                                    activeScanType === key
                                                        ? 'border-primary-500 text-primary-600'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                            >
                                                {tr.scanTypes[key]}
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                                <div className="space-y-2 mt-2">
                                    {(scansByType[activeScanType] || []).length > 0 ? (scansByType[activeScanType] || []).map(scan => (
                                        <label key={scan.id} className="flex items-center p-2 rounded-md hover:bg-gray-50">
                                            <input type="checkbox" checked={selectedScanIds.includes(scan.id)} onChange={() => handleScanSelection(scan.id)} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                            <span className="ml-3 text-sm">{scan.name} (${scan.price.toFixed(2)})</span>
                                        </label>
                                    )) : <p className="text-center text-gray-500 pt-4">{tr.noScansAvailable}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t flex justify-between">
                            <button type="button" onClick={() => setStep(1)} className="px-4 py-2 bg-gray-200 rounded">{tr.back}</button>
                            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded" disabled={selectedScanIds.length === 0}>{tr.saveRequest}</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};


// ReportModal Component
const ReportModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    request: RadiologyScan;
    onSave: (request: RadiologyScan) => void;
    patient?: Patient;
    availableScanMap: Map<string, AvailableRadiologyScan>;
    t: Translation;
}> = ({ isOpen, onClose, request, onSave, patient, availableScanMap, t }) => {
    const [results, setResults] = useState<Record<string, TestResult>>(request.results);
    const tr = t.radiology;

    const handleTextResultChange = (scanId: string, value: string) => {
        setResults(prev => ({ ...prev, [scanId]: { ...prev[scanId], text: value }}));
    };

    const handleFileUpload = (scanId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            for (const file of Array.from(event.target.files)) {
                const typedFile = file as File;
                const reader = new FileReader();
                reader.onload = (loadEvent) => {
                    const newFile: ResultFile = {
                        name: typedFile.name,
                        type: typedFile.type,
                        dataUrl: loadEvent.target?.result as string,
                    };
                    setResults(prev => {
                        const currentScanResult = prev[scanId] || { text: '', files: [] };
                        return {
                            ...prev,
                            [scanId]: {
                                ...currentScanResult,
                                files: [...currentScanResult.files, newFile]
                            }
                        };
                    });
                };
                reader.readAsDataURL(typedFile);
            }
        }
    };
    
    const handleRemoveFile = (scanId: string, fileIndexToRemove: number) => {
        setResults(prev => {
            const currentScanResult = prev[scanId];
            return {
                ...prev,
                [scanId]: {
                    ...currentScanResult,
                    files: currentScanResult.files.filter((_, index) => index !== fileIndexToRemove)
                }
            };
        });
    };
    
    const handleSave = () => {
        onSave({ ...request, results, status: 'Completed' });
    };

    const handlePrint = () => {
        const printContent = `
            <div style="font-family: sans-serif; padding: 20px;">
                <h1 style="text-align: center; color: #333;">${tr.reportModalTitle}</h1>
                <hr/>
                <h2 style="color: #555;">${tr.patientInfo}</h2>
                <p><strong>ID:</strong> ${patient?.id || 'N/A'}</p>
                <p><strong>Name:</strong> ${patient?.name || 'N/A'}</p>
                <p><strong>Age:</strong> ${patient?.age || 'N/A'}</p>
                <p><strong>Gender:</strong> ${patient?.gender || 'N/A'}</p>
                <hr/>
                <h2 style="color: #555;">${tr.report}</h2>
                ${request.scanIds.map(scanId => `
                    <div style="margin-bottom: 20px; page-break-inside: avoid;">
                        <h3 style="background-color: #f2f2f2; padding: 8px; border-radius: 4px;">${availableScanMap.get(scanId)?.name || 'Unknown Scan'}</h3>
                        <div style="padding: 10px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 4px 4px;">
                            <h4>${tr.findings}</h4>
                            <p>${results[scanId]?.text || 'No findings entered'}</p>
                            <h4 style="margin-top: 15px;">${tr.attachedFiles}</h4>
                            ${(results[scanId]?.files?.length || 0) > 0 ?
                                results[scanId].files.map(file => 
                                    file.type.startsWith('image/')
                                    ? `<div style="margin-top: 10px; text-align: center;">
                                         <p style="font-style: italic;">${file.name}</p>
                                         <img src="${file.dataUrl}" style="max-width: 90%; max-height: 400px; border: 1px solid #ccc; margin-top: 5px;"/>
                                       </div>`
                                    : `<p>${file.name}</p>`
                                ).join('')
                                : `<p style="color: #777;">${tr.noFilesAttached}</p>`
                            }
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        const printWindow = window.open('', '', 'height=800,width=1000');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Print Radiology Report</title></head><body>');
            printWindow.document.write(printContent);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    };

    if(!isOpen) return null;

    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">{tr.reportModalTitle}</h2>
                    <button onClick={onClose}><XMarkIcon className="w-6 h-6" /></button>
                </div>

                <div className="p-6 flex-grow overflow-y-auto space-y-6">
                    <div className="bg-gray-100 p-3 rounded">
                        <h3 className="font-bold">{tr.patientInfo}</h3>
                        {patient ? (
                             <p>{patient.name} ({patient.id}) - {patient.age}, {patient.gender}</p>
                        ) : <p>Unknown Patient</p>}
                    </div>

                    <div className="space-y-6">
                        {request.scanIds.map(scanId => {
                            const scan = availableScanMap.get(scanId);
                            if(!scan) return null;
                            const scanResults = results[scanId] || { text: '', files: [] };
                            return (
                                <div key={scanId} className="bg-gray-50 p-4 rounded-lg border">
                                    <h3 className="font-bold text-lg text-gray-800 mb-3">{scan.name}</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">{tr.findings}</label>
                                        <textarea 
                                            value={scanResults.text}
                                            onChange={(e) => handleTextResultChange(scanId, e.target.value)}
                                            rows={3}
                                            className="mt-1 w-full p-2 border rounded-md"
                                            placeholder={`${tr.findings} for ${scan.name}...`}
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700">{tr.attachedFiles}</label>
                                        <div className="mt-2 border-2 border-dashed rounded-md p-4">
                                            {scanResults.files.length > 0 ? (
                                                <ul className="space-y-2">
                                                    {scanResults.files.map((file, index) => (
                                                         <li key={index} className="flex items-center justify-between bg-white p-2 rounded-md border">
                                                            <div className="flex items-center">
                                                                {file.type.startsWith('image/') && <img src={file.dataUrl} alt={file.name} className="w-10 h-10 object-cover rounded-md mr-3" />}
                                                                <span className="text-sm font-medium">{file.name}</span>
                                                            </div>
                                                            <button onClick={() => handleRemoveFile(scanId, index)} className="text-red-500 hover:text-red-700" title={tr.removeFile}>
                                                                <TrashIcon className="w-5 h-5"/>
                                                            </button>
                                                         </li>
                                                    ))}
                                                </ul>
                                            ) : <p className="text-sm text-gray-500 text-center">{tr.noFilesAttached}</p>}
                                        </div>
                                         <label className="mt-3 inline-block px-4 py-2 bg-white text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 cursor-pointer w-full text-center">
                                            <span>{tr.uploadFile}</span>
                                            <input type="file" multiple className="hidden" onChange={(e) => handleFileUpload(scanId, e)}/>
                                        </label>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="p-4 border-t flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">{tr.close}</button>
                    <button onClick={handlePrint} className="px-4 py-2 bg-blue-600 text-white rounded">{tr.printReport}</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-primary-600 text-white rounded">{tr.saveReport}</button>
                </div>
            </div>
         </div>
    );
};