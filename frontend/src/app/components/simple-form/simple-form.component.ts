import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-simple-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './simple-form.component.html',
  styleUrls: ['./simple-form.component.css']
})
export class SimpleFormComponent {
  formData = {
    name: '',
    email: '',
    message: ''
  };
  submitted = false;
  submittedData: any = null;

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.submitted = true;
      this.submittedData = { ...this.formData };
      console.log('Form submitted:', this.submittedData);
      form.resetForm();
      this.submitted = false;
    }
  }
}
