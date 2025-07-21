# Helpdesk API - Test Automation Project

![Cypress](https://img.shields.io/badge/Cypress-14.5.2-brightgreen)

This repository contains the automated API tests for the Helpdesk API for the capgemini chalenge, developed using Cypress.

## Test Design

The tests are planned using VADER heuristics and are represented in the Mindmap below.

![Mindmap](docs/[Backend]%20-%20HelpDesk%20-%20Cenários%20de%20teste.png)

## Table of Contents
- [Helpdesk API - Test Automation Project](#helpdesk-api---test-automation-project)
  - [Test Design](#test-design)
  - [Table of Contents](#table-of-contents)
  - [Tech Stack](#tech-stack)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
    - [Installation](#installation)
  - [Running the Tests](#running-the-tests)
  - [Reporting](#reporting)
  - [Project Structure](#project-structure)
  - [Suggestions for Improvement](#suggestions-for-improvement)
    - [1. Missing Input Validation on `PUT` Requests](#1-missing-input-validation-on-put-requests)
    - [2. Missing Conflict Validation on User Update](#2-missing-conflict-validation-on-user-update)
    - [3. Data Integrity Violation](#3-data-integrity-violation)
    - [4. Inconsistent Error Code Semantics for Invalid IDs](#4-inconsistent-error-code-semantics-for-invalid-ids)
    - [5. Flawed ID Generation](#5-flawed-id-generation)
    - [6. Orphaned Tickets on User Deletion](#6-orphaned-tickets-on-user-deletion)

## Tech Stack
* **Testing Framework:** [Cypress](https://www.cypress.io/)
* **Schema Validation:** [AJV](https://ajv.js.org/)
* **Test Tagging:** [cypress-grep](https://github.com/cypress-io/cypress-grep)
* **Reporting:** [Mochawesome](https://github.com/adamgruber/mochawesome)

## Prerequisites
Before you begin, ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/en/) (v18.x or higher recommended)
* [npm](https://www.npmjs.com/)
* [Git](https://git-scm.com/)
* [Mock API server](https://github.com/automacaohml/helpdesk-api) running on `http://localhost:3000`

## Getting Started

### Installation

1.  **Clone the repository:**

2.  **Navigate to the project directory:**

3.  **Install the dependencies:**
    This will install Cypress and all the plugins listed in `package.json`.
    ```bash
    npm install
    ```

## Running the Tests
1.  **Interactive Mode**
    ```bash
    npx cypress open
    ```

    or 
    ```bash
    npm run cy:open
    ```

2.  **Headless Mode**
    ```bash
    npx cypress run
    ```
    or 
    ```bash
    npm run cy:run
    ```

3.  **Running Tests with Tags: **
    
    Run only the smoke tests
    ```bash
    npx cypress run --env grep="@smoke"
    ```

    Run all high-priority (@p1) regression tests: 
    ```bash
    npx cypress run --env grep="@regression and @p1"
    ```

## Reporting

After running the tests in headless mode, a detailed HTML report will be generated in the following directory: ```cypress/reports/html```

Open the ```index.html``` file in your browser to view the results.

## Project Structure

```plaintext
cypress/
├── e2e/                        # Test cases
│   ├── 01_users/
│   │   ├── 01_POST_Users.cy.js
│   │   ├── 02_GET_Users.cy.js
│   │   ├── 03_PUT_Users.cy.js
│   │   └── 04_DELETE_Users.cy.js
│   ├── 02_tickets/
│   │   ├── 01_POST_Tickets.cy.js
│   │   ├── 02_GET_Tickets.cy.js
│   │   ├── 03_PUT_Tickets.cy.js
│   │   └── 04_DELETE_Tickets.cy.js
fixtures/                        # Sample data for tests
├── users/
│   ├── user.json
│   ├── user_sem_email.json
│   ├── user_sem_nome.json
support/                         # Custom commands and utilities
│   ├── factories/
│   │   ├── userFactory.js
│   │   └── ticketFactory.js
│   ├── schemas/
│   |   ├── tickets/
│   │   │   ├── Ticket_Schema.js
│   │   │   └── PUT_Ticket_Schema.js
│   │   ├── users/
│   │   │   ├── User_Schema.js
│   │   │   ├── Users_Schema.js
│   │   │   ├── DELETE_User_Schema.js
│   │   │   └── PUT_User_Schema.js
│   ├── commands.js
│   ├── ajv_instance.js
│   └── constants.js    
|   └── e2e.js
docs/                           # Documentation, mindmaps and challenge details
├── [Backend] - HelpDesk - Cenários de teste.pdf
├── [Backend] - HelpDesk - Cenários de teste.xmind
├── challeng-details.jpg
results/                        # Video of executed tests
├── test-result.mp4
cypress.config.js               # Cypress configuration file
package.json                    # Project dependencies and scripts
package-lock.json               # Lock file for dependencies
README.md                       # Project documentation
```

## Suggestions for Improvement

### 1. Missing Input Validation on `PUT` Requests
* **Problem:** The API is not validating the request body on `PUT` endpoints. It incorrectly accepts invalid data (e.g., null values, incorrect formats) and responds with `200 OK` instead of the expected `400 Bad Request`. This is a critical bug identified by multiple failing tests in `03_PUT_Users.cy.js` and `03_PUT_Tickets.cy.js`.
* **Suggestion:** Implement strict input validation on all `PUT` endpoints to reject invalid payloads and return a `400 Bad Request` status.

### 2. Missing Conflict Validation on User Update
* **Problem:** The `PUT /users/:id` endpoint does not check if a new email already exists, allowing duplicate emails in the database. Test `[TC026]` fails with `expected 200 to equal 409` due to this issue.
* **Suggestion:** Add a validation check to ensure the new email is unique among all other users before saving the update.

### 3. Data Integrity Violation
* **Problem:** The schema validation for `GET /users` failed (`[TC012]`) because a user with a malformed email exists in the database. This is a direct consequence of the faulty validation in the `POST` and `PUT` endpoints.
* **Suggestion:** Correcting the input validation on the creation and update endpoints will prevent malformed data from being saved, ensuring data integrity.

### 4. Inconsistent Error Code Semantics for Invalid IDs
* **Problem:** The API returns a `404 Not Found` for requests with an invalidly formatted ID (e.g., `/users/abc`). The correct semantic response for a malformed parameter is `400 Bad Request`. This was observed in multiple failing tests, including `[TC015]`, `[TC030]`, and `[TC040]`, which expected `400` but received `404`.
* **Suggestion:** Standardize the API to return a `400 Bad Request` for any request where a path parameter has an invalid format.

### 5. Flawed ID Generation
* **Problem:** The method for creating new User and Ticket IDs (`collection.length + 1`) will cause duplicate IDs if items are deleted.
* **Suggestion:** Implement a robust ID generation logic that finds the current maximum ID in the collection and increments it.

### 6. Orphaned Tickets on User Deletion
* **Problem:** Deleting a user does not delete their associated tickets, leaving orphaned data with an invalid `userId`.
* **Suggestion:** Implement a "cascading delete" logic. When a user is deleted, all tickets associated with that `userId` should also be deleted.