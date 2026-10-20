declare namespace Cypress {
  interface Chainable {
    pokemondetail(): Cypress.Chainable<Element>;
    selectGame(game: string): Cypress.Chainable<Element>;
  }
}
