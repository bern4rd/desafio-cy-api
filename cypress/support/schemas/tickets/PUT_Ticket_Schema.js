import { TICKET_SCHEMA } from './Ticket_Schema.js';

export const PUT_TICKET_SCHEMA = {
  type: 'object',
  properties: {
    message: { type: 'string' },
    ticket: TICKET_SCHEMA
  },
  required: ['message', 'ticket']
};


// {
//     "message": "Ticket status updated successfully.",
//     "ticket": {
//         "id": 1,
//         "userId": 1,
//         "description": "My internet is not working.",
//         "status": "In Progress",
//         "createdAt": "2025-03-11T14:30:00Z"
//     }
// }