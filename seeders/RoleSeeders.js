const mongoose = require('mongoose');
const Role = require('../models/role'); // Assuming you have a Role model defined
 require('../db');
const rolesToSeed = [
  { name: 'Admin' },
  { name: 'User' },
  { name: 'Moderator' },
];

// Function to insert the seed data
async function seedRoles() {
  try {
    await Role.insertMany(rolesToSeed);
    console.log('Roles seeded successfully.');
  } catch (err) {
    console.error('Error seeding roles:', err);
  } finally {
    mongoose.connection.close();
  }
}

seedRoles();
