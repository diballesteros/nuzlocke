describe('Badges', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid=game-select]').click();
    cy.contains('Sword and Shield').click();
  });

  it('Select badge', () => {
    cy.get('[title="Fire Badge"]')
      .click()
      .should('have.css', 'background-color', 'rgb(212, 106, 106)');
    cy.get('[data-testid=badge-detail-0] > .question').click();
    cy.contains('Milo').should('exist');
  });

  it('Edit badges', () => {
    cy.get('[title="Grass Badge"]').should('have.text', '20');
    cy.get('[data-testid=edit-badges]').click();
    cy.get('.content > :nth-child(1) > input').type('99');
    cy.contains('Close').click();
    cy.get('[title="Grass Badge"]').should('have.text', '2099');
    cy.get('[data-testid=edit-badges]').click();
    cy.contains('Set default').click();
    cy.contains('Close').click();
    cy.get('[title="Grass Badge"]').should('have.text', '20');
  });

  it('Badge Details', () => {
    cy.get('[data-testid=badge-detail-0] > .question').click();
    cy.contains('Eldegoss').should('exist');
    cy.contains('DYNAMAX').should('exist');
    cy.contains('Back').click();
    cy.get('[data-testid=game-select]').click();
    cy.contains('Ultra Sun and Ultra Moon').click();
    cy.get('[data-testid=badge-detail-0] > .question').click();
    cy.contains('TOTEM').should('exist');
    cy.contains('Back').click();
    cy.get('[data-testid=game-select]').click();
    cy.contains('HeartGold and SoulSilver').click();
    cy.get('[data-testid=badges]').scrollTo('right');
    cy.get('[data-testid=badge-detail-8] > .question').click();
    cy.contains('Rematch').should('exist').click();
    cy.contains('Bronzong').should('exist');
    cy.get('[data-testid=badge-details-tabs] > .menu > :nth-child(5)').click();
    cy.contains('Salamence').should('exist');
  });
});
