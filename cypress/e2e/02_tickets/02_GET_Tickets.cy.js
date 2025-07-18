/// <reference types="cypress" />

import { TICKET_SCHEMA } from '../../support/schemas/tickets/Ticket_Schema.js';
import HTTP_STATUS from '../../support/contants.js';
import ajv from '../../support/ajv_instance.js';
import UserPayloads from '../../support/factories/userFactory.js';
import TicketPayloads from '../../support/factories/ticketFactory.js';

describe('(GET /tickets/{id}) - Ticket Search Tests', { tags: ['@tickets', '@regression'] }, () => {

    context('Success Scenarios', () => {
        let ticketId;
        let ticketPayload;

        before(() => {
            cy.api_createUser(UserPayloads.createValidUser()).then(userResponse => {
                ticketPayload = { userId: userResponse.body.id, ...TicketPayloads.createValidTicket() };
                cy.api_createTicket(ticketPayload).then(ticketResponse => {
                    ticketId = ticketResponse.body.id;
                });
            });
        });

        it('[TC038] Should return a specific ticket successfully', { tags: ['@smoke'] }, () => {
            cy.api_getTicketById(ticketId).then(response => {
                expect(response.status).to.equal(HTTP_STATUS.OK);
                expect(response.body.id).to.equal(ticketId);
                expect(response.body.description).to.equal(ticketPayload.description);
            });
        });

        it('[TC039] Should validate the returned ticket schema', { tags: ['@contract'] }, () => {
            cy.api_getTicketById(ticketId).then(response => {
                const validate = ajv.compile(TICKET_SCHEMA);
                const isValid = validate(response.body);
                expect(isValid, `Ticket schema should be valid. Errors: ${JSON.stringify(validate.errors)}`).to.be.true;
            });
        });
    });

    context('Failure Scenarios', () => {
        
        it('[TC040] Should return 400 for an invalid ticket ID format', { tags: ['@contract'] }, () => {
            cy.api_getTicketById('invalid-id').then(response => {
                expect(response.status).to.equal(HTTP_STATUS.BAD_REQUEST);
            });
        });

        it('[TC041] Should return 404 for a non-existent ticket ID', () => {
            cy.api_getTicketById(999999).then(response => {
                expect(response.status).to.equal(HTTP_STATUS.NOT_FOUND);
            });
        });
    });
});