const mongoose = require('mongoose');  
const Employee = require('../models/employee');
const { EmployeeData } = require('../data/Seed');
require('../db');
 
// Function to insert the seed data
async function seedDatabase() {
  try {
    await Employee.insertMany(EmployeeData);
    console.log('Data seeded successfully.');
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
