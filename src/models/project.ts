/**
 * Specifies the various statuses of a project.
 *
 * @see Project for a use case.
 */
export enum ProjectStatus {
  active,
  finished,
}

export class Project {
  /**
   * Project Model
   * @param id {string}
   * @param title {string}
   * @param description {string}
   * @param people {number}
   * @param status {ProjectStatus}
   */
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}
