// required packages
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// initalizing arrays for lists
var roleArr = [];
var managersArr = [];
var departmentsArr = [];

// define the database connection
const connection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '',
  database: 'employees'
});

// show mysql connection status
connection.connect((err) => {
  if (err) {
    console.log("Database Connection Failed!!", err);
  } else {
    console.log("Connected to Database");
  }
});

// ASCII art header
const artHeader = () => {
  console.log("");
  console.log(".oPYo.                8                               ooooo                     8                   ");
  console.log("8.                    8                                 8                       8                   ");
  console.log("`boo   ooYoYo. .oPYo. 8 .oPYo. o    o .oPYo. .oPYo.     8   oPYo. .oPYo. .oPYo. 8  .o  .oPYo. oPYo. ");
  console.log(".P     8' 8  8 8    8 8 8    8 8    8 8oooo8 8oooo8     8   8  `' .oooo8 8    ' 8oP'   8oooo8 8  `' ");
  console.log("8      8  8  8 8    8 8 8    8 8    8 8.     8.         8   8     8    8 8    . 8 `b.  8.     8     ");
  console.log("`YooP' 8  8  8 8YooP' 8 `YooP' `YooP8 `Yooo' `Yooo'     8   8     `YooP8 `YooP' 8  `o. `Yooo' 8     ");
  console.log(":.....:..:..:..8 ....:..:.....::....8 :.....::.....:::::..::..:::::.....::.....:..::...:.....:..::::");
  console.log(":::::::::::::::8 ::::::::::::::::ooP'.::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::");
  console.log(":::::::::::::::..::::::::::::::::...::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::");
  console.log("");
  console.log("");
};

// prompt user with a main menu
const promptChoice = () => {
    inquirer.prompt([
          {
            name: 'choices',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
              'View All Employees (Sorted by ID)',
              'View All Employees (Sorted by Department)',
              'View All Roles and Salaries (Sorted by ID)',
              'View All Departments (Sorted by ID)',
              'View Department Budgets (Sorted by ID)',
              'Add Employee',
              'Add Role',
              'Add Department',
              'Remove Employee',
              'Remove Role',
              'Remove Department',
              'Exit'
              ]
          }
        ])
        .then((answers) => {
          const {choices} = answers;
    
            if (choices === 'View All Employees (Sorted by ID)') {
                getAllEmployees();
            }
    
            if (choices === 'View All Departments (Sorted by ID)') {
              getAllDepartments();
          }
    
            if (choices === 'View All Employees (Sorted by Department)') {
                viewEmployeesByDepartment();
            }
    
            if (choices === 'Add Employee') {
                addEmployee();
            }
    
            if (choices === 'Remove Employee') {
                removeEmployee();
            }
    
            if (choices === 'View All Roles and Salaries (Sorted by ID)') {
                getAllRoles();
            }
    
            if (choices === 'Add Role') {
                addRole();
            }
    
            if (choices === 'Remove Role') {
                removeRole();
            }
    
            if (choices === 'Add Department') {
                addDepartment();
            }
    
            if (choices === 'View Department Budgets (Sorted by ID)') {
                viewDepartmentBudget();
            }
    
            if (choices === 'Remove Department') {
                removeDepartment();
            }
    
            if (choices === 'Exit') {
                connection.end();
            }
      });
    };

// view selections //

// view all employees
const getAllEmployees = () => {
  let sql = `SELECT
   employee.id AS ID,
   CONCAT(employee.first_name, ' ' ,employee.last_name) AS "Employee Name",
   role.title AS 'Job Title', 
   role.salary AS 'SALARY', 
   department.name AS 'Department', 
   CONCAT(e.first_name, ' ' ,e.last_name) AS "Manager Name"
   FROM employee 
   INNER JOIN role on role.id = employee.role_id 
   INNER JOIN department on department.id = role.department_id 
   LEFT JOIN employee e on employee.manager_id = e.id
   ORDER BY employee.id;`;
    connection.query(sql, (err, result) => {
        console.log('\033[2J'); // screen clear
        artHeader();
        console.log("====================================");
        console.log(`Current Employees:`);
        console.log("====================================");
        console.table(result);
        promptChoice();
    })
};

