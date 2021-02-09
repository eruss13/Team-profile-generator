const inquirer = require("inquirer");
const fs = require("fs");
const style = require("./styling/css")

// const Employee = require("./lib/employee")
const Engineer = require("./lib/engineer")
const Manager = require("./lib/manager")
const Intern = require("./lib/intern")

let finalTeamArray = [];

function startingPrompt() {
    inquirer.prompt([
        {
            message: "Welcome to Team Profile Generator! Please write your team name:",
            name: "teamname"
        }
    ])
        .then(function(data){
            const teamName = data.teamname
            finalTeamArray.push(teamName)
            addManager();
        })
}

function addManager() {
    inquirer.prompt([
        {
            message: "What is the team manager's name?",
            name: "name"
        },
        {
            message: "What is the team manager's employee ID?",
            name: "id"
        },
        {
            message: "What is the team manager's email address?",
            name: "email"
        },

        {
            type: "number",
            message: "What is the team manager's office number?",
            name: "officeNumber"
        },
    ])

        .then(function (data) {
            const name = data.name
            const id = data.id
            const email = data.email
            const officeNumber = data.officeNumber
            const teamMember = new Manager(name, id, email, officeNumber)
            finalTeamArray.push(teamMember)
            addTeamMembers();
        });
}

function addTeamMembers() {
    inquirer.prompt([
        {
            type: "list",
            message: "Would you like to add more team members?",
            choices: ["Yes, add an engineer", "Yes, add an intern", "No, my team is complete"],
            name: "addMemberData"
        }
    ])

        .then(function (data) {

            switch (data.addMemberData) {
                case "Yes, add an engineer":
                    addEngineer();
                    break;
                case "Yes, add an intern":
                    addIntern();
                    break;
                case "No, my team is complete":
                    compileTeam();
                    break;
            }
        });
}

function addEngineer() {
    inquirer.prompt([
        {
            message: "What is the engineer's name?",
            name: "name"
        },
        {
            message: "What is the engineer's employee ID?",
            name: "id"
        },
        {
            message: "What is the engineer's email address?",
            name: "email"
        },
        {
            message: "What is the engineer's Github profile?",
            name: "github"
        }
    ])

        .then(function (data) {
            const name = data.name
            const id = data.id
            const email = data.email
            const github = data.github
            const teamMember = new Engineer(name, id, email, github)
            finalTeamArray.push(teamMember)
            addTeamMembers()
        });
};

function addIntern() {
    inquirer.prompt([
        {
            message: "What is the intern's name?",
            name: "name"
        },
        {
            message: "What is the intern's employee ID?",
            name: "id"
        },
        {
            message: "What is the intern's email address?",
            name: "email"
        },
        {
            message: "What is the intern's school?",
            name: "school"
        }
    ])

        .then(function (data) {
            const name = data.name
            const id = data.id
            const email = data.email
            const school = data.school
            const teamMember = new Intern(name, id, email, school)
            finalTeamArray.push(teamMember)
            addTeamMembers()
        });
};

function compileTeam() {
    console.log("Your team is complete!")

    const htmlArray = []
    const htmlBeginning = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>${finalTeamArray[0]}</title>
        <link href="https://fonts.googleapis.com/css?family=Bebas+Neue&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous">
        <style>
        ${style}
        </style>
        
    </head>
    <body>
    <div class="banner-bar">
        <h1>${finalTeamArray[0]}</h1>
    </div>
    <div class="card-container">
    `
    htmlArray.push(htmlBeginning);

    for (let i = 1; i < finalTeamArray.length; i++) {
        let object = `
        <div class="member-card">
            <div class="card-top">
                <h2>${finalTeamArray[i].name}</h2>
                `
                if(finalTeamArray[i].title === "Manager") {
                    object += `
                    <h3>${finalTeamArray[i].title} <i class="fas fa-coffee"></i></h3>
                    `
                }
                if(finalTeamArray[i].title === "Engineer") {
                    object += `
                    <h3>${finalTeamArray[i].title} <i class="fas fa-code-branch"></i></h3>
                    `
                }
                if (finalTeamArray[i].title === "Intern") {
                    object += `
                    <h3>${finalTeamArray[i].title} <i class="fas fa-user-graduate"></i></h3>
                    `
                }
                object += `
                </div>
                
            <div class="card-bottom">
                <p><i class="far fa-id-badge"></i> Employee ID: ${finalTeamArray[i].id}</p>
                <p><i class="far fa-envelope"></i> Email: <a href="mailto:${finalTeamArray[i].email}">${finalTeamArray[i].email}</a></p>
        `
        if (finalTeamArray[i].officeNumber) {
            object += `
            <p><i class="far fa-building"></i> Office #: ${finalTeamArray[i].officeNumber}</p>
            `
        }
        if (finalTeamArray[i].github) {
            object += `
            <p><i class="fab fa-github"></i> GitHub: <a href="https://github.com/${finalTeamArray[i].github}" target="_blank" >${finalTeamArray[i].github} </a></p>
            `
        }
        if (finalTeamArray[i].school) {
            object += `
            <p><i class="fas fa-school"></i> School: ${finalTeamArray[i].school}</p>
            `
        }
        object += `
        </div>
        </div>
        `
        htmlArray.push(object)
    }

    const htmlEnd = `
    </div>
    </body>
    </html>
    `
    htmlArray.push(htmlEnd);

    fs.writeFile(`./dist/${finalTeamArray[0]}.html`, htmlArray.join(""), function (err) {
            
    })
}

startingPrompt();
