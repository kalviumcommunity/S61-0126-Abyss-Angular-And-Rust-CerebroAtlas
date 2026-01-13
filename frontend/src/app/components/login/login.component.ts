import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, LoginMetadata, LoginResponse, StaffCredentials, StaffProfile } from '../../services/auth.service';

type LoginStatus = 'idle' | 'pending' | 'success' | 'error';

interface AuthFeedback {
	status: LoginStatus;
	message: string;
	issuedAt?: string;
}

class StaffLoginAudit {
	constructor(
		public readonly actor: string,
		public readonly attemptedAt: Date,
		public readonly metadata: LoginMetadata,
	) {}
}

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css'
})
export class LoginComponent {
	private readonly fb = inject(FormBuilder);
	private readonly auth = inject(AuthService);

	readonly pageTitle = 'Cerebro Atlas Staff Access';
	readonly typedNumber: number = 2048;
	readonly typedBoolean: boolean = true;
	readonly typedArray: string[] = ['TypeScript types', 'Angular signals', 'Rust contracts'];
	readonly typedObject: Record<string, string> = { stack: 'Angular + Rust', integrity: 'typed' };
	readonly typedProfile: StaffProfile = {
		id: 'STAFF-1024',
		email: 'ada.lovelace@cerebro.atlas',
		fullName: 'Ada Lovelace',
		role: 'clinician',
		lastLogin: '2026-01-10T08:00:00Z'
	};
	readonly auditTrail = new StaffLoginAudit(
		this.typedProfile.id,
		new Date(),
		{ channel: 'web', device: 'Windows client', version: 'atlas-1.0' }
	);

	readonly form = this.fb.nonNullable.group({
		staffIdOrEmail: this.fb.nonNullable.control('', { validators: [Validators.required] }),
		password: this.fb.nonNullable.control('', { validators: [Validators.required, Validators.minLength(8)] }),
	});

	readonly feedback = signal<AuthFeedback>({
		status: 'idle',
		message: 'Enter your staff ID or email and password to sign in.'
	});

	readonly loginMetadata = computed<LoginMetadata>(() => ({
		channel: 'web',
		device: 'Windows client',
		version: 'Cerebro-Atlas-1.0'
	}));

	submit(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			this.feedback.set({ status: 'error', message: 'Provide both fields before signing in.' });
			return;
		}

		const credentials: StaffCredentials = this.form.getRawValue();
		this.feedback.set({ status: 'pending', message: 'Validating credentials with typed service...' });

		this.auth.login(credentials, this.loginMetadata()).subscribe({
			next: (response: LoginResponse) => {
				this.feedback.set({
					status: 'success',
					message: `Welcome back, ${response.staff.fullName}. Token issued with typed payload.`,
					issuedAt: response.issuedAt,
				});
				this.form.reset({ staffIdOrEmail: '', password: '' });
			},
			error: (error: Error) => {
				this.feedback.set({ status: 'error', message: error.message });
			}
		});
	}

	get showPasswordHint(): boolean {
		return this.form.controls.password.touched && this.form.controls.password.invalid;
	}
}
