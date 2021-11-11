describe('Custom game', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  context('Add custom game', () => {
    afterEach(() => {
      cy.get('[data-testid=add-encounter-input] > input').type('Test');
      cy.contains('Save').click();
      cy.get('[data-testid=filter] > input').type('Test');
      cy.wait(1000);
      cy.get('[data-testid=encounters-list]')
        .children()
        .children()
        .children()
        .should('have.length', 1);
      cy.get('[data-testid=encounter-0]').click();
      cy.get('[data-testid=poke-Bulbasaur]').click();
      cy.contains('Bulbasaur').should('exist');
      cy.contains('Select...').click();
      cy.contains('Fainted').click({ force: true });
      cy.get('[data-testid=encounter-0] .repeat').click();
      cy.contains('Select...').should('exist');
      cy.get('[data-testid=encounter-0] .trash').click();
      cy.contains('OK').click();
      cy.get('[data-testid=encounters-list]')
        .children()
        .children()
        .children()
        .should('have.length', 0);
      cy.get('[data-testid=options]').click();
      cy.contains('Builder').click();
      cy.get('[data-testid=builder-add]').click();
      cy.get('[data-testid=poke-Bulbasaur]').click();
      cy.get('[aria-label="deletegame"]').click();
      cy.contains('Cancel').click();
      cy.get('[aria-label="deletegame"]').click();
      cy.contains('OK').click();
      cy.contains('Emerald Kaizo').should('not.exist');
    });

    it('Add game', () => {
      cy.get('[data-testid=add-game]').click();
      cy.contains('Cancel').click();
      cy.get('[data-testid=add-game]').click();
      cy.get('[data-testid=add-game-input] > input')
        .type('Emerald Kaizo')
        .should('have.value', 'Emerald Kaizo');
      cy.contains('Save').click();
      cy.get('[data-testid=custom-edit-badges]').click();
      cy.contains('Close').click();
      cy.get('[data-testid=custom-edit-badges]').click();
      cy.get('[data-testid=add-cap]').click();
      cy.get('[data-testid=remove-custom-badge-0]').click();
      cy.get('[data-testid=add-cap]').click();
      cy.get('[data-testid=custom-badge-input-0] > input').type('10').should('have.value', '010');
      cy.contains('Close').click();
      cy.contains('010').should('exist').click();
      cy.get('[data-testid=add-encounter]').click();
    });

    it('Add game - small screen', () => {
      cy.viewport('iphone-6+');
      cy.get('[data-testid=add-game]').click();
      cy.get('[data-testid=add-game-input] > input').type('Emerald Kaizo');
      cy.contains('Save').click();
      cy.get('[data-testid=fab-tracker] > .ui').click();
      cy.get('[data-testid=fab-add-edit-badges] > [data-testid=custom-edit-badges]').click();
      cy.contains('Close').click();
      cy.get('[data-testid=fab-add-encounter] > [data-testid=add-encounter]').click();
    });
  });

  it('Reset custom game encounters', () => {
    cy.get('[data-testid=add-game]').click();
    cy.get('[data-testid=add-game-input] > input').type('Emerald Kaizo');
    cy.contains('Save').click();
    cy.get('[data-testid=add-encounter]').click();
    cy.get('[data-testid=add-encounter-input] > input').type('Test');
    cy.contains('Save').click();
    cy.get('[data-testid=reset-all]').click();
    cy.contains('OK').click();
    cy.get('[data-testid=encounters-list]')
      .children()
      .children()
      .children()
      .should('have.length', 0);
  });
});
