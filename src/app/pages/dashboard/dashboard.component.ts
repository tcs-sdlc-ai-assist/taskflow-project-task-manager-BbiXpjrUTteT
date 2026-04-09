import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { StorageService } from '../../services/storage.service';
import { SummaryCardComponent } from '../../components/summary-card/summary-card.component';
import { ProgressBarComponent } from '../../components/progress-bar/progress-bar.component';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import type { Project } from '../../models/project.model';
import type { Task } from '../../models/task.model';

interface DashboardSummary {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  completionPercentage: number;
}

interface ProjectProgress {
  id: string;
  name: string;
  color: string;
  totalTasks: number;
  completedTasks: number;
  percentage: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SummaryCardComponent, ProgressBarComponent, TaskCardComponent],
  template: `
    <div class="dashboard-container">
      <!-- Welcome Banner -->
      <section class="welcome-banner">
        <div class="welcome-content">
          <h1 class="welcome-title">Welcome back! 👋</h1>
          <p class="welcome-subtitle">Here's an overview of your productivity</p>
          <div class="welcome-stats">
            <span class="welcome-stat">
              <span class="stat-value active">{{ activeTasks }}</span>
              <span class="stat-label">Active</span>
            </span>
            <span class="welcome-stat">
              <span class="stat-value completed">{{ summary.completedTasks }}</span>
              <span class="stat-label">Completed</span>
            </span>
            <span class="welcome-stat">
              <span class="stat-value today">{{ completedToday }}</span>
              <span class="stat-label">Done Today</span>
            </span>
          </div>
        </div>
      </section>

      @if (hasData) {
        <!-- Summary Cards Grid -->
        <section class="summary-section">
          <div class="summary-grid">
            <app-summary-card
              title="Total Projects"
              [value]="summary.totalProjects"
              icon="📁"
              color="#6366f1"
            ></app-summary-card>
            <app-summary-card
              title="Total Tasks"
              [value]="summary.totalTasks"
              icon="📋"
              color="#3b82f6"
            ></app-summary-card>
            <app-summary-card
              title="Completed"
              [value]="summary.completedTasks"
              icon="✅"
              color="#22c55e"
            ></app-summary-card>
            <app-summary-card
              title="In Progress"
              [value]="summary.inProgressTasks"
              icon="⏳"
              color="#f59e0b"
            ></app-summary-card>
          </div>
        </section>

        <!-- Recent Tasks Section -->
        <section class="recent-tasks-section">
          <div class="recent-tasks-header">
            <h2 class="section-title">Recent Tasks</h2>
            <a routerLink="/tasks" class="view-all-link">View All →</a>
          </div>
          @if (recentTasks.length > 0) {
            <div class="recent-tasks-list">
              @for (task of recentTasks; track task.id) {
                <app-task-card
                  [task]="task"
                  [projectName]="getProjectName(task.projectId)"
                  [projectColor]="getProjectColor(task.projectId)"
                  (edit)="onTaskEdit($event)"
                  (delete)="onTaskDelete($event)"
                  (statusChange)="onTaskStatusChange($event)"
                ></app-task-card>
              }
            </div>
          } @else {
            <div class="empty-state-inline">
              <p>No tasks yet. Create your first task to get started!</p>
            </div>
          }
        </section>

        <!-- Project Progress Section -->
        <section class="project-progress-section">
          <div class="recent-tasks-header">
            <h2 class="section-title">Project Progress</h2>
            <a routerLink="/projects" class="view-all-link">View All →</a>
          </div>
          @if (projectProgress.length > 0) {
            <div class="project-progress-list">
              @for (project of projectProgress; track project.id) {
                <div class="project-progress-item">
                  <div class="project-progress-header">
                    <div class="project-name-row">
                      <span class="project-color-dot" [style.background-color]="project.color"></span>
                      <span class="project-name">{{ project.name }}</span>
                    </div>
                    <span class="project-stats">{{ project.completedTasks }}/{{ project.totalTasks }} tasks</span>
                  </div>
                  <app-progress-bar
                    [value]="project.percentage"
                    [color]="project.color"
                    [label]="''"
                    [showPercentage]="true"
                  ></app-progress-bar>
                </div>
              }
            </div>
          } @else {
            <div class="empty-state-inline">
              <p>No projects yet. Create a project to track your progress!</p>
            </div>
          }
        </section>
      } @else {
        <!-- Empty State -->
        <section class="empty-state">
          <div class="empty-state-content">
            <div class="empty-state-emoji">📊</div>
            <h2 class="empty-state-title">No data yet</h2>
            <p class="empty-state-message">
              Start by creating your first project and adding tasks to see your dashboard come to life!
            </p>
            <a routerLink="/projects" class="empty-state-action">
              📁 Create a Project
            </a>
          </div>
        </section>
      }
    </div>
  `,
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  tasks: Task[] = [];
  recentTasks: Task[] = [];
  projectProgress: ProjectProgress[] = [];
  summary: DashboardSummary = {
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    todoTasks: 0,
    completionPercentage: 0
  };
  hasData = false;
  activeTasks = 0;
  completedToday = 0;
  errorMessage = '';

  private subscriptions: Subscription[] = [];

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.loadData();

    const projectsSub = this.storageService.projects$.subscribe((projects) => {
      this.projects = projects;
      this.computeAll();
    });

    const tasksSub = this.storageService.tasks$.subscribe((tasks) => {
      this.tasks = tasks;
      this.computeAll();
    });

    this.subscriptions.push(projectsSub, tasksSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  loadData(): void {
    try {
      this.projects = this.storageService.getProjects();
      this.tasks = this.storageService.getTasks();
      this.computeAll();
      this.errorMessage = '';
    } catch {
      this.errorMessage = 'Failed to load data. Please try again.';
    }
  }

  private computeAll(): void {
    this.computeSummary();
    this.computeRecentTasks();
    this.computeProjectProgress();
    this.computeActiveTasks();
    this.computeCompletedToday();
    this.hasData = this.projects.length > 0 || this.tasks.length > 0;
  }

  private computeSummary(): void {
    const totalProjects = this.projects.length;
    const totalTasks = this.tasks.length;
    const completedTasks = this.tasks.filter((t) => t.status === 'done').length;
    const inProgressTasks = this.tasks.filter((t) => t.status === 'inprogress').length;
    const todoTasks = this.tasks.filter((t) => t.status === 'todo').length;
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    this.summary = {
      totalProjects,
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      completionPercentage
    };
  }

  private computeRecentTasks(): void {
    const sorted = [...this.tasks].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    this.recentTasks = sorted.slice(0, 5);
  }

  private computeProjectProgress(): void {
    this.projectProgress = this.projects.map((project) => {
      const projectTasks = this.tasks.filter((t) => t.projectId === project.id);
      const totalTasks = projectTasks.length;
      const completedTasks = projectTasks.filter((t) => t.status === 'done').length;
      const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        id: project.id,
        name: project.name,
        color: project.color || '#6366f1',
        totalTasks,
        completedTasks,
        percentage
      };
    });
  }

  private computeActiveTasks(): void {
    this.activeTasks = this.tasks.filter(
      (t) => t.status === 'todo' || t.status === 'inprogress'
    ).length;
  }

  private computeCompletedToday(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.completedToday = this.tasks.filter((t) => {
      if (!t.completedAt) {
        return false;
      }
      const completedDate = new Date(t.completedAt);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    }).length;
  }

  getProjectName(projectId: string): string {
    if (!projectId) {
      return '';
    }
    const project = this.projects.find((p) => p.id === projectId);
    return project ? project.name : '';
  }

  getProjectColor(projectId: string): string {
    if (!projectId) {
      return '#6366f1';
    }
    const project = this.projects.find((p) => p.id === projectId);
    return project ? project.color : '#6366f1';
  }

  onTaskEdit(task: Task): void {
    // Navigation to task edit handled by task list page
  }

  onTaskDelete(task: Task): void {
    if (!task) {
      return;
    }
    const updatedTasks = this.tasks.filter((t) => t.id !== task.id);
    this.storageService.saveTasks(updatedTasks);
  }

  onTaskStatusChange(event: { task: Task; newStatus: string }): void {
    if (!event || !event.task) {
      return;
    }
    const now = new Date().toISOString();
    const updatedTasks = this.tasks.map((t) => {
      if (t.id === event.task.id) {
        return {
          ...t,
          status: event.newStatus,
          completedAt: event.newStatus === 'done' ? (t.completedAt || now) : null
        };
      }
      return t;
    });
    this.storageService.saveTasks(updatedTasks);
  }
}