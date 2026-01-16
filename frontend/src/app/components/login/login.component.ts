import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  activeTab: 'password' | 'biometric' = 'password';
  errorMessage: string | null = null;

  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  setTab(tab: 'password' | 'biometric'): void {
    this.activeTab = tab;
    this.errorMessage = null;
  }

  onSubmit(): void {
    if (this.activeTab === 'biometric') {
      console.log('Biometric login success');
      return;
    }

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Invalid email or password';
      return;
    }

    console.log('Login success', this.loginForm.value);
    this.errorMessage = null;
  }
}
