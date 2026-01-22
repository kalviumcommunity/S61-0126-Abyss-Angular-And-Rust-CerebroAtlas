import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../shared/sidebar/sidebar';

interface MedicalRecord {
	type: string;
	title: string;
	typeBadge: string;
	desc: string;
	patientInitials: string;
	patientName: string;
	provider: string;
	date: string;
	status: string;
	secondaryStatus?: string;
	dateObj?: Date;
}

@Component({
	selector: 'app-medical-records',
	standalone: true,
	imports: [CommonModule, FormsModule, RouterModule, Sidebar],
	templateUrl: './medical-records.component.html',
	styleUrls: ['./medical-records.component.css']
})
export class MedicalRecordsComponent {
	activeTab = 'all';
	searchQuery = '';
	showNewRecordModal = false;
	showDetailsModal = false;
	selectedRecord: MedicalRecord | null = null;
	dateRangeStart = '';
	dateRangeEnd = '';
	showFilters = false;
	selectedStatuses: { [key: string]: boolean } = {
		'completed': true,
		'pending review': true,
		'active': true,
		'pending': true
	};

	stats = [
		{ label: 'Consultations', value: '156', icon: 'consultations' },
		{ label: 'Lab Results', value: '89', icon: 'lab-results' },
		{ label: 'Prescriptions', value: '234', icon: 'prescriptions' },
		{ label: 'Imaging', value: '45', icon: 'imaging' },
	];

	allRecords: MedicalRecord[] = [
		{
			type: 'consultation',
			title: 'Follow-up Consultation',
			typeBadge: 'Consultation',
			desc: 'Blood sugar levels improving. Continued current medication regimen.',
			patientInitials: 'AO',
			patientName: 'Amara Okonkwo',
			provider: 'Dr. Sarah Johnson',
			date: '2024-01-15 at 10:30 AM',
			status: 'completed',
			secondaryStatus: undefined,
			dateObj: new Date('2024-01-15')
		},
		{
			type: 'lab-result',
			title: 'Complete Blood Count',
			typeBadge: 'Lab Result',
			desc: 'Results ready for physician review.',
			patientInitials: 'KM',
			patientName: 'Kwame Mensah',
			provider: 'Lab Technician',
			date: '2024-01-14 at 2:15 PM',
			status: 'pending review',
			secondaryStatus: 'Pending sync',
			dateObj: new Date('2024-01-14')
		},
		{
			type: 'prescription',
			title: 'Prenatal Vitamins',
			typeBadge: 'Prescription',
			desc: 'Folic acid, Iron supplements, Vitamin D - 3 month supply',
			patientInitials: 'FH',
			patientName: 'Fatima Hassan',
			provider: 'Dr. James Adeyemi',
			date: '2024-01-13 at 11:00 AM',
			status: 'active',
			secondaryStatus: undefined,
			dateObj: new Date('2024-01-13')
		},
		{
			type: 'imaging',
			title: 'Chest X-Ray',
			typeBadge: 'Imaging',
			desc: 'Clear lungs, no abnormalities detected',
			patientInitials: 'CE',
			patientName: 'Chidi Eze',
			provider: 'Dr. Sarah Johnson',
			date: '2024-01-12 at 9:45 AM',
			status: 'completed',
			secondaryStatus: undefined,
			dateObj: new Date('2024-01-12')
		}
	];

	consultations: MedicalRecord[] = [
		{
			type: 'consultation',
			title: 'Follow-up Consultation',
			typeBadge: 'Consultation',
			desc: 'Blood sugar levels improving. Continued current medication regimen.',
			patientInitials: 'AO',
			patientName: 'Amara Okonkwo',
			provider: 'Dr. Sarah Johnson',
			date: '2024-01-15 at 10:30 AM',
			status: 'completed',
			secondaryStatus: undefined,
			dateObj: new Date('2024-01-15')
		}
	];

	labResults: MedicalRecord[] = [
		{
			type: 'lab-result',
			title: 'Complete Blood Count',
			typeBadge: 'Lab Result',
			desc: 'Results ready for physician review.',
			patientInitials: 'KM',
			patientName: 'Kwame Mensah',
			provider: 'Lab Technician',
			date: '2024-01-14 at 2:15 PM',
			status: 'pending review',
			secondaryStatus: 'Pending sync',
			dateObj: new Date('2024-01-14')
		}
	];

	prescriptions: MedicalRecord[] = [
		{
			type: 'prescription',
			title: 'Prenatal Vitamins',
			typeBadge: 'Prescription',
			desc: 'Folic acid, Iron supplements, Vitamin D - 3 month supply',
			patientInitials: 'FH',
			patientName: 'Fatima Hassan',
			provider: 'Dr. James Adeyemi',
			date: '2024-01-13 at 11:00 AM',
			status: 'active',
			secondaryStatus: undefined,
			dateObj: new Date('2024-01-13')
		}
	];

