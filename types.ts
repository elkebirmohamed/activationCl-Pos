
export interface ActivationFormData {
  machineId: string;
  email: string;
}

export enum ActivationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface ServiceResponse {
  success: boolean;
  message: string;
}

export interface LicenseData {
  key: string;
  generatedAt: string;
  status: 'ACTIVE' | 'PENDING';
}

export type Language = 'fr' | 'en';

export type AppView = 'FORM' | 'SUCCESS' | 'ADMIN';
