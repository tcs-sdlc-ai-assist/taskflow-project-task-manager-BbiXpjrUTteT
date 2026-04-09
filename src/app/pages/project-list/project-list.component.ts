import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StorageService } from '../../services/storage.service';
import { ProjectCardComponent } from '../../components/project-card/project-card.component';
import { ProjectModalComponent } from '../../components/project-modal/project-modal.component';
import type { Project } from '../../models/project.model';
import type { Task } from '../../models/task.model';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, ProjectCardComponent, ProjectModalComponent],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  tasks: Task[] = [];

  isModalOpen = false;
  isEditMode = false;
  selectedProject: Project | null = null;

  isDeleteConfirmationOpen = false;
  projectToDelete: Project | null = null;

  private projectsSub: Subscription | null = null;
  private tasksSub: Subscription | null = null;

  constructor(
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projectsSub = this.storageService.projects$.subscribe((projects) => {
      this.projects = projects;
    });
    this.tasksSub = this.storageService.tasks$.subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  ngOnDestroy(): void {
    if (this.projectsSub) {
      this.projectsSub.unsubscribe();
    }
    if (this.tasksSub) {
      this.tasksSub.unsubscribe();
    }
  }

  getTaskCount(projectId: string): number {
    return this.tasks.filter((t) => t.projectId === projectId).length;
  }

  getCompletedTaskCount(projectId: string): number {
    return this.tasks.filter((t) => t.projectId === projectId && t.status === 'done').length;
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedProject = null;
    this.isModalOpen = true;
  }

  openEditModal(project: Project): void {
    this.isEditMode = true;
    this.selectedProject = project;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isEditMode = false;
    this.selectedProject = null;
  }

  onSaveProject(projectData: Partial<Project>): void {
    const now = new Date().toISOString();
    const currentProjects = this.storageService.getProjects();

    if (this.isEditMode && this.selectedProject) {
      const updatedProjects = currentProjects.map((p) => {
        if (p.id === projectData.id) {
          return {
            ...p,
            name: projectData.name || p.name,
            description: projectData.description !== undefined ? projectData.description : p.description,
            color: projectData.color || p.color,
            createdAt: p.createdAt
          } as Project;
        }
        return p;
      });
      this.storageService.saveProjects(updatedProjects);
    } else {
      const newProject: Project = {
        id: projectData.id || crypto.randomUUID(),
        name: projectData.name || '',
        description: projectData.description || '',
        color: projectData.color || '#3b82f6',
        createdAt: projectData.createdAt || now
      };
      currentProjects.push(newProject);
      this.storageService.saveProjects(currentProjects);
    }

    this.closeModal();
  }

  openDeleteConfirmation(project: Project): void {
    this.projectToDelete = project;
    this.isDeleteConfirmationOpen = true;
  }

  closeDeleteConfirmation(): void {
    this.isDeleteConfirmationOpen = false;
    this.projectToDelete = null;
  }

  confirmDelete(): void {
    if (!this.projectToDelete) {
      return;
    }

    const projectId = this.projectToDelete.id;

    const updatedProjects = this.storageService.getProjects().filter((p) => p.id !== projectId);
    this.storageService.saveProjects(updatedProjects);

    const updatedTasks = this.storageService.getTasks().filter((t) => t.projectId !== projectId);
    this.storageService.saveTasks(updatedTasks);

    this.closeDeleteConfirmation();
  }

  navigateToProject(projectId: string): void {
    this.router.navigate(['/projects', projectId]);
  }
}