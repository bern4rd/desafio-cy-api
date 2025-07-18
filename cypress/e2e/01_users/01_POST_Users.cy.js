/// <reference types="cypress" />

import { USER_SCHEMA } from '../../support/schemas/users/User_Schema.js';
import HTTP_STATUS from '../../support/contants.js';
import ajv from '../../support/ajv_instance.js';
import UserPayloads from '../../support/factories/userFactory.js';

describe('(POST /users) - User Creation Tests', { tags: ['@regression','@users'] }, () => {

    context('Success Scenarios', () => {
        it('[TC001] Should create a new user successfully with valid data', { tags: ['@smoke', '@p1'] }, () => {
            const userPayload = UserPayloads.createValidUser();
            cy.api_createUser(userPayload).then(response => {
                expect(response.status).to.equal(HTTP_STATUS.CREATED);
                expect(response.body).to.have.property('id');
                expect(response.body.name).to.equal(userPayload.name);
                expect(response.body.email).to.equal(userPayload.email);
            });
        });
        it('[TC002] Should validate the success response schema', () => {
            const userPayload = UserPayloads.createValidUser();
            cy.api_createUser(userPayload).then(response => {
                const validate = ajv.compile(USER_SCHEMA);
                const isValid = validate(response.body);
                expect(isValid, `Response schema should be valid. Errors: ${JSON.stringify(validate.errors)}`).to.be.true;
            });
        });
    });
 
    context('Failure Scenarios', () => {
        it('[TC003] Should not create a user with an already existing email', { tags: ['@p1'] }, () => {
            const userPayload = UserPayloads.createValidUser();
            cy.api_createUser(userPayload).then(() => {
                cy.api_createUser(userPayload).then(response => {
                    expect(response.status).to.equal(HTTP_STATUS.CONFLICT);
                    expect(response.body.error).to.equal('A user with this name or email already exists.');
                });
            });
        });

        const missingFieldScenarios = [
            { id: '[TC004]', title: 'without the required field: email', payload: UserPayloads.createUserWithout('email') },
            { id: '[TC005]', title: 'without the required field: name', payload: UserPayloads.createUserWithout('name') },
        ];
        missingFieldScenarios.forEach(scenario => {
            it(`${scenario.id} Should not create a user ${scenario.title}`, { tags: ['@contract'] }, () => {
                cy.api_createUser(scenario.payload).then(response => {
                    expect(response.status).to.equal(HTTP_STATUS.BAD_REQUEST);
                    expect(response.body.error).to.include('The fields name and email are required.');
                });
            });
        });
    });

    context('Invalid Data Scenarios', () => {

        const invalidDataScenarios = [
            { id: '[TC006]', title: 'with an invalid email format', payload: UserPayloads.userWithInvalidEmailFormat(), error : 'The email format is invalid.' },
            { id: '[TC007]', title: 'with an empty "name" field', payload: UserPayloads.userWithEmptyField('name'), error : 'The fields name and email are required.' },
            { id: '[TC008]', title: 'with an empty "email" field', payload: UserPayloads.userWithEmptyField('email'), error : 'The fields name and email are required.' },
            { id: '[TC009]', title: 'with an incorrect data type for "name"', payload: { ...UserPayloads.createValidUser(), name: 12345 }, error : 'The name field must be a string.' },
        ];
        invalidDataScenarios.forEach(scenario => {
            it(`${scenario.id} Should not create a user ${scenario.title}`, { tags: ['@contract'] }, () => {
                cy.api_createUser(scenario.payload).then(response => {
                    expect(response.status).to.equal(HTTP_STATUS.BAD_REQUEST);
                    expect(response.body.error).to.exist;
                });
            });
        });

        it('[TC010] Should not create a user with a malformed JSON payload', { tags: ['@contract'] }, () => {
            const malformedPayload = '{"name": "Test", "email": "test@test.com"';
            cy.api_createUser(malformedPayload, { sendAsText: true }).then(response => {
                expect(response.status).to.equal(HTTP_STATUS.BAD_REQUEST);
            });
        });
    });
});