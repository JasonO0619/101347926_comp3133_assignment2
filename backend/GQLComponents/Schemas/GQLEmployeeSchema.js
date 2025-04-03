const { gql } = require('apollo-server-express');

const employeeSchema = gql`
  type Employee {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
    createdAt: String!
    updatedAt: String!
  }

  input AddEmployeeInput {
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
  }

  input UpdateEmployeeInput {
    first_name: String
    last_name: String
    email: String
    gender: String
    designation: String
    salary: Float
    date_of_joining: String
    department: String
    employee_photo: String
  }

  type Query {
    getAllEmployees: [Employee]
    getEmployeeById(eid: ID!): Employee
    getEmployeeByDesignationOrDepartment(designation: String, department: String): [Employee]
  }

  type Mutation {
    addEmployee(input: AddEmployeeInput!): Employee

    updateEmployeeById(eid: ID!, input: UpdateEmployeeInput!): Employee

    deleteEmployeeById(eid: ID!): String
  }
`;

module.exports = employeeSchema;
