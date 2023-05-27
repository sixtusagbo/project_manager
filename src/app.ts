/// <reference path="components/project_form.ts" />
/// <reference path="components/project_list.ts" />

namespace App {
  new ProjectForm();
  new ProjectList('active');
  new ProjectList('finished');
}
