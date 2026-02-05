import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

async function sha256(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  errorMessage: string | null = null;
  loginForm: FormGroup;
  loginSuccess = false;
  loginAttempted = false;

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    this.loginAttempted = true;
    this.loginSuccess = false;
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Invalid email or password';
      return;
    }

    const { email, password } = this.loginForm.value;

    sha256(password).then(password_hash => {
      this.api.login(email, password_hash).subscribe({
        next: (response: any) => {
          // Save token to localStorage
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            console.log('Token saved:', response.token);
          } else {
            console.warn('No token found in response:', response);
          }
          console.log('Token in localStorage:', this.api.getToken());
          this.loginSuccess = true;
          this.errorMessage = null;
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.loginSuccess = false;
          this.errorMessage = 'Invalid credentials';
        }
      });
    });
  }
}

