const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"], // Custom error message
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    match: [
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
      "Invalid email format",
    ], // Custom error message
  },
  image: String,
  image_id: String,
  department: String,
  designation: String,
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",  
    required: [true, 'Role Id is Required!']
  },
  status: {
    type: String,
    enum: {
      values: ["Active", "Inactive"],
      message: "Status must be Active or Inactive",  
    },
    default: "Active",
  },
});

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
