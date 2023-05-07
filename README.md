#Clearpoint - Test Automation Assessment 
Automation tool : Cypress (v12)
Scripting language :  Typescript

GIT Repo link : 

System under Test : Build deployed locally using docker-compose

Assumption : Docker image up and running

URLs :
Below are the URls 
APIs : http://localhost:3002/api/todoItems/
UI : http://localhost:3000 

Test Automation Setup

Ensure that you have Node.js and NPM installed on your machine. You can download Node.js from the official website: https://nodejs.org/en/download/

Clone the repository provide

Navigate to the root directory of the repository and run npm install to install the necessary dependencies.

Once the dependencies have been installed, 
- Run npx cypress open to open the Cypress Test Runner or 
- Run npx cypress run to run tests in UI less mode

From the Test Runner, you can select which tests you would like to run by clicking on the test file name. Alternatively, you can run all tests by clicking the "Run all specs" button.

As the tests run, you can view the results in real-time in the Test Runner interface. Any failing tests will be highlighted in red, while passing tests will be highlighted in green.

Test solution setup folder structure :
cypress >> e2e > TodoListApiTests.spec.ts :  Test file containing the all test method in Mocha format
cypress >> support : Provides implementation of the Custom commands (callToDoListAPI) used in the test methods
cypress.config.ts : Provides configuration settings for test file patterns and configurable environment URLs
Package.json : version and dependencies used by the project
tsconfig.json : Typescript complier options

Tests : 
1. Verify count of added ToDo items matches the items fetch by GET request
2. Verify on successful POST of ToDo item server return response code of 201
3. Post ToDo item with description more than 255 characters returns bad request with response code of 400
4. Post ToDo item with description same existing as ToDo item gives conflict response with error code as 409
5. Verify successful retrival of ToDo item based on valid ID provided using GET request with response code of 200
6. Verify that retriving ToDo item using GET request returns with invalid ID response with 404 error code
7. Verify that retriving ToDo item using GET request with invalid URL returns error response with 404 error code
8. Verify PUT api request on successful updation of existing ToDo items return a success response of 204
9. Verify that referencing a ToDo item with invalid ID returns 400 Bad request response
10.Verify that referencing ToDo item with invalid URL returns 404 Not found response
11 Verify to Added item from UI and read and update the item using Get and Put APIs 
