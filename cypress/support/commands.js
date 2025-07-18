// User commands

Cypress.Commands.add('api_createUser', (user) => {
  cy.api({
    method: 'POST',
    url: '/users',
    body: user,
    failOnStatusCode: false 
  })
});

Cypress.Commands.add('getNewUserId', () => {
  return cy.fixture('users/user.json').then((user) => {
    user.email = `${Date.now()}_${user.email}`;
    cy.api_createUser(user).then(response => {
        return response.body.id;
    });
  });
});

Cypress.Commands.add('api_getUsers', () => {
  return cy.api({
    method: 'GET',
    url: '/users',
    failOnStatusCode: false 
  });
});

Cypress.Commands.add('api_getUserById', (id) => {
  return cy.api({
    method: 'GET',
    url: `/users/${id}`,
    failOnStatusCode: false
  });
});

Cypress.Commands.add('api_updateUser', (id, user) => {
  return cy.api({
    method: 'PUT',
    url: `/users/${id}`,
    body: user,
    failOnStatusCode: false
  });
});

Cypress.Commands.add('api_deleteUser', (id) => {
  return cy.api({
    method: 'DELETE',
    url: `/users/${id}`,
    failOnStatusCode: false
  });
});

// Ticket commands

Cypress.Commands.add('api_createTicket', (ticket) => {
  return cy.api({
    method: 'POST',
    url: '/tickets',
    body: ticket,
    failOnStatusCode: false
  });
});

Cypress.Commands.add('api_getTicketById', (id) => {
  return cy.api({
    method: 'GET',
    url: `/tickets/${id}`,
    failOnStatusCode: false
  });
});

Cypress.Commands.add('api_updateTicketStatus', (id, status) => {
  return cy.api({
    method: 'PUT',
    url: `/tickets/${id}/status`, // Assuming the endpoint for updating status is /tickets/{id}/status
    body: status,
    failOnStatusCode: false
  });
});

Cypress.Commands.add('api_deleteTicket', (id) => {
  return cy.api({
    method: 'DELETE',
    url: `/tickets/${id}`,
    failOnStatusCode: false
  });
});