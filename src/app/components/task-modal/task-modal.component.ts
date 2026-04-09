import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import type { Task } from '../../models/task.model';
import { STATUSES, PRIORITIES } from '../../models/task.model';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" (click)="onOverlayClick($event)">
      <div class="modal-dialog" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ isEditMode ? 'Edit Task' : 'Create Task' }}</h2>
          <button class="modal-close-btn" type="button" (click)="onClose()" aria-label="Close modal">×</button>
        </div>

        <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="modal-body">
          <div class="form-group">
            <label for="taskTitle">Title <span class="required">*</span></label>
            <input
              id="taskTitle"
              type="text"
              class="form-control"
              formControlName="title"
              maxlength="128"
              placeholder="Enter task title"
              [class.invalid]="submitted && taskForm.get('title')!.invalid"
            />
            @if (submitted && taskForm.get('title')!.invalid) {
              <span class="error-message">Task title is required.</span>
            }
          </div>

          <div class="form-group">
            <label for="taskDescription">Description</label>
            <textarea
              id="taskDescription"
              class="form-control"
              formControlName="description"
              maxlength="512"
              placeholder="Enter task description (optional)"
              rows="4"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="taskPriority">Priority <span class="required">*</span></label>
            <select
              id="taskPriority"
              class="form-control"
              formControlName="priority"
              [class.invalid]="submitted && taskForm.get('priority')!.invalid"
            >
              @for (p of priorities; track p) {
                <option [value]="p">{{ p === 'urgent' ? 'Urgent' : p === 'high' ? 'High' : p === 'medium' ? 'Medium' : 'Low' }}</option>
              }
            </select>
            @if (submitted && taskForm.get('priority')!.invalid) {
              <span class="error-message">Priority is required.</span>
            }
          </div>

          @if (isEditMode) {
            <div class="form-group">
              <label for="taskStatus">Status <span class="required">*</span></label>
              <select
                id="taskStatus"
                class="form-control"
                formControlName="status"
                [class.invalid]="submitted && taskForm.get('status')!.invalid"
              >
                @for (s of statuses; track s) {
                  <option [value]="s">{{ s === 'inprogress' ? 'In Progress' : s === 'done' ? 'Done' : 'To Do' }}</option>
                }
              </select>
              @if (submitted && taskForm.get('status')!.invalid) {
                <span class="error-message">Status is required.</span>
              }
            </div>
          }

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="onClose()">Cancel</button>
            <button type="submit" class="btn btn-primary">{{ isEditMode ? 'Update' : 'Create' }}</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['./task-modal.component.css']
})
export class TaskModalComponent implements OnInit, OnChanges {
  @Input() task: Task | null = null;
  @Input() projectId: string = '';
  @Input() projects: { id: string; name: string }[] = [];
  @Output() save = new EventEmitter<Partial<Task>>();
  @Output() close = new EventEmitter<void>();

  taskForm!: FormGroup;
  submitted = false;
  statuses = STATUSES;
  priorities = PRIORITIES;

  get isEditMode(): boolean {
    return this.task !== null && this.task !== undefined;
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && this.taskForm) {
      this.populateForm();
    }
  }

  private initForm(): void {
    this.taskForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.maxLength(128)]),
      description: new FormControl('', [Validators.maxLength(512)]),
      priority: new FormControl('medium', [Validators.required]),
      status: new FormControl('todo', [Validators.required])
    });

    this.populateForm();
  }

  private populateForm(): void {
    if (this.task) {
      this.taskForm.patchValue({
        title: this.task.title || '',
        description: this.task.description || '',
        priority: this.task.priority || 'medium',
        status: this.task.status || 'todo'
      });
    } else {
      this.taskForm.patchValue({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo'
      });
    }
    this.submitted = false;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.taskForm.invalid) {
      return;
    }

    const formValue = this.taskForm.getRawValue();
    const now = new Date().toISOString();

    if (this.isEditMode && this.task) {
      const updatedTask: Partial<Task> = {
        id: this.task.id,
        projectId: this.task.projectId,
        title: formValue.title.trim(),
        description: formValue.description?.trim() || '',
        priority: formValue.priority,
        status: formValue.status,
        createdAt: this.task.createdAt,
        completedAt: formValue.status === 'done' ? (this.task.completedAt || now) : null
      };
      this.save.emit(updatedTask);
    } else {
      const newTask: Partial<Task> = {
        id: crypto.randomUUID(),
        projectId: this.projectId,
        title: formValue.title.trim(),
        description: formValue.description?.trim() || '',
        priority: formValue.priority,
        status: 'todo',
        createdAt: now,
        completedAt: null
      };
      this.save.emit(newTask);
    }

    this.submitted = false;
  }

  onClose(): void {
    this.submitted = false;
    this.close.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}