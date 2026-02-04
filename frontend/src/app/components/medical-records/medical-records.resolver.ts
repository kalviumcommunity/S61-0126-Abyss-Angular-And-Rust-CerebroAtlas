import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Observable, forkJoin } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MedicalRecordsResolver implements Resolve<any> {
  constructor(private api: ApiService) {}

  resolve(): Observable<any> {
    // Fetch both records and patients before activating medical records route
    return forkJoin({
      records: this.api.getRecords(),
      patients: this.api.getPatients()
    });
  }
}
