export interface Tenant {
  id: string;
  name: string;
  plan: 'Basic' | 'Pro' | 'Enterprise';
  status: 'Active' | 'Suspended';
  schoolsCount: number;
  studentsCount: number;
  quotaLimit: number;
  contactEmail: string;
}

export interface School {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  activeStudents: number;
  pendingApprovals: number;
  assignedTemplateId: string;
  status: 'Active' | 'Inactive';
  adminName?: string;
  adminEmail?: string;
  adminPhone?: string;
  username?: string;
  password?: string;
}

export interface MasterField {
  id: string;
  tenantId: string;
  key: string;
  label: string;
  dataType: 'text' | 'number' | 'date' | 'select' | 'image';
  options?: string[];
  isRequired: boolean;
}

export interface TemplatePlaceholder {
  key: string; // matches master field key
  label: string;
  x: number;
  y: number;
  fontSize?: number;
  color?: string;
  fontWeight?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TemplatePhotoZone {
  x: number;
  y: number;
  width: number;
  height: number;
  shape: 'rectangle' | 'rounded' | 'oval';
}

export interface Template {
  id: string;
  tenantId: string;
  name: string;
  category: string;
  frontBgColor: string;
  backBgColor: string;
  primaryColor: string;
  accentColor: string;
  frontAssetUrl?: string; // Direct PNG / PDF upload artwork
  backAssetUrl?: string;
  textPlaceholders: TemplatePlaceholder[];
  photoZone: TemplatePhotoZone;
  status: 'Active' | 'Draft' | 'Requested';
  assignedSchoolId?: string;
}

export interface ClassBatch {
  id: string;
  schoolId: string;
  className: string;
  division: string;
  academicYear: string;
  status: 'Open' | 'Finalized' | 'Printed';
}

export interface BatchForm {
  id: string;
  schoolId: string;
  batchId: string;
  className: string;
  division: string;
  templateId: string;
  templateName: string;
  publicUrl: string;
  createdScope: 'school' | 'admin';
  includedMasterFieldIds: string[];
  customFields: Array<{ label: string; dataType: string }>;
  createdAt: string;
}

export interface StudentSubmission {
  id: string;
  schoolId: string;
  batchId: string;
  rollNo: string;
  fullName: string;
  className: string;
  division: string;
  dob: string;
  bloodGroup: string;
  phone: string;
  photoUrl: string;
  submittedAt: string;
  status: 'Data Submitted' | 'Batch Finalized' | 'Sample Generated' | 'Under Review' | 'Approved' | 'Rejected' | 'Printing' | 'Dispatched';
  rejectionReason?: string;
  panX?: number; // fallback photo positioning
  panY?: number;
  zoom?: number;
}

export interface TemplateRequest {
  id: string;
  schoolId: string;
  schoolName: string;
  orientation: 'Vertical' | 'Horizontal';
  brandingColor: string;
  notes: string;
  status: 'Requested' | 'In Design' | 'Ready for Review' | 'Approved';
}
