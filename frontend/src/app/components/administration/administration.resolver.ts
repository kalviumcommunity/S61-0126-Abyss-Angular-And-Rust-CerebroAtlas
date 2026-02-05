import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdministrationResolver implements Resolve<any> {
  constructor(private api: ApiService) {}

  resolve(): Observable<any> {
    // Fetch administration data before activating the route
    return this.api.getAdministration();
  }
}
