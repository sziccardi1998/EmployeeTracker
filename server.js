const mysql = require("mysql");
const inquirer = require("inquirer");

// import other functions

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: "", // This will need to be added by the user
    database: "employee_DB" 
});

connection.connect(err => {
    if (err) throw err;
    console.log("Conencted as id" + connection.threadId);
});

function optionTree() {
    inquirer.prompt([{
        type: 'list',
        message: 'What would you like to do?',
        name: 'selection',
        choices: ['View all employees', 'View employees by department', 'Update employee role', 'View employees by role', 'Add department', 'Add role', 'Add employee', 'Exit'],
    }]).then((data) => {
        let userChoice = data.selection;

        // create list of departments to be passed
        let departmentArray = [];
        connection.query("SELECT * FROM department", function(err, res) {
            if (err) throw err;
            for(let i = 0; i < res.length; i++){
                departmentArray.push(res[i].name);
            }
        })
        
        // create list of managers
        let managerArray =["None"];
        connection.query("SELECT * FROM employee", function(err, res) {
            if (err) throw err;
            for(let i = 0; i < res.length; i++) {
                managerArray.push(res[i].first_name + " " + res[i].last_name);
            }
        })

        // create list of roles
        let roleArray = [];
        connection.query("SELECT * FROM role", function(err, res) {
            if (err) throw err;
            for(let i = 0; i < res.length; i++) {
                roleArray.push(res[i].title);
            }
        })

        let roleHolder2 = roleArrayCreator();

        // build a case-switch tree that performs a different task for each choice
        // each case should have a function that is used
        switch (userChoice) {
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'View employees by department':
                viewDepartments();
                break;
            case 'View employees by role':
                viewRoles();
                break;
            case 'Add department':
                addDepartment();
                break;
            case 'Add role':
                addRole(departmentArray);
                break;
            case 'Add employee':
                addEmployee(roleArray, managerArray);
                break;
            case 'Update employee role':
                updateRole(roleHolder2);
                break;
            case 'Exit':
                connection.end();
                break;
        }
    })
}

// Begining of functions

// create function that adds a new department to the department table
const addDepartment = () => {
    // prompt for the department name
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the department name?',
            name: 'department'   
        }
    ]).then((data) => {
            // BONUS: check to see if that department already exsists
            var departmentName = data.department;
            // if the department does not exsist add it to the table
            connection.query(
                "INSERT INTO department SET ?",
                {
                    name: departmentName
                },
                function(err, res) {
                    if (err) throw err;
                    console.log("\nDepartment created!\n");
                    optionTree();

                }
            );
        })
}

// create a function that adds a new role to the roles database
const addRole = (deptArray) => {
    // get the name, salary and department of the new role
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
                     choices: deptArray
                }
            ]).then((data) => {
                // get the selected departments id
        connection.query(
        "SELECT * FROM department WHERE ?",
        {
            name: data.roleDepartment
        },
        function(err, res) {
            if (err) throw err;
            // pass all needed information along
            buildRole(data.roleTitle, data.roleSalary, res[0].id);
        })
    })
}

// create call back to finish building the new role
const buildRole = (job, pay, departmentID) => {
    connection.query(
        "INSERT INTO role SET ?", {
            title: job,
            salary: pay,
            department_id: departmentID
        },
        function(err, res) {
            if (err) throw err;
            console.log("\nRole added!\n");
            optionTree();
        }
    )
}

// create function that adds a new employee
const addEmployee = (roleList, managerList) => {
    // get the name, role and manager of the employee
    inquirer.prompt([
    {
        type: 'input',
        message: 'What is the first name of the employee?',
        name: 'firstName'
    },
    {
        type: 'input',
        message: 'What is the last name of the employee?',
        name: 'lastName'
    },
    {
        type: 'list',
        message: 'What is the role of this employee?',
        choices: roleList,
        name: 'employeeRole'
    },
    {
        type: 'list',
        message: 'Who is the manager of this employee?',
        choices: managerList,
        name: 'employeeManager'
    }
]).then((data) => {
    // get the id of the manager and role
    let employeeFirst = data.firstName;
    let employeeLast = data.lastName;
    let roleID;
    if (data.employeeManager === "None") {
        connection.query(
            "SELECT * FROM role WHERE ?",
            {
                title: data.employeeRole
            },
            function(err, res) {
                if (err) throw err;
                roleID = res[0].id;
                employeeNoManager(data.firstName, data.lastName, roleID);                
            }
        )
    }
    else {
        let splitName = data.employeeManager.split(" ");
        let managerFirstName = splitName[0];
        let managerLastName = splitName[1];
        console.log(managerFirstName);
        connection.query(
            "SELECT * FROM role WHERE ?",
            {
                title: data.employeeRole
            },
            function(err, res) {
                if (err) throw err;
                roleID = res[0].id;
                getManagerID(managerFirstName, managerLastName, roleID, employeeFirst, employeeLast);
            }
        )
        
    }
})

} 

