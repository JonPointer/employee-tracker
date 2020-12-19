-- Create and use the Content Management System DB.
CREATE DATABASE cms_db;
USE cms_db;

-- Create the 'department' table
CREATE TABLE department (
  id INT NOT NULL PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

-- Create the 'role' table
CREATE TABLE role (
id INT NOT NULL PRIMARY KEY,
title VARCHAR(30) NOT NULL,
salary DECIMAL(10,2) NOT NULL,
department_id INT NOT NULL
);

-- Create the 'employee' table
CREATE TABLE employee (
id INT NOT NULL PRIMARY KEY,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT NOT NULL,
manager_id INT
);

-- Seed the tables with some initial data
INSERT INTO department (id, name) VALUES (1, "Corporate"), (2, "Engineering"), (3, "Marketing");
INSERT INTO role (id, title, salary, department_id) VALUES (11, "CEO", 1000000, 1), (12, "President", 500000, 1), (21, "Engineering Manager", 200000, 2), (22, "Mechanical Engineer", 100000, 2), (23, "Software Engineer", 150000, 2), (31, "Marketing Manager", 225000, 3), (32, "Account Rep", 125000, 3), (33, "Market Analyst", 200000, 3);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (1, "Chuck", "Brimage", 11, 1), (2, "Larry", "Preston", 21, 1), (3, "Bill", "Parker", 22, 2), (4, "Phil", "Thompson", 31, 1); 

-- Select and display the tables
SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;