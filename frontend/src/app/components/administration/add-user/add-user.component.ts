import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Location } from '@angular/common';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, Sidebar],
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
  password: string = '';
  isLoading = false;
  errorMsg = '';
  successMsg = '';

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

  constructor(private location: Location, private http: HttpClient) {}

  save(): void {
    this.errorMsg = '';
    this.successMsg = '';
    // Basic validation
    if (!this.user.firstName || !this.user.lastName || !this.user.email || !this.user.role || !this.user.department || !this.user.username || !this.password) {
      this.errorMsg = 'Please fill all required fields.';
      return;
    }
    this.isLoading = true;
    // Convert camelCase to snake_case for backend
    const payload = {
      first_name: this.user.firstName,
      last_name: this.user.lastName,
      email: this.user.email,
      phone: this.user.phone,
      role: this.user.role,
      department: this.user.department,
      specialization: this.user.specialization,
      license_number: this.user.licenseNumber,
      username: this.user.username,
      password: this.password,
      status: this.user.status,
      permissions: this.user.permissions
    };
    this.http.post('/api/users', payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMsg = 'User created successfully!';
        setTimeout(() => this.goBack(), 1200);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMsg = err.error?.message || 'Failed to create user.';
      }
    });
  }

  goBack() {
    this.location.back();
  }
}
