describe('Encounters', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid=game-select]').click();
    cy.contains('Sword and Shield').click();
  });

  it('Filter', () => {
    cy.get('#search-filter').type('Slumbering Weald').should('have.value', 'Slumbering Weald');
    cy.wait(1000);
    cy.get('[data-testid=encounters-list]')
      .children()
      .children()
      .children()
      .should('have.length', 1);
  });

  it('Edit base encounter', () => {
    cy.get('[data-testid=pokemon-0] > .search').type('Bulb');
    cy.contains('Bulbasaur').click();
    cy.get('#search-filter').click();
    cy.scrollTo('top');
    cy.get('[data-testid=pokemon-0] > .divider').should('have.text', 'Bulbasaur');
    cy.scrollTo('top');
    cy.get('[data-testid=status-0]').click();
    cy.get('[data-testid=status-0] > .visible > :nth-child(2)').click();
    cy.get('[data-testid=status-0] > .divider').should('have.text', 'Fainted');
    cy.get('[data-testid=encounter-0] .repeat').click();
    cy.get('[data-testid=pokemon-0] > .divider').should('have.text', 'Select...');
    cy.get('[data-testid=status-0] > .divider').should('have.text', 'Select...');
  });

  it('Reset all encounters', () => {
    cy.get('[data-testid=pokemon-0] > .search').type('Bulb');
    cy.contains('Bulbasaur').click();
    cy.get('#search-filter').click();
    cy.get('[data-testid=reset-all]').click();
    cy.contains('OK').click();
    cy.get('[data-testid=status-0] > .divider').should('have.text', 'Select...');
  });

  it('Delete encounter', () => {
    cy.get('[data-testid=encounter-0] .trash').click();
    cy.contains('OK').click();
    cy.get('#search-filter').type('Starter');
    cy.wait(1000);
    cy.get('[data-testid=encounters-list]')
      .children()
      .children()
      .children()
      .should('have.length', 0);
  });

  it('Add encounter', () => {
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
  });

  it('Share', () => {
    cy.get('[data-testid=options]').click();
    cy.contains('Share').click();
    cy.get('.header').contains('Share').should('exist');
  });
});
