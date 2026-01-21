import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../shared/sidebar/sidebar';

@Component({
  selector: 'app-new-patient',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './new-patient.component.html',
  styleUrls: ['./new-patient.component.css']
})
export class NewPatientComponent {
  // Placeholder model bindings to enable template-driven forms
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

  save(): void {
    // Hook for future submit logic
    console.log('Register patient', this.patient);
  }
}
