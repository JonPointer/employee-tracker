const mysql = require("mysql");
const inquirer = require("inquirer");
const logo = require('asciiart-logo');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,   // redo for Heroku  ??
    user: "root",
    password: "root",
    database: "cms_db",
});

// Function to display company header with each menu
const menuHeader = () => {
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
    // Call the company header
    menuHeader();
    // Utilize inquirer to display the menu choices
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Choose a function to perform:',
                choices: ["View Departments", "View Roles", "View Employees"],
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
                    // Call the function
                    break;
                case "View Employees":
                    // Call the function
                    break;
                default:
                    break;
            }
            menu();
        })
}

// Function to add a role


// Function to add a department


// Function to add an employee


// Function to view all roles


// Function to view all departments


// Function to view all employees


// Function to update employee roles


// const displayRoles = () => {
//     const query = "SELECT * FROM role";
//     connection.query(query, (err, res) => {
//         res.forEach(({ id, title, salary, department_id }) => {
//             console.log(
//                 `ID: ${id} || Title: ${title} || Salary: ${salary} || Department ID: ${department_id}`
//             );
//         });
//     });
// }

// Make connection and display menu
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    menu();
});