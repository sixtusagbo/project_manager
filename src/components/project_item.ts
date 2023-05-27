import { Component } from '../components/base.js';
import { autobind } from '../decorators/autobind.js';
import { Draggable } from '../models/drag_and_drop.js';
import { Project } from '../models/project.js';

export class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private get persons(): string {
    if (this.project.people === 1) {
      return '1 person';
    }
    return `${this.project.people} persons`;
  }

  constructor(hostId: string, private project: Project) {
    super('single-project', hostId, 'afterbegin', project.id);

    this.configure();
    this.renderContent();
  }

  @autobind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData('text/plain', this.project.id);
    event.dataTransfer!.effectAllowed = 'move';
  }

  @autobind
  dragEndHandler(_: DragEvent) {
    console.log('Drag End');
  }

  configure() {
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }

  renderContent(): void {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.persons + ' assigned.';
    this.element.querySelector('p')!.textContent = this.project.description;
  }
}