// view all roles
const getAllRoles = () => {
  let sql =` SELECT
  role.id AS ID, 
  role.title AS "Job Title",
  role.salary AS "Salary",
  department.name AS "Department"
  FROM role
  INNER JOIN department on role.department_id = department.id
  ORDER BY role.id;`;
    connection.query(sql , (err, result) => {
        console.log('\033[2J'); // screen clear
        artHeader();
        console.log("====================================");
        console.log(`Current Roles:`);
        console.log("====================================");
        console.table(result);
        promptChoice();
    })
};

// view all departments
const getAllDepartments = () => {
  let sql = `SELECT 
  department.id AS ID, 
  department.name AS "Department Name" 
  FROM department;`;
    connection.query(sql, (err, result) => {
        console.log('\033[2J'); // screen clear
        artHeader();
        console.log("====================================");
        console.log(`Current Departments:`)
        console.log("====================================");
        console.table(result);
        promptChoice();
    })
};

// view all employees by department
const viewEmployeesByDepartment = () => {
  let sql = `SELECT
  employee.id AS ID, 
  CONCAT(employee.first_name, ' ' ,employee.last_name) AS "Employee Name",
  department.name AS Department FROM employee 
  JOIN role ON employee.role_id = role.id 
  JOIN department ON role.department_id = department.id 
  ORDER BY department.name;`;
    connection.query(sql, (err, result) => {
        console.log('\033[2J'); // screen clear
        artHeader();
        console.log("====================================");
        console.log(`Employees by Department:`);
        console.log("====================================");
        console.table(result);
        promptChoice();
    })
};

// view all departments by budget
const viewDepartmentBudget = () => {
  let sql = `SELECT 
  department_id AS ID, 
  department.name AS 'Department',
  SUM(salary) AS 'Budget'
  FROM role  
  INNER JOIN department ON role.department_id = department.id 
  GROUP BY  role.department_id`;
  connection.query(sql, (err, result) => {
        console.log('\033[2J'); // screen clear
        artHeader();
        console.log("====================================");
        console.log(`Budget By Department:`);
        console.log("====================================");
        console.table(result);
        promptChoice();
    })
};

// menu for choosing a role
function selectRole() {
  connection.query("SELECT * FROM role", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }

  })
  return roleArr;
}

// menu for choosing a manager
function selectManager() {
  connection.query("SELECT first_name, last_name FROM employee", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managersArr.push(res[i].first_name);
    }

  })
  return managersArr;
}

// menu for choosing a department
function selectDepartment() {
  connection.query("SELECT name FROM department", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      departmentsArr.push(res[i].name);
    }

  })
  return departmentsArr;
}

// function to add a new employee
function addEmployee() { 
  inquirer.prompt([
      {
        name: "firstName",
        type: "input",
        message: "Enter their First Name: "
      },
      {
        name: "lastName",
        type: "input",
        message: "Enter their Last Name: "
      },
      {
        name: "role",
        type: "list",
        message: "Choose their Job Title: ",
        choices: selectRole()
      },
      {
          name: "manager",
          type: "rawlist",
          message: "Choose their Managers Name:",
          choices: selectManager()
      }
  ]).then(function (res) {
    var roleId = selectRole().indexOf(res.role) + 1
    var managerId = selectManager().indexOf(res.manager) + 1
    console.log(managerId);
    connection.query("INSERT INTO employee SET ? ", 
    {
        first_name: res.firstName,
        last_name: res.lastName,
        manager_id: managerId,
        role_id: roleId
        
    }, function(err){
        if (err) throw err
        console.log('\033[2J'); // screen clear
        artHeader();
        console.log("====================================");
        console.table("Employee Successfully Added");
        console.log("====================================");
        promptChoice();
    })

})
}

