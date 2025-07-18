import { USER_SCHEMA } from './User_Schema.js';

export const PUT_USER_SCHEMA = {
  type: 'object',
  properties: {
    message: { type: 'string' },
    user: USER_SCHEMA 
  },
  required: ['message', 'user']
};

// {
//     "message": "User updated successfully.",
//     "user": {
//         "id": 1,
//         "name": "Jane Doe",
//         "email": "jane.doe@example.com"
//     }
// }