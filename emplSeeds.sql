DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
id INT NOT NULL AUTO_INCREMENT,
title VARCHAR(30) NOT NULL,
salary DECIMAL(10,2) NOT NULL,
dept_id INT NOT NULL,
PRIMARY KEY (id)
);

CREATE TABLE department (
id INT NOT NULL AUTO_INCREMENT,
name VARCHAR(30) NOT NULL,
PRIMARY KEY (id)
);


-- Load department table
INSERT INTO department (name)
VALUES ("Human Resources"),
       ("Finance"),
       ("Sales & Marketing"),
       ("Warehouse"),
       ("Information Tech");

-- Load role table
INSERT INTO role (title, salary, dept_id)
VALUES ("HR Rep", 40000.00, 1),
       ("HR Manager", 55000.00, 1),
       ("Accounting Clerk", 45000.00, 2),
       ("Finance Manager", 60000.00, 2),
       ("Inside Sales", 50000.00, 3),
       ("Outside Sales", 55000.00, 3),
       ("Sales & Mktg Manager", 65000.00, 3),
       ("Stock Clerk", 35000.00, 4),
       ("Whse Manager", 45000.00, 4),
       ("Junior Developer", 50000.00, 5),
       ("Senior Developer", 75000.00, 5),
       ("IT Manager", 85000.00, 5);

-- Load employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jack", "Jones", 1, 2),
       ("Jill", "White", 2, NULL),
       ("Bill", "Greene", 3, 4),
       ("Lisa", "Arenas", 4, NULL),
       ("Chuck", "Magee", 5, 7),
       ("Bob", "Brown", 6, 7),
       ("Phil", "Gallager", 7, NULL),
       ("Billy", "Gofur", 8, 9),
       ("Jim", "Smith", 9, NULL),
       ("Carl", "DeSantis", 10, 12),
       ("Tony", "Jackson", 11, 12),
       ("Ken", "Kowalski", 12, NULL);