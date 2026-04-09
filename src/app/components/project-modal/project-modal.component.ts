import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import type { Project } from '../../models/project.model';
import { PROJECT_COLORS } from '../../constants/app.constants';
import type { ProjectColorOption } from '../../constants/app.constants';

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" (click)="onOverlayClick($event)">
      <div class="modal-dialog" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ isEditMode ? 'Edit Project' : 'Create Project' }}</h2>
          <button class="modal-close-btn" type="button" (click)="onCancel()" aria-label="Close modal">×</button>
        </div>

        <form [formGroup]="projectForm" (ngSubmit)="onSubmit()">
          <div class="modal-body">
            <div class="form-group">
              <label for="projectName">Project Name <span class="required">*</span></label>
              <input
                id="projectName"
                type="text"
                formControlName="name"
                maxlength="64"
                placeholder="Enter project name"
                [class.invalid]="submitted && projectForm.get('name')!.invalid"
              />
              @if (submitted && projectForm.get('name')!.hasError('required')) {
                <span class="error-message">Project name is required.</span>
              }
              @if (submitted && projectForm.get('name')!.hasError('maxlength')) {
                <span class="error-message">Project name must be 64 characters or less.</span>
              }
            </div>

            <div class="form-group">
              <label for="projectDescription">Description</label>
              <textarea
                id="projectDescription"
                formControlName="description"
                maxlength="256"
                placeholder="Enter project description (optional)"
                rows="3"
              ></textarea>
            </div>

            <div class="form-group">
              <label class="color-picker-label">Color <span class="required">*</span></label>
              <div class="color-picker-grid">
                @for (colorOption of projectColors; track colorOption.value) {
                  <button
                    type="button"
                    class="color-swatch"
                    [style.background-color]="colorOption.hex"
                    [class.selected]="projectForm.get('color')!.value === colorOption.hex"
                    (click)="selectColor(colorOption.hex)"
                    [attr.aria-label]="'Select color ' + colorOption.value"
                  >
                    @if (projectForm.get('color')!.value === colorOption.hex) {
                      <span class="check-icon">✓</span>
                    }
                  </button>
                }
              </div>
              @if (submitted && projectForm.get('color')!.hasError('required')) {
                <span class="error-message">Please select a project color.</span>
              }
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-cancel" (click)="onCancel()">Cancel</button>
            <button type="submit" class="btn btn-save">{{ isEditMode ? 'Save Changes' : 'Create Project' }}</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['./project-modal.component.css']
})
export class ProjectModalComponent implements OnInit, OnChanges {
  @Input() project: Project | null = null;
  @Input() isEditMode: boolean = false;
  @Output() save = new EventEmitter<Partial<Project>>();
  @Output() close = new EventEmitter<void>();

  projectForm!: FormGroup;
  projectColors: ProjectColorOption[] = PROJECT_COLORS;
  submitted = false;

  get isEdit(): boolean {
    return this.isEditMode && this.project !== null;
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project'] || changes['isEditMode']) {
      this.initForm();
    }
  }

  private initForm(): void {
    this.submitted = false;
    this.projectForm = new FormGroup({
      name: new FormControl(this.project?.name || '', [Validators.required, Validators.maxLength(64)]),
      description: new FormControl(this.project?.description || '', [Validators.maxLength(256)]),
      color: new FormControl(this.project?.color || '', [Validators.required])
    });
  }

  selectColor(hex: string): void {
    this.projectForm.get('color')!.setValue(hex);
    this.projectForm.get('color')!.markAsTouched();
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.projectForm.invalid) {
      return;
    }

    const formValue = this.projectForm.value;
    const now = new Date().toISOString();

    if (this.isEdit && this.project) {
      this.save.emit({
        id: this.project.id,
        name: formValue.name.trim(),
        description: formValue.description?.trim() || '',
        color: formValue.color,
        createdAt: this.project.createdAt
      });
    } else {
      this.save.emit({
        id: crypto.randomUUID(),
        name: formValue.name.trim(),
        description: formValue.description?.trim() || '',
        color: formValue.color,
        createdAt: now
      });
    }
  }

  onCancel(): void {
    this.close.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}