# Helpdesk API - Test Automation Project

![Cypress](https://img.shields.io/badge/Cypress-14.5.2-brightgreen)

This repository contains the automated API tests for the Helpdesk API for the capgemini chalenge, developed using Cypress.

## Table of Contents
- [Helpdesk API - Test Automation Project](#helpdesk-api---test-automation-project)
  - [Table of Contents](#table-of-contents)
  - [Tech Stack](#tech-stack)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
    - [Installation](#installation)
  - [Running the Tests](#running-the-tests)
  - [Reporting](#reporting)
  - [Project Structure](#project-structure)
  - [Suggestions for Improvement](#suggestions-for-improvement)

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

2.  **Headless Mode**
    ```bash
    npx cypress run
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
cypress.config.js               # Cypress configuration file
package.json                    # Project dependencies and scripts
package-lock.json               # Lock file for dependencies
README.md                       # Project documentation
```

## Suggestions for Improvement

:TODO: