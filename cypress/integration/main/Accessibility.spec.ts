describe('Accesibility', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid=game-select]').click();
    cy.contains('Sword and Shield').click();
  });

  it('Keyboard Navigation', () => {
    cy.get('[data-testid="badge-detail-0"]').focus().type('{Enter}');
    cy.contains('Back').click();
    cy.get('[data-testid="pokemon-selector"]').first().focus().type('{Enter}');
    cy.contains('Cancel').click();
    cy.get('[data-testid="options"]').click();
    cy.get('[data-testid="calculator"]').click();
    cy.get('[data-testid="expand-moves"]').focus().type('{Enter}');
    cy.get('[data-testid="attacker-result-2"]').focus().type('{Enter}');
    cy.get('[data-testid="defender-result-3"]').focus().type('{Enter}');
    cy.viewport('iphone-6+');
    cy.get('[data-testid="pokemon2-tab"').focus().type('{Enter}');
    cy.get('[data-testid="pokemon1-tab"').focus().type('{Enter}');
  });
});
