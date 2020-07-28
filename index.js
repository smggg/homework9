const inquirer = require('inquirer');
const fs = require('fs');
const fetch = require('node-fetch')

// inquirer questions
const questions = [
    {
        type: 'input',
        message: 'What is your GitHub username?\n',
        name: 'username'
    },
    {
        type: 'input',
        message: 'What is the title of your project?\n',
        name: 'title'
    },
    {
        type: 'input',
        message: 'Enter a brief description of your project.\n',
        name: 'description'
    },
    {
        type: 'input',
        message: 'Enter directions of how to install your app.\n',
        name: 'installation',
    },
    {
        type: 'input',
        message: 'Enter how to use your app.\n',
        name: 'usage',
    },
    {
        type: 'list',
        message: 'Project License:\n',
        name: 'license',
        choices: [
            'MIT License',
            'GPLv3.0',
            'Other'
        ]
    },
    {
        type: 'input',
        message: 'Is the project open to contributions and what are the requirements?\n',
        name: 'contributing',
    },
    {
        type: 'input',
        message: 'Have any tests been done?\n',
        name: 'tests',
    }
]

console.clear()

async function main(){
    var response = await inquirer.prompt(questions)

    // create filename with no spaces.
    const filename = response.title.toLowerCase().split(' ').join('-')+'.md';

    // add badge based on license choice
    let link
    switch(response.license) {
    case ('MIT License'):
        link = 'https://img.shields.io/badge/license-MIT-blue'
        break;
    case ('GPLv3.0'):
        link = 'https://img.shields.io/badge/license-GPL-blue'
        break;
    default:
        link = ''
    }
    // fetch github user data
    let url = `https://api.github.com/users/${response.username}`
    const data = await fetch(url).then(data => data.json())

    // appends README input
    let readmeOutput =
`${(link != '') ? `![license](${link})` : ''}
# ${response.title}

${response.description}

## Table of contents
[${response.title}](#${filename})

${response.installation ? '[Installation](#installation)' : ''}

${response.usage ? '[Usage](#usage)' : ''}

${response.license ? '[License](#license)' : ''}

${response.contributing ? '[Contributing](#contributing)' : ''}

${response.tests ? '[Tests](#tests)' : ''}

[Questions](#questions)


## Installation
${response.installation}

## Usage
${response.usage}

## License
${response.license}

## Contributing
${response.contributing}

## Test
${response.tests}

## Questions
For any questions, they can be can be sent to the repo owner [${data.login}](${data.html_url})

<a href="url"><img src="${data.avatar_url}" align="left" height="100" width="100" ></a>
`
    // console.log('response:', response)
    writeMyReadme(filename,readmeOutput)
}

// function to append response and create the readme file
async function writeMyReadme(filename,output) {
    await fs.writeFile(filename,output,function(err){
        if (err){
            return console.log('SORRY WE FAILED YOU !')
        }
        console.log('The work is done !!')
    })
}

main()