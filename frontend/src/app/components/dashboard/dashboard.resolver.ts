import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Observable, forkJoin } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardResolver implements Resolve<any> {
  constructor(private api: ApiService) {}

  resolve(): Observable<any> {
    // Fetch both patients and records before activating dashboard
    return forkJoin({
      patients: this.api.getPatients(),
      records: this.api.getRecords()
    });
  }
}
