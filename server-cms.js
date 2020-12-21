const mysql = require("mysql");
const inquirer = require("inquirer");
const logo = require('asciiart-logo');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,   // redo for Heroku  ??
    user: "root",
    password: "root",
    database: "cms_db",
});

// Function to display company header with each menu
const menuHeader = () => {
    // Clear the console
    console.clear();
    console.log(
        logo({
            name: 'Hughes Drill Bits Co.',
            font: 'Standard',
            lineChars: 35,
            padding: 2,
            margin: 3,
            borderColor: 'grey',
            logoColor: 'bold-green',
            textColor: 'green',
        })
            .center('Company Content Management System')
            .render()
    );
}

const menu = () => {
    // Utilize inquirer to display the menu choices
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Choose a function to perform:',
                choices: [new inquirer.Separator('---- View a Database Table ----'), "View Departments", "View Roles", "View Employees",
                new inquirer.Separator('---- Add to a Database Table ----'), "Add a Department", "Add a Role", "Add an Employee",
                new inquirer.Separator('---- Update a Database Table ----'), "Update an employee's role",
                new inquirer.Separator('---- Exit ----'), "Exit"],
                name: 'choice',
            },

        ])
        .then((response) => {
            // Choose which class to call depending on the employee's role
            switch (response.choice) {
                case "View Departments":
                    viewDepartments();
                    break;
                case "View Roles":
                    viewRoles();
                    break;
                case "View Employees":
                    viewEmployees();
                    break;
                case "Add a Department":
                    addDepartment();
                    break;
                case "Add a Role":
                    addRole();
                    break;
                case "Add an Employee":
                    addEmployee();
                    break;
                case "Update an employee's role":
                    updateEmployeeRole();
                    break;
                case "Exit":
                    // Exit from the program
                    process.exit();
                    break;
                default:
                    break;
            }
        })
}

// Function to pause for input and then call top menu
const pauseMenu = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Hit Enter to Continue',
                name: 'continue',
            },
        ])
        .then((response) => {
            console.clear();
            menuHeader();
            menu();
        })
};

// Function to view all departments
const viewDepartments = () => {
    const query = "SELECT * FROM department";
    connection.query(query, (err, res) => {
        console.table('Company Departments:', res);
        pauseMenu();
    });
};

// Function to view all roles
const viewRoles = () => {
    let query = "SELECT a.id, a.title, a.salary, b.name FROM role a "
    query += "INNER JOIN department b ON a.department_id = b.id";
    connection.query(query, (err, res) => {
        console.table('Company Roles:', res);
        pauseMenu();
    });
};

// Function to view all employees
const viewEmployees = () => {
    let query = "SELECT a.id, a.first_name, a.last_name, b.title, c.name AS 'department', b.salary, CONCAT(d.first_name, ' ',d.last_name) as 'manager' FROM employee a ";
    query += "INNER JOIN role b ON a.role_id = b.id ";
    query += "INNER JOIN department c ON b.department_id = c.id ";
    query += "LEFT JOIN employee d ON a.manager_id = d.id";

    connection.query(query, (err, res) => {
        console.table('Company Employees:', res);
        pauseMenu();
    });
};

// Function to add a department
const addDepartment = () => {
    // Prompt for department information
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'Enter Name of New Department:',
                name: 'department',
            },
        ])
        .then((response) => {
            // Make sure this department doesn't already exist
            const query = "SELECT * FROM department WHERE name = (?);";
            connection.query(query, response.department, (err, res) => {
                if (err) throw err;
                if (res[0]) {
                    console.log(`Department ${response.department} already exists`);
                    viewDepartments();
                } else {
                    const query = "INSERT INTO department (name) VALUES (?);";
                    connection.query(query, response.department, (err, res) => {
                        if (err) throw err;
                        console.log(`Department ${response.department} Added`);
                        viewDepartments();
                    });

                }


            });
        });
};

// Function to add a role
const addRole = () => {
    // Store current departments
    let currentDepartments = [];
    connection.query("SELECT name FROM department;", (err, res) => {
        if (err) throw err;
        currentDepartments = res;
        // Prompt for role information
        inquirer
            .prompt([
                {
                    type: 'input',
                    message: 'Enter Title of New Role:',
                    name: 'title',
                },
            ])
            .then((response) => {
                // Make sure this role doesn't already exist
                const query = "SELECT * FROM role WHERE title = (?);";
                connection.query(query, response.title, (err, res) => {
                    if (err) throw err;
                    if (res[0]) {
                        console.log(`Role of ${response.title} already exists`);
                        viewRoles();
                    } else {
                        // Ask for other role information
                        inquirer
                            .prompt([
                                {
                                    type: 'number',
                                    message: `Enter ${response.title} Salary:`,
                                    name: 'salary',
                                },
                                {
                                    type: 'list',
                                    message: `Choose the Department for ${response.title}:`,
                                    choices: currentDepartments,
                                    name: 'department',
                                },
                            ])
                            .then((secondResponse) => {
                                // Get the id for the chosen department
                                connection.query("SELECT id FROM department WHERE name = ?;", secondResponse.department, (err, res2) => {
                                    if (err) throw err;
                                    // Add this role to the database
                                    const query = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
                                    connection.query(query, [response.title, secondResponse.salary, res2[0].id], (err, res) => {
                                        if (err) throw err;
                                        console.log(`Role ${response.title} Added`);
                                        viewRoles();
                                    })
                                });
                            })
                    };
                });
            });
    });
};

// Function to add an employee
const addEmployee = () => {
    // Get list of current roles
    let currentRoles = [];
    connection.query("SELECT title as 'name' FROM role;", (err, res) => {
        if (err) throw err;
        currentRoles = res;
        // Get list of current employees for managers - start with none
        let currentEmployees = [];
        connection.query("SELECT CONCAT(first_name, ' ',last_name) as name FROM employee;", (err, res2) => {
            if (err) throw err;
            currentEmployees = res2;
            // Prompt for input on new employee
            inquirer
                .prompt([
                    {
                        type: 'input',
                        message: 'Enter First Name:',
                        name: 'first',
                    },
                    {
                        type: 'input',
                        message: 'Enter Last Name:',
                        name: 'last',
                    },
                    {
                        type: 'list',
                        message: `Select their Role:`,
                        choices: currentRoles,
                        name: 'role',
                    },
                    {
                        type: 'list',
                        message: `Select their Manager:`,
                        choices: currentEmployees,
                        name: 'manager',
                    },
                ])
                .then((response) => {
                    // Get the id for the chosen role
                    connection.query("SELECT id FROM role WHERE title = ?;", response.role, (err, res3) => {
                        if (err) throw err;
                        // Get the id for the chosen manager
                        connection.query("SELECT id FROM employee WHERE CONCAT(first_name, ' ',last_name) = ?;", response.manager, (err, res4) => {
                            if (err) throw err;
                            // Add this employee to the database
                            const query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                            connection.query(query, [response.first, response.last, res3[0].id, res4[0].id], (err, res) => {
                                if (err) throw err;
                                console.log(`Employee Added`);
                                viewEmployees();
                            })
                        });

                    });
                })
        });
    });
}

// Function to update employee roles
const updateEmployeeRole = () => {

}


// Make connection and display menu
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    // Call the company header
    menuHeader();
    // Call the system menu
    menu();
});