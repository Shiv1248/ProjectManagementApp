import { StackContext, Api } from "sst/constructs";
import { Duration } from "aws-cdk-lib";

export function ApiStack({ stack }: StackContext) {
  const api = new Api(stack, "Api", {
    routes: {
        "GET    /tasks":           "functions/tasks/list.handler",
        "POST   /tasks":           "functions/tasks/create.handler",
        "GET    /tasks/{id}":      "functions/tasks/get.handler",
        "PUT    /tasks/{id}":      "functions/tasks/update.handler",
        "DELETE /tasks/{id}":      "functions/tasks/delete.handler",
        "GET    /tasks/{projectId}/project-list": "functions/tasks/project-list.handler",
        "GET    /tasks/{userId}/user-list": "functions/tasks/user-list.handler",

        "GET    /users":           "functions/users/list.handler",
        "POST   /users":           "functions/users/create.handler",
        "GET    /users/{id}":      "functions/users/get.handler",
        "PUT    /users/{id}":      "functions/users/update.handler",
        "DELETE /users/{id}":      "functions/users/delete.handler",
        "GET    /users/{projectId}/project-list": "functions/users/project-list.handler",

        "GET    /projects":          "functions/projects/list.handler",
        "POST   /projects":          "functions/projects/create.handler",
        "GET    /projects/{id}":     "functions/projects/get.handler",
        "PUT    /projects/{id}":     "functions/projects/update.handler",
        "DELETE /projects/{id}":     "functions/projects/delete.handler",
        "GET    /projects/{userId}/user-list": "functions/projects/user-list.handler",

        "POST   /user-projects":  "functions/userProjects/create.handler",
        "DELETE /user-projects/{id}": "functions/userProjects/delete.handler",
      },
    defaults: {
      function: {
        environment: {
          DATABASE_URL: process.env.DATABASE_URL,
        },
        timeout: Duration.seconds(30),
      },
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
