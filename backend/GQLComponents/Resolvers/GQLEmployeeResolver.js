const Employee = require('../../models/Employee');

const employeeResolvers = {
  Query: {
    getEmployeeById: async (_, { eid }) => {
      console.log(`Fetching employee with doc ID: ${eid}`);
      const emp = await Employee.findById(eid);
      if (!emp) throw new Error("Employee not found");

      return {
        id: emp._id.toString(), 
        ...emp.toObject(),
        createdAt: new Date(emp.createdAt).toLocaleString(),
        updatedAt: new Date(emp.updatedAt).toLocaleString()
      };
    },

    getAllEmployees: async () => {
      console.log(`Fetching all employees`);
      const employees = await Employee.find({});
      return employees.map(emp => ({
        id: emp._id.toString(),
        ...emp.toObject(),
        createdAt: new Date(emp.createdAt).toLocaleString(),
        updatedAt: new Date(emp.updatedAt).toLocaleString()
      }));
    },

    getEmployeeByDesignationOrDepartment: async (_, { designation, department }) => {
      console.log(`Fetching employees by Designation: ${designation}, Department: ${department}`);
      let query = {};
      if (designation) query.designation = new RegExp(designation, 'i');
      if (department) query.department = new RegExp(department, 'i');

      const employees = await Employee.find(query);
      if (!employees.length) throw new Error("No employees found with the given criteria.");
      return employees.map(emp => ({
        id: emp._id.toString(),
        ...emp.toObject(),
        createdAt: new Date(emp.createdAt).toLocaleString(),
        updatedAt: new Date(emp.updatedAt).toLocaleString()
      }));
    }
  },

  Mutation: {
    addEmployee: async (_, { input }) => {
      try {
        console.log(`🚀 Inserting employee with input:`, input);
        const genderToAdd = input.gender
          ? input.gender.charAt(0).toUpperCase() + input.gender.slice(1).toLowerCase()
          : "Other";

        const newEmployee = new Employee({
          ...input,
          gender: genderToAdd,
          date_of_joining: new Date(input.date_of_joining)
        });

        const savedEmployee = await newEmployee.save();
        console.log("✅ Saved employee:", savedEmployee);

        return {
          id: savedEmployee._id.toString(), 
          ...savedEmployee.toObject(),
          createdAt: new Date(savedEmployee.createdAt).toLocaleString(),
          updatedAt: new Date(savedEmployee.updatedAt).toLocaleString()
        };
      } catch (error) {
        console.error("❌ Error saving employee:", error.message);
        throw new Error("Failed to save employee. " + error.message);
      }
    },

    updateEmployeeById: async (_, { eid, input }) => {
      try {
        if (!eid) {
          console.log("Error: Employee ID is required for update.");
          throw new Error("Employee ID is required for update.");
        }

        console.log(`Updating employee with ID: ${eid}`);

        const genderFormatted = input.gender
          ? input.gender.charAt(0).toUpperCase() + input.gender.slice(1).toLowerCase()
          : undefined;

        const updateFields = {
          ...input,
          ...(genderFormatted && { gender: genderFormatted }),
        };

        if (input.date_of_joining) {
          updateFields.date_of_joining = new Date(input.date_of_joining);
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(
          eid,
          { $set: updateFields },
          { new: true, runValidators: true }
        );

        if (!updatedEmployee) {
          console.log(`No employee found with ID: ${eid}`);
          throw new Error("Employee not found");
        }

        console.log(`✅ Employee updated successfully`);

        return {
          id: updatedEmployee._id.toString(), 
          ...updatedEmployee.toObject(),
          createdAt: new Date(updatedEmployee.createdAt).toLocaleString(),
          updatedAt: new Date(updatedEmployee.updatedAt).toLocaleString()
        };
      } catch (error) {
        console.error(`❌ Error updating employee: ${error.message}`);
        throw new Error("Error updating employee. " + error.message);
      }
    },

    deleteEmployeeById: async (_, { eid }) => {
      if (!eid) {
        console.log(`ID not provided`);
        throw new Error("Please provide employee ID to delete");
      }

      console.log(`Deleting employee ID: ${eid}`);
      const emp = await Employee.findByIdAndDelete(eid);
      if (!emp) {
        throw new Error("Employee not found");
      }

      return "Employee deleted successfully";
    }
  }
};

module.exports = employeeResolvers;
