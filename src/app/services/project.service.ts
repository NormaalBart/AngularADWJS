import { Injectable } from '@angular/core';
import { ProjectRepository } from '../repositories/project-repository';
import { Project } from '../models/project.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  public activeProject = new BehaviorSubject<Project | null>(null);

  constructor(private projectRepository: ProjectRepository) { }

  getProjects(): Observable<Project[]> {
    return this.projectRepository.getProjects();
  }

  addProject(name: string): void {
    this.projectRepository.addProject(name);
  }

  deleteProject(id: string): void {
    this.projectRepository.deleteProject(id);
  }

  setActiveProject(project: Project): void {
    this.activeProject.next(project);
  }

  clearActiveProject(): void {
    this.activeProject.next(null);
  }

  isActiveProject(project: Project): boolean {
    return this.activeProject.value === project;
  }
}
