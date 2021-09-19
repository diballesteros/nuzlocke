// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

declare namespace Cypress {
  interface Chainable {
    pokemondetail(): Chainable<Element>;
  }
}

Cypress.Commands.add('pokemondetail', () => {
  cy.get('[data-testid=level] > input').type('15').should('have.value', 15);
  cy.get('[data-testid=metlevel] > input').type('5').should('have.value', 5);
  cy.get('[data-testid=ability] > input').type('Ability').should('have.value', 'Ability');
  cy.get('[data-testid=item] > input').type('Oran Berry').should('have.value', 'Oran Berry');
  cy.get('[data-testid=gender]').click();
  cy.get('[data-testid=gender] > .visible > :nth-child(2)').click();
  cy.get('[data-testid=nature]').type('Bold');
  cy.get('[data-testid=move-summary]').click();
  cy.get('[data-testid=move-1] > div').click();
  cy.get('[data-testid=move-Pound]').click();
  cy.get('[data-testid=move-2] > div').click();
  cy.get('[data-testid="move-Karate Chop"]').click({ force: true });
  cy.get('[data-testid=move-3] > div').click();
  cy.get('[data-testid=filter-button]').click();
  cy.get('[data-testid=filter-gen-1]').click();
  cy.get('[data-testid=filter-type-WATER]').click();
  cy.get('[data-testid=filter-button]').click();
  cy.get('[data-testid=move-Surf]').click({ force: true });
  cy.get('[data-testid=move-4] > div').click();
  cy.get('[data-testid=move-Pound]').click();
});
