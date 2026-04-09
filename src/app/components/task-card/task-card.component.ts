import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Task } from '../../models/task.model';
import { STATUSES, PRIORITIES } from '../../constants/app.constants';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="task-card" [style.border-left-color]="getPriorityColor()">
      <div class="task-card-header">
        <h3 class="task-card-title">{{ task.title }}</h3>
        <div class="task-card-actions">
          <button
            class="action-btn action-edit"
            (click)="onEdit($event)"
            title="Edit task"
            type="button"
          >
            ✏️
          </button>
          <button
            class="action-btn action-delete"
            (click)="onDelete($event)"
            title="Delete task"
            type="button"
          >
            🗑️
          </button>
        </div>
      </div>

      @if (task.description) {
        <p class="task-card-description">{{ truncatedDescription }}</p>
      }

      @if (projectName) {
        <span class="task-card-project" [style.background-color]="projectColorLight" [style.color]="projectColorValue">
          {{ projectName }}
        </span>
      }

      <div class="task-card-meta">
        <span class="priority-pill" [class]="'priority-pill priority-' + task.priority">
          <span class="priority-dot" [style.background-color]="getPriorityColor()"></span>
          {{ getPriorityLabel() }}
        </span>

        <span class="status-badge" [class]="'status-badge status-' + task.status">
          {{ getStatusLabel() }}
        </span>

        <span class="task-card-date">{{ formatDate(task.createdAt) }}</span>
      </div>

      <div class="task-card-actions-row">
        @if (task.status === 'todo') {
          <button
            class="action-btn action-complete"
            (click)="onStatusChange('inprogress', $event)"
            title="Start task"
            type="button"
          >
            ▶ Start
          </button>
        }
        @if (task.status === 'inprogress') {
          <button
            class="action-btn action-complete"
            (click)="onStatusChange('done', $event)"
            title="Complete task"
            type="button"
          >
            ✓ Complete
          </button>
          <button
            class="action-btn"
            (click)="onStatusChange('todo', $event)"
            title="Move back to To Do"
            type="button"
          >
            ← To Do
          </button>
        }
        @if (task.status === 'done') {
          <button
            class="action-btn"
            (click)="onStatusChange('inprogress', $event)"
            title="Reopen task"
            type="button"
          >
            ↺ Reopen
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .task-card {
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      padding: 16px 20px;
      transition: box-shadow 0.2s ease, transform 0.2s ease;
      cursor: default;
      position: relative;
      overflow: hidden;
      border-left: 4px solid #6366f1;
    }

    .task-card:hover {
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
      transform: translateY(-2px);
    }

    .task-card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 8px;
    }

    .task-card-title {
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
      line-height: 1.4;
      word-break: break-word;
    }

    .task-card-actions {
      display: flex;
      gap: 4px;
      flex-shrink: 0;
    }

    .task-card-description {
      font-size: 0.875rem;
      color: #64748b;
      margin: 0 0 12px 0;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .task-card-project {
      font-size: 0.75rem;
      font-weight: 500;
      padding: 2px 8px;
      border-radius: 6px;
      display: inline-block;
      margin-bottom: 8px;
    }

    .task-card-meta {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 12px;
    }

    .priority-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
      letter-spacing: 0.02em;
      line-height: 1;
      background: #f1f5f9;
    }

    .priority-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .priority-pill.priority-high,
    .priority-pill.priority-urgent {
      background: #fef2f2;
      color: #dc2626;
    }

    .priority-pill.priority-medium {
      background: #fffbeb;
      color: #d97706;
    }

    .priority-pill.priority-low {
      background: #f0fdf4;
      color: #16a34a;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
      letter-spacing: 0.02em;
      line-height: 1;
    }

    .status-badge.status-todo {
      background: #f1f5f9;
      color: #475569;
    }

    .status-badge.status-inprogress {
      background: #eff6ff;
      color: #2563eb;
    }

    .status-badge.status-done {
      background: #f0fdf4;
      color: #16a34a;
    }

    .task-card-date {
      font-size: 0.75rem;
      color: #94a3b8;
      margin-left: auto;
    }

    .task-card-actions-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-top: 12px;
      border-top: 1px solid #f1f5f9;
    }

    .action-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 4px 10px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: #94a3b8;
      cursor: pointer;
      transition: background 0.15s ease, color 0.15s ease;
      font-size: 0.8125rem;
      line-height: 1;
      white-space: nowrap;
    }

    .action-btn:hover {
      background: #f1f5f9;
      color: #475569;
    }

    .action-btn:focus-visible {
      outline: 2px solid #6366f1;
      outline-offset: 2px;
    }

    .action-btn.action-edit:hover {
      background: #eff6ff;
      color: #2563eb;
    }

    .action-btn.action-delete:hover {
      background: #fef2f2;
      color: #dc2626;
    }

    .action-btn.action-complete:hover {
      background: #f0fdf4;
      color: #16a34a;
    }

    @media (max-width: 640px) {
      .task-card {
        padding: 14px 16px;
        border-radius: 10px;
      }

      .task-card-header {
        flex-direction: column;
        gap: 8px;
      }

      .task-card-actions {
        align-self: flex-end;
      }

      .task-card-meta {
        gap: 6px;
      }

      .task-card-date {
        margin-left: 0;
        width: 100%;
        margin-top: 4px;
      }

      .task-card-actions-row {
        flex-wrap: wrap;
        gap: 6px;
      }
    }

    @media (max-width: 380px) {
      .task-card {
        padding: 12px 14px;
      }

      .priority-pill,
      .status-badge {
        font-size: 0.7rem;
        padding: 3px 8px;
      }
    }
  `]
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Input() projectName: string = '';
  @Input() projectColor: string = '';

  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<Task>();
  @Output() statusChange = new EventEmitter<{ task: Task; newStatus: string }>();
  @Output() moveStatus = new EventEmitter<string>();

  get truncatedDescription(): string {
    if (!this.task.description) {
      return '';
    }
    if (this.task.description.length > 120) {
      return this.task.description.substring(0, 120) + '…';
    }
    return this.task.description;
  }

  get projectColorValue(): string {
    if (!this.projectColor) {
      return '#6366f1';
    }
    return this.projectColor;
  }

  get projectColorLight(): string {
    if (!this.projectColor) {
      return '#eef2ff';
    }
    return this.projectColor + '1a';
  }

  getPriorityColor(): string {
    const found = PRIORITIES.find(p => p.value === this.task.priority);
    return found ? found.color : '#6b7280';
  }

  getPriorityLabel(): string {
    const found = PRIORITIES.find(p => p.value === this.task.priority);
    return found ? found.label : this.task.priority;
  }

  getStatusLabel(): string {
    const found = STATUSES.find(s => s.value === this.task.status);
    return found ? found.label : this.task.status;
  }

  formatDate(dateString: string): string {
    if (!dateString) {
      return '';
    }
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  }

  onEdit(event: MouseEvent): void {
    event.stopPropagation();
    this.edit.emit(this.task);
  }

  onDelete(event: MouseEvent): void {
    event.stopPropagation();
    this.delete.emit(this.task);
  }

  onStatusChange(newStatus: string, event: MouseEvent): void {
    event.stopPropagation();
    this.statusChange.emit({ task: this.task, newStatus });
    this.moveStatus.emit(newStatus);
  }
}