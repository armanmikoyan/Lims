# E-LAB Backend

This is the backend service for the E-LAB project, built with Nest.js and TypeScript, and utilizing Docker for containerization and Prisma for database management.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Running Tests](#running-tests)

## Requirements

- Node.js LTS (At least 20+)
- Docker
- Docker Compose
- Prisma CLI

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Quantori-Academy/elab-be.git
   ```

2. **Navigate to the project folder:**

   ```bash
   cd elab-be
   ```

3. **Install the dependencies:**

   ```bash
   npm install
   ```

4. **Set up the environment variables:**

   Create a `.env` file based on `.env.example` and provide the necessary configurations (database, ports, etc.). You can use your own values for local container with your own DB, or ask Azat for creds of DEV DB.

## Running the Application

1. **Using Docker** (Recommended):

   Use Docker to run the application in a containerized environment:

   ```bash
   docker-compose up --build
   ```

2. **Running Locally:**

   Alternatively you can run the application locally:

   ```bash
   npm run start:dev
   ```

   Don't forget to run Docker container with DB. 

   *If you have issues with Docker you should run DB locally and populate `.env` file with corresponding values.*

## Running Tests

- **Unit Tests:**

  ```bash
  npm run test
  ```
---

## Layered Architecture and Best Practices

### Layered Architecture

The E-LAB backend follows a layered architecture for scalability and maintainability:

1. **Prisma Layer**: Manages database schemas, migrations, and interactions using Prisma ORM.
2. **Modules Layer**:
Each module contains components related to specific features or functionalities.

   2.1 **Controller**: Handles HTTP requests, processes them, and returns responses.

   2.2 **Service**: Contains business logic, coordinates between controllers and the data layer.

   2.3 **DTOs and Validators**: Ensure data integrity across layers.

   2.4 **Interfaces**: Define the shape of data and objects used throughout the application.
3. **Common Layer**: Contains shared configs, decorators, guards, dtos, interfaces, pipes, services, and reusable components accessible across different modules.

### Best Practices

- **Modular Architecture**: Organize code into feature-based modules.
- **Dependency Injection**: Use DI for managing services.
- **Validation**: Implement pipes and DTOs for data validation.
- **Exception Handling**: Use global filters for error management.
- **Security**: Protect routes with authentication and secure headers.
- **Testing**: Write unit using Jest.

---

# Git flow

Use the following Git flow for the development 

https://nvie.com/posts/a-successful-git-branching-model/

In a nutshell, when you would like to start your work do the following:

- Create feature branch 
- Complete your work
- Push feature branch (you can squash it if you would like to) and open PR to `develop`
- When PR is approved by at least mentor and 2 students, merge it to `develop`