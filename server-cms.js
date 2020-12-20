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
                    // Call the function
                    break;
                case "View Roles":
                    viewRoles();
                    break;
                case "View Employees":
                    // Call the function
                    break;
                case "Add a Department":
                    // Call the function
                    break;
                case "Add a Role":
                    // Call the function
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

// Function to view all roles
const viewRoles = () => {
    const query = "SELECT * FROM role";
    connection.query(query, (err, res) => {
        console.table('Company Roles:', res);
        pauseMenu();
    });
};

// Function to view all departments


// Function to view all employees


// Function to add a role


// Function to add a department


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