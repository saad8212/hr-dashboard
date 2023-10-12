const chai = require("chai");
const sinon = require("sinon");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");
const cloudinary = require('../utils/cloudinary');
const {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/EmployeeController");
const Employee = require("../models/employee");

const expect = chai.expect;
const request = supertest(app);

describe("Employee Controller", () => {
  const sampleEmployee = {
    name: "Test Employee",
    email: "test@example.com",
    department: "HR",
    designation: "Manager",
    role: mongoose.Types.ObjectId(),
    status: "Active",
  };

  afterEach(async () => {
    await Employee.deleteMany({});
  });

  after(async () => {
    await mongoose.connection.close();
  });

    describe("Create Employee", () => {
      it("should create a new employee", async function() {
      
        this.timeout(5000);
        const cloudinaryUploadStub = sinon
          .stub(cloudinary.uploader, "upload")
          .resolves({
            public_id: "sample_public_id",
            secure_url: "sample_secure_url",
          });

        const req = {
          body: sampleEmployee,
          file: { path: "path_to_sample_image" },
        };
        const res = { status: sinon.stub(), json: sinon.stub() };
        res.status.returns(res);

        await createEmployee(req, res);

        sinon.assert.calledOnce(res.status);
        expect(res.status.firstCall.args[0]).to.equal(201);

        sinon.assert.calledOnce(res.json);
        const responseBody = res.json.firstCall.args[0];
        expect(responseBody.status).to.equal("success");
        expect(responseBody.data.name).to.equal(sampleEmployee.name);

        // Restore the Cloudinary upload function
        cloudinaryUploadStub.restore();
        
      });

      it("should handle missing image", async () => {
        const req = { body: sampleEmployee };
        const res = { status: sinon.stub(), json: sinon.stub() };
        res.status.returns(res);

        await createEmployee(req, res);

        sinon.assert.calledOnce(res.status);
        expect(res.status.firstCall.args[0]).to.equal(403);

        sinon.assert.calledOnce(res.json);
        const responseBody = res.json.firstCall.args[0];
        expect(responseBody.message).to.equal("Image not Found!");
      });
    });

    describe("Get Employees", () => {
      it("should get all employees with default sorting and limiting fields", async () => {
        const req = { query: {} };
        const res = { status: sinon.stub(), json: sinon.stub() };
        res.status.returns(res);

        await getEmployees(req, res);

        sinon.assert.calledOnce(res.status);
        expect(res.status.firstCall.args[0]).to.equal(200);

        sinon.assert.calledOnce(res.json);
        const responseBody = res.json.firstCall.args[0];
        expect(responseBody.status).to.equal("success");
        // Add more assertions to check the response data.
      });

      it("should filter employees and sort them", async () => {
        const req = {
          query: {
            department: "HR",
            sort: "name",
          },
        };
        const res = { status: sinon.stub(), json: sinon.stub() };
        res.status.returns(res);

        await getEmployees(req, res);

        sinon.assert.calledOnce(res.status);
        expect(res.status.firstCall.args[0]).to.equal(200);

        sinon.assert.calledOnce(res.json);
        const responseBody = res.json.firstCall.args[0];
        expect(responseBody.status).to.equal("success");
        // Add more assertions to check the response data.
      });

      it("should handle errors", async () => {
        const req = { query: { department: "NonexistentDepartment" } };
        const res = { status: sinon.stub(), json: sinon.stub() };
        res.status.returns(res);
        await getEmployees(req, res);

        sinon.assert.calledOnce(res.status);
      
        // Check for a 500 status code for error handling
        expect(res.status.firstCall.args[0]).to.equal(500);
      
        sinon.assert.calledOnce(res.json);
        const responseBody = res.json.firstCall.args[0];
        expect(responseBody.status).to.equal("fail");
       
      });
    });
    describe("Update Employee", () => {
      it("should update an employee", async () => {
        // Create a sample employee for updating
        const employeeToUpdate = await Employee.create(sampleEmployee);

        // Mock Cloudinary upload function
        const cloudinaryUploadStub = sinon
          .stub(cloudinary.uploader, "upload")
          .resolves({
            public_id: "sample_public_id",
            secure_url: "sample_secure_url",
          });

        const updatedEmployeeData = {
          name: "Updated Employee",
          email: "updated@example.com",
          department: "IT",
          designation: "Engineer",
          role: mongoose.Types.ObjectId(),
          status: "Inactive",
        };

        const req = {
          params: { id: employeeToUpdate._id },
          body: updatedEmployeeData,
          file: { path: "path_to_updated_image" },
        };
        const res = { status: sinon.stub(), json: sinon.stub() };
        res.status.returns(res);

        await updateEmployee(req, res);

        sinon.assert.calledOnce(res.status);
        expect(res.status.firstCall.args[0]).to.equal(200);

        sinon.assert.calledOnce(res.json);
        const responseBody = res.json.firstCall.args[0];
        expect(responseBody.status).to.equal("success");
        expect(responseBody.data.name).to.equal(updatedEmployeeData.name);

        // Restore the Cloudinary upload function
        cloudinaryUploadStub.restore();
      });

      it("should handle missing employee for update", async () => {
        const req = {
          params: { id: mongoose.Types.ObjectId() },
          body: { name: "Updated Employee" },
        };
        const res = { status: sinon.stub(), json: sinon.stub() };
        res.status.returns(res);

        await updateEmployee(req, res);

        sinon.assert.calledOnce(res.status);
        expect(res.status.firstCall.args[0]).to.equal(404);

        sinon.assert.calledOnce(res.json);
        const responseBody = res.json.firstCall.args[0];
        expect(responseBody.message).to.equal("Employee not found");
      });
    });

    describe("Delete Employee", () => {
      it("should delete an employee", async () => {
        // Create a sample employee for deletion
        const employeeToDelete = await Employee.create(sampleEmployee);

        const req = { params: { id: employeeToDelete._id } };
        const res = { status: sinon.stub(), json: sinon.stub() };
        res.status.returns(res);

        await deleteEmployee(req, res);

        sinon.assert.calledOnce(res.status);
        expect(res.status.firstCall.args[0]).to.equal(204);

        // Ensure the employee is deleted from the database
        const deletedEmployee = await Employee.findById(employeeToDelete._id);
        expect(deletedEmployee).to.be.null;
      });

      it("should handle missing employee for delete", async () => {
        const req = { params: { id: mongoose.Types.ObjectId() } };
        const res = { status: sinon.stub(), json: sinon.stub() };
        res.status.returns(res);

        await deleteEmployee(req, res);

        sinon.assert.calledOnce(res.status);
        expect(res.status.firstCall.args[0]).to.equal(404);

        sinon.assert.calledOnce(res.json);
        const responseBody = res.json.firstCall.args[0];
        expect(responseBody.message).to.equal("Employee not found");
      });
      
    });
});
