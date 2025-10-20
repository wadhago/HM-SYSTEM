// types.ts

// Basic types
export type Language = 'en' | 'ar';
export type UserRole = 'admin' | 'doctor' | 'nurse' | 'receptionist';
export type View =
  | 'dashboard'
  | 'diagnostic_assistant'
  | 'patients'
  | 'doctors'
  | 'emergency'
  | 'inpatient'
  | 'lab'
  | 'radiology'
  | 'pharmacy'
  | 'surgery'
  | 'billing'
  | 'hr'
  | 'inventory'
  | 'reports'
  | 'security';

export interface SystemSettings {
  name: string;
  icon: string;
  color: string;
  font: string;
  fontSize: string;
}

// Data models
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  patientPhone: string;
  emergencyContact: string;
  registrationDate: string; // YYYY-MM-DD
  lastVisitDate: string; // YYYY-MM-DD
  services: (keyof Translation['modules'])[];
}

export interface Service {
    id: keyof Translation['modules'];
    labelKey: keyof Translation['modules'];
}

export interface Doctor {
    id: string;
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    email: string;
    phone: string;
    role: RoleKey;
    specialty: SpecialtyKey;
}

export type RoleKey = 'consultant' | 'specialist' | 'resident' | 'intern';
export interface Role {
    id: RoleKey;
    labelKey: RoleKey;
}

export type SpecialtyKey = 'cardiology' | 'dermatology' | 'neurology' | 'orthopedics' | 'pediatrics' | 'radiology' | 'surgery' | 'anesthesiology' | 'oncology';
export interface Specialty {
    id: SpecialtyKey;
    labelKey: SpecialtyKey;
}

export interface EmergencyCase {
    id: string;
    patientId: string;
    admittedAt: string; // ISO Date string
    triageLevel: 'Red' | 'Yellow' | 'Green';
    status: 'In Progress' | 'Admitted' | 'Discharged';
    symptoms: string;
    medicalHistory: string;
    vitalSigns: string;
    physicalExamFindings: string;
    labTestsRequested: string;
    radiologyRequested: string;
    ecgRequested: string;
    labResults: string;
    radiologyResults: string;
    ecgResults: string;
    treatmentPlan: string;
    consultationRequest: string;
    consultationResponse: string;
    attendingERPhysicianId: string | null;
    erSpecialistId: string | null;
    admittingPhysicianId: string | null;
}

export interface Bed {
    id: string;
    number: string;
    location: InpatientLocationKey;
    isOccupied: boolean;
}

export type InpatientLocationKey = 'general_ward' | 'icu' | 'maternity' | 'pediatric';
export type AdmissionReasonKey = 'medical' | 'surgery' | 'observation' | 'maternity';

export interface InpatientRecord {
    id: string;
    patientId: string;
    admissionDate: string;
    dischargeDate: string | null;
    bedId: string;
    attendingPhysicianId: string;
    admissionReason: AdmissionReasonKey;
    surgeryType?: SurgicalDepartmentKey; // Using SurgicalDepartmentKey for consistency
    stayDuration: number; // in days
    extensionDays: number;
}

export type ServiceCategoryKey = 'consultation' | 'emergency' | 'lab' | 'radiology' | 'surgery' | 'pharmacy' | 'inpatient';

export interface BillableService {
    id: string;
    name: string;
    category: ServiceCategoryKey;
    price: number;
}

export interface InvoiceItem {
    serviceId: string;
    quantity: number;
    unitPrice: number;
}

export interface Invoice {
    id: string;
    patientId: string;
    invoiceDate: string;
    dueDate: string;
    items: InvoiceItem[];
    totalAmount: number;
    status: 'Paid' | 'Unpaid' | 'Overdue';
}

export interface PurchaseRecord {
    id: string;
    date: string;
    itemDescription: string;
    supplier: string;
    quantity: number;
    unitPrice: number;
    totalCost: number;
}

export interface Employee {
    id: string;
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    phone: string;
    address: string;
    department: string;
    jobTitle: string;
    jobGrade: string;
    hireDate: string;
    salary: number;
}

export interface PayrollRecord {
    id: string;
    employeeId: string;
    payPeriod: string; // e.g., "2024-07"
    issueDate: string;
    baseSalary: number;
    bonuses: number;
    deductions: number;
    netPay: number;
}

export interface EmployeeLeave {
    id: string;
    employeeId: string;
    startDate: string;
    duration: number; // in days
    endDate: string;
}

export interface ResultFile {
    name: string;
    type: string;
    dataUrl: string;
}

export interface TestResult {
    text: string;
    files: ResultFile[];
}

