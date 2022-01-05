describe('Badges', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid="close-warning"]').click();
    cy.get('[data-testid=game-select]').click();
    cy.contains('Sword and Shield').click();
  });

  it('Select badge', () => {
    cy.get('[title="Fire Badge"]').should('have.css', 'filter', 'grayscale(1)');
    cy.get('[title="Fire Badge"]').click().should('not.have.css', 'filter', 'grayscale(1)');
    cy.get('[title="Fire Badge"]').click().should('have.css', 'filter', 'grayscale(1)');
  });

  it('Edit badges', () => {
    cy.get('[title="Grass Badge"]').should('have.text', '20');
    cy.get('[data-testid=edit-badges]').click();
    cy.get('.content > :nth-child(1) > input').type('9');
    cy.contains('Cancel').click();
    cy.get('[title="Grass Badge"]').should('have.text', '209');
    cy.get('[data-testid=edit-badges]').click();
    cy.contains('Set default').click();
    cy.contains('Cancel').click();
    cy.get('[title="Grass Badge"]').should('have.text', '20');
    cy.get('[data-testid=game-select]').click();
    cy.contains('Red, Blue and Yellow').click();
    cy.get('[data-testid=edit-badges]').click();
    cy.get('[data-testid=badge-multiple-default]').click();
    cy.get('[data-testid=badge-multiple-default] > .visible > :nth-child(2)').click();
    cy.get('.content > :nth-child(1) > input').should('have.value', '12');
    cy.get('.page').click(1, 1);
  });

  it('Edit badges - Smaller screen', () => {
    cy.viewport('iphone-6+');
    cy.get('[data-testid=fab-tracker] > .ui').click();
    cy.get('[data-testid=fab-add-edit-badges] > [data-testid=edit-badges]').click();
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
    cy.contains('Original').should('exist').click();
    cy.contains('Xatu').should('exist');
    cy.contains('Rematch').click();
    cy.get('[data-testid=badge-details-tabs] > .menu > :nth-child(5)').click();
    cy.contains('Salamence').should('exist');
    cy.contains('241').should('exist');
  });

  it('Badge detail incorrect parameters', () => {
    cy.visit('/badgedetail/13/15');
    cy.url().should('not.include', '/badgedetail');
    cy.visit('/badgedetail/25/25');
    cy.url().should('not.include', '/badgedetail');
  });
});
