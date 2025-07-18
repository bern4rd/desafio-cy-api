/// <reference types="cypress" />

import HTTP_STATUS from '../../support/contants.js';
import UserPayloads from '../../support/factories/userFactory.js';
import TicketPayloads from '../../support/factories/ticketFactory.js';

describe('(DELETE /tickets/{id}) - Ticket Deletion Tests', { tags: ['@tickets', '@regression'] }, () => {

    context('Success Scenarios', () => {
        let ticketIdToDelete;

        beforeEach(() => {
            cy.api_createUser(UserPayloads.createValidUser()).then(userResponse => {
                const ticketPayload = { userId: userResponse.body.id, ...TicketPayloads.createValidTicket() };
                cy.api_createTicket(ticketPayload).then(ticketResponse => {
                    ticketIdToDelete = ticketResponse.body.id;
                });
            });
        });

        it('[TC049] Should delete an existing ticket successfully', { tags: ['@smoke'] }, () => {
            cy.api_deleteTicket(ticketIdToDelete).then(response => {
                expect(response.status).to.equal(HTTP_STATUS.OK);
                expect(response.body).to.have.property('message', 'Ticket deleted successfully.');
            });
        });

        it('[TC050] Should verify the ticket was removed from the database', { tags: ['@p1'] }, () => {
            cy.api_deleteTicket(ticketIdToDelete).then(deleteResponse => {
                expect(deleteResponse.status).to.equal(HTTP_STATUS.OK);
                cy.api_getTicketById(ticketIdToDelete).then(getResponse => {
                    expect(getResponse.status).to.equal(HTTP_STATUS.NOT_FOUND);
                });
            });
        });

        // Validar Json Schema
        // it('[TC051] Should validate the JSON schema of the delete response', { tags:
        //     ['@contract'] }, () => {
        //     cy.api_deleteTicket(ticketIdToDelete).then(response => {
        //         expect(response.status).to.equal(HTTP_STATUS.OK);
        //         cy.validateJsonSchema(response.body, 'deleteTicketResponseSchema');
        //     });
        // });
    });

    context('Failure Scenarios', () => {
        it('[TC052] Should return 400 when trying to delete a ticket with an invalid ID format', { tags: ['@contract'] }, () => {
            cy.api_deleteTicket('invalid-id').then(response => {
                expect(response.status).to.equal(HTTP_STATUS.BAD_REQUEST);
            });
        });

        it('[TC053] Should return 404 when trying to delete a non-existent ticket', () => {
            cy.api_deleteTicket(999999).then(response => {
                expect(response.status).to.equal(HTTP_STATUS.NOT_FOUND);
            });
        });
    });
});