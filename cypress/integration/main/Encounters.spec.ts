describe('Encounters', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid=game-select]').click();
    cy.contains('Sword and Shield').click();
  });

  it('Filter', () => {
    cy.get('[data-testid=filter] > input')
      .type('Slumbering Weald')
      .should('have.value', 'Slumbering Weald');
    cy.get('[data-testid=pokemon-1]').click();
    cy.get('[data-testid=poke-Butterfree]').click();
    cy.get('[data-testid=filter-button]').click();
    cy.get('[data-testid=filter-gen-1]').click();
    cy.get('[data-testid=filter-gen-1]').click();
    cy.get('[data-testid=filter-type-BUG]').click();
    cy.get('[data-testid=filter-type-BUG]').click();
    cy.get('[data-testid=filter-button]').click();
    cy.get('[data-testid=encounters-list]')
      .children()
      .children()
      .children()
      .should('have.length', 1);
  });

  it('Edit base encounter', () => {
    cy.get('[data-testid=encounter-0]').click();
    cy.contains('Cancel').click();
    cy.get('[data-testid=encounter-0]').click();
    cy.get('.st0Fire').click({ force: true });
    cy.contains('Super effective against').should('exist');
    cy.get('.tabular > :nth-child(3)').click();
    cy.get('.st0Steel').click({ force: true, multiple: true });
    cy.get('[data-testid=effect-close]').click();
    cy.get('[data-testid=poke-Scorbunny]').click({ force: true });
    cy.contains('Scorbunny').should('exist');

    cy.get('[data-testid=edit-encounter-0]').click();
    cy.contains('Cancel').click();
    cy.get('[data-testid=status-0]').click();
    cy.get('[data-testid=status-0] > .visible > :nth-child(2)').click();
    cy.get('[data-testid=status-0] > .divider').should('have.text', 'Fainted');
    cy.get('[data-testid=edit-encounter-0]').click();
    cy.get('[data-testid="cause of fainting"]')
      .type('Died to crit')
      .should('have.value', 'Died to crit');
    cy.get('[data-testid=nature-info]').click();
    cy.contains('Increased stat').should('exist');
    cy.contains('Hardy').should('exist');
    cy.get('[data-testid=nature-close]').click();
    cy.get('[data-testid=nature-info]').click();

    cy.get('.dimmable > div').click(1, 1, { force: true, multiple: true });
    cy.contains('Cancel').click();

    cy.get('[data-testid="evolve-0}"]').click();
    cy.get(':nth-child(3) > .ui > label').click();
    cy.contains('Cancel').click();
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
    cy.contains('Cancel').click();
    cy.get('[data-testid=reset-all]').click();
    cy.get('.page').click(1, 1);
    cy.get('[data-testid=reset-all]').click();
    cy.contains('Save').click();
    cy.get('[data-testid=status-0] > .divider').should('have.text', 'Select...');
  });

  it('Delete encounter', () => {
    cy.get('[data-testid=encounter-0] .trash').click();
    cy.contains('Cancel').click();
    cy.get('[data-testid=encounter-0] .trash').click();
    cy.contains('OK').click();
    cy.get('[data-testid=filter] > input').type('Starter');
    cy.get('[data-testid=encounters-list]')
      .children()
      .children()
      .children()
      .should('have.length', 0);
  });

  it('Add encounter', () => {
    cy.get('[data-testid=add-encounter]').click();
    cy.contains('Cancel').click();
    cy.get('[data-testid=add-encounter]').click();
    cy.get('[data-testid=add-encounter-input] > input').type('Test').should('have.value', 'Test');
    cy.contains('Save').click();
    cy.get('[data-testid=filter] > input').type('Test');
    cy.get('[data-testid=encounters-list]')
      .children()
      .children()
      .children()
      .should('have.length', 1);
  });

  it('Export to another game', () => {
    cy.get('[data-testid=encounter-0]').click();
    cy.get('[data-testid=poke-Scorbunny]').click({ force: true });
    cy.get('[data-testid=edit-encounter-0]').click();
    cy.get('[data-testid=export-to-game]').click();
    cy.get('[data-testid=export-to-game] > .visible > :nth-child(2)').click();
    cy.get('[data-testid=game-select]').click();
    cy.contains('Gold, Silver and Crystal').click();
    cy.contains('From Sword and Shield').should('exist');
    cy.contains('Scorbunny').should('exist');
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
      cy.get('[data-testid=filter] > input').type('Test');
      cy.get('[data-testid=encounters-list]')
        .children()
        .children()
        .children()
        .should('have.length', 1);
    });

    it('Reset all encounters', () => {
      cy.get('[data-testid=encounter-0]').click();
      cy.get('[data-testid=poke-Scorbunny]').click({ force: true });
      cy.get('[data-testid=fab-reset-encounters] > [data-testid=reset-all]').click();
      cy.contains('Save').click();
      cy.get('[data-testid=status-0] > .divider').should('have.text', 'Select...');
    });
  });
});
