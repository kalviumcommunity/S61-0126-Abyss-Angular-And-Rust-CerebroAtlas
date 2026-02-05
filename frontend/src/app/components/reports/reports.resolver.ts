import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Observable, forkJoin } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportsResolver implements Resolve<any> {
  constructor(private api: ApiService) {}

  resolve(): Observable<any> {
    // Fetch analytics, records, and patients before activating the reports route
    return forkJoin({
      analytics: this.api.getAnalytics(),
      records: this.api.getRecords(),
      patients: this.api.getPatients()
    });
  }
}
