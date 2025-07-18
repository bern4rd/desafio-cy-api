/// <reference types="cypress" />

import { TICKET_SCHEMA } from '../../support/schemas/tickets/Ticket_Schema.js';
import HTTP_STATUS from '../../support/contants.js';
import ajv from '../../support/ajv_instance.js';
import UserPayloads from '../../support/factories/userFactory.js';
import TicketPayloads from '../../support/factories/ticketFactory.js';

describe('(POST /tickets) - Ticket Creation Tests', { tags: ['@tickets', '@regression'] }, () => {
    
    let userId;

    before(() => {
        cy.api_createUser(UserPayloads.createValidUser()).then(response => {
            userId = response.body.id;
        });
    });

    context('Success Scenarios', () => {
        it('[TC032] Should create a new ticket successfully', { tags: ['@smoke', '@p1'] }, () => {
            const ticketPayload = { userId, ...TicketPayloads.createValidTicket() };
            cy.api_createTicket(ticketPayload).then(response => {
                expect(response.status).to.equal(HTTP_STATUS.CREATED);
                expect(response.body).to.have.property('id');
                expect(response.body.userId).to.equal(userId);
                expect(response.body.description).to.equal(ticketPayload.description);
                expect(response.body.status).to.equal('Open'); 
                expect(response.body).to.have.property('createdAt');
                expect(new Date(response.body.createdAt)).to.be.a('date');
            });
        });

        it('[TC033] Should validate the success response schema', { tags: ['@contract'] }, () => {
            const ticketPayload = { userId, ...TicketPayloads.createValidTicket() };
            cy.api_createTicket(ticketPayload).then(response => {
                const validate = ajv.compile(TICKET_SCHEMA);
                const isValid = validate(response.body);
                expect(isValid, `Response schema should be valid. Errors: ${JSON.stringify(validate.errors)}`).to.be.true;
            });
        });
    });

    context('Failure Scenarios', () => {

        const invalidDataScenarios = [
            { id: '[TC034]', title: 'with an empty userId', payload: { userId: '', ...TicketPayloads.createValidTicket() }, error: 'The fields userId and description are required.' },
            { id: '[TC035]', title: 'with an empty description', payload: { userId, description: '' }, error: 'The fields userId and description are required.' },            
        ];

        invalidDataScenarios.forEach(scenario => {
            it(`${scenario.id} Should not create a ticket ${scenario.title}`, { tags: ['@contract'] }, () => {
                cy.api_createTicket(scenario.payload).then(response => {
                    expect(response.status).to.equal(HTTP_STATUS.BAD_REQUEST);
                    expect(response.body).to.have.property('error', scenario.error);
                });
            });
        });

        it('[TC036] Should not create a ticket for a non-existent user', () => {
            const ticketPayload = { userId: 999999, ...TicketPayloads.createValidTicket() };
            cy.api_createTicket(ticketPayload).then(response => {
                expect(response.status).to.equal(HTTP_STATUS.NOT_FOUND);
            });
        });

        it('[TC037] Should not create a ticket with a malformed payload', { tags: ['@contract'] }, () => {
            const malformedPayload = `{"userId": ${userId}, "description": "Help"`;
            cy.api_createTicket(malformedPayload, { sendAsText: true }).then(response => {
                expect(response.status).to.equal(HTTP_STATUS.BAD_REQUEST);
            });
        });
    });
});