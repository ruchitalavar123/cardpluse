'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tenant, School, MasterField, Template, ClassBatch, StudentSubmission, TemplateRequest, BatchForm } from '../types';
import { INITIAL_TENANTS, INITIAL_SCHOOLS, DEFAULT_MASTER_FIELDS, INITIAL_TEMPLATES, INITIAL_BATCHES, INITIAL_STUDENTS, INITIAL_REQUESTS, INITIAL_FORMS } from '../data/mockData';

export type UserRole = 'super_admin' | 'tenant' | 'school' | 'student';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTenantId: string;
  setActiveTenantId: (id: string) => void;
  activeSchoolId: string;
  setActiveSchoolId: (id: string) => void;
  
  // Data lists
  tenants: Tenant[];
  schools: School[];
  masterFields: MasterField[];
  templates: Template[];
  batches: ClassBatch[];
  students: StudentSubmission[];
  templateRequests: TemplateRequest[];
  batchForms: BatchForm[];

  // Mutators & Operations
  addTenant: (tenant: Omit<Tenant, 'id'>) => void;
  addSchool: (school: Omit<School, 'id'>) => void;
  addMasterField: (field: Omit<MasterField, 'id'>) => void;
  addTemplate: (template: Omit<Template, 'id'>) => void;
  addBatchForm: (form: Omit<BatchForm, 'id' | 'createdAt'>) => void;
  addStudentSubmission: (submission: Omit<StudentSubmission, 'id' | 'submittedAt' | 'status'>) => void;
  updateStudentStatus: (studentId: string, status: StudentSubmission['status'], rejectionReason?: string) => void;
  updateStudentPhotoFit: (studentId: string, panX: number, panY: number, zoom: number) => void;
  updateStudentData: (studentId: string, updatedData: Partial<StudentSubmission>) => void;
  applyBatchPhotoFit: (schoolId: string, panX: number, panY: number, zoom: number) => void;
  applyBatchDataAdjustment: (schoolId: string, updatedData: Partial<StudentSubmission>) => void;
  bulkApproveStudents: (batchId: string) => void;
  addTemplateRequest: (req: Omit<TemplateRequest, 'id' | 'status'>) => void;
  updateRequestStatus: (reqId: string, status: TemplateRequest['status']) => void;
  updateTemplateLayout: (templateId: string, updatedFields: Partial<Template>) => void;
  addClassBatch: (batch: Omit<ClassBatch, 'id'>) => void;
  finalizeBatch: (batchId: string) => void;
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('super_admin');
  const [activeTenantId, setActiveTenantId] = useState<string>('ten-1');
  const [activeSchoolId, setActiveSchoolId] = useState<string>('sch-1');

  // State loaded from localStorage if available
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [schools, setSchools] = useState<School[]>(INITIAL_SCHOOLS);
  const [masterFields, setMasterFields] = useState<MasterField[]>(DEFAULT_MASTER_FIELDS);
  const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES);
  const [batches, setBatches] = useState<ClassBatch[]>(INITIAL_BATCHES);
  const [students, setStudents] = useState<StudentSubmission[]>(INITIAL_STUDENTS);
  const [templateRequests, setTemplateRequests] = useState<TemplateRequest[]>(INITIAL_REQUESTS);
  const [batchForms, setBatchForms] = useState<BatchForm[]>(INITIAL_FORMS);

  // Load state on initial mount
  useEffect(() => {
    try {
      const savedTenants = localStorage.getItem('saas_id_tenants');
      if (savedTenants) setTenants(JSON.parse(savedTenants));

      const savedSchools = localStorage.getItem('saas_id_schools');
      if (savedSchools) setSchools(JSON.parse(savedSchools));

      const savedStudents = localStorage.getItem('saas_id_students');
      if (savedStudents) setStudents(JSON.parse(savedStudents));

      const savedTemplates = localStorage.getItem('saas_id_templates');
      if (savedTemplates) setTemplates(JSON.parse(savedTemplates));
    } catch (e) {
      console.error('Failed to parse localStorage', e);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('saas_id_tenants', JSON.stringify(tenants));
    localStorage.setItem('saas_id_schools', JSON.stringify(schools));
    localStorage.setItem('saas_id_students', JSON.stringify(students));
    localStorage.setItem('saas_id_templates', JSON.stringify(templates));
  }, [tenants, schools, students, templates]);

  const addTenant = (t: Omit<Tenant, 'id'>) => {
    const newT: Tenant = { ...t, id: `ten-${Date.now()}` };
    setTenants(prev => [...prev, newT]);
  };

  const addSchool = (s: Omit<School, 'id'>) => {
    const newS: School = { ...s, id: `sch-${Date.now()}` };
    setSchools(prev => [...prev, newS]);
  };

  const addMasterField = (f: Omit<MasterField, 'id'>) => {
    const newF: MasterField = { ...f, id: `mf-${Date.now()}` };
    setMasterFields(prev => [...prev, newF]);
  };

  const addTemplate = (tpl: Omit<Template, 'id'>) => {
    const newTpl: Template = { ...tpl, id: `tpl-${Date.now()}` };
    setTemplates(prev => [...prev, newTpl]);
  };

  const addStudentSubmission = (sub: Omit<StudentSubmission, 'id' | 'submittedAt' | 'status'>) => {
    const newSub: StudentSubmission = {
      ...sub,
      id: `stu-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'Data Submitted',
      panX: 0,
      panY: 0,
      zoom: 1.0,
    };
    setStudents(prev => [newSub, ...prev]);
  };

  const updateStudentStatus = (studentId: string, status: StudentSubmission['status'], rejectionReason?: string) => {
    setStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, status, rejectionReason: rejectionReason ?? s.rejectionReason } : s))
    );
  };

  const updateStudentPhotoFit = (studentId: string, panX: number, panY: number, zoom: number) => {
    setStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, panX, panY, zoom } : s))
    );
  };

  const applyBatchPhotoFit = (schoolId: string, panX: number, panY: number, zoom: number) => {
    setStudents(prev =>
      prev.map(s => (s.schoolId === schoolId ? { ...s, panX, panY, zoom } : s))
    );
  };

  const updateStudentData = (studentId: string, updatedData: Partial<StudentSubmission>) => {
    setStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, ...updatedData } : s))
    );
  };

  const applyBatchDataAdjustment = (schoolId: string, updatedData: Partial<StudentSubmission>) => {
    setStudents(prev =>
      prev.map(s => (s.schoolId === schoolId ? { ...s, ...updatedData } : s))
    );
  };

  const bulkApproveStudents = (batchId: string) => {
    setStudents(prev =>
      prev.map(s => (s.batchId === batchId ? { ...s, status: 'Approved' } : s))
    );
  };

  const addTemplateRequest = (req: Omit<TemplateRequest, 'id' | 'status'>) => {
    const newReq: TemplateRequest = { ...req, id: `req-${Date.now()}`, status: 'Requested' };
    setTemplateRequests(prev => [...prev, newReq]);
  };

  const updateRequestStatus = (reqId: string, status: TemplateRequest['status']) => {
    setTemplateRequests(prev =>
      prev.map(r => (r.id === reqId ? { ...r, status } : r))
    );
  };

  const updateTemplateLayout = (templateId: string, updatedFields: Partial<Template>) => {
    setTemplates(prev =>
      prev.map(t => (t.id === templateId ? { ...t, ...updatedFields } : t))
    );
  };

  const addClassBatch = (b: Omit<ClassBatch, 'id'>) => {
    const newB: ClassBatch = {
      ...b,
      id: `batch-${Date.now()}`,
    };
    setBatches(prev => [...prev, newB]);
  };

  const finalizeBatch = (batchId: string) => {
    setBatches(prev => prev.map(b => (b.id === batchId ? { ...b, status: 'Finalized' } : b)));
    setStudents(prev =>
      prev.map(s => (s.batchId === batchId && s.status === 'Data Submitted' ? { ...s, status: 'Under Review' } : s))
    );
  };

  const addBatchForm = (f: Omit<BatchForm, 'id' | 'createdAt'>) => {
    const newForm: BatchForm = {
      ...f,
      id: `form-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setBatchForms(prev => [newForm, ...prev]);
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setTenants(INITIAL_TENANTS);
    setSchools(INITIAL_SCHOOLS);
    setMasterFields(DEFAULT_MASTER_FIELDS);
    setTemplates(INITIAL_TEMPLATES);
    setBatches(INITIAL_BATCHES);
    setStudents(INITIAL_STUDENTS);
    setTemplateRequests(INITIAL_REQUESTS);
    setBatchForms(INITIAL_FORMS);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeTenantId,
        setActiveTenantId,
        activeSchoolId,
        setActiveSchoolId,
        tenants,
        schools,
        masterFields,
        templates,
        batches,
        students,
        templateRequests,
        batchForms,
        addTenant,
        addSchool,
        addMasterField,
        addTemplate,
        addBatchForm,
        addStudentSubmission,
        updateStudentStatus,
        updateStudentPhotoFit,
        applyBatchPhotoFit,
        updateStudentData,
        applyBatchDataAdjustment,
        bulkApproveStudents,
        addTemplateRequest,
        updateRequestStatus,
        updateTemplateLayout,
        addClassBatch,
        finalizeBatch,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
