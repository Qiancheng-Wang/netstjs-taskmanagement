## Nest.Js

1. #### Controllers:

- Responsible for handling incoming requests and returning responses to the client.
- Bound to a specific path (for example, "/tasks" for the task resource).
- Contain handlers, which handle endpoints and request methods (GET, POST, DELETE etc.).
- Can take advantage of dependency injection to consume providers within the same module.

2. #### Services:

- Defined as providers. Not all providers are services.
- Common concept within software development and are not exclusive Nestjs, JavaScript or Back-end development.
- Singleton when wrapped with @Injectable() and provided to a module, That means, the same instance will be shared across the application - acting as a single source of truth.
- The main source of business logic. For example, a service will be called from a controller to validate data, create an item in the database and return a response.
