import { USER_SCHEMA } from './User_Schema.js';

export const DELETE_USER_SCHEMA = {
  type: 'object',
  properties: {
    message: { type: 'string' },
    user: USER_SCHEMA
  },
  required: ['message', 'user']
};

// {
//     "message": "User deleted successfully.",
//     "user": {
//         "id": 2,
//         "name": "Gilberto Gil",
//         "email": "gilberto.gil@gmail.com"
//     }
// }