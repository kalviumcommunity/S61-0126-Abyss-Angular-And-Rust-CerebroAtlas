import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-new-patient',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './new-patient.component.html',
  styleUrls: ['./new-patient.component.css']
})
export class NewPatientComponent {
  patient: any = {
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    bloodType: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    contactName: '',
    contactPhone: '',
    contactRelationship: '',
    conditions: '',
    allergies: '',
    notes: ''
  };

  saving: boolean = false;
  error: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  save(): void {
    if (!this.patient.firstName || !this.patient.lastName || !this.patient.dob || !this.patient.gender || !this.patient.phone) {
      this.error = 'Please fill in all required fields (First Name, Last Name, DOB, Gender, Phone)';
      return;
    }

    this.saving = true;
    this.error = '';

    // Format data to match backend API structure
    const patientData = {
      first_name: this.patient.firstName,
      last_name: this.patient.lastName,
      date_of_birth: this.patient.dob,
      gender: this.patient.gender,
      phone_number: this.patient.phone,
      middle_name: '',
      blood_type: this.patient.bloodType || undefined,
      email: this.patient.email || undefined,
      address: this.patient.address ? {
        street: this.patient.address,
        city: this.patient.city,
        state: this.patient.state
      } : undefined,
      village: this.patient.city || undefined,
      emergency_contact: this.patient.contactName ? {
        name: this.patient.contactName,
        phone: this.patient.contactPhone,
        relationship: this.patient.contactRelationship
      } : undefined,
      active_conditions: this.patient.conditions ? [this.patient.conditions] : [],
      known_allergies: this.patient.allergies ? [this.patient.allergies] : [],
      additional_notes: this.patient.notes || undefined,
      status: 'active'
    };

    console.log('Saving patient:', patientData);

    this.apiService.createPatient(patientData).subscribe({
      next: (response) => {
        console.log('Patient created successfully:', response);
        this.saving = false;
        // Navigate back to patients list
        this.router.navigate(['/patients']);
      },
      error: (err) => {
        console.error('Error creating patient:', err);
        this.error = 'Failed to create patient: ' + (err.message || 'Unknown error');
        this.saving = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/patients']);
  }
}
