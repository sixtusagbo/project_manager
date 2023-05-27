/**
 * Project Manager
 *
 * @author Sixtus Agbo <miracleagbosixtus@gmail.com>
 */

enum ProjectStatus {
  active,
  finished,
}

type Listener<T> = (items: T[]) => void;

// Project Model
class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

// State Management
class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}
class ProjectState extends State<Project> {
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
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

/**
 * Validation object interface
 */
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

/**
 * Validates a validatable object, which is just a form input.
 *
 * @param {Validatable} validatableInput Validatable object
 */
function validate(validatableInput: Validatable) {
  let isValid = true;
  const { value, required, minLength, maxLength, min, max } = validatableInput;

  if (required) {
    isValid = isValid && value.toString().trim().length !== 0;
  }

  if (minLength != null && typeof value === 'string') {
    isValid = isValid && value.length >= minLength;
  }

  if (maxLength != null && typeof value === 'string') {
    isValid = isValid && value.length <= maxLength;
  }

  if (min != null && typeof value === 'number') {
    isValid = isValid && value >= min;
  }

  if (max != null && typeof value === 'number') {
    isValid = isValid && value <= max;
  }

  return isValid;
}

/**
 * Automatically binds `this` to event handlers.
 *
 * @param _ target
 * @param __ method name
 * @param {PropertyDescriptor} descriptor
 * @returns {PropertyDescriptor} Improved Descriptor
 */
function autobind(_: any, __: string, descriptor: PropertyDescriptor) {
  let initialMethod = descriptor.value;
  const improvedDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundMethod = initialMethod.bind(this);
      return boundMethod;
    },
  };

  return improvedDescriptor;
}

// Component Base Class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    position: InsertPosition,
    newElementId?: string
  ) {
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(position);
  }

  private attach(position: InsertPosition) {
    this.hostElement.insertAdjacentElement(position, this.element);
  }

  /**
   * Set up listeners
   */
  abstract configure(): void;

  /**
   * Renders HTML Element to the DOM
   */
  abstract renderContent(): void;
}

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
  constructor(hostId: string, private project: Project) {
    super('single-project', hostId, 'afterbegin', project.id);

    this.renderContent();
  }

  configure(): void {}

  renderContent(): void {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent =
      this.project.people.toString();
    this.element.querySelector('p')!.textContent = this.project.description;
  }
}

class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];
  listId: string;

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', 'beforeend', `${type}-projects`);
    this.assignedProjects = [];
    this.listId = `${this.type}-projects-list`;

    this.configure();
    this.renderContent();
  }

  configure(): void {
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

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super('project-input', 'app', 'afterbegin', 'user-input');

    this.titleInputElement = this.element.querySelector(
      '#title'
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      '#description'
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      '#people'
    ) as HTMLInputElement;

    this.configure();
  }

  configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  renderContent(): void {}

  @autobind
  private submitHandler(e: Event) {
    e.preventDefault();
    const userInput = this.gatherUserInput();

    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      projectState.addProject(title, description, people);
      this.clearInputs();
    }
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };
    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 10,
    };

    const enteredFieldsAreValid =
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable);

    if (enteredFieldsAreValid) {
      alert('Invalid input, please try again');
      return;
    }

    return [enteredTitle, enteredDescription, +enteredPeople];
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }
}

const projectForm = new ProjectInput();
const activeProjects = new ProjectList('active');
const finishedProjects = new ProjectList('finished');