export interface AvailableLabTest {
    id: string;
    name: string;
    price: number;
}
export interface LabTest {
    id: string;
    patientId: string;
    testIds: string[];
    requestDate: string;
    status: 'Pending' | 'In Progress' | 'Completed';
    results: Record<string, TestResult>;
}

export type RadiologyScanType = 'x-ray' | 'ct' | 'mri' | 'ultrasound' | 'echo' | 'doppler';
export interface AvailableRadiologyScan {
    id: string;
    name: string;
    price: number;
    scanType: RadiologyScanType;
}

export interface RadiologyScan {
    id: string;
    patientId: string;
    scanIds: string[];
    requestDate: string;
    status: 'Pending' | 'In Progress' | 'Completed';
    results: Record<string, TestResult>;
}

export interface Medication {
    id: string;
    tradeName: string;
    scientificName: string;
    pharmacyStock: number;
    mainStock: number;
    unitPrice: number;
}

export interface SaleItem {
    medicationId: string;
    quantity: number;
    unitPrice: number;
}

export interface PharmacySale {
    id: string;
    date: string; // ISO string
    items: SaleItem[];
    totalAmount: number;
}

export interface StockPurchase {
    id: string;
    date: string;
    medicationId: string;
    quantity: number;
    supplier: string;
}

export interface StockRequisition {
    id: string;
    date: string;
    medicationId: string;
    quantity: number;
    status: 'Pending' | 'Fulfilled';
}


export type SurgicalDepartmentKey = 'general' | 'pediatric' | 'plastic' | 'orthopedic' | 'urology' | 'neuro' | 'thoracic' | 'endoscopy';
export type SurgeryClassificationKey = 'major_plus' | 'major' | 'moderate' | 'minor';

export interface AvailableSurgicalProcedure {
    id: string;
    name: string;
    department: SurgicalDepartmentKey;
    classification: SurgeryClassificationKey;
    price: number;
}

export interface SurgicalProcedureRecord {
    id: string;
    patientId: string;
    procedureId: string;
    surgeonId: string;
    anesthetistId: string; 
    diagnosis: string;
    scheduledDateTime: string; // Replaces date
    status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
    operatingRoom: string; 
    notes: string; 
}


export interface InventoryItem {
    id: string;
    name: string;
    category: string;
    quantity: number;
    lowStockThreshold: number;
}

export interface UserLog {
    id: string;
    user: string;
    action: string;
    timestamp: string;
    status: 'Success' | 'Failed';
}

