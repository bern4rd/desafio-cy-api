/// <reference types="cypress" />

import { DELETE_USER_SCHEMA } from '../../support/schemas/users/DELETE_User_Schema.js';
import HTTP_STATUS from '../../support/contants.js';
import ajv from '../../support/ajv_instance.js';
import UserPayloads from '../../support/factories/userFactory.js';

describe('(DELETE /users/{id}) - User Deletion Tests', { tags: ['@users', '@regression'] }, () => {

    context('Success Scenarios', () => {

        let userPayload;
        let userIdToDelete;

        beforeEach(() => {
            userPayload = UserPayloads.createValidUser();
            cy.api_createUser(userPayload).then(response => {
                userIdToDelete = response.body.id;
            });
        });

        it('[TC027] Should delete an existing user successfully and return its data', { tags: ['@smoke', '@p1'] }, () => {
            cy.api_deleteUser(userIdToDelete).then(deleteResponse => {
                expect(deleteResponse.status).to.equal(HTTP_STATUS.OK);
                expect(deleteResponse.body.message).to.equal('User deleted successfully.');
                
                const deletedUser = deleteResponse.body.user;
                expect(deletedUser.id).to.equal(userIdToDelete);
                expect(deletedUser.name).to.equal(userPayload.name);
                expect(deletedUser.email).to.equal(userPayload.email);
            });
        });

        it('[TC028] Should validate that the user was removed', { tags: '@p1' }, () => {
            cy.api_deleteUser(userIdToDelete).then(deleteResponse => {
                expect(deleteResponse.status).to.equal(HTTP_STATUS.OK);
                cy.api_getUserById(userIdToDelete).then(getResponse => {
                    expect(getResponse.status).to.equal(HTTP_STATUS.NOT_FOUND);
                });
            });
        });

        it('[TC029] Should validate the success response schema', { tags: '@contract' }, () => {
            cy.api_deleteUser(userIdToDelete).then(deleteResponse => {
                const validate = ajv.compile(DELETE_USER_SCHEMA);
                const isValid = validate(deleteResponse.body);
                expect(isValid, `Deletion response schema should be valid. Errors: ${JSON.stringify(validate.errors)}`).to.be.true;
            });
        });
    });

    context('Failure Scenarios', () => {

        it('[TC030] Should return a 400 error when trying to delete a user with an invalid format ID', { tags: '@contract' }, () => {
            const invalidId = 'invalid-id';
            cy.api_deleteUser(invalidId).then(response => {
                expect(response.status).to.equal(HTTP_STATUS.BAD_REQUEST);
            });
        });

        it('[TC031] Should return a 404 error when trying to delete a user with a non-existent ID', () => {
            const nonExistentId = 999999999;
            cy.api_deleteUser(nonExistentId).then(response => {
                expect(response.status).to.equal(HTTP_STATUS.NOT_FOUND);
            });
        });
    });
}); 