	pendingSync: MedicalRecord[] = [
		{
			type: 'lab-result',
			title: 'Complete Blood Count',
			typeBadge: 'Lab Result',
			desc: 'Results ready for physician review.',
			patientInitials: 'KM',
			patientName: 'Kwame Mensah',
			provider: 'Lab Technician',
			date: '2024-01-14 at 2:15 PM',
			status: 'pending review',
			secondaryStatus: 'Pending sync',
			dateObj: new Date('2024-01-14')
		}
	];

	switchTab(tab: string) {
		this.activeTab = tab;
		this.searchQuery = '';
		this.dateRangeStart = '';
		this.dateRangeEnd = '';
		this.showFilters = false;
	}

	getCurrentRecords(): MedicalRecord[] {
		let records: MedicalRecord[] = [];
		
		switch (this.activeTab) {
			case 'consultations':
				records = [...this.consultations];
				break;
			case 'lab-results':
				records = [...this.labResults];
				break;
			case 'prescriptions':
				records = [...this.prescriptions];
				break;
			case 'pending-sync':
				records = [...this.pendingSync];
				break;
			default:
				records = [...this.allRecords];
		}

		return this.filterAndSearch(records);
	}

	filterAndSearch(records: MedicalRecord[]): MedicalRecord[] {
		return records.filter(record => {
			// Search filter
			if (this.searchQuery && this.searchQuery.trim()) {
				const query = this.searchQuery.toLowerCase();
				const matchesSearch = 
					record.patientName.toLowerCase().includes(query) ||
					record.provider.toLowerCase().includes(query) ||
					record.typeBadge.toLowerCase().includes(query) ||
					record.title.toLowerCase().includes(query);
				if (!matchesSearch) return false;
			}

			// Date range filter
			if (this.dateRangeStart || this.dateRangeEnd) {
				const recordDate = record.dateObj || new Date(record.date);
				
				if (this.dateRangeStart) {
					const startDate = new Date(this.dateRangeStart);
					startDate.setHours(0, 0, 0, 0);
					if (recordDate < startDate) return false;
				}

				if (this.dateRangeEnd) {
					const endDate = new Date(this.dateRangeEnd);
					endDate.setHours(23, 59, 59, 999);
					if (recordDate > endDate) return false;
				}
			}

			// Status filter
			const statusKey = record.status.toLowerCase();
			if (!this.selectedStatuses[statusKey]) {
				return false;
			}

			return true;
		});
	}

	onSearch(event: any): void {
		this.searchQuery = event.target.value;
	}

	openNewRecordModal(): void {
		this.showNewRecordModal = true;
	}

	closeNewRecordModal(): void {
		this.showNewRecordModal = false;
	}

	openDetailsModal(record: MedicalRecord): void {
		this.selectedRecord = { ...record };
		this.showDetailsModal = true;
	}

	closeDetailsModal(): void {
		this.showDetailsModal = false;
		this.selectedRecord = null;
	}

	toggleFilters(): void {
		this.showFilters = !this.showFilters;
	}

	toggleStatusFilter(status: string): void {
		if (this.selectedStatuses.hasOwnProperty(status)) {
			this.selectedStatuses[status] = !this.selectedStatuses[status];
		}
	}

	clearFilters(): void {
		this.searchQuery = '';
		this.dateRangeStart = '';
		this.dateRangeEnd = '';
		Object.keys(this.selectedStatuses).forEach(status => {
			this.selectedStatuses[status] = true;
		});
	}

	exportRecords(): void {
		const records = this.getCurrentRecords();
		const csvContent = this.convertToCSV(records);
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		const url = URL.createObjectURL(blob);
		link.setAttribute('href', url);
		link.setAttribute('download', `medical-records-${new Date().toISOString().split('T')[0]}.csv`);
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	convertToCSV(records: MedicalRecord[]): string {
		const headers = ['Title', 'Type', 'Patient', 'Provider', 'Date', 'Status', 'Description'];
		const rows = records.map(r => [
			`"${r.title}"`,
			`"${r.typeBadge}"`,
			`"${r.patientName}"`,
			`"${r.provider}"`,
			`"${r.date}"`,
			`"${r.status}${r.secondaryStatus ? `, ${r.secondaryStatus}` : ''}"`,
			`"${r.desc}"`
		]);

		const csvRows = [
			headers.join(','),
			...rows.map(row => row.join(','))
		];

		return csvRows.join('\n');
	}

	getStatusColor(status: string): string {
		const statusLower = status.toLowerCase();
		switch (statusLower) {
			case 'completed':
			case 'active':
				return '#10b981';
			case 'pending review':
			case 'pending':
				return '#f97316';
			default:
				return '#6b7280';
		}
	}
}
