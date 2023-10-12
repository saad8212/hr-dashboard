const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Role name is required."],
    unique: [true, "Role name must be unique."],
  }
});

const Role = mongoose.model("Role", roleSchema);
module.exports = Role;
