import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { StorageService } from '../../services/storage.service';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { TaskModalComponent } from '../../components/task-modal/task-modal.component';
import type { Project } from '../../models/project.model';
import type { Task } from '../../models/task.model';

@Component({
  selector: 'app-project-board',
  standalone: true,
  imports: [CommonModule, RouterLink, TaskCardComponent, TaskModalComponent],
  templateUrl: './project-board.component.html',
  styleUrls: ['./project-board.component.css']
})
export class ProjectBoardComponent implements OnInit, OnDestroy {
  project: Project | null = null;
  allTasks: Task[] = [];

  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];

  showTaskModal = false;
  selectedTask: Task | null = null;

  showDeleteConfirm = false;
  taskToDelete: Task | null = null;

  private routeSub: Subscription | null = null;
  private tasksSub: Subscription | null = null;
  private projectsSub: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const projectId = params.get('id');
      if (projectId) {
        this.loadProject(projectId);
      }
    });

    this.tasksSub = this.storageService.tasks$.subscribe(tasks => {
      this.allTasks = tasks;
      if (this.project) {
        this.filterTasksByProject(this.project.id);
      }
    });

    this.projectsSub = this.storageService.projects$.subscribe(projects => {
      if (this.project) {
        const updated = projects.find(p => p.id === this.project!.id);
        if (updated) {
          this.project = updated;
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.tasksSub) {
      this.tasksSub.unsubscribe();
    }
    if (this.projectsSub) {
      this.projectsSub.unsubscribe();
    }
  }

  private loadProject(projectId: string): void {
    const projects = this.storageService.getProjects();
    this.project = projects.find(p => p.id === projectId) || null;
    if (this.project) {
      this.filterTasksByProject(this.project.id);
    }
  }

  private filterTasksByProject(projectId: string): void {
    const projectTasks = this.allTasks.filter(t => t.projectId === projectId);
    this.todoTasks = projectTasks.filter(t => t.status === 'todo');
    this.inProgressTasks = projectTasks.filter(t => t.status === 'inprogress');
    this.doneTasks = projectTasks.filter(t => t.status === 'done');
  }

  openAddTaskModal(): void {
    this.selectedTask = null;
    this.showTaskModal = true;
  }

  openEditTaskModal(task: Task): void {
    this.selectedTask = { ...task };
    this.showTaskModal = true;
  }

  closeTaskModal(): void {
    this.showTaskModal = false;
    this.selectedTask = null;
  }

  onSaveTask(taskData: Partial<Task>): void {
    const tasks = this.storageService.getTasks();
    const now = new Date().toISOString();

    if (this.selectedTask) {
      const index = tasks.findIndex(t => t.id === taskData.id);
      if (index !== -1) {
        tasks[index] = {
          ...tasks[index],
          title: taskData.title || tasks[index].title,
          description: taskData.description ?? tasks[index].description,
          priority: taskData.priority || tasks[index].priority,
          status: taskData.status || tasks[index].status,
          completedAt: taskData.status === 'done' ? (tasks[index].completedAt || now) : null
        };
      }
    } else {
      const newTask: Task = {
        id: taskData.id || crypto.randomUUID(),
        projectId: this.project!.id,
        title: taskData.title || '',
        description: taskData.description || '',
        status: taskData.status || 'todo',
        priority: taskData.priority || 'medium',
        createdAt: taskData.createdAt || now,
        completedAt: null
      };
      tasks.push(newTask);
    }

    this.storageService.saveTasks(tasks);
    this.closeTaskModal();
  }

  confirmDeleteTask(task: Task): void {
    this.taskToDelete = task;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.taskToDelete = null;
  }

  onDeleteTask(): void {
    if (!this.taskToDelete) {
      return;
    }

    const tasks = this.storageService.getTasks();
    const filtered = tasks.filter(t => t.id !== this.taskToDelete!.id);
    this.storageService.saveTasks(filtered);
    this.showDeleteConfirm = false;
    this.taskToDelete = null;
  }

  onMoveTaskStatus(taskId: string, newStatus: string): void {
    const tasks = this.storageService.getTasks();
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) {
      return;
    }

    const now = new Date().toISOString();
    tasks[index] = {
      ...tasks[index],
      status: newStatus,
      completedAt: newStatus === 'done' ? (tasks[index].completedAt || now) : null
    };

    this.storageService.saveTasks(tasks);
  }
}