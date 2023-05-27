/// <reference path="models/drag_and_drop.ts" />
/// <reference path="models/project.ts" />
/// <reference path="state/project.ts" />
/// <reference path="util/validation.ts" />
/// <reference path="decorators/autobind.ts" />
/// <reference path="components/project_form.ts" />
/// <reference path="components/project_list.ts" />

namespace App {
  new ProjectForm();
  new ProjectList('active');
  new ProjectList('finished');
}
