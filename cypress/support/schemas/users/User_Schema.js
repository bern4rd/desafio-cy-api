export const USER_SCHEMA = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' }
  },
  required: ['id', 'name', 'email']
};

// {
//         "id": 1,
//         "name": "Ivete Sangalo",
//         "email": "ivete.sangalo@hotmail.com"
// }