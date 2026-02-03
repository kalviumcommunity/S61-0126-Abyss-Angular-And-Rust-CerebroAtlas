// Administration API types
export interface AdministrationStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  roles: number;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  username: string;
  password: string;
  role: string;
  department?: string;
  specialization?: string;
  license_number?: string;
  status: string;
  last_login?: string;
  last_activity?: string;
  is_active: boolean;
  profile_picture_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  read: boolean;
  write: boolean;
  delete: boolean;
}

export interface RolePermissions {
  patient_records: Permission;
  medical_records: Permission;
  prescriptions: Permission;
  appointments: Permission;
  lab_results: Permission;
  reports: Permission;
  user_management: Permission;
  system_settings: Permission;
}

export interface Role {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  permissions: RolePermissions;
  created_at?: string;
  updated_at?: string;
}

export interface AdministrationResponse {
  stats: AdministrationStats;
  users: User[];
  roles: Role[];
}

// Administration API will be merged into the main ApiService class below.
export interface StatsResponse {
  total_patients: number;
  total_records: number;
  consultations_mtd: number;
  completed: number;
  pending: number;
  lab_results: number;
  avg_wait_time?: string;
  data_completeness?: string;
}

export interface VillageDistribution {
  name: string;
  patients: number;
  growth: string;
}

export interface ConditionDistribution {
  condition: string;
  percentage: number;
}

export interface DiseaseTrend {
  month: string;
  value: number;
}

export interface AnalyticsResponse {
  stats: StatsResponse;
  villages: VillageDistribution[];
  conditions: ConditionDistribution[];
  disease_trend: DiseaseTrend[];
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Address {
  street?: string;
  city?: string;
  state?: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface Patient {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  blood_type?: string;
  phone_number: string;
  email?: string;
  address?: Address;
  village?: string;
  emergency_contact?: EmergencyContact;
  active_conditions?: string[];
  known_allergies?: string[];
  additional_notes?: string;
  status: string;
  sync_status?: string;
  critical_flag?: boolean;
  profile_picture_url?: string;
  next_visit?: string;
  created_at: string;
  updated_at: string;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  record_type: string;
  record_category?: string;
  title: string;
  provider: string;
  date: string;
  status: string;
  description?: string;
  secondary_status?: string;
  reviewed_by?: string;
  attachments?: string[];
  is_exported?: boolean;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:8080';

  constructor(private http: HttpClient) { }

  // Administration API
  getAdministration(): Observable<AdministrationResponse> {
    return this.http.get<AdministrationResponse>(`${this.apiUrl}/administration`);
  }

  // Patients API
  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}/patients`);
  }

  getPatient(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/patients/${id}`);
  }

  createPatient(patient: Partial<Patient>): Observable<Patient> {
    return this.http.post<Patient>(`${this.apiUrl}/patients`, patient);
  }

  updatePatient(id: string, patient: Partial<Patient>): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/patients/${id}`, patient);
  }

  deletePatient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/patients/${id}`);
  }

  // Medical Records API
  getRecords(): Observable<MedicalRecord[]> {
    return this.http.get<MedicalRecord[]>(`${this.apiUrl}/records`);
  }

  getRecord(id: string): Observable<MedicalRecord> {
    return this.http.get<MedicalRecord>(`${this.apiUrl}/records/${id}`);
  }

  createRecord(record: Partial<MedicalRecord>): Observable<MedicalRecord> {
    const payload = {
      patient_id: Number(record.patient_id),
      record_type: record.record_type?.toLowerCase().replace(' ', '_'),
      title: record.title?.trim(),
      provider: record.provider?.trim(),
      date: this.toISODate(record.date),
      status: record.status?.toLowerCase(),
      record_category: record.record_category || null,
      description: record.description || null,
      secondary_status: record.secondary_status || null,
      reviewed_by: record.reviewed_by || null,
      attachments: record.attachments?.length ? record.attachments : null,
      is_exported: record.is_exported ?? false
    };
    console.log('FINAL Payload:', payload);
    return this.http.post<MedicalRecord>(`${this.apiUrl}/records`, payload);
  }


  updateRecord(id: string, record: Partial<MedicalRecord>): Observable<MedicalRecord> {
    return this.http.put<MedicalRecord>(`${this.apiUrl}/records/${id}`, record);
  }

  deleteRecord(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/records/${id}`);
  }

  // Login API
  login(email: string, password_hash: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password_hash });
  }

  // Analytics API
  getAnalytics(): Observable<AnalyticsResponse> {
    return this.http.get<AnalyticsResponse>(`${this.apiUrl}/analytics`);
  }

  // Health check
  health(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }

  private toISODate(dateStr?: string): string {
    if (!dateStr) return new Date().toISOString().slice(0, 10);
    if (dateStr.includes('-') && dateStr.length === 10) {
      // Already yyyy-mm-dd
      return dateStr;
    }
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  }
}
