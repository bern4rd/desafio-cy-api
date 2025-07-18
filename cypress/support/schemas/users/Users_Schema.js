import { USER_SCHEMA } from './User_Schema.js';

export const USERS_SCHEMA = {
  type: 'array',
  items: USER_SCHEMA
};

// [
//     {
//         "id": 1,
//         "name": "Ivete Sangalo",
//         "email": "ivete.sangalo@hotmail.com"
//     },
//     {
//         "id": 2,
//         "name": "Gilberto Gil",
//         "email": "gilberto.gil@gmail.com"
//     },
//     {
//         "id": 3,
//         "name": "João Gomes",
//         "email": "joaogomes@yahoo.com"
//     },
//     {
//         "id": 4,
//         "name": "Maria Betanea",
//         "email": "mariabetaanea@gmail.com"
//     },
//     {
//         "id": 5,
//         "name": "Caetano Veloso",
//         "email": "caetano.veloso@outlook.com"
//     }
// ]