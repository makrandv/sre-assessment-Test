/// <reference types="cypress" />

//To generate random string
import { v4 as uuidv4 } from "uuid";

context("Sre-Assessment Test Suite", () => {
  const BASEURL = Cypress.env("base_url_api");
  const BASEAPPURL = Cypress.env("base_url_ui");

  //Mark all the existing (if any) ToDo Items from the list as Completed
  beforeEach("Test Setup", () => {
    cy.request("GET", BASEURL)
      .then((response) => {
        response.body.forEach((toDoItem) => {
          let toDoItemBody = {
            id: toDoItem.id,
            description: toDoItem.description,
            isCompleted: true,
          };
          cy.callToDoListAPI("PUT", BASEURL + toDoItem.id, toDoItemBody, true);
          cy.log("ToDo Item :" + toDoItem.id + " marked Completed");
        });
      })
      .then(() => {
        cy.request("GET", BASEURL).then((response) => {
          expect(response.body.length).to.equals(0);
        });
      });
  });

  //Verify GET Request API
  //Scenario : Verify count of added ToDo items matches the items fetch by GET request
  context("GET Request", () => {
    context("Success request", () => {
      it("Success - 200 : Gets list of ToDoItems Added to List", () => {
        const ITEMSTOADD = 5;

        //Adding some ToDo items
        for (let iCount = 0; iCount < ITEMSTOADD; iCount++) {
          let payLoad = {
            description: "ToDoItem_" + uuidv4(),
          };
          cy.callToDoListAPI("POST", BASEURL, payLoad, false);
        }

        //Verify count fetched by GET request matches count of items added by POST request
        cy.request("GET", BASEURL).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.length).to.be.eqls(ITEMSTOADD);
        });
      });
    });
  });

  //Verify POST Request API
  context("POST Request", () => {
    //Generating ToDo description with random values
    let postToDoItem = "ToDoItem_" + uuidv4();

    context("Success request", () => {
      //Scenario :
      //1.Verify on successful Posting of ToDo item server return response code of 201
      //2.Verify posted ToDo item can be fetch successfully
      it("Success - 201 : Post items in ToDoItems", () => {
        let payload = {
          description: postToDoItem,
        };
        //Add new item to ToDo list
        cy.callToDoListAPI("POST", BASEURL, payload, true).then((response) => {
          expect(response.status).to.eqls(201);

          //Verify if the item is added ToDo list by using ID
          cy.request("GET", BASEURL + response.body).then((response) => {
            expect(response.status).to.be.eqls(200);
          });
        });
      });
    });

    context("Bad Request , Conflict", () => {
      //Scenario : Posting ToDo item with description more than 255 characters returns bad request with response code of 400
      it("Bad Request - 400 : Posting ToDo Item with description > 255 Characters", () => {
        //255 Character string
        let payload = {
          description:
            "HuHD3vzwIIzQWVqf5HZVmCpZuubeTUMMqVjh9uKb3y8E0KmW8WH" +
            "avqufhMZ8n2nFr9HgZOjuPMTQ3v73f4XvV1DnVmfGPCW4uPCsPtS" +
            "xtGKxLpXAWwoOR5RVge1mZtsMAT4hNOgnLa6kUT7wkYPJeENfzQGw8" +
            "iVabbx9yzGYCEPoR1dhQ6cGkOaRlLPI3M7gqlIVzTIm7BevQpBLqrW7" +
            "pSqBXiVg4HrmuSHCCbJODuNRfEMvLiGcPYMQ3oNYnUnr",
        };

        cy.callToDoListAPI("POST", BASEURL, payload, false).then((response) => {
          expect(response.status).to.eq(400);
          expect(response.body.errors.Description[0]).to.contain(
            "Description field can not be greater than 255 characters"
          );
        });
      });

      //Scenario : Posting ToDo item with description same existing as ToDo item gives conflict response with error code as 409
      it("Conflict - 409 : Posting items with same description", () => {
        let payload = {
          description: "ToDoItem_" + uuidv4(),
        };

        //Add a new ToDo item
        cy.callToDoListAPI("POST", BASEURL, payload, true).then((response) => {
          expect(response.status).to.eq(201);

          //Add another ToDo item with same description
          cy.callToDoListAPI("POST", BASEURL, payload, false).then(
            (response) => {
              expect(response.status).to.eq(409);
              expect(response.body).to.contains(
                "A todo item with description already exists"
              );
            }
          );
        });
      });
    });
  });

  //Get existing ToDo item based on ID
  context("GET Request with ID", () => {
    let toDoitem_description = "ToDoItem_" + uuidv4();

    //Scenario : Verify successful retrival of ToDo item based on valid ID provided
    context("Success", () => {
      let date = new Date();
      it("Success - 200 : Get ToDo list based on ID", () => {
        let payload = {
          description: toDoitem_description,
        };

        cy.callToDoListAPI("POST", BASEURL, payload, true).then((response) => {
          cy.request({
            method: "GET",
            url: BASEURL + response.body,
          }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.description).to.be.contains(
              toDoitem_description
            );
          });
        });
      });
    });

    //Verify handling of exception by GET request
    context("Not found", () => {
      let date = new Date();
      let myuuid = uuidv4();

      //Scenario : Verify that retriving ToDo item with invalid ID returns 404 Not found response
      it("Not Found - 404 : Provide Incorrect ID to GET request", () => {
        cy.request({
          method: "GET",
          url: BASEURL + uuidv4(),
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(404);
        });
      });

      //Scenario : Verify that retriving ToDo item with invalid URL returns 404 Not found response
      it("Not Found - 404 : Provide Incorrect URL to GET request", () => {
        let payload = {
          description: "ToDoItem_" + uuidv4(),
        };
        cy.callToDoListAPI("POST", BASEURL, payload, true).then((response) => {
          cy.request({
            method: "GET",
            url: BASEURL + "/incorrectPath/" + response.body,
            failOnStatusCode: false,
          }).then((response) => {
            expect(response.status).to.eq(404);
          });
        });
      });
    });
  });

  //Update existing ToDo item based on ID
  context("PUT Request with ID", () => {
    let toDoitem_description;
    let toDoItemID;

    //Creating ToDo item as part of intial setup
    beforeEach(() => {
      let payload = {
        description: "ToDoItem_" + uuidv4(),
      };
      //Create new ToDo Item using POST request
      cy.callToDoListAPI("POST", BASEURL, payload, true).then((response) => {
        expect(response.status).to.eq(201);
        //ID of added ToDo Item to be used for further reference
        toDoItemID = response.body;
      });
    });

    //Handling of Success and Bad Request by PUT request
    context("Success", () => {
      //Scenario : Verify PUT api request on successful updation of existing ToDo items return a success response of 204
      it("Success - 204 : Update posted items in ToDoItems", () => {
        toDoitem_description = "ToDoItem_" + uuidv4();
        //Update recently added ToDo item
        let payload = {
          id: toDoItemID,
          description: "Updated_" + toDoitem_description,
        };
        cy.callToDoListAPI("PUT", BASEURL + toDoItemID, payload, true).then(
          (response) => {
            //Verify response after update is successful
            expect(response.status).to.eq(204);

            //Verify updated ToDo item is saved successful
            cy.request({
              method: "GET",
              url: BASEURL + toDoItemID,
            }).then((response) => {
              expect(response.status).to.eq(200);
              expect(response.body.description).to.eqls(
                "Updated_" + toDoitem_description
              );
            });
          }
        );
      });
    });

    context("Bad Request,Not Found", () => {
      //Scenaria : Verify PUT api request on unsuccessful updation of existing ToDo items return a error response of 400
      it("Bad Request - 400 : Updating existing ToDo item with incorrect values", () => {
        //Update recently added ToDo item with incorrect values

        let payload = {
          id: toDoItemID,
          description: "Updated_" + toDoitem_description,
          isCompleted: "Null",
        };
        cy.callToDoListAPI("PUT", BASEURL + toDoItemID, payload, false).then(
          (response) => {
            //Verify response after update is successful
            expect(response.status).to.eq(400);
          }
        );
      });

      //Scenario : Verify that referencing a ToDo item with invalid ID returns 400 Bad request response
      it("Bad Request - 400 : Provide Incorrect ID to PUT request", () => {
        let payload = {
          description: "Incorrect ToDo Item",
        };
        cy.callToDoListAPI("PUT", BASEURL + uuidv4(), payload, false).then(
          (response) => {
            expect(response.status).to.eq(400);
            expect(response.body).to.equals(
              "You are trying to update the wrong todo item"
            );
          }
        );
      });

      //Scenario : Verify that referencing ToDo item with invalid URL returns 404 Not found response
      it("Not Found - 404 : Provide Incorrect URL Requested", () => {
        let payload = {
          description: "Incorrect ToDo Item",
        };
        //Update Non-existing ToDoItem
        cy.callToDoListAPI(
          "PUT",
          BASEURL + "/IncorrectURLs",
          payload,
          false
        ).then((response) => {
          expect(response.status).to.eq(404);
        });
      });
    });
  });

  //Read & Update the ToDo items added from the UI application using APIs
  context("Retrive ToDo items added from UI app", () => {
    let toDoitem_description = "ToDoItem added from the UI application";
    
    //Scenario : Add item from UI and read and update the item using Get and Put APIs 
    it("Adding ToDo list from UI and confirm it using GET API request", () => {
    
      cy.visit(BASEAPPURL);
      cy.get("#formAddTodoItem").type(toDoitem_description);
      cy.get(".btn.btn-primary").contains("Add Item").click();
      cy.get(".table>tbody>tr>td:nth-child(1)")
        .invoke("text")
        .then((toDoID) => {
          //Verify the item added from UI can be fetched using the GET api
          cy.request("GET", BASEURL + toDoID).then((response) => {
            expect(response.status).to.be.equals(200);

            let payload = {
              id: toDoID,
              description: toDoitem_description,
              isCompleted: true,
            };
            cy.callToDoListAPI("PUT", BASEURL + toDoID, payload, true)
              .then((response) => {
                expect(response.status).to.be.equals(204);
              })
              .then(() => {
                // Reload UI to confirm that the completed ToDo item doesn't appear in table
                cy.reload().then(() => {
                  cy.get(".table > tbody").should("exist");
                  cy.get(".table > tbody").children().should("have.length", 0);
                });
              });
          });
        });
    });
  });
});
