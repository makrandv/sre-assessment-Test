  /// <reference types="cypress" />
  Cypress.Commands.add('callToDoListAPI', (requestType:string,requestURL:string,payload:any,errorOnFailState:boolean):any =>{
    cy.request(
      {
      method:requestType,
      url:requestURL, 
      body:payload,
      failOnStatusCode:errorOnFailState,
  })
  })