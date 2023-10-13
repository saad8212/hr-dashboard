const express = require("express");
const router = express.Router();

// Middleware Imports
const { verifyToken } = require("../middleware/AuthMiddleware");
const upload = require("../middleware/MulterMiddleware");

// Controller Functions
const { postLogin } = require("../controllers/dashboard/AuthController");
const { update_user, get_users } = require("../controllers/dashboard/UserController");
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/EmployeeController");

const {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
} = require("../controllers/RoleController");

// Admin Routes (Protected for Admins)
router.post("/login", postLogin); // Login User

// User Routes (Protected for Users)
router.route("/user/:id").patch(upload.single("image"), verifyToken, update_user); // Update Existing User
router.get("/api/v1/users", verifyToken, get_users); // Main User Route

// Employee Routes (Not protected by verifyToken)
router.post("/employees", upload.single('image'), createEmployee); // Create Employee
router.get("/employees", getEmployees); // Get all Employees
router.get("/employees/:id", getEmployeeById); // Get a Single Employee by ID
router.patch("/employees/:id",upload.single('image'), updateEmployee); // Update (Patch) an Employee by ID
router.delete("/employees/:id", deleteEmployee); // Delete an Employee by ID

// Role Routes (Protected for Admins)
router.post("/roles", createRole); // Create a Role
router.get("/roles", getRoles); // Get all Roles
router.get("/roles/:id", getRoleById); // Get a Single Role by ID
router.patch("/roles/:id", updateRole); // Update a Role by ID
router.delete("/roles/:id", verifyToken, deleteRole); // Delete a Role by ID

// Dashboard Route (Protected for Admins)
router.get("/", verifyToken, (req, res) => {
  res.send("<h2>Dashboard</h2>");
});

module.exports = router;
