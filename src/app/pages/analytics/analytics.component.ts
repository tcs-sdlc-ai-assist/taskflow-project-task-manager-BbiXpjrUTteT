import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { StorageService } from '../../services/storage.service';
import { ProgressBarComponent } from '../../components/progress-bar/progress-bar.component';
import { SummaryCardComponent } from '../../components/summary-card/summary-card.component';
import type { Project } from '../../models/project.model';
import type { Task } from '../../models/task.model';
import { STATUSES, PRIORITIES } from '../../constants/app.constants';
import type { StatusOption, PriorityOption } from '../../constants/app.constants';

interface DistributionItem {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

interface ProjectProgress {
  id: string;
  name: string;
  color: string;
  total: number;
  completed: number;
  percentage: number;
}

interface DailyActivityItem {
  label: string;
  date: string;
  created: number;
  completed: number;
  total: number;
  percentage: number;
  color: string;
}

interface AnalyticsMetrics {
  completionRate: number;
  tasksCreated: number;
  tasksCompleted: number;
  avgCompletionTime: number;
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, ProgressBarComponent, SummaryCardComponent],
  template: `
    <div class="analytics-page">
      <div class="analytics-header">
        <h1>Analytics</h1>
        <p>Track your productivity and project progress</p>
        <div class="time-range-toggle">
          <button
            [class.active]="timeRange === 'week'"
            (click)="setTimeRange('week')"
            type="button"
          >
            7d
          </button>
          <button
            [class.active]="timeRange === 'month'"
            (click)="setTimeRange('month')"
            type="button"
          >
            14d
          </button>
          <button
            [class.active]="timeRange === 'all'"
            (click)="setTimeRange('all')"
            type="button"
          >
            30d
          </button>
        </div>
      </div>

      @if (hasData) {
        <!-- Overview Cards -->
        <div class="overview-cards">
          <div class="completion-ring-container animate-in">
            <div
              class="completion-ring"
              [style.background]="getConicGradient(metrics.completionRate)"
            >
              <div class="completion-ring-inner">
                <span class="completion-ring-value">{{ metrics.completionRate }}</span>
                <span class="completion-ring-label">%</span>
              </div>
            </div>
            <span class="completion-ring-title">Completion Rate</span>
          </div>

          <app-summary-card
            class="animate-in"
            title="Tasks Created"
            [value]="metrics.tasksCreated"
            icon="📝"
            color="#6366f1"
          />

          <app-summary-card
            class="animate-in"
            title="Tasks Completed"
            [value]="metrics.tasksCompleted"
            icon="✅"
            color="#22c55e"
          />

          <div class="completion-ring-container metric-highlight animate-in">
            <span class="metric-highlight-value">{{ metrics.avgCompletionTime }}</span>
            <span class="metric-highlight-unit">days</span>
            <span class="metric-highlight-description">Avg. Completion Time</span>
          </div>
        </div>

        <!-- Charts Grid -->
        <div class="charts-grid">
          <!-- Status Distribution -->
          <div class="chart-card animate-in">
            <div class="chart-card-header">
              <h3 class="chart-card-title">Status Distribution</h3>
              <span class="chart-card-subtitle">Tasks by status</span>
            </div>
            <div class="horizontal-bar-chart">
              @for (item of statusDistribution; track item.label) {
                <div class="horizontal-bar-item">
                  <div class="horizontal-bar-label-row">
                    <span class="horizontal-bar-label">
                      <span class="horizontal-bar-dot" [style.background-color]="item.color"></span>
                      {{ item.label }}
                    </span>
                    <span class="horizontal-bar-percentage">{{ item.value }} ({{ item.percentage }}%)</span>
                  </div>
                  <div class="horizontal-bar-track">
                    <div
                      class="horizontal-bar-fill"
                      [style.width.%]="item.percentage"
                      [style.background-color]="item.color"
                    ></div>
                  </div>
                </div>
              }
            </div>
            <div class="chart-legend">
              @for (item of statusDistribution; track item.label) {
                <span class="chart-legend-item">
                  <span class="chart-legend-color" [style.background-color]="item.color"></span>
                  {{ item.label }}
                </span>
              }
            </div>
          </div>

          <!-- Priority Distribution -->
          <div class="chart-card animate-in">
            <div class="chart-card-header">
              <h3 class="chart-card-title">Priority Distribution</h3>
              <span class="chart-card-subtitle">Tasks by priority</span>
            </div>
            <div class="horizontal-bar-chart">
              @for (item of priorityDistribution; track item.label) {
                <div class="horizontal-bar-item">
                  <div class="horizontal-bar-label-row">
                    <span class="horizontal-bar-label">
                      <span class="horizontal-bar-dot" [style.background-color]="item.color"></span>
                      {{ item.label }}
                    </span>
                    <span class="horizontal-bar-percentage">{{ item.value }} ({{ item.percentage }}%)</span>
                  </div>
                  <div class="horizontal-bar-track">
                    <div
                      class="horizontal-bar-fill"
                      [style.width.%]="item.percentage"
                      [style.background-color]="item.color"
                    ></div>
                  </div>
                </div>
              }
            </div>
            <div class="chart-legend">
              @for (item of priorityDistribution; track item.label) {
                <span class="chart-legend-item">
                  <span class="chart-legend-color" [style.background-color]="item.color"></span>
                  {{ item.label }}
                </span>
              }
            </div>
          </div>
        </div>

        <!-- Daily Activity -->
        @if (dailyActivity.length > 0) {
          <div class="chart-card chart-card-full animate-in">
            <div class="chart-card-header">
              <h3 class="chart-card-title">Daily Activity</h3>
              <span class="chart-card-subtitle">Tasks created & completed per day</span>
            </div>
            <div class="vertical-bar-chart">
              @for (day of dailyActivity; track day.date) {
                <div class="vertical-bar-group">
                  <span class="vertical-bar-count">{{ day.total }}</span>
                  <div
                    class="vertical-bar"
                    [style.height.%]="day.percentage"
                    [style.background-color]="day.color"
                  >
                    <span class="vertical-bar-tooltip">{{ day.total }} tasks</span>
                  </div>
                  <span class="vertical-bar-day-label">{{ day.label }}</span>
                </div>
              }
            </div>
            <div class="chart-legend">
              <span class="chart-legend-item">
                <span class="chart-legend-color" style="background-color: #6366f1;"></span>
                Created
              </span>
              <span class="chart-legend-item">
                <span class="chart-legend-color" style="background-color: #22c55e;"></span>
                Completed
              </span>
            </div>
          </div>
        }

        <!-- Project Completion -->
        @if (projectProgress.length > 0) {
          <div class="project-completion-section">
            <div class="chart-card animate-in">
              <div class="chart-card-header">
                <h3 class="chart-card-title">Project Completion</h3>
                <span class="chart-card-subtitle">Progress across all projects</span>
              </div>
              <div class="project-completion-list">
                @for (project of projectProgress; track project.id) {
                  <div class="project-completion-item">
                    <div class="project-completion-header">
                      <span class="project-completion-name">
                        <span class="project-color-indicator" [style.background-color]="project.color"></span>
                        {{ project.name }}
                      </span>
                      <div class="project-completion-stats">
                        <strong>{{ project.completed }}</strong>/{{ project.total }} tasks
                        <span class="project-completion-percentage">{{ project.percentage }}%</span>
                      </div>
                    </div>
                    <div class="project-completion-bar-track">
                      <div
                        class="project-completion-bar-fill"
                        [style.width.%]="project.percentage"
                        [style.background-color]="project.color"
                      ></div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        }
      } @else {
        <!-- Empty State -->
        <div class="analytics-empty-state">
          <div class="empty-state-icon">📊</div>
          <h2>No analytics data yet</h2>
          <p>Start creating projects and tasks to see your productivity insights here.</p>
        </div>
      }
    </div>
  `,
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  tasks: Task[] = [];
  timeRange: 'week' | 'month' | 'all' = 'week';

