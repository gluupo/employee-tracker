INSERT INTO
  department (name)
VALUES
  ("Sales"),
  ("Engineering"),
  ("Finance"),
  ("Legal");
INSERT INTO
  role (title, salary, department_id)
VALUES
  ("Accountant", 125000, 3),
  ("Account Manager", 160000, 3),
  ("Lawyer", 190000, 4),
  ("Lead Engineer", 150000, 2),
  ("Legal Team Lead", 250000, 4),
  ("Salesperson", 80000, 1),
  ("Sales Lead", 100000, 1),
  ("Softward Engineer", 120000, 2);
INSERT INTO
  employee (first_name, last_name, role_id, manager_id)
VALUES
  ("John", "Doe", 7, null),
  ("Mike", "Chan", 6, 1),
  ("Ashley", "Rodriquez", 4, null),
  ("Kevin", "Tupic", 8, 3),
  ("Kunal", "Singh", 2, null),
  ("Malia", "Brown", 1, 5),
  ("Sarah", "Lourd", 5, null),
  ("Tom", "Allen", 3, 7);