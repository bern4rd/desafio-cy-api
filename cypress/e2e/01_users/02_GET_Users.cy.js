/// <reference types="cypress" />

import { USERS_SCHEMA } from '../../support/schemas/users/Users_Schema.js';
import { USER_SCHEMA } from '../../support/schemas/users/User_Schema.js';
import HTTP_STATUS from '../../support/contants.js';
import ajv from '../../support/ajv_instance.js';
import UserPayloads from '../../support/factories/userFactory.js';

describe('(GET /users) - User Search Tests', { tags: ['@users', '@regression'] }, () => {

    context('GET /users | Success Scenarios', () => {
        it('[TC011] Should return the list of users successfully', { tags: ['@smoke'] }, () => {
            cy.api_getUsers().then(response => {
                expect(response.status).to.equal(HTTP_STATUS.OK);
                expect(response.body).to.be.an('array');
            });
        });

        it('[TC012] Should validate the user list schema', { tags: ['@contract'] }, () => {
            cy.api_getUsers().then(response => {
                const validate = ajv.compile(USERS_SCHEMA);
                const isValid = validate(response.body);
                expect(isValid, `User list schema should be valid. Errors: ${JSON.stringify(validate.errors)}`).to.be.true;
            });
        });
    });

    context('GET /users/{id} | Success Scenarios', () => {
        let userId;
        let userPayload;

        // Create a user before each test 
        before(() => {
            userPayload = UserPayloads.createValidUser();
            cy.api_createUser(userPayload).then(response => {
                userId = response.body.id;
            });
        });

        it('[TC013] Should return the data of a specific user successfully', { tags: ['@smoke', '@p1'] }, () => {
            cy.api_getUserById(userId).then(response => {
                expect(response.status).to.equal(HTTP_STATUS.OK);
                expect(response.body.id).to.equal(userId);
                expect(response.body.name).to.equal(userPayload.name);
                expect(response.body.email).to.equal(userPayload.email);
            });
        });

        it('[TC014] Should validate the schema of the user returned by ID', { tags: ['@contract'] }, () => {
            cy.api_getUserById(userId).then(response => {
                const validate = ajv.compile(USER_SCHEMA);
                const isValid = validate(response.body);
                expect(isValid, `User schema should be valid. Errors: ${JSON.stringify(validate.errors)}`).to.be.true;
            });
        });
    });

    context('GET /users/{id} | Failure Scenarios', () => {

         it('[TC015] Should return a 400 error when searching for an ID with an invalid format', { tags: ['@contract'] }, () => {
            const invalidId = 'abc'; 
            cy.api_getUserById(invalidId).then(response => {
                expect(response.status).to.equal(HTTP_STATUS.BAD_REQUEST);
            });
        });

        it('[TC016] Should return a 404 (NOT FOUND) when searching for a non-existent ID', { tags: ['@p1'] }, () => {
            const nonExistentId = 999999;
            cy.api_getUserById(nonExistentId).then(response => {
                expect(response.status).to.equal(HTTP_STATUS.NOT_FOUND);
            });
        });

       
    });
});