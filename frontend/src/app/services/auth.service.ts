import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';

export type StaffRole = 'clinician' | 'admin' | 'technician';

export interface StaffCredentials {
	staffIdOrEmail: string;
	password: string;
}

export interface StaffProfile {
	id: string;
	email: string;
	fullName: string;
	role: StaffRole;
	lastLogin?: string;
}

export interface LoginResponse {
	token: string;
	staff: StaffProfile;
	issuedAt: string;
}

export interface LoginMetadata {
	channel: 'web' | 'mobile' | 'integration';
	device: string;
	version: string;
}

interface AuthPayload {
	identity: string;
	email?: string;
	staff_id?: string;
	password: string;
	channel: LoginMetadata['channel'];
	device: string;
	version: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
	private readonly http = inject(HttpClient);
	private readonly apiBase = 'http://localhost:8000/api';

	login(credentials: StaffCredentials, metadata: LoginMetadata): Observable<LoginResponse> {
		const payload = this.buildPayload(credentials, metadata);

		if (!payload.identity) {
			return throwError(() => new Error('Provide a staff ID or email.'));
		}

		if (payload.password.length < 8) {
			return throwError(() => new Error('Password must be at least 8 characters.'));
		}

		const simulated: LoginResponse = {
			token: btoa(`${payload.identity}|${payload.channel}`),
			staff: {
				id: payload.staff_id ?? payload.identity,
				email: payload.email ?? 'staff@cerebro.atlas',
				fullName: 'Typed Staff Member',
				role: 'admin',
				lastLogin: new Date().toISOString(),
			},
			issuedAt: new Date().toISOString(),
		};

		// Swap the simulated response for a real HTTP call when the Rust API is available.
		// return this.http.post<LoginResponse>(`${this.apiBase}/auth/login`, payload);
		return of(simulated).pipe(delay(750));
	}

	private buildPayload(credentials: StaffCredentials, metadata: LoginMetadata): AuthPayload {
		const trimmed = credentials.staffIdOrEmail.trim();
		const identity = trimmed || '';
		const isEmail = trimmed.includes('@');

		return {
			identity,
			email: isEmail ? trimmed : undefined,
			staff_id: isEmail ? undefined : trimmed,
			password: credentials.password,
			channel: metadata.channel,
			device: metadata.device,
			version: metadata.version,
		};
	}
}
