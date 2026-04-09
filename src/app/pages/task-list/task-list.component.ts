import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StorageService } from '../../services/storage.service';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { TaskModalComponent } from '../../components/task-modal/task-modal.component';
import type { Task } from '../../models/task.model';
import type { Project } from '../../models/project.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskCardComponent, TaskModalComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  projects: Project[] = [];
  filteredTasks: Task[] = [];

  selectedStatus: string = 'all';
  selectedPriority: string = 'all';
  selectedProjectId: string = 'all';

  isModalOpen: boolean = false;
  isDeleteDialogOpen: boolean = false;
  selectedTask: Task | null = null;
  taskToDelete: Task | null = null;

  private tasksSub!: Subscription;
  private projectsSub!: Subscription;

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.projectsSub = this.storageService.projects$.subscribe((projects) => {
      this.projects = projects;
      this.applyFilters();
    });

    this.tasksSub = this.storageService.tasks$.subscribe((tasks) => {
      this.tasks = tasks;
      this.applyFilters();
    });
  }

  ngOnDestroy(): void {
    if (this.tasksSub) {
      this.tasksSub.unsubscribe();
    }
    if (this.projectsSub) {
      this.projectsSub.unsubscribe();
    }
  }

  onStatusFilter(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  onPriorityFilter(priority: string): void {
    this.selectedPriority = priority;
    this.applyFilters();
  }

  onProjectFilter(projectId: string): void {
    this.selectedProjectId = projectId;
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.tasks];

    if (this.selectedStatus !== 'all') {
      result = result.filter((t) => t.status === this.selectedStatus);
    }

    if (this.selectedPriority !== 'all') {
      result = result.filter((t) => t.priority === this.selectedPriority);
    }

    if (this.selectedProjectId !== 'all') {
      result = result.filter((t) => t.projectId === this.selectedProjectId);
    }

    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    this.filteredTasks = result;
  }

  getProjectName(projectId: string): string {
    const project = this.projects.find((p) => p.id === projectId);
    return project ? project.name : '';
  }

  getProjectColor(projectId: string): string {
    const project = this.projects.find((p) => p.id === projectId);
    return project ? project.color : '';
  }

  openCreateModal(): void {
    this.selectedTask = null;
    this.isModalOpen = true;
  }

  openEditModal(task: Task): void {
    this.selectedTask = { ...task };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedTask = null;
  }

  onSaveTask(taskData: Partial<Task>): void {
    const allTasks = this.storageService.getTasks();
    const now = new Date().toISOString();

    if (this.selectedTask) {
      const index = allTasks.findIndex((t) => t.id === taskData.id);
      if (index !== -1) {
        allTasks[index] = {
          ...allTasks[index],
          title: taskData.title || allTasks[index].title,
          description: taskData.description ?? allTasks[index].description,
          priority: taskData.priority || allTasks[index].priority,
          status: taskData.status || allTasks[index].status,
          completedAt: taskData.status === 'done'
            ? (allTasks[index].completedAt || now)
            : null
        };
      }
    } else {
      const newTask: Task = {
        id: taskData.id || crypto.randomUUID(),
        projectId: taskData.projectId || (this.projects.length > 0 ? this.projects[0].id : ''),
        title: taskData.title || '',
        description: taskData.description || '',
        status: taskData.status || 'todo',
        priority: taskData.priority || 'medium',
        createdAt: taskData.createdAt || now,
        completedAt: null
      };
      allTasks.push(newTask);
    }

    this.storageService.saveTasks(allTasks);
    this.closeModal();
  }

  confirmDelete(task: Task): void {
    this.taskToDelete = task;
    this.isDeleteDialogOpen = true;
  }

  cancelDelete(): void {
    this.isDeleteDialogOpen = false;
    this.taskToDelete = null;
  }

  onConfirmDelete(): void {
    if (!this.taskToDelete) {
      return;
    }

    const allTasks = this.storageService.getTasks();
    const updated = allTasks.filter((t) => t.id !== this.taskToDelete!.id);
    this.storageService.saveTasks(updated);
    this.isDeleteDialogOpen = false;
    this.taskToDelete = null;
  }

  onStatusChange(taskId: string, event: { task: Task; newStatus: string }): void {
    const allTasks = this.storageService.getTasks();
    const now = new Date().toISOString();
    const index = allTasks.findIndex((t) => t.id === taskId);

    if (index !== -1) {
      allTasks[index] = {
        ...allTasks[index],
        status: event.newStatus,
        completedAt: event.newStatus === 'done'
          ? (allTasks[index].completedAt || now)
          : null
      };
      this.storageService.saveTasks(allTasks);
    }
  }
}