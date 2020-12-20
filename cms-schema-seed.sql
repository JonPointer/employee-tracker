-- Create and use the Content Management System DB.
CREATE DATABASE cms_db;
USE cms_db;

-- Create the 'department' table
CREATE TABLE department (
  id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

-- Create the 'role' table
CREATE TABLE role (
id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
title VARCHAR(30) NOT NULL,
salary DECIMAL(10,2) NOT NULL,
department_id INT NOT NULL
);

-- Create the 'employee' table
CREATE TABLE employee (
id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT NOT NULL,
manager_id INT
);

-- Seed the tables with some initial data
INSERT INTO department (name) VALUES ("Corporate"), ("Engineering"), ("Marketing");
INSERT INTO role (title, salary, department_id) VALUES ("CEO", 1000000, 1), ("President", 500000, 1), ("Engineering Manager", 200000, 2), ("Mechanical Engineer", 100000, 2), ("Software Engineer", 150000, 2), ("Marketing Manager", 225000, 3), ("Account Rep", 125000, 3), ("Market Analyst", 200000, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Chuck", "Brimage", 1, NULL), ("Larry", "Preston", 3, 1), ("Bill", "Parker", 4, 2), ("Phil", "Thompson", 6, 1); 

-- Select and display the tables
SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;