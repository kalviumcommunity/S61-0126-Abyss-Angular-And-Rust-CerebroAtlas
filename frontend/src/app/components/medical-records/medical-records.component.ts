import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../shared/sidebar/sidebar';

@Component({
	selector: 'app-medical-records',
	standalone: true,
	imports: [CommonModule, RouterModule, Sidebar],
	templateUrl: './medical-records.component.html',
	styleUrls: ['./medical-records.component.css']
})
export class MedicalRecordsComponent {
	// Add logic here if needed in the future
}
