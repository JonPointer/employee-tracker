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
                    // Call the function
                    break;
                case "Update an employee's role":
                    // Call the function
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
    const query = "SELECT * FROM role";
    connection.query(query, (err, res) => {
        console.table('Company Roles:', res);
        pauseMenu();
    });
};

// Function to view all employees
const viewEmployees = () => {
    const query = "SELECT * FROM employee";
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
    });
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
};

// Function to add an employee


// Function to update employee roles



// Make connection and display menu
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    // Call the company header
    menuHeader();
    // Call the system menu
    menu();
});