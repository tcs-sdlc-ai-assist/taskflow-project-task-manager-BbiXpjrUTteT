import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Project } from '../../models/project.model';
import { PROJECT_COLORS } from '../../constants/app.constants';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="project-card" [style.border-top-color]="getProjectColorHex()">
      <div class="card-header">
        <h3 class="project-name">{{ project.name }}</h3>
        <span
          class="task-count-badge"
          [style.background-color]="getProjectColorLight()"
          [style.color]="getProjectColorHex()"
        >
          {{ taskCount }} {{ taskCount === 1 ? 'task' : 'tasks' }}
        </span>
      </div>

      <p class="project-description">{{ project.description || 'No description provided.' }}</p>

      <div class="progress-section">
        <div class="progress-info">
          <span class="progress-label">Completion</span>
          <span class="progress-percentage">{{ completionPercentage }}%</span>
        </div>
        <div class="progress-bar-track">
          <div
            class="progress-bar-fill"
            [style.width.%]="completionPercentage"
            [style.background-color]="getProjectColorHex()"
          ></div>
        </div>
      </div>

      <div class="card-actions">
        <button
          class="btn btn-open"
          (click)="onOpen($event)"
          title="Open project"
          type="button"
        >
          📂 Open
        </button>
        <button
          class="btn btn-edit"
          (click)="onEdit($event)"
          title="Edit project"
          type="button"
        >
          ✏️ Edit
        </button>
        <button
          class="btn btn-delete"
          (click)="onDelete($event)"
          title="Delete project"
          type="button"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .project-card {
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      padding: 20px;
      border-top: 4px solid #6366f1;
      transition: box-shadow 0.2s ease, transform 0.2s ease;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .project-card:hover {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14);
      transform: translateY(-2px);
    }

    .card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .project-name {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
      line-height: 1.4;
      word-break: break-word;
      flex: 1;
      margin-right: 8px;
    }

    .task-count-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 20px;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .project-description {
      font-size: 0.875rem;
      color: #64748b;
      margin: 0 0 16px 0;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-word;
    }

    .progress-section {
      margin: 16px 0;
    }

    .progress-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;
    }

    .progress-label {
      font-size: 0.75rem;
      color: #94a3b8;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .progress-percentage {
      font-size: 0.75rem;
      color: #475569;
      font-weight: 600;
    }

    .progress-bar-track {
      width: 100%;
      height: 6px;
      background: #e2e8f0;
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-bar-fill {
      height: 100%;
      border-radius: 3px;
      transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      min-width: 0;
    }

    .card-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid #f1f5f9;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 6px 12px;
      font-size: 0.8125rem;
      font-weight: 500;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.15s ease, color 0.15s ease;
      background: transparent;
      color: #64748b;
      font-family: inherit;
    }

    .btn:hover {
      background: #f1f5f9;
      color: #334155;
    }

    .btn.btn-edit:hover {
      background: #ede9fe;
      color: #6366f1;
    }

    .btn.btn-delete:hover {
      background: #fee2e2;
      color: #ef4444;
    }

    .btn.btn-open {
      background: #6366f1;
      color: #ffffff;
      padding: 6px 14px;
    }

    .btn.btn-open:hover {
      background: #4f46e5;
      color: #ffffff;
    }

    @media (max-width: 768px) {
      .project-card {
        padding: 16px;
      }

      .project-name {
        font-size: 1rem;
      }

      .project-description {
        font-size: 0.8125rem;
        margin-bottom: 12px;
      }

      .card-actions {
        flex-wrap: wrap;
        justify-content: center;
      }

      .btn {
        flex: 1;
        min-width: 0;
        justify-content: center;
        padding: 8px 10px;
      }
    }

    @media (max-width: 480px) {
      .project-card {
        padding: 14px;
        border-radius: 10px;
      }

      .project-name {
        font-size: 0.9375rem;
      }

      .card-actions {
        gap: 6px;
      }
    }
  `]
})
export class ProjectCardComponent {
  @Input() project!: Project;
  @Input() taskCount: number = 0;
  @Input() completedTaskCount: number = 0;

  @Output() edit = new EventEmitter<Project>();
  @Output() delete = new EventEmitter<Project>();
  @Output() viewDetails = new EventEmitter<Project>();

  get completionPercentage(): number {
    if (this.taskCount === 0) {
      return 0;
    }
    return Math.round((this.completedTaskCount / this.taskCount) * 100);
  }

  getProjectColorHex(): string {
    const colorOption = PROJECT_COLORS.find(c => c.value === this.project.color);
    return colorOption ? colorOption.hex : '#6366f1';
  }

  getProjectColorLight(): string {
    const colorOption = PROJECT_COLORS.find(c => c.value === this.project.color);
    return colorOption ? colorOption.light : '#eef2ff';
  }

  onOpen(event: MouseEvent): void {
    event.stopPropagation();
    this.viewDetails.emit(this.project);
  }

  onEdit(event: MouseEvent): void {
    event.stopPropagation();
    this.edit.emit(this.project);
  }

  onDelete(event: MouseEvent): void {
    event.stopPropagation();
    this.delete.emit(this.project);
  }
}