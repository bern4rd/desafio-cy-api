/// <reference types="cypress" />

import { PUT_USER_SCHEMA } from '../../support/schemas/users/PUT_User_Schema.js';
import HTTP_STATUS from '../../support/contants.js';
import ajv from '../../support/ajv_instance.js';
import UserPayloads from '../../support/factories/userFactory.js';

describe('(PUT /users/{id}) - User Update Tests', { tags: ['@users', '@regression'] }, () => {

    context('Success Scenarios', () => {
        let userId;
        beforeEach(() => {
                cy.api_createUser(UserPayloads.createValidUser()).then(response => {
                userId = response.body.id;
            });
        });

        it('[TC017] Should update a user\'s name and email successfully', { tags: ['@smoke', '@p1'] }, () => {
            const newPayload = UserPayloads.createValidUser();
            cy.api_updateUser(userId, newPayload).then(response => {
                expect(response.status).to.equal(HTTP_STATUS.OK);
                expect(response.body.message).to.equal('User updated successfully.');
                expect(response.body.user.name).to.equal(newPayload.name);
                expect(response.body.user.email).to.equal(newPayload.email);
            });
        });

        it('[TC018] Should update only the user\'s name', () => {
            const newPayload = { name: UserPayloads.createValidUser().name };
            cy.api_updateUser(userId, newPayload).then(response => {
                expect(response.status).to.equal(HTTP_STATUS.OK);
                expect(response.body.user.name).to.equal(newPayload.name);
            });
        });

        it('[TC019] Should update only the user\'s email', () => {
            const newPayload = { email: UserPayloads.createValidUser().email };
            cy.api_updateUser(userId, newPayload).then(response => {
                expect(response.status).to.equal(HTTP_STATUS.OK);
                expect(response.body.user.email).to.equal(newPayload.email);
            });
        });

        it('[TC020] Should validate the complete response schema of the update', { tags: ['@contract'] }, () => {
            const newPayload = UserPayloads.createValidUser();
            cy.api_updateUser(userId, newPayload).then(response => {
                const validate = ajv.compile(PUT_USER_SCHEMA);
                const isValid = validate(response.body);
                expect(isValid, `Complete update response schema should be valid. Errors: ${JSON.stringify(validate.errors)}`).to.be.true;
            });
        });
    });

    context('Failure Scenarios', () => {
        let userId;
        beforeEach(() => {
                cy.api_createUser(UserPayloads.createValidUser()).then(response => {
                userId = response.body.id;
            });
        });

        const invalidDataScenarios = [
            { id: '[TC021]', title: 'with an invalid email format', payload: { email: 'invalid.email.com' } },
            { id: '[TC022]', title: 'by sending a null name', payload: { name: null } },
            { id: '[TC023]', title: 'by sending a null email', payload: { email: null } }
        ];

        invalidDataScenarios.forEach(scenario => {
            it(`${scenario.id} Should not update a user ${scenario.title}`, { tags: ['@contract'] }, () => {
                cy.api_updateUser(userId, scenario.payload).then(response => {
                    expect(response.status).to.equal(HTTP_STATUS.BAD_REQUEST);
                });
            });
        });

        it('[TC024] Should not update a user with a malformed JSON payload', { tags: ['@contract'] }, () => {
            const malformedPayload = '{"name": "Test"';
            cy.api_updateUser(userId, malformedPayload, { sendAsText: true }).then(response => {
                expect(response.status).to.equal(HTTP_STATUS.BAD_REQUEST);
            });
        });

        it('[TC025] Should return a 404 error when trying to update a user with a non-existent ID', () => {
            const nonExistentId = 999999;
            const payload = UserPayloads.createValidUser();
            cy.api_updateUser(nonExistentId, payload).then(response => {
                expect(response.status).to.equal(HTTP_STATUS.NOT_FOUND);
            });
        });

        it('[TC026] Should return a 409 error when trying to update to an email that is already in use', { tags: ['@p1'] }, () => {
            const secondUserPayload = UserPayloads.createValidUser();
            cy.api_createUser(secondUserPayload).then(() => {
                const updatePayload = { email: secondUserPayload.email };
                cy.api_updateUser(userId, updatePayload).then(response => {
                    expect(response.status).to.equal(HTTP_STATUS.CONFLICT);
                });
            });
        });

    });
});