// function to add a new role
function addRole() { 
  connection.query("SELECT role.title AS Title, role.salary AS Salary FROM role",   function(err, res) {
    inquirer.prompt([
        {
          name: "Title",
          type: "input",
          message: "What is the roles Title?"
        },
        {
          name: "Salary",
          type: "input",
          message: "What is the Salary?"

        },
        {
          name: "department",
          type: "rawlist",
          message: "Choose their Department:",
          choices: selectDepartment()
        }
    ]).then(function(res) {
      var departmentId = selectDepartment().indexOf(res.department) + 1
        connection.query(
            "INSERT INTO role SET ?",
            {
              title: res.Title,
              salary: res.Salary,
              department_id: departmentId
            },
            function(err) {
                if (err) throw err
                console.log('\033[2J'); // screen clear
                artHeader();
                console.log("====================================");
                console.table("Role Successfully Added");
                console.log("====================================");
                promptChoice();
            }
        )

    });
  });
  }

// function to add a new department
function addDepartment() { 

  inquirer.prompt([
      {
        name: "name",
        type: "input",
        message: "What Department would you like to add?"
      }
  ]).then(function(res) {
      var query = connection.query(
          "INSERT INTO department SET ?",
          {
            name: res.name
          
          },
          function(err) {
              if (err) throw err
              console.log('\033[2J'); // screen clear
              artHeader();
              console.log("====================================");
              console.log(`Department Successfully Added`);
              console.log("====================================");
              promptChoice();
          }
      )
  })
}

// delete an employee
const removeEmployee = () => {
    let sql =     `SELECT employee.id, employee.first_name, employee.last_name FROM employee`;

    connection.query(sql, (error, response) => {
      if (error) throw error;
      let employeeNamesArray = [];
      response.forEach((employee) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);});

      inquirer
        .prompt([
          {
            name: 'chosenEmployee',
            type: 'list',
            message: 'Which employee would you like to remove?',
            choices: employeeNamesArray
          }
        ])
        .then((answer) => {
          let employeeId;

          response.forEach((employee) => {
            if (
              answer.chosenEmployee ===
              `${employee.first_name} ${employee.last_name}`
            ) {
              employeeId = employee.id;
            }
          });

          let sql = `DELETE FROM employee WHERE employee.id = ?`;
          connection.query(sql, [employeeId], (error) => {
            if (error) throw error;
            console.log('\033[2J'); // screen clear
            artHeader();
            console.log("====================================");
            console.log(`Employee Successfully Removed`);
            console.log("====================================");
            promptChoice();
          });
        });
    });
  };

// delete a role
const removeRole = () => {
    let sql = `SELECT role.id, role.title FROM role`;

    connection.query(sql, (error, response) => {
      if (error) throw error;
      let roleNamesArray = [];
      response.forEach((role) => {roleNamesArray.push(role.title);});

      inquirer
        .prompt([
          {
            name: 'chosenRole',
            type: 'list',
            message: 'Which role would you like to remove?',
            choices: roleNamesArray
          }
        ])
        .then((answer) => {
          let roleId;

          response.forEach((role) => {
            if (answer.chosenRole === role.title) {
              roleId = role.id;
            }
          });

          let sql =   `DELETE FROM role WHERE role.id = ?`;
          connection.query(sql, [roleId], (error) => {
            if (error) throw error;
            console.log('\033[2J'); // screen clear
            artHeader();
            console.log("====================================");
            console.log(`Role Successfully Removed`);
            console.log("====================================");
            promptChoice();
          });
        });
    });
  };

// delete a department
const removeDepartment = () => {
    let sql =   `SELECT department.id, department.name FROM department`;
    connection.query(sql, (error, response) => {
      if (error) throw error;
      let departmentNamesArray = [];
      response.forEach((department) => {departmentNamesArray.push(department.name);});

      inquirer
        .prompt([
          {
            name: 'chosenDept',
            type: 'list',
            message: 'Which department would you like to remove?',
            choices: departmentNamesArray
          }
        ])
        .then((answer) => {
          let departmentId;

          response.forEach((department) => {
            if (answer.chosenDept === department.name) {
              departmentId = department.id;
            }
          });

          let sql =     `DELETE FROM department WHERE department.id = ?`;
          connection.query(sql, [departmentId], (error) => {
            if (error) throw error
            console.log('\033[2J'); // screen clear
            artHeader();
            console.log("====================================");
            console.log(`Department Successfully Removed`);
            console.log("====================================");
            promptChoice();
          });
        });
    });
};

// define starting the application
const start = () => promptChoice();

// start the application
start();