// Translation object structure
export interface Translation {
  header: {
    searchPlaceholder: string;
    backToDashboard: string;
    serverSettings: string;
    serverModalTitle: string;
    serverUrl: string;
    port: string;
    connect: string;
    close: string;
    systemSettings: string;
    systemSettingsModalTitle: string;
    systemName: string;
    systemIcon: string;
    uploadIcon: string;
    font: string;
    fontColor: string;
    fontSize: string;
    save: string;
  };
  modules: {
    dashboard: string;
    diagnostic_assistant: string;
    patients: string;
    doctors: string;
    emergency: string;
    inpatient: string;
    lab: string;
    radiology: string;
    pharmacy: string;
    surgery: string;
    billing: string;
    hr: string;
    inventory: string;
    reports: string;
    security: string;
  };
  patientManagement: {
    title: string;
    totalPatients: string;
    searchPlaceholder: string;
    addNewPatient: string;
    tableId: string;
    tableName: string;
    tablePatientPhone: string;
    tableEmergencyContact: string;
    tableRegDate: string;
    tableLastVisit: string;
    tableServices: string;
    tableActions: string;
    edit: string;
    print: string;
    modalTitleAdd: string;
    modalTitleEdit: string;
    formName: string;
    formAge: string;
    formGender: string;
    formGenderMale: string;
    formGenderFemale: string;
    formPatientPhone: string;
    formEmergencyContact: string;
    formAddress: string;
    formRegDate: string;
    formLastVisit: string;
    formServices: string;
    save: string;
    cancel: string;
  };
  doctorManagement: {
    title: string;
    searchPlaceholder: string;
    addNewDoctor: string;
    tableId: string;
    tableName: string;
    tableRole: string;
    tableSpecialty: string;
    tablePhone: string;
    tableEmail: string;
    tableActions: string;
    edit: string;
    delete: string;
    print: string;
    deleteConfirm: string;
    modalTitleAdd: string;
    modalTitleEdit: string;
    formName: string;
    formAge: string;
    formGender: string;
    formGenderMale: string;
    formGenderFemale: string;
    formEmail: string;
    formPhone: string;
    formRole: string;
    formSpecialty: string;
    save: string;
    cancel: string;
    roles: Record<RoleKey, string>;
    specialties: Record<SpecialtyKey, string>;
  };
  diagnostic_assistant: {
    title: string;
    description: string;
    disclaimer: string;
    inputLabel: string;
    inputPlaceholder: string;
    analyzeButton: string;
    loading: string;
    analysisTitle: string;
    noAnalysis: string;
    enterSymptoms: string;
    errorPrefix: string;
  };
  emergency: {
    title: string;
    inProgressCases: string;
    redCases: string;
    yellowCases: string;
    searchPlaceholder: string;
    addNewCase: string;
    tablePatientId: string;
    tablePatientName: string;
    tableTriage: string;
    tableAdmittedAt: string;
    tableAttending: string;
    tableStatus: string;
    tableActions: string;
    medicalRecord: string;
    triageRed: string;
    triageYellow: string;
    triageGreen: string;
    statusInProgress: string;
    statusAdmitted: string;
    statusDischarged: string;
    addCaseTitle: string;
    step1: string;
    step2: string;
    searchPatientPlaceholder: string;
    selectPatient: string;
    noPatientFound: string;
    patientDetails: string;
    triage_level: string;
    initial_status: string;
    back: string;
    saveCase: string;
    medicalRecordTitle: string;
    patientInfo: string;
    patientId: string;
    name: string;
    age: string;
    gender: string;
    address: string;
    close: string;
    saveChanges: string;
    clinicalAssessment: string;
    symptoms: string;
    medicalHistory: string;
    vitalSigns: string;
    physicalExamFindings: string;
    investigationsAndResults: string;
    labTests: string;
    radiology: string;
    ecg: string;
    requested: string;
    results: string;
    planAndConsults: string;
    treatmentPlan: string;
    consultationRequest: string;
    consultationResponse: string;
    physicians: string;
    attendingERPhysician: string;
    erSpecialist: string;
    admittingPhysician: string;
  };
  inpatient: {
    title: string;
    admittedPatients: string;
    avgStay: string;
    days: string;
    searchPlaceholder: string;
    admitNewPatient: string;
    manageBeds: string;
    tablePatientId: string;
    tablePatientName: string;
    tableAdmissionDate: string;
    tableLocation: string;
    tableBed: string;
    tableReason: string;
    tableAttending: string;
    tableStay: string;
    admitPatientTitle: string;
    step1: string;
    step2: string;
    searchPatientPlaceholder: string;
    selectPatient: string;
    noPatientFound: string;
    patientDetails: string;
    admissionDetails: string;
    admissionLocation: string;
    bedNumber: string;
    noBedsAvailable: string;
    admissionReason: string;
    surgeryType: string;
    attendingPhysician: string;
    estimatedStay: string;
    back: string;
    saveAdmission: string;
    manageBedsTitle: string;
    bedNumberLabel: string;
    locationLabel: string;
    addBed: string;
    deleteBedConfirm: string;
    delete: string;
    tableStatus: string;
    locations: Record<InpatientLocationKey, string>;
    reasons: Record<AdmissionReasonKey, string>;
    surgeries: Record<SurgicalDepartmentKey, string>;
  };
  lab: {
    title: string;
    pendingTests: string;
    completedToday: string;
    inProgress: string;
    searchPlaceholder: string;
    manageTests: string;
    newTestRequest: string;
    tableId: string;
    tablePatient: string;
    tableTests: string;
    tableDate: string;
    tableStatus: string;
    tableActions: string;
    statusPending: string;
    statusCompleted: string;
    statusInProgress: string;
    viewResults: string;
    manageTestsTitle: string;
    testName: string;
    testPrice: string;
    testId: string;
    addTest: string;
    updateTest: string;
    cancelEdit: string;
    editTest: string;
    deleteTestConfirm: string;
    newRequestTitle: string;
    step1: string;
    step2: string;
    searchPatientPlaceholder: string;
    selectPatient: string;
    noPatientFound: string;
    patientDetails: string;
    selectTests: string;
    noTestsAvailable: string;
    back: string;
    saveRequest: string;
    resultsModalTitle: string;
    patientInfo: string;
    result: string;
    textResult: string;
    uploadedFiles: string;
    noFilesUploaded: string;
    removeFile: string;
    uploadFile: string;
    close: string;
    printResults: string;
    saveResults: string;
  };
  radiology: {
    title: string;
    pendingScans: string;
    completedToday: string;
    inProgress: string;
    searchPlaceholder: string;
    manageScans: string;
    newScanRequest: string;
    tableId: string;
    tablePatient: string;
    tableScans: string;
    tableDate: string;
    tableStatus: string;
    tableActions: string;
    statusPending: string;
    statusCompleted: string;
    statusInProgress: string;
    viewEditReport: string;
    delete: string;
    deleteRequestConfirm: string;
    manageScansTitle: string;
    scanName: string;
    scanPrice: string;
    scanId: string;
    scanType: string;
    addScan: string;
    updateScan: string;
    cancelEdit: string;
    edit: string;
    deleteScanConfirm: string;
    newRequestTitle: string;
    step1: string;
    step2: string;
    searchPatientPlaceholder: string;
    selectPatient: string;
    noPatientFound: string;
    patientDetails: string;
    selectScans: string;
    noScansAvailable: string;
    back: string;
    saveRequest: string;
    reportModalTitle: string;
    patientInfo: string;
    report: string;
    findings: string;
    attachedFiles: string;
    noFilesAttached: string;
    removeFile: string;
    uploadFile: string;
    close: string;
    printReport: string;
    saveReport: string;
    scanTypes: Record<RadiologyScanType, string>;
  };
  pharmacy: {
    title: string;
    tabs: {
        sales: string;
        medications: string;
        inventory: string;
    };
    sales: {
        title: string;
        newSale: string;
        tableSaleId: string;
        tableDate: string;
        tableItems: string;
        tableTotal: string;
        tableActions: string;
        print: string;
        view: string;
        delete: string;
        deleteConfirm: string;
        newSaleTitle: string;
        editSaleTitle: string;
        searchPlaceholder: string;
        addSelectedItems: string;
        medication: string;
        quantity: string;
        lineTotal: string;
        invoiceTotal: string;
        cancel: string;
        saveSale: string;
    };
    medications: {
        title: string;
        addMedication: string;
        tableMedId: string;
        tableTradeName: string;
        tableScientificName: string;
        tableUnitPrice: string;
        tablePharmacyStock: string;
        tableMainStock: string;
        tableActions: string;
        edit: string;
        delete: string;
        deleteConfirm: string;
        addMedTitle: string;
        editMedTitle: string;
        tradeName: string;
        scientificName: string;
        unitPrice: string;
        cancel: string;
        saveMedication: string;
    };
    inventory: {
        purchases: string;
        requisitions: string;
        recordPurchase: string;
        newRequisition: string;
        tablePurchaseId: string;
        tableDate: string;
        tableMedication: string;
        tableQuantity: string;
        tableSupplier: string;
        tableReqId: string;
        tableStatus: string;
        actions: string;
        statusPending: string;
        statusFulfilled: string;
        fulfill: string;
    };
  };
  surgery: {
    title: string;
    scheduledSurgeries: string;
    surgeriesToday: string;
    operatingRooms: string;
    searchPlaceholder: string;
    manageProcedures: string;
    registerNew: string;
    tableId: string;
    tablePatient: string;
    tableProcedure: string;
    tableSurgeon: string;
    tableDateTime: string;
    tableRoom: string;
    tableStatus: string;
    tableActions: string;
    edit: string;
    delete: string;
    print: string;
    deleteConfirm: string;
    statusScheduled: string;
    statusInProgress: string;
    statusCompleted: string;
    statusCancelled: string;

    manageProceduresTitle: string;
    procedureName: string;
    department: string;
    classification: string;
    price: string;
    addProcedure: string;
    updateProcedure: string;
    deleteProcedureConfirm: string;

    registerModalTitle: string;
    editModalTitle: string;
    step1: string;
    step2: string;
    searchPatientPlaceholder: string;
    selectPatient: string;
    noPatientFound: string;
    patientDetails: string;
    surgeryDetails: string;
    diagnosis: string;
    procedure: string;
    noProceduresInDept: string;
    surgeon: string;
    anesthetist: string,
    operatingRoom: string;
    notes: string;
    status: string;
    back: string;
    save: string;
    cancel: string;
    
    departments: Record<SurgicalDepartmentKey, string>;
    classifications: Record<SurgeryClassificationKey, string>;
  };
  financialManagement: {
    title: string;
    tabs: {
        invoicing: string;
        services: string;
        purchases: string;
        payroll: string;
        reports: string;
    };
    invoicing: {
        title: string;
        newInvoice: string;
        deleteConfirm: string;
        tableInvoiceId: string;
        tablePatient: string;
        tableDate: string;
        tableTotal: string;
        tableStatus: string;
        tableActions: string;
        print: string;
        edit: string;
        delete: string;
        statusPaid: string;
        statusUnpaid: string;
        statusOverdue: string;
        modalTitleNew: string;
        modalTitleEdit: string;
        step1: string;
        searchPatient: string;
        selectPatient: string;
        noPatientFound: string;
        step2: string;
        patientDetails: string;
        selectServices: string;
        service: string;
        quantity: string;
        price: string;
        lineTotal: string;
        invoiceTotal: string;
        back: string;
        save: string;
    };
    services: {
        title: string;
        addService: string;
        deleteConfirm: string;
        tableServiceId: string;
        tableName: string;
        tableCategory: string;
        tablePrice: string;
        tableActions: string;
        edit: string;
        delete: string;
        modalTitleNew: string;
        modalTitleEdit: string;
        formCategory: string;
        formName: string;
        formPrice: string;
        cancel: string;
        save: string;
        categories: Record<ServiceCategoryKey, string>;
    };
    purchases: {
        title: string;
        recordPurchase: string;
        tablePurchaseId: string;
        tableDate: string;
        tableItem: string;
        tableSupplier: string;
        tableTotalCost: string;
        tableActions: string;
        modalTitleNew: string;
        modalTitleEdit: string;
        formItem: string;
        formSupplier: string;
        formQuantity: string;
        formUnitPrice: string;
        cancel: string;
        save: string;
    };
    payroll: {
        title: string;
        runPayroll: string;
        deleteConfirm: string;
        tableEmployee: string;
        tablePayPeriod: string;
        tableNetPay: string;
        tableIssueDate: string;
        tableActions: string;
        printPayslip: string;
        edit: string;
        delete: string;
        modalTitleNew: string;
        modalTitleEdit: string;
        formEmployee: string;
        formPayPeriod: string;
        formBaseSalary: string;
        formBonuses: string;
        formDeductions: string;
        cancel: string;
        save: string;
    };
    reports: {
        totalRevenue: string;
        totalExpenses: string;
        totalPayroll: string;
        netProfit: string;
        revenueVsExpenses: string;
        revenueBreakdown: string;
        invoiceStatusSummary: string;
        status: string;
        count: string;
        amount: string;
    };
  };
  hr: {
    title: string;
    tabs: {
        employees: string;
        leaves: string;
    };
    employees: {
        searchPlaceholder: string;
        printAll: string;
        addNew: string;
        tableId: string;
        tableName: string;
        tableDepartment: string;
        tableJobTitle: string;
        tablePhone: string;
        tableHireDate: string;
        tableActions: string;
        print: string;
        edit: string;
        delete: string;
        deleteConfirm: string;
        modalTitleAdd: string;
        modalTitleEdit: string;
        formName: string;
        formAge: string;
        formGender: string;
        formGenderMale: string;
        formGenderFemale: string;
        formPhone: string;
        formAddress: string;
        formDepartment: string;
        formJobTitle: string;
        formJobGrade: string;
        formHireDate: string;
        formSalary: string;
    };
    leaves: {
        title: string;
        printAll: string;
        addNew: string;
        tableEmployee: string;
        tableDepartment: string;
        tableStartDate: string;
        tableDuration: string;
        days: string;
        tableEndDate: string;
        tableActions: string;
        print: string;
        edit: string;
        delete: string;
        deleteConfirm: string;
        modalTitleAdd: string;
        modalTitleEdit: string;
        formEmployee: string;
        formStartDate: string;
        formDuration: string;
        formEndDate: string;
    };
    cancel: string;
    save: string;
  };
  inventory: {
    title: string;
    totalItems: string;
    lowStock: string;
    outOfStock: string;
    searchPlaceholder: string;
    tableId: string;
    tableName: string;
    tableCategory: string;
    tableQuantity: string;
    tableStatus: string;
    statusOutOfStock: string;
    statusLowStock: string;
    statusInStock: string;
  };
  reports: {
    title: string;
    financialOverview: string;
    revenueVsExpense: string;
    patientDemographics: string;
    ageDistribution: string;
    departmentPerformance: string;
    appointmentsByDept: string;
    occupancyRate: string;
    bedOccupancy: string;
    chartPlaceholder: string;
  };
  security: {
    title: string;
    totalEvents: string;
    successfulLogins: string;
    failedAttempts: string;
    searchPlaceholder: string;
    tableId: string;
    tableUser: string;
    tableAction: string;
    tableTimestamp: string;
    tableStatus: string;
    statusSuccess: string;
    statusFailed: string;
  };
  placeholders: {
    underDevelopment: string;
    featureComingSoon: string;
  };
}