  metrics: AnalyticsMetrics = {
    completionRate: 0,
    tasksCreated: 0,
    tasksCompleted: 0,
    avgCompletionTime: 0
  };

  statusDistribution: DistributionItem[] = [];
  priorityDistribution: DistributionItem[] = [];
  projectProgress: ProjectProgress[] = [];
  dailyActivity: DailyActivityItem[] = [];

  hasData = false;

  private subscriptions: Subscription[] = [];

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
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

  setTimeRange(range: 'week' | 'month' | 'all'): void {
    this.timeRange = range;
    this.computeAll();
  }

  private computeAll(): void {
    const filteredTasks = this.filterTasksByTimeRange(this.tasks);
    this.hasData = this.tasks.length > 0;

    this.computeMetrics(filteredTasks);
    this.computeStatusDistribution(filteredTasks);
    this.computePriorityDistribution(filteredTasks);
    this.computeProjectProgress(filteredTasks);
    this.computeDailyActivity();
  }

  private getDaysForRange(): number {
    switch (this.timeRange) {
      case 'week':
        return 7;
      case 'month':
        return 14;
      case 'all':
        return 30;
      default:
        return 7;
    }
  }

  private filterTasksByTimeRange(tasks: Task[]): Task[] {
    const days = this.getDaysForRange();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    cutoff.setHours(0, 0, 0, 0);

    return tasks.filter((task) => {
      try {
        const createdDate = new Date(task.createdAt);
        return createdDate >= cutoff;
      } catch {
        return false;
      }
    });
  }

