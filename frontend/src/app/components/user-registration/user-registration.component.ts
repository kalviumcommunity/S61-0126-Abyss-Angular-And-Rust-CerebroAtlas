import { Component } from '@angular/core';
import { UserFormComponent } from '../user-form/user-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [UserFormComponent, CommonModule],
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent {
  registrationMessage = '';
  registeredUsers: any[] = [];

  onUserFormSubmitted(formData: { firstName: string; lastName: string; email: string }) {
    // Handle registration: add user to a list and show confirmation
    const newUser = {
      ...formData,
      registeredAt: new Date().toLocaleString(),
      status: 'Registered'
    };
    this.registeredUsers.push(newUser);
    this.registrationMessage = `User ${formData.firstName} ${formData.lastName} has been registered successfully!`;
    console.log('User registered:', newUser);
  }
}
