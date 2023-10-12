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

// Admin Routes
router.post("/login", postLogin); // Login User

// User Routes
router.route("/user/:id").patch(upload.single("image"), update_user); // Update Existing User
router.get("/api/v1/users", get_users); // Main User Route

// Employee Routes
router.post("/employees", createEmployee); // Create Employee
router.get("/employees", getEmployees); // Get all Employees
router.get("/employees/:id", getEmployeeById); // Get a Single Employee by ID
router.patch("/employees/:id", updateEmployee); // Update (Patch) an Employee by ID
router.delete("/employees/:id", deleteEmployee); // Delete an Employee by ID

// Dashboard Route
router.get("/", (req, res) => {
  res.send("<h2>Dashboard</h2>");
});

module.exports = router;
