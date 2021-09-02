describe('Custom game', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Add game', () => {
    cy.get('[data-testid=add-game]').click();
    cy.get('[data-testid=add-game-input] > input')
      .type('Emerald Kaizo')
      .should('have.value', 'Emerald Kaizo');
    cy.contains('Save').click();
    cy.get('[data-testid=game-select]').click();
    cy.contains('Emerald Kaizo').click();
    cy.get('[data-testid=add-encounter]').click();
    cy.get('[data-testid=add-encounter-input] > input').type('Test').should('have.value', 'Test');
    cy.contains('Save').click();
    cy.get('#search-filter').type('Test');
    cy.wait(1000);
    cy.get('[data-testid=encounters-list]')
      .children()
      .children()
      .children()
      .should('have.length', 1);
    cy.get('[data-testid=encounter-0]').click();
    cy.get('[data-testid=poke-Bulbasaur]').click();
    cy.contains('Bulbasaur').should('exist');
    cy.get('[data-testid=status-0]').click();
    cy.get('[data-testid=status-0] > .visible > :nth-child(2)').click();
    cy.get('[data-testid=status-0] > .divider').should('have.text', 'Fainted');
    cy.get('[data-testid=encounter-0] .repeat').click();
    cy.get('[data-testid=encounter-empty-0]').should('exist');
    cy.get('[data-testid=status-0] > .divider').should('have.text', 'Select...');
    cy.get('[data-testid=encounter-0] .trash').click();
    cy.contains('OK').click();
    cy.get('[data-testid=encounters-list]')
      .children()
      .children()
      .children()
      .should('have.length', 0);
  });

  it('Delete game', () => {
    cy.get('[data-testid=add-game]').click();
    cy.get('[data-testid=add-game-input] > input')
      .type('Emerald Kaizo')
      .should('have.value', 'Emerald Kaizo');
    cy.contains('Save').click();
    cy.get('[data-testid=game-select]').click();
    cy.contains('Emerald Kaizo').click();
    cy.get('[aria-label="deletegame"]').click();
    cy.contains('OK').click();
    cy.contains('Emerald Kaizo').should('not.exist');
  });
});
