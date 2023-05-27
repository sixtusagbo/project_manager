namespace App {
  /** Component Base Class */
  export abstract class Component<
    T extends HTMLElement,
    U extends HTMLElement
  > {
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
}
