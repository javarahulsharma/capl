export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: UserProfile;
}

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  employeeId: string;
  roleId: number;
  departmentId: number | null;
  designationId: number | null;
  photo: string | null;
  qrCode: string;
  department: Department | null;
  designation: Designation | null;
  role: Role;
  permissions: Permission[];
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  permissionCount?: number;
  userCount?: number;
}

export interface Permission {
  moduleKey: string;
  actionKey: string;
}

export interface ProfileResponse {
  user: UserProfile;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
  deleted: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Designation {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
  deleted: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UploadPhotoResponse {
  url: string;
}
