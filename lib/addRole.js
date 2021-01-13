const inquirer = require('inquirer');

function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the title of the role?',
            name: 'roleTitle'
        },
        {
            type: 'number',
            message: 'What is the salary of this role?',
            name: 'roleSalary'
        },
        {
            type: 'list',
            message: 'Which department does this role belong to?',
            name: 'roleDepartment',
            choices:  // have the choices array populated by the contents of the departments table
        }
    ]).then((data) => {
        // BONUS: check to see if the role doesnt already exsists
        // if the role does not already exsist add it to the roles table
        // return back to the main menu
    });
}

module.exports = addRole;