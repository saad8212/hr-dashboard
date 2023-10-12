const mongoose = require("mongoose");
const Employee = require("../models/employee");
require("../db");

async function deleteRecordsFromEnd(lengthToDelete) {
  try {
    // Find and delete the records
    const recordsToDelete = await Employee.find()
      .sort({ _id: -1 })
      .limit(lengthToDelete);

    for (const record of recordsToDelete) {
      await record.remove();
    }

    console.log(`Deleted ${lengthToDelete} records `);
  } catch (error) {
    console.error("Error deleting records:", error);
  } finally {
    mongoose.connection.close();
  }
}

deleteRecordsFromEnd(10);