  private computeMetrics(filteredTasks: Task[]): void {
    const totalTasks = filteredTasks.length;
    const completedTasks = filteredTasks.filter((t) => t.status === 'done');
    const completedCount = completedTasks.length;

    const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

    let avgCompletionTime = 0;
    const completedWithTime = completedTasks.filter((t) => t.completedAt && t.createdAt);
    if (completedWithTime.length > 0) {
      const totalDays = completedWithTime.reduce((sum, task) => {
        try {
          const created = new Date(task.createdAt).getTime();
          const completed = new Date(task.completedAt!).getTime();
          const diffDays = Math.max(0, (completed - created) / (1000 * 60 * 60 * 24));
          return sum + diffDays;
        } catch {
          return sum;
        }
      }, 0);
      avgCompletionTime = Math.round((totalDays / completedWithTime.length) * 10) / 10;
    }

    this.metrics = {
      completionRate,
      tasksCreated: totalTasks,
      tasksCompleted: completedCount,
      avgCompletionTime
    };
  }

  private computeStatusDistribution(filteredTasks: Task[]): void {
    const total = filteredTasks.length;
    this.statusDistribution = STATUSES.map((status: StatusOption) => {
      const count = filteredTasks.filter((t) => t.status === status.value).length;
      return {
        label: status.label,
        value: count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        color: status.color
      };
    });
  }

  private computePriorityDistribution(filteredTasks: Task[]): void {
    const total = filteredTasks.length;
    this.priorityDistribution = PRIORITIES.map((priority: PriorityOption) => {
      const count = filteredTasks.filter((t) => t.priority === priority.value).length;
      return {
        label: priority.label,
        value: count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        color: priority.color
      };
    });
  }

  private computeProjectProgress(filteredTasks: Task[]): void {
    this.projectProgress = this.projects
      .map((project) => {
        const projectTasks = filteredTasks.filter((t) => t.projectId === project.id);
        const total = projectTasks.length;
        const completed = projectTasks.filter((t) => t.status === 'done').length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
          id: project.id,
          name: project.name,
          color: project.color || '#6366f1',
          total,
          completed,
          percentage
        };
      })
      .filter((p) => p.total > 0)
      .sort((a, b) => b.percentage - a.percentage);
  }

  private computeDailyActivity(): void {
    const days = this.getDaysForRange();
    const now = new Date();
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const activityMap: DailyActivityItem[] = [];
    let maxTotal = 0;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const dateStr = date.toISOString().split('T')[0];
      const dayOfWeek = dayLabels[date.getDay()];
      const label = days <= 7
        ? dayOfWeek
        : `${monthLabels[date.getMonth()]} ${date.getDate()}`;

      const created = this.tasks.filter((t) => {
        try {
          const d = new Date(t.createdAt);
          return d.toISOString().split('T')[0] === dateStr;
        } catch {
          return false;
        }
      }).length;

      const completed = this.tasks.filter((t) => {
        if (!t.completedAt) return false;
        try {
          const d = new Date(t.completedAt);
          return d.toISOString().split('T')[0] === dateStr;
        } catch {
          return false;
        }
      }).length;

      const total = created + completed;
      if (total > maxTotal) {
        maxTotal = total;
      }

      activityMap.push({
        label,
        date: dateStr,
        created,
        completed,
        total,
        percentage: 0,
        color: completed > created ? '#22c55e' : '#6366f1'
      });
    }

    this.dailyActivity = activityMap.map((item) => ({
      ...item,
      percentage: maxTotal > 0 ? Math.max(4, Math.round((item.total / maxTotal) * 100)) : 4
    }));
  }

  getConicGradient(percentage: number): string {
    const clampedPercentage = Math.min(100, Math.max(0, percentage));
    const completedColor = '#22c55e';
    const remainingColor = '#e5e7eb';
    return `conic-gradient(${completedColor} ${clampedPercentage * 3.6}deg, ${remainingColor} ${clampedPercentage * 3.6}deg)`;
  }
}