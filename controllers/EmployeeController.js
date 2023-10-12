const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");
const Employee = require('../models/employee');

// Create Employee
async function createEmployee(req, res) {
  try {
    if (!req.file) {
      return res.status(403).json({ message: "Image not Found!" });
    }

    const { name, email, department, designation, role, status } = req.body;
    const image_upload = await cloudinary.uploader.upload(req.file.path);

    const employeeData = {
      name,
      email,
      image_id: image_upload.public_id,
      image: image_upload.secure_url,
      department,
      designation,
      role: mongoose.Types.ObjectId(role),
      status,
    };

    const employee = await Employee.create(employeeData);
    res.status(201).json({
      status: "success",
      data: employee,
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
}

// Get all Employees
async function getEmployees(req, res) {
  try {
    // Filtering, Advanced Filtering, Sorting, Fields Limiting
    const { query, options } = buildQuery(req.query);
    const employees = await Employee.find(query).select(options.fields).sort(options.sort) .populate('role', '-_id name');

    res.status(200).json({
      status: "success",
      data: employees,
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
}

// Get a Single Employee by ID
async function getEmployeeById(req, res) {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({
      status: "success",
      data: employee,
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
}

// Update (Patch) an Employee by ID
async function updateEmployee(req, res) {
  try {
    const { id } = req.params;
    const { name, email, department, designation, role, status } = req.body;
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check if a new image is being uploaded
    if (req.file) {
      await updateEmployeeImage(employee, req.file);
    }

    // Update employee fields
    employee.name = name || employee.name;
    employee.email = email || employee.email;
    employee.department = department || employee.department;
    employee.designation = designation || employee.designation;
    employee.role = role || employee.role;
    employee.status = status || employee.status;

    const updatedEmployee = await employee.save();

    res.status(200).json({
      status: "success",
      data: updatedEmployee,
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
}

// Delete an Employee by ID
async function deleteEmployee(req, res) {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await deleteEmployeeImage(employee);
    await employee.remove();

    res.status(204).json();
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
}

// Helper function to build query, sort, and fields options
function buildQuery(queryParams) {
  const query = { ...queryParams };
  const options = { fields: "-__v", sort: "-createdAt" };

  // Filtering
  const excludedFields = ["page", "limit", "sort", "fields"];
  excludedFields.forEach((field) => delete query[field]);

  // Advanced Filtering
  for (const key in query) {
    if (query[key].startsWith("gte") || query[key].startsWith("gt") || query[key].startsWith("lte") || query[key].startsWith("lt")) {
      query[key] = query[key].replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    }
  }

  // Sorting
  if (query.sort) {
    options.sort = query.sort.split(",").join(" ");
    delete query.sort;
  }

  // Fields Limiting
  if (query.fields) {
    options.fields = query.fields.split(",").join(" ");
    delete query.fields;
  }

  return { query, options };
}

// Helper function to update employee's image
async function updateEmployeeImage(employee, file) {
  if (employee.image_id) {
    await cloudinary.uploader.destroy(employee.image_id);
  }
  const image_upload = await cloudinary.uploader.upload(file.path);
  employee.image_id = image_upload.public_id;
  employee.image = image_upload.secure_url;
}

// Helper function to delete an employee's image
async function deleteEmployeeImage(employee) {
  if (employee.image_id) {
    await cloudinary.uploader.destroy(employee.image_id);
  }
}

// Export the functions for use in your application
module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
