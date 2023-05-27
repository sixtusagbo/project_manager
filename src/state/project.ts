import { Project, ProjectStatus } from '../models/project.js';
import { State } from './base.js';

/**
 * This class holds the Project State.
 */
export class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Date.now().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.active
    );

    this.projects.push(newProject);
    this.updateListeners();
  }

  moveProject(id: string, newStatus: ProjectStatus) {
    const project = this.projects.find(p => p.id == id);
    if (project) {
      // Don't update if it's status has not changed
      if (project.status === newStatus) return;
      project.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

/**
 * Runs once - when the file is imported for the first time by any file.
 *
 * If another file imports this file again, this does not run again.
 */
export const projectState = ProjectState.getInstance();
