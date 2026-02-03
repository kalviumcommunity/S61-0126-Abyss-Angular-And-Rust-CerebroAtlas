// (removed stray top-level comment)
import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../shared/sidebar/sidebar';
import { ApiService, Patient } from '../../services/api.service';
import { Observable, BehaviorSubject, combineLatest, of, OperatorFunction } from 'rxjs';
import { map, catchError, startWith, tap, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, RouterModule, Sidebar],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent {
  // State subjects
  private searchTermSubject = new BehaviorSubject<string>('');
  private activeTabSubject = new BehaviorSubject<string>('all');
  readonly activeTab$ = this.activeTabSubject.asObservable();
  private reloadSubject = new BehaviorSubject<void>(undefined);

  // Expose as Observable for async pipe
  patients$: Observable<Patient[]>;
  filteredPatients$: Observable<Patient[]>;
  loading$ = new BehaviorSubject<boolean>(true);
  error$ = new BehaviorSubject<string>('');

  constructor(private apiService: ApiService) {
    // Fetch patients, handle loading and error
    this.patients$ = this.reloadSubject.pipe(
      tap(() => {
        this.loading$.next(true);
        this.error$.next('');
      }),
      // Switch to API call
      switchMap(() => this.apiService.getPatients().pipe(
        tap(() => this.loading$.next(false)),
        catchError(err => {
          this.error$.next('Failed to load patients: ' + (err.message || 'Unknown error'));
          this.loading$.next(false);
          return of([]);
        })
      )),
      startWith([])
    );

    // Combine patients, search, and tab filters
    this.filteredPatients$ = combineLatest([
      this.patients$,
      this.searchTermSubject.asObservable(),
      this.activeTabSubject.asObservable()
    ]).pipe(
      map(([patients, searchTerm, activeTab]: [Patient[], string, string]) => {
        let filtered = patients;
        if (searchTerm && searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter((p: Patient) =>
            p.first_name.toLowerCase().includes(term) ||
            p.last_name.toLowerCase().includes(term) ||
            (p.village?.toLowerCase().includes(term) ?? false) ||
            (p.active_conditions?.some((c: string) => c.toLowerCase().includes(term)) || false)
          );
        }
        if (activeTab === 'active') {
          filtered = filtered.filter((p: Patient) => p.status === 'active');
        } else if (activeTab === 'pending') {
          filtered = filtered.filter((p: Patient) => p.sync_status === 'pending');
        } else if (activeTab === 'critical') {
          filtered = filtered.filter((p: Patient) => p.critical_flag === true);
        }
        return filtered;
      })
    );
  }

  set searchTerm(val: string) {
    this.searchTermSubject.next(val);
  }
  get searchTerm() {
    return this.searchTermSubject.value;
  }

  setTab(tab: string) {
    this.activeTabSubject.next(tab);
  }

  getInitials(patient: Patient): string {
    return (patient.first_name.charAt(0) + patient.last_name.charAt(0)).toUpperCase();
  }

  deletePatient(id: string) {
    if (confirm('Are you sure you want to delete this patient?')) {
      this.apiService.deletePatient(id).pipe(
        tap({
          next: () => {
            this.reloadSubject.next();
          },
          error: (err) => {
            this.error$.next('Failed to delete patient');
            console.error('Error deleting patient:', err);
          }
        })
      ).subscribe();
    }
  }

  viewPatient(id: string) {
    // Navigate to patient details if needed
  }

  addPatient(newPatient: Partial<Patient>) {
    this.apiService.createPatient(newPatient).pipe(
      tap({
        next: () => {
          this.reloadSubject.next();
          this.error$.next('');
        },
        error: (err) => {
          this.error$.next('Failed to add patient: ' + (err.message || 'Unknown error'));
          console.error('Error adding patient:', err);
        }
      })
    ).subscribe();
  }

  updatePatient(id: string, updatedData: Partial<Patient>) {
    this.apiService.updatePatient(id, updatedData).pipe(
      tap({
        next: () => {
          this.reloadSubject.next();
          this.error$.next('');
        },
        error: (err) => {
          this.error$.next('Failed to update patient: ' + (err.message || 'Unknown error'));
          console.error('Error updating patient:', err);
        }
      })
    ).subscribe();
  }
}
/**
 * Implementation of switchMap for the context above.
 * This is a simplified version for demonstration purposes.
 */
function switchMap<T, R>(project: (value: T, index: number) => Observable<R>): OperatorFunction<T, R> {
  return (source: Observable<T>) =>
    new Observable<R>(subscriber => {
      let innerSubscription: any;
      let index = 0;
      const outerSubscription = source.subscribe({
        next(value) {
          if (innerSubscription) {
            innerSubscription.unsubscribe();
          }
          let innerObservable: Observable<R>;
          try {
            innerObservable = project(value, index++);
          } catch (err) {
            subscriber.error(err);
            return;
          }
          innerSubscription = innerObservable.subscribe({
            next: val => subscriber.next(val),
            error: err => subscriber.error(err),
            complete: () => { /* do nothing */ }
          });
        },
        error(err) {
          subscriber.error(err);
        },
        complete() {
          if (innerSubscription) {
            innerSubscription.unsubscribe();
          }
          subscriber.complete();
        }
      });
      return () => {
        outerSubscription.unsubscribe();
        if (innerSubscription) {
          innerSubscription.unsubscribe();
        }
      };
    });
}

