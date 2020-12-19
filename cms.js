const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,   // redo for Heroku  ??
    user: "root",
    password: "root",
    database: "cms_db",
});
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    displayRoles();  // Test to see if connection is working
});

const displayRoles = () => {
    const query = "SELECT * FROM role";
    connection.query(query, (err, res) => {
        res.forEach(({ id, title, salary, department_id }) => {
            console.log(
                `ID: ${id} || Title: ${title} || Salary: ${salary} || Department ID: ${department_id}`
            );
        });
    });
}

