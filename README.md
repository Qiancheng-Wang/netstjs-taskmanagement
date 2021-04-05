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

3. #### Pipes:

- Pipes operate on the arguments to be processed by the route handler, just before the handler is called.
- Pipes can perform data transformation or data validation.
- Pipes can return data - either original or modified - which will be passed on to the route handler.

##### 3-1. Parameter-level pipes

Parameter-level pipes tend to be slimmer and cleaner. However, they often result in extra code added to handlers - this can get messy and hard to maintain.

##### 3-2. Handler-level pipes

Handler-level pipes require some more code, but provide some great benefits.
