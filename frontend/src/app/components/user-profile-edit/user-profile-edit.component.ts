import { Component } from '@angular/core';
import { UserFormComponent } from '../user-form/user-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile-edit',
  standalone: true,
  imports: [UserFormComponent, CommonModule],
  templateUrl: './user-profile-edit.component.html',
  styleUrls: ['./user-profile-edit.component.css']
})
export class UserProfileEditComponent {
  // Simulated current user profile
  currentProfile = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com'
  };

  editMessage = '';
  updateHistory: any[] = [];

  onUserFormSubmitted(formData: { firstName: string; lastName: string; email: string }) {
    // Handle profile edit: update the profile and record the change
    const previousProfile = { ...this.currentProfile };
    this.currentProfile = { ...formData };
    
    const update = {
      previousProfile,
      newProfile: formData,
      updatedAt: new Date().toLocaleString(),
      status: 'Updated'
    };
    this.updateHistory.push(update);
    this.editMessage = `Profile updated for ${formData.firstName} ${formData.lastName}.`;
    console.log('Profile updated:', update);
  }
}
