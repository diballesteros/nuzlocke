describe('Accessibility', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid="game-select"]').click();
    cy.contains('Sword and Shield').click();
  });

  it('Keyboard Navigation', () => {
    cy.get('[data-testid="badge-detail-0"]').should('be.visible').focus();
    cy.get('[data-testid="badge-detail-0"]').type('{Enter}');
    cy.contains('Back').click();

    cy.get('[data-testid="pokemon-selector"]').first().should('be.visible').focus();
    cy.get('[data-testid="pokemon-selector"]').first().type('{Enter}');
    cy.contains('Cancel').click();

    cy.get('[data-testid="options"]').click();
    cy.get('[data-testid="calculator"]').click();

    cy.get('[data-testid="expand-moves"]').should('be.visible').focus();
    cy.get('[data-testid="expand-moves"]').type('{Enter}');

    cy.get('[data-testid="attacker-result-2"]').should('be.visible').focus();
    cy.get('[data-testid="attacker-result-2"]').type('{Enter}');

    cy.get('[data-testid="defender-result-3"]').should('be.visible').focus();
    cy.get('[data-testid="defender-result-3"]').type('{Enter}');

    cy.viewport('iphone-6+');

    cy.get('[data-testid="pokemon2-tab"]').should('be.visible').focus();
    cy.get('[data-testid="pokemon2-tab"]').type('{Enter}');

    cy.get('[data-testid="pokemon1-tab"]').should('be.visible').focus();
    cy.get('[data-testid="pokemon1-tab"]').type('{Enter}');
  });
});
