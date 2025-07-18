export const TICKET_SCHEMA = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    userId: { type: 'number' },
    description: { type: 'string' },
    status: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' } 
  },
  required: [
    'id',
    'userId',
    'description',
    'status',
    'createdAt'
  ]
};