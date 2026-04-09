import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./pages/project-list/project-list.component').then(
        (m) => m.ProjectListComponent
      ),
  },
  {
    path: 'projects/:id',
    loadComponent: () =>
      import('./pages/project-board/project-board.component').then(
        (m) => m.ProjectBoardComponent
      ),
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./pages/task-list/task-list.component').then(
        (m) => m.TaskListComponent
      ),
  },
  {
    path: 'analytics',
    loadComponent: () =>
      import('./pages/analytics/analytics.component').then(
        (m) => m.AnalyticsComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];