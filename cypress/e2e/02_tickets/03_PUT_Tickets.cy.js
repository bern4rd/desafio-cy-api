/// <reference types="cypress" />

import { PUT_TICKET_SCHEMA } from '../../support/schemas/tickets/PUT_Ticket_Schema.js';
import HTTP_STATUS from '../../support/contants.js';
import UserPayloads from '../../support/factories/userFactory.js';
import TicketPayloads from '../../support/factories/ticketFactory.js';
import ajv from '../../support/ajv_instance.js';

describe('(PUT /tickets/{id}) - Ticket Update Tests', { tags: ['@tickets', '@regression'] }, () => {

    let ticketId;

    beforeEach(() => {
        cy.api_createUser(UserPayloads.createValidUser()).then(userResponse => {
            const ticketPayload = { userId: userResponse.body.id, ...TicketPayloads.createValidTicket() };
            cy.api_createTicket(ticketPayload).then(ticketResponse => {
                ticketId = ticketResponse.body.id;
            });
        });
    });

    context('Success Scenarios', () => {

        const updateScenarios = [
            { id: '[TC042]', title: 'with status In Progress', payload: TicketPayloads.updateStatus('In Progress') },
            { id: '[TC043]', title: 'with status Closed', payload: TicketPayloads.updateStatus('Closed') }
        ];

        updateScenarios.forEach(scenario => {
            it(`${scenario.id} Should update a ticket status successfully ${scenario.title}`, { tags: ['@smoke', '@p1'] }, () => {
                cy.api_updateTicketStatus(ticketId, scenario.payload).then(response => {
                    expect(response.status).to.equal(HTTP_STATUS.OK);
                    expect(response.body.ticket.status).to.equal(scenario.payload.status);
                });
            });
        });

        // Validate JSON Schema
        it('[TC044] Should validate the response schema after updating a ticket', { tags: ['@contract'] }, () => {
            const updatePayload = TicketPayloads.updateStatus('In Progress');
            cy.api_updateTicketStatus(ticketId, updatePayload).then(response => {
                expect(response.status).to.equal(HTTP_STATUS.OK);
                const validate = ajv.compile(PUT_TICKET_SCHEMA);
                const isValid = validate(response.body);
                expect(isValid, `Response schema should be valid. Errors: ${JSON.stringify(validate.errors)}`).to.be.true;
            });
        });
    });

    context('Failure Scenarios', () => {
        it('[TC045] Should not update a ticket with an invalid status', { tags: ['@contract'] }, () => {
            const updatePayload = TicketPayloads.updateStatus('InvalidStatus');
            cy.api_updateTicketStatus(ticketId, updatePayload).then(response => {
                expect(response.status).to.equal(HTTP_STATUS.BAD_REQUEST);
            });
        });

        it('[TC046] Should not update a ticket with an invalid ID format', { tags: ['@contract'] }, () => {
            const updatePayload = TicketPayloads.updateStatus(  true);
            cy.api_updateTicketStatus(ticketId, updatePayload).then(response => {
                expect(response.status).to.equal(HTTP_STATUS.BAD_REQUEST);
            });
        });

        it('[TC046] Should not update a ticket with a malformed payload', { tags: ['@contract'] }, () => {
            const malformedPayload = '{"status": "In Progress"';
            cy.api_updateTicketStatus(ticketId, malformedPayload, { sendAsText: true }).then(response => {
                expect(response.status).to.equal(HTTP_STATUS.BAD_REQUEST);
            });
        });

        it('[TC048] Should return 404 when trying to update a non-existent ticket', () => {
            const updatePayload = TicketPayloads.updateStatus('In Progress');
            cy.api_updateTicketStatus(999999, updatePayload).then(response => {
                expect(response.status).to.equal(HTTP_STATUS.NOT_FOUND);
            });
        });
    });
});