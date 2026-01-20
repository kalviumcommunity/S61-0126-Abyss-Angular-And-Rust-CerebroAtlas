import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../shared/sidebar/sidebar';

interface Patient {
  name: string;
  age: number;
  gender: string;
  location: string;
  phone: string;
  nextVisit: Date;
  conditions: string[];
  statuses: string[];
}

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, Sidebar],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [
    {
      name: 'Amara Okonkwo',
      age: 34,
      gender: 'Female',
      location: 'Umuahia North',
      phone: '+234 801 234 5678',
      nextVisit: new Date('2024-01-22'),
      conditions: ['Hypertension', 'Diabetes Type 2'],
      statuses: ['active']
    },
    {
      name: 'Kwame Mensah',
      age: 52,
      gender: 'Male',
      location: 'Aba South',
      phone: '+234 802 345 6789',
      nextVisit: new Date('2024-01-22'),
      conditions: ['Malaria (recovering)'],
      statuses: ['follow-up', 'Pending sync']
    },
    {
      name: 'Fatima Hassan',
      age: 28,
      gender: 'Female',
      location: 'Ikwuano',
      phone: '+234 803 456 7890',
      nextVisit: new Date('2024-01-20'),
      conditions: ['Prenatal Care'],
      statuses: ['new']
    },
    {
      name: 'Chidi Eze',
      age: 45,
      gender: 'Male',
      location: 'Osisioma',
      phone: '+234 804 567 8901',
      nextVisit: new Date('2024-01-25'),
      conditions: [],
      statuses: ['active']
    },
    {
      name: 'Ngozi Adeyemi',
      age: 67,
      gender: 'Female',
      location: 'Umuahia South',
      phone: '+234 805 678 9012',
      nextVisit: new Date('2024-01-18'),
      conditions: [],
      statuses: []
    }
  ];

  filteredPatients: Patient[] = [];
  searchTerm: string = '';
  activeTab: string = 'all';

  ngOnInit() {
    this.filteredPatients = this.patients;
  }

  filterPatients() {
    const term = this.searchTerm.toLowerCase();
    this.filteredPatients = this.patients.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.location.toLowerCase().includes(term) ||
      p.conditions.some(c => c.toLowerCase().includes(term))
    );
  }

  setTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'all') {
      this.filteredPatients = this.patients;
    } else if (tab === 'active') {
      this.filteredPatients = this.patients.filter(p => p.statuses.includes('active'));
    } else if (tab === 'pending') {
      this.filteredPatients = this.patients.filter(p => p.statuses.includes('Pending sync'));
    } else if (tab === 'critical') {
      this.filteredPatients = [];
    }
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
}