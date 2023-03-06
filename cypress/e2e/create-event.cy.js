/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe('create event', () => {
    beforeEach(() => {
        cy.viewport(1500, 1000)


      // Cypress starts out with a blank slate for each test
      // so we must tell it to visit our website with the `cy.visit()` command.
      // Since we want to visit the same URL at the start of all our tests,
      // we include it in our beforeEach function so that it runs before each test
      cy.visit('http://localhost:3000/')
    })
  
    it('open create event modal and filled title click save button, compare recently created title', () => {
        // cy.wait(3000)
        cy.get("#create-event").click();

        cy.get("#title").type("test event by cypress");
        cy.get("#save-button").click();

        cy.wait(3000)
        cy.get("#event-table tbody tr:first td").first().should('have.text', 'test event by cypress');
    })


  })
  