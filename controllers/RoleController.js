const mongoose = require('mongoose');
const Role = require('../models/role'); // Import the Role model

// Create a Role
async function createRole(req, res) {
  try {
    const { name } = req.body;
    const role = await Role.create({ name });

    res.status(201).json({
      status: 'success',
      data: role,
    });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message });
  }
}

// Get all Roles
async function getRoles(req, res) {
  try {
    const roles = await Role.find();

    res.status(200).json({
      status: 'success',
      data: roles,
    });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message });
  }
}

// Get a Single Role by ID
async function getRoleById(req, res) {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.status(200).json({
      status: 'success',
      data: role,
    });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message });
  }
}

// Update a Role by ID
async function updateRole(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const role = await Role.findById(id);

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    role.name = name || role.name;

    const updatedRole = await role.save();

    res.status(200).json({
      status: 'success',
      data: updatedRole,
    });
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message });
  }
}

// Delete a Role by ID
async function deleteRole(req, res) {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    await role.remove();

    res.status(204).json();
  } catch (error) {
    res.status(500).json({ status: 'fail', message: error.message });
  }
}

// Export the functions for use in your application
module.exports = {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
};
