import Component from '../components/base';
import { autobind } from '../decorators/autobind';
import { DragTarget } from '../models/drag_and_drop';
import { Project, ProjectStatus } from '../models/project';
import { projectState } from '../state/project';
import { ProjectItem } from './project_item';

export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignedProjects: Project[];
  listId: string;

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', 'beforeend', `${type}-projects`);
    this.assignedProjects = [];
    this.listId = `${this.type}-projects-list`;

    this.configure();
    this.renderContent();
  }

  @autobind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();

      const listEl = this.element.querySelector('ul')!;
      listEl.classList.add('droppable');
    }
  }

  @autobind
  dropHandler(event: DragEvent): void {
    const projectId = event.dataTransfer!.getData('text/plain');
    projectState.moveProject(
      projectId,
      this.type === 'finished' ? ProjectStatus.finished : ProjectStatus.active
    );
  }

  @autobind
  dragLeaveHandler(_: DragEvent): void {
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.remove('droppable');
  }

  configure(): void {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('drop', this.dropHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);

    projectState.addListener((projects: Project[]) => {
      // Makes sure that the projects are added to the correct list
      // depending on whether it is active or finished
      const relevantProjects = projects.filter(project => {
        if (this.type === 'active') {
          return project.status === ProjectStatus.active;
        }
        return project.status === ProjectStatus.finished;
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    this.element.querySelector('ul')!.id = this.listId;
    this.element.querySelector('h2')!.textContent =
      this.type.toUpperCase() + ' PROJECTS';
  }

  private renderProjects() {
    const listEl = document.getElementById(this.listId)! as HTMLUListElement;

    // Fix duplication of projects when new project is added
    // I chose this because it's performance cost is better than
    // comparing the DOM elements to find which that has been rendered.
    listEl.innerHTML = '';

    for (const project of this.assignedProjects) {
      new ProjectItem(this.listId, project);
    }
  }
}
