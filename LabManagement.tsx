import React, { useState, useMemo, useEffect } from 'react';
import type { Translation, LabTest, Patient, AvailableLabTest, ResultFile, TestResult } from '../types';
import { mockLabTests, mockPatients, mockAvailableLabTests } from '../constants';
import { LabIcon, PlusIcon, XMarkIcon, TrashIcon, Cog6ToothIcon, ClipboardDocumentCheckIcon, PencilIcon, DocumentTextIcon } from './icons';

interface LabManagementProps {
    t: Translation;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
                {icon}
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    </div>
);

export const LabManagement: React.FC<LabManagementProps> = ({ t }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [labRequests, setLabRequests] = useState<LabTest[]>(mockLabTests);
    const [availableTests, setAvailableTests] = useState<AvailableLabTest[]>(mockAvailableLabTests);
    const [isManageModalOpen, setManageModalOpen] = useState(false);
    const [isRequestModalOpen, setRequestModalOpen] = useState(false);
    const [isResultsModalOpen, setResultsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<LabTest | null>(null);
    
    const tl = t.lab;

    const patientMap = useMemo<Map<string, Patient>>(() => new Map(mockPatients.map(p => [p.id, p])), []);
    const availableTestMap = useMemo<Map<string, AvailableLabTest>>(() => new Map(availableTests.map(t => [t.id, t])), [availableTests]);

    const handleSaveAvailableTests = (newTests: AvailableLabTest[]) => {
        setAvailableTests(newTests);
    };

    const handleSaveNewRequest = (newRequest: Omit<LabTest, 'id'>) => {
        const fullRequest: LabTest = {
            id: `L${Math.floor(Math.random() * 900) + 300}`,
            ...newRequest,
        };
        setLabRequests([fullRequest, ...labRequests]);
        setRequestModalOpen(false);
    };
    
    const handleOpenResults = (request: LabTest) => {
        setSelectedRequest(request);
        setResultsModalOpen(true);
    };

    const handleSaveResults = (updatedRequest: LabTest) => {
        setLabRequests(labRequests.map(r => r.id === updatedRequest.id ? updatedRequest : r));
        setResultsModalOpen(false);
    };


    const filteredRequests = labRequests.filter(req => {
        const patient = patientMap.get(req.patientId);
        return patient?.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const getStatusChip = (status: LabTest['status']) => {
        switch (status) {
            case 'Pending': return <span className="px-2 py-1 text-xs font-semibold text-orange-800 bg-orange-100 rounded-full">{tl.statusPending}</span>;
            case 'Completed': return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">{tl.statusCompleted}</span>;
            case 'In Progress': return <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">{tl.statusInProgress}</span>;
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <LabIcon className="w-8 h-8 mr-3 text-purple-500" />
                {tl.title}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard title={tl.pendingTests} value={labRequests.filter(t => t.status === 'Pending').length} icon={<LabIcon className="h-6 w-6 text-orange-500" />} />
                <StatCard title={tl.completedToday} value={labRequests.filter(t => t.status === 'Completed' && t.requestDate === new Date().toISOString().split('T')[0]).length} icon={<LabIcon className="h-6 w-6 text-green-500" />} />
                <StatCard title={tl.inProgress} value={labRequests.filter(t => t.status === 'In Progress').length} icon={<LabIcon className="h-6 w-6 text-blue-500" />} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                    <input
                        type="text"
                        placeholder={tl.searchPlaceholder}
                        className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg mb-2 md:mb-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                     <div className="flex items-center space-x-2">
                        <button onClick={() => setManageModalOpen(true)} className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                            <Cog6ToothIcon className="w-5 h-5 mr-2" />
                            {tl.manageTests}
                        </button>
                        <button onClick={() => setRequestModalOpen(true)} className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                            <ClipboardDocumentCheckIcon className="w-5 h-5 mr-2" />
                            {tl.newTestRequest}
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tl.tableId}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tl.tablePatient}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tl.tableTests}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tl.tableDate}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tl.tableStatus}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tl.tableActions}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredRequests.map((req) => (
                                <tr key={req.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patientMap.get(req.patientId)?.name || 'Unknown'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {req.testIds.map(id => availableTestMap.get(id)?.name).join(', ')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.requestDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusChip(req.status)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button onClick={() => handleOpenResults(req)} className="text-indigo-600 hover:text-indigo-900" title={tl.viewResults}><DocumentTextIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {isManageModalOpen && <ManageTestsModal isOpen={isManageModalOpen} onClose={() => setManageModalOpen(false)} tests={availableTests} onSave={handleSaveAvailableTests} t={t} />}
            {isRequestModalOpen && <NewRequestModal isOpen={isRequestModalOpen} onClose={() => setRequestModalOpen(false)} onSave={handleSaveNewRequest} availableTests={availableTests} t={t} />}
            {isResultsModalOpen && selectedRequest && (
                <ResultsModal 
                    isOpen={isResultsModalOpen}
                    onClose={() => setResultsModalOpen(false)}
                    request={selectedRequest}
                    onSave={handleSaveResults}
                    patient={patientMap.get(selectedRequest.patientId)}
                    availableTestMap={availableTestMap}
                    t={t}
                />
            )}
        </div>
    );
};


// ManageTestsModal Component
const ManageTestsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    tests: AvailableLabTest[];
    onSave: (tests: AvailableLabTest[]) => void;
    t: Translation;
}> = ({ isOpen, onClose, tests, onSave, t }) => {
    const [localTests, setLocalTests] = useState(tests);
    const [newTestName, setNewTestName] = useState('');
    const [newTestPrice, setNewTestPrice] = useState(0);
    const [editingTest, setEditingTest] = useState<AvailableLabTest | null>(null);
    const tl = t.lab;

    const handleSaveTest = () => {
        if (!newTestName.trim() || newTestPrice <= 0) return;

        if (editingTest) {
            const updatedTests = localTests.map(t => t.id === editingTest.id ? {...t, name: newTestName, price: newTestPrice} : t);
            setLocalTests(updatedTests);
            onSave(updatedTests);
        } else {
            const newTest: AvailableLabTest = {
                id: `LT${Math.floor(Math.random() * 900) + 10}`,
                name: newTestName,
                price: newTestPrice,
            };
            const updatedTests = [...localTests, newTest];
            setLocalTests(updatedTests);
            onSave(updatedTests);
        }
        
        setNewTestName('');
        setNewTestPrice(0);
        setEditingTest(null);
    };
    
    const handleEdit = (test: AvailableLabTest) => {
        setEditingTest(test);
        setNewTestName(test.name);
        setNewTestPrice(test.price);
    };
    
    const cancelEdit = () => {
        setEditingTest(null);
        setNewTestName('');
        setNewTestPrice(0);
    };

    const handleDeleteTest = (testId: string) => {
        if(window.confirm(tl.deleteTestConfirm)) {
            const updatedTests = localTests.filter(t => t.id !== testId);
            setLocalTests(updatedTests);
            onSave(updatedTests);
        }
    };
    
    if(!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">{tl.manageTestsTitle}</h2>
                    <button onClick={onClose}><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-center">
                        <input type="text" placeholder={tl.testName} value={newTestName} onChange={e => setNewTestName(e.target.value)} className="p-2 border rounded col-span-2"/>
                        <input type="number" placeholder={tl.testPrice} value={newTestPrice} onChange={e => setNewTestPrice(Number(e.target.value))} className="p-2 border rounded"/>
                    </div>
                     <div className="flex justify-end space-x-2">
                        {editingTest && <button onClick={cancelEdit} className="px-4 py-2 bg-gray-200 text-black rounded-lg">{tl.cancelEdit}</button>}
                        <button onClick={handleSaveTest} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">{editingTest ? tl.updateTest : tl.addTest}</button>
                    </div>
                </div>
                 <div className="p-6 border-t max-h-80 overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium">{tl.testId}</th>
                                <th className="px-4 py-2 text-left text-xs font-medium">{tl.testName}</th>
                                <th className="px-4 py-2 text-left text-xs font-medium">{tl.testPrice}</th>
                                <th className="px-4 py-2 text-left text-xs font-medium">{tl.tableActions}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {localTests.map(test => (
                                <tr key={test.id}>
                                    <td className="px-4 py-2 text-sm">{test.id}</td>
                                    <td className="px-4 py-2 text-sm">{test.name}</td>
                                    <td className="px-4 py-2 text-sm">${test.price.toFixed(2)}</td>
                                    <td className="px-4 py-2 text-sm text-right space-x-2">
                                        <button onClick={() => handleEdit(test)} className="text-indigo-500 hover:text-indigo-700" title={tl.editTest}><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDeleteTest(test.id)} className="text-red-500 hover:text-red-700" title={tl.deleteTestConfirm}><TrashIcon className="w-5 h-5"/></button>
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
    onSave: (request: Omit<LabTest, 'id'>) => void;
    availableTests: AvailableLabTest[];
    t: Translation;
}> = ({ isOpen, onClose, onSave, availableTests, t }) => {
    const [step, setStep] = useState(1);
    const [patientSearch, setPatientSearch] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [selectedTestIds, setSelectedTestIds] = useState<string[]>([]);
    const tl = t.lab;
    
    const filteredPatients = mockPatients.filter(p => 
        p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.id.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.patientPhone.includes(patientSearch)
    );

    const handleSelectPatient = (patient: Patient) => {
        setSelectedPatient(patient);
        setStep(2);
    };

    const handleTestSelection = (testId: string) => {
        setSelectedTestIds(prev => 
            prev.includes(testId) ? prev.filter(id => id !== testId) : [...prev, testId]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPatient || selectedTestIds.length === 0) return;
        
        const newRequest: Omit<LabTest, 'id'> = {
            patientId: selectedPatient.id,
            testIds: selectedTestIds,
            requestDate: new Date().toISOString().split('T')[0],
            status: 'Pending',
            results: selectedTestIds.reduce((acc, id) => ({...acc, [id]: { text: '', files: [] } }), {})
        };
        onSave(newRequest);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">{tl.newRequestTitle}</h2>
                    <button onClick={onClose}><XMarkIcon className="w-6 h-6" /></button>
                </div>

                {step === 1 && (
                    <div className="p-6">
                        <h3 className="font-semibold mb-2">{tl.step1}</h3>
                        <input type="text" placeholder={tl.searchPatientPlaceholder} value={patientSearch} onChange={(e) => setPatientSearch(e.target.value)} className="w-full p-2 border rounded" />
                        <ul className="mt-2 max-h-60 overflow-y-auto">
                            {filteredPatients.length > 0 ? filteredPatients.map(p => (
                                <li key={p.id} className="flex justify-between items-center p-2 hover:bg-gray-100">
                                    <div><p className="font-semibold">{p.name}</p><p className="text-sm text-gray-500">{p.id} - {p.patientPhone}</p></div>
                                    <button onClick={() => handleSelectPatient(p)} className="px-3 py-1 bg-primary-500 text-white text-sm rounded">{tl.selectPatient}</button>
                                </li>
                            )) : <li className="p-2 text-center text-gray-500">{tl.noPatientFound}</li>}
                        </ul>
                    </div>
                )}

                {step === 2 && selectedPatient && (
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <h3 className="font-semibold mb-2">{tl.step2}</h3>
                            <div className="bg-gray-100 p-3 rounded"><h4 className="font-bold">{tl.patientDetails}</h4><p>{selectedPatient.name} ({selectedPatient.id})</p></div>
                            <div>
                                <h4 className="font-bold mb-2">{tl.selectTests}</h4>
                                <div className="space-y-2">
                                    {availableTests.length > 0 ? availableTests.map(test => (
                                        <label key={test.id} className="flex items-center p-2 rounded-md hover:bg-gray-50">
                                            <input type="checkbox" checked={selectedTestIds.includes(test.id)} onChange={() => handleTestSelection(test.id)} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                            <span className="ml-3 text-sm">{test.name} (${test.price.toFixed(2)})</span>
                                        </label>
                                    )) : <p className="text-center text-gray-500">{tl.noTestsAvailable}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t flex justify-between">
                            <button type="button" onClick={() => setStep(1)} className="px-4 py-2 bg-gray-200 rounded">{tl.back}</button>
                            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded" disabled={selectedTestIds.length === 0}>{tl.saveRequest}</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};


// ResultsModal Component
const ResultsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    request: LabTest;
    onSave: (request: LabTest) => void;
    patient?: Patient;
    availableTestMap: Map<string, AvailableLabTest>;
    t: Translation;
}> = ({ isOpen, onClose, request, onSave, patient, availableTestMap, t }) => {
    const [results, setResults] = useState<Record<string, TestResult>>(request.results);
    const tl = t.lab;

    const handleTextResultChange = (testId: string, value: string) => {
        setResults(prev => ({ ...prev, [testId]: { ...prev[testId], text: value }}));
    };

    const handleFileUpload = (testId: string, event: React.ChangeEvent<HTMLInputElement>) => {
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
                        const currentTestResult = prev[testId] || { text: '', files: [] };
                        return {
                            ...prev,
                            [testId]: {
                                ...currentTestResult,
                                files: [...currentTestResult.files, newFile]
                            }
                        };
                    });
                };
                reader.readAsDataURL(typedFile);
            }
        }
    };
    
    const handleRemoveFile = (testId: string, fileIndexToRemove: number) => {
        setResults(prev => {
            const currentTestResult = prev[testId];
            return {
                ...prev,
                [testId]: {
                    ...currentTestResult,
                    files: currentTestResult.files.filter((_, index) => index !== fileIndexToRemove)
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
                <h1 style="text-align: center; color: #333;">${tl.resultsModalTitle}</h1>
                <hr/>
                <h2 style="color: #555;">${tl.patientInfo}</h2>
                <p><strong>ID:</strong> ${patient?.id || 'N/A'}</p>
                <p><strong>Name:</strong> ${patient?.name || 'N/A'}</p>
                <p><strong>Age:</strong> ${patient?.age || 'N/A'}</p>
                <p><strong>Gender:</strong> ${patient?.gender || 'N/A'}</p>
                <hr/>
                <h2 style="color: #555;">${tl.result}</h2>
                ${request.testIds.map(testId => `
                    <div style="margin-bottom: 20px; page-break-inside: avoid;">
                        <h3 style="background-color: #f2f2f2; padding: 8px; border-radius: 4px;">${availableTestMap.get(testId)?.name || 'Unknown Test'}</h3>
                        <div style="padding: 10px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 4px 4px;">
                            <h4>${tl.textResult}</h4>
                            <p>${results[testId]?.text || 'No text result entered'}</p>
                            <h4 style="margin-top: 15px;">${tl.uploadedFiles}</h4>
                            ${(results[testId]?.files?.length || 0) > 0 ?
                                results[testId].files.map(file => 
                                    file.type.startsWith('image/')
                                    ? `<div style="margin-top: 10px; text-align: center;">
                                         <p style="font-style: italic;">${file.name}</p>
                                         <img src="${file.dataUrl}" style="max-width: 90%; max-height: 400px; border: 1px solid #ccc; margin-top: 5px;"/>
                                       </div>`
                                    : `<p>${file.name}</p>`
                                ).join('')
                                : `<p style="color: #777;">${tl.noFilesUploaded}</p>`
                            }
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        const printWindow = window.open('', '', 'height=800,width=1000');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Print Lab Results</title></head><body>');
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
                    <h2 className="text-xl font-bold">{tl.resultsModalTitle}</h2>
                    <button onClick={onClose}><XMarkIcon className="w-6 h-6" /></button>
                </div>

                <div className="p-6 flex-grow overflow-y-auto space-y-6">
                    <div className="bg-gray-100 p-3 rounded">
                        <h3 className="font-bold">{tl.patientInfo}</h3>
                        {patient ? (
                             <p>{patient.name} ({patient.id}) - {patient.age}, {patient.gender}</p>
                        ) : <p>Unknown Patient</p>}
                    </div>

                    <div className="space-y-6">
                        {request.testIds.map(testId => {
                            const test = availableTestMap.get(testId);
                            if(!test) return null;
                            const testResults = results[testId] || { text: '', files: [] };
                            return (
                                <div key={testId} className="bg-gray-50 p-4 rounded-lg border">
                                    <h3 className="font-bold text-lg text-gray-800 mb-3">{test.name}</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">{tl.textResult}</label>
                                        <textarea 
                                            value={testResults.text}
                                            onChange={(e) => handleTextResultChange(testId, e.target.value)}
                                            rows={3}
                                            className="mt-1 w-full p-2 border rounded-md"
                                            placeholder={`${tl.result} for ${test.name}...`}
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700">{tl.uploadedFiles}</label>
                                        <div className="mt-2 border-2 border-dashed rounded-md p-4">
                                            {testResults.files.length > 0 ? (
                                                <ul className="space-y-2">
                                                    {testResults.files.map((file, index) => (
                                                         <li key={index} className="flex items-center justify-between bg-white p-2 rounded-md border">
                                                            <div className="flex items-center">
                                                                {file.type.startsWith('image/') && <img src={file.dataUrl} alt={file.name} className="w-10 h-10 object-cover rounded-md mr-3" />}
                                                                <span className="text-sm font-medium">{file.name}</span>
                                                            </div>
                                                            <button onClick={() => handleRemoveFile(testId, index)} className="text-red-500 hover:text-red-700" title={tl.removeFile}>
                                                                <TrashIcon className="w-5 h-5"/>
                                                            </button>
                                                         </li>
                                                    ))}
                                                </ul>
                                            ) : <p className="text-sm text-gray-500 text-center">{tl.noFilesUploaded}</p>}
                                        </div>
                                         <label className="mt-3 inline-block px-4 py-2 bg-white text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 cursor-pointer w-full text-center">
                                            <span>{tl.uploadFile}</span>
                                            <input type="file" multiple className="hidden" onChange={(e) => handleFileUpload(testId, e)}/>
                                        </label>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="p-4 border-t flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">{tl.close}</button>
                    <button onClick={handlePrint} className="px-4 py-2 bg-blue-600 text-white rounded">{tl.printResults}</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-primary-600 text-white rounded">{tl.saveResults}</button>
                </div>
            </div>
         </div>
    );
};