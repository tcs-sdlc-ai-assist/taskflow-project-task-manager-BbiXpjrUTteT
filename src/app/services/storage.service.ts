import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import type { Project } from '../models/project.model';
import type { Task } from '../models/task.model';
import { STORAGE_KEYS } from '../constants/app.constants';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  private tasksSubject = new BehaviorSubject<Task[]>([]);

  readonly projects$ = this.projectsSubject.asObservable();
  readonly tasks$ = this.tasksSubject.asObservable();

  constructor() {
    this.seedDummyData();
    this.projectsSubject.next(this.getProjects());
    this.tasksSubject.next(this.getTasks());
  }

  getProjects(): Project[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.projects);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('StorageService: Failed to read projects from localStorage', error);
      return [];
    }
  }

  getTasks(): Task[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.tasks);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('StorageService: Failed to read tasks from localStorage', error);
      return [];
    }
  }

  saveProjects(projects: Project[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects));
      this.projectsSubject.next(projects);
    } catch (error) {
      console.error('StorageService: Failed to save projects to localStorage', error);
    }
  }

  saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
      this.tasksSubject.next(tasks);
    } catch (error) {
      console.error('StorageService: Failed to save tasks to localStorage', error);
    }
  }

  isSeeded(): boolean {
    try {
      return (
        localStorage.getItem(STORAGE_KEYS.projects) !== null &&
        localStorage.getItem(STORAGE_KEYS.tasks) !== null
      );
    } catch (error) {
      console.error('StorageService: Failed to check seeded state', error);
      return false;
    }
  }

  seedDummyData(): void {
    if (this.isSeeded()) {
      return;
    }

    const now = new Date().toISOString();

    const dummyProjects: Project[] = [
      {
        id: crypto.randomUUID(),
        name: 'Website Redesign',
        description: 'Overhaul the company website with a modern design and improved UX.',
        color: '#3b82f6',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: crypto.randomUUID(),
        name: 'Mobile App Development',
        description: 'Build a cross-platform mobile application for task management on the go.',
        color: '#22c55e',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: crypto.randomUUID(),
        name: 'Marketing Campaign',
        description: 'Plan and execute the Q2 digital marketing campaign across all channels.',
        color: '#a855f7',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: crypto.randomUUID(),
        name: 'API Integration',
        description: 'Integrate third-party APIs for payment processing and analytics.',
        color: '#f97316',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const dummyTasks: Task[] = [
      // Website Redesign tasks
      {
        id: crypto.randomUUID(),
        projectId: dummyProjects[0].id,
        title: 'Create wireframes for homepage',
        description: 'Design low-fidelity wireframes for the new homepage layout.',
        status: 'done',
        priority: 'high',
        createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: crypto.randomUUID(),
        projectId: dummyProjects[0].id,
        title: 'Design color palette and typography',
        description: 'Select brand colors and font families for the redesign.',
        status: 'done',
        priority: 'medium',
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: crypto.randomUUID(),
        projectId: dummyProjects[0].id,
        title: 'Implement responsive navigation',
        description: 'Build the responsive nav bar with mobile hamburger menu.',
        status: 'inprogress',
        priority: 'high',
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: null
      },
      {
        id: crypto.randomUUID(),
        projectId: dummyProjects[0].id,
        title: 'Optimize images and assets',
        description: 'Compress all images and convert to WebP format for faster loading.',
        status: 'todo',
        priority: 'low',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: null
      },
      // Mobile App Development tasks
      {
        id: crypto.randomUUID(),
        projectId: dummyProjects[1].id,
        title: 'Set up project scaffolding',
        description: 'Initialize the mobile project with required dependencies and folder structure.',
        status: 'done',
        priority: 'urgent',
        createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: crypto.randomUUID(),
        projectId: dummyProjects[1].id,
        title: 'Build authentication flow',
        description: 'Implement login, registration, and password reset screens.',
        status: 'inprogress',
        priority: 'high',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: null
      },
      {
        id: crypto.randomUUID(),
        projectId: dummyProjects[1].id,
        title: 'Design task list UI',
        description: 'Create the main task list view with swipe actions and pull-to-refresh.',
        status: 'todo',
        priority: 'medium',
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: null
      },
      {
        id: crypto.randomUUID(),
        projectId: dummyProjects[1].id,
        title: 'Implement push notifications',
        description: 'Set up push notification service for task reminders and updates.',
        status: 'todo',
        priority: 'low',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: null
      },
      // Marketing Campaign tasks
      {
        id: crypto.randomUUID(),
        projectId: dummyProjects[2].id,
        title: 'Research target audience',
        description: 'Analyze demographics and create buyer personas for the campaign.',
        status: 'done',
        priority: 'high',
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: crypto.randomUUID(),
        projectId: dummyProjects[2].id,
        title: 'Create social media content calendar',
        description: 'Plan posts for Instagram, Twitter, and LinkedIn for the next 4 weeks.',
        status: 'inprogress',
        priority: 'medium',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: null
      },
      {
        id: crypto.randomUUID(),
        projectId: dummyProjects[2].id,
        title: 'Design email newsletter template',
        description: 'Create a reusable HTML email template for the campaign newsletters.',
        status: 'todo',
        priority: 'medium',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: null
      },
      // API Integration tasks
      {
        id: crypto.randomUUID(),
        projectId: dummyProjects[3].id,
        title: 'Evaluate payment gateway options',
        description: 'Compare Stripe, PayPal, and Square for payment processing integration.',
        status: 'done',
        priority: 'urgent',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: crypto.randomUUID(),
        projectId: dummyProjects[3].id,
        title: 'Implement Stripe checkout flow',
        description: 'Integrate Stripe API for handling one-time and subscription payments.',
        status: 'inprogress',
        priority: 'high',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: null
      },
      {
        id: crypto.randomUUID(),
        projectId: dummyProjects[3].id,
        title: 'Set up analytics tracking',
        description: 'Integrate Google Analytics and Mixpanel for user behavior tracking.',
        status: 'todo',
        priority: 'medium',
        createdAt: now,
        completedAt: null
      }
    ];

    try {
      localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(dummyProjects));
      localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(dummyTasks));
    } catch (error) {
      console.error('StorageService: Failed to seed dummy data', error);
    }
  }
}