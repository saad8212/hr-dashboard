const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  name: String,
  description: String
});

const Permission = mongoose.model('Permission', permissionSchema);
module.exports = Permission;
