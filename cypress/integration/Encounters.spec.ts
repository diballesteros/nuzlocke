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
    cy.get('[data-testid=encounter-0]').click();
    cy.get('.st0Fire').click({ force: true });
    cy.contains('Super effective against').should('exist');
    cy.get('[data-testid=effect-close]').click();
    cy.get('[data-testid=poke-Scorbunny]').click({ force: true });
    cy.contains('Scorbunny').should('exist');
    cy.get('[data-testid=status-0]').click();
    cy.get('[data-testid=status-0] > .visible > :nth-child(2)').click();
    cy.get('[data-testid=status-0] > .divider').should('have.text', 'Fainted');
    cy.get('[data-testid="evolve-0}"]').click();
    cy.get(':nth-child(2) > .ui > label').click();
    cy.contains('Save').click();
    cy.contains('Raboot').should('exist');
    cy.get('[data-testid=encounter-0] .repeat').click();
    cy.get('[data-testid=encounter-empty-0]').should('exist');
    cy.get('[data-testid=status-0] > .divider').should('have.text', 'Select...');
  });

  it('Reset all encounters', () => {
    cy.get('[data-testid=encounter-0]').click();
    cy.get('[data-testid=poke-Scorbunny]').click({ force: true });
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

  context('Small screens', () => {
    beforeEach(() => {
      cy.viewport('iphone-6+');
      cy.get('[data-testid=fab-tracker] > .ui').click();
    });

    it('Add encounter', () => {
      cy.get('[data-testid=fab-add-encounter] > [data-testid=add-encounter]').click();
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

    it('Reset all encounters', () => {
      cy.get('[data-testid=encounter-0]').click();
      cy.get('[data-testid=poke-Scorbunny]').click({ force: true });
      cy.get(':nth-child(3) > [data-testid=reset-all]').click();
      cy.contains('OK').click();
      cy.get('[data-testid=status-0] > .divider').should('have.text', 'Select...');
    });
  });
});
