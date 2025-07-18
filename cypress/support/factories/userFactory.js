const UserPayloads = {
    createValidUser: () => {
        const timestamp = Date.now();
        return {
            name: `User ${timestamp}`,
            email: `user.${timestamp}@example.com`,
        };
    },
    createUserWithout: (field) => {
        const payload = UserPayloads.createValidUser();
        delete payload[field];
        return payload;
    },
    userWithInvalidEmailFormat: () => {
        return {
            name: 'Invalid Email User',
            email: 'invalid-email-format',
        };
    },
    userWithEmptyField: (field) => {
        return {
            name: field === 'name' ? null : 'Valid Name',
            email: field === 'email' ? null : 'valid.email@example.com',
        };
    }
};

export default UserPayloads;
