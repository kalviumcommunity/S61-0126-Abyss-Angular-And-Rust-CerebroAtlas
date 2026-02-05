import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Consent {
	id: number;
	patient_id: number;
	consent_type: string;
	granted: boolean;
	created_at?: string;
}

@Injectable({ providedIn: 'root' })
export class ConsentService {
	private apiUrl = 'http://localhost:8080/consents';

	constructor(private http: HttpClient) {}

	getConsents(): Observable<Consent[]> {
		return this.http.get<Consent[]>(this.apiUrl);
	}

	getConsent(id: number): Observable<Consent> {
		return this.http.get<Consent>(`${this.apiUrl}/${id}`);
	}

	updateConsent(id: number, granted: boolean): Observable<any> {
		return this.http.put(`${this.apiUrl}/${id}`, { granted });
	}
}
