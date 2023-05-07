/// <reference types="cypress" />
declare namespace Cypress {
    interface Chainable {
        callToDoListAPI:(requestType:string,requestURL:string,payload:any,errorOnFailState:boolean)=> Chainable<any>
    }
  }