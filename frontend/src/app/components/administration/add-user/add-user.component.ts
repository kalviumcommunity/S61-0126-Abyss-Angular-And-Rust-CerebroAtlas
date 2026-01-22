import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../shared/sidebar/sidebar';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  user: any = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    specialization: '',
    licenseNumber: '',
    username: '',
    status: 'active',
    permissions: []
  };

  roles = [
    'Administrator',
    'Physician',
    'Nurse',
    'Lab Technician',
    'Pharmacist',
    'Data Manager'
  ];

  departments = [
    'General Medicine',
    'Pediatrics',
    'Surgery',
    'Laboratory',
    'Pharmacy',
    'General Ward',
    'IT Department'
  ];

  save(): void {
    console.log('Create user', this.user);
  }
}
