import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  @Input() initialData: { firstName?: string; lastName?: string; email?: string } = {};
  @Output() formSubmitted = new EventEmitter<{ firstName: string; lastName: string; email: string }>();

  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    if (this.initialData && Object.keys(this.initialData).length > 0) {
      this.userForm.patchValue(this.initialData);
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.formSubmitted.emit(this.userForm.value);
      this.userForm.reset();
    }
  }
}
