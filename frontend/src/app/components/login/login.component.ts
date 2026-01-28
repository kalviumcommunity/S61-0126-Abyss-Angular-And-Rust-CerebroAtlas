import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

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

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
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

    const { email, password } = this.loginForm.value;
    this.api.login(email, password).subscribe({
      next: (res) => {
        // Save token, navigate, etc.
        this.errorMessage = null;
        // Example: localStorage.setItem('token', res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = 'Login failed: Invalid credentials';
      }
    });
  }
}
