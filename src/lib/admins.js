// Simple admin management - stores admin credentials
// In production, this should be in a database with proper encryption

const admins = [
  {
    id: 1,
    email: 'bimaldevasia@gmail.com',
    password: '12345678',
    name: 'Bimal Devasia',
    role: 'super-admin',
    createdAt: '2024-01-01T00:00:00.000Z'
  }
];

export default admins;