// create function to add an employee without a manager
const employeeNoManager = (first, last, role) => {
    connection.query(
        "INSERT INTO employee SET ?",
        {
            first_name: first,
            last_name: last,
            role_id: role
        },
        function(err, res) {
            if (err) throw err;
            console.log("\nEmployee added!\n");
            optionTree();
        }
    );
}

const getManagerID = (first, last, roleID, empFirst, empLast) => {
    let passedFirst = empFirst;
    let passedLast = empLast;
    connection.query(
        "SELECT * FROM employee WHERE ? AND ?",
        [{
            first_name: first
        },{
            last_name: last
        }],
        function(err, res) {
            if (err) throw err;
            managerID = res[0].id;
            console.log(managerID);
            employeeWithManager(passedFirst, passedLast, roleID, managerID);
        }
    )
}

// create function to add an employee with a manager
const employeeWithManager = (first, last, role, manager) => {
    connection.query(
        "INSERT INTO employee SET ?",
        {
            first_name: first,
            last_name: last,
            role_id: role,
            manager_id: manager
        },
        function(err, res) {
            if (err) throw err;
            console.log("\nEmployee added!\n");
            optionTree();
        }
    );
}

// create function that displays employees by department
const viewDepartments = () => {
    // get the name and department of each employee
    connection.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id", 
    function (err, res) {
        if(err) throw err;
        console.table(res);
        optionTree();
    });
}

// create function that displays employees by role
const viewRoles = () => {
    // get the name and role of each employee
    connection.query("SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id",
    function (err, res) {
        if (err) throw err;
        console.table(res);
        optionTree();
    });
}

// create function that shows all information for each employee
const viewAllEmployees = () => {
    // get id, name, title, department, salary, manager
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS Department, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id LEFT JOIN employee manager on employee.manager_id = manager.id;",
    function(err, res) {
        if (err) throw err;
        console.table(res);
        optionTree();
    });
}

var roleHolder = [];
function roleArrayCreator()  {
    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;
        for(var i = 0; i < res.length; i++) {
            roleHolder.push(res[i].title);
        }
    })
    return roleHolder;
}

var employeeHolder = [];
function employeeArrayCreator() {
    connection.query("SELECT * FROM employee", function(err, res) {
        if (err) throw err;
        for(let i = 0; i < res.length; i++) {
            employeeHolder.push(res[i].first_name + " " + res[i].last_name);
        }
    })
    return employeeHolder;
}

// create function that allows user to update an employees role
let updateRole = (roleList) => {
    // prompt the user for the employee being changed and their new role

    connection.query("SELECT employee.first_name, employee.last_name FROM employee", function(err, res) {
        if (err) throw err;

        inquirer.prompt([{
            type: "list",
            name: "changedEmployee",
            message: "Which employee would you like to update?",
            choices: function() {
                let employees = [];
                for (let k = 0; k < res.length; k++) {
                    employees.push(res[k].first_name + " " + res[k].last_name);
                }
                return employees;
            },
        },
        {
            type: 'list',
            name: 'updatedRole',
            message: 'What is the new role of the employee?',
            choices: roleList
        }])
    .then((data) => {
        let splitName = data.changedEmployee.split(" ");
        let empFirstName = splitName[0];
        let empLastName = splitName[1];
        let roleID = roleList.indexOf(data.updatedRole) + 1;
        updateEmployee(empFirstName, empLastName, roleID);
    })})
}

const updateEmployee = (empFirstName, empLastName, positionID) => {
    connection.query("UPDATE employee SET ? WHERE ? AND ?",  [{
        role_id: positionID
    },
    {
        first_name: empFirstName
    },
    {
        last_name: empLastName
    }], 
    function(err, results) {
        if (err) throw err
        console.log("Employee updated!");
        optionTree();
    })
}

optionTree();