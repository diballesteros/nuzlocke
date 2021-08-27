describe('Rules', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.contains('Rules').click();
  });

  it('Rule CRUD', () => {
    cy.get('[data-testid=add-rule]').click();
    cy.get('[data-testid=add-rule-input] > input')
      .type('This is a test rule')
      .should('have.value', 'This is a test rule');
    cy.contains('Save').click();
    cy.contains('This is a test rule').should('exist');
    cy.get('[data-testid=edit-rule-3]').click();
    cy.get('[data-testid=edit-rule-input] > input')
      .type(' this is now an edited rule')
      .should('have.value', 'This is a test rule this is now an edited rule');
    cy.contains('Save').click();
    cy.contains('This is a test rule this is now an edited rule').should('exist');
    cy.get('[data-testid=delete-rule-3]').click();
    cy.contains('This is a test rule').should('not.exist');
    cy.get('[data-testid=arrow-down-0]').click();
    cy.get('[data-testid=ruleslist] > :nth-child(2)').should(
      'have.text',
      '2.Any Pokémon that faints is considered dead, and must be released or put in the Pokémon Storage System permanently'
    );
    cy.get('[data-testid=arrow-up-1]').click();
    cy.get('[data-testid=ruleslist] > :nth-child(1)').should(
      'have.text',
      '1.Any Pokémon that faints is considered dead, and must be released or put in the Pokémon Storage System permanently'
    );
  });

  it('Share rules', () => {
    cy.get('[data-testid=share-encounters]').click();
    cy.get('.header').contains('Share').should('exist');
  });

  it('Custom ruleset', () => {
    cy.get('[data-testid=add-ruleset]').click();
    cy.get('[data-testid=add-ruleset-input] > input')
      .type('Nuzlocke Custom')
      .should('have.value', 'Nuzlocke Custom');
    cy.contains('Save').click();
    cy.get('[data-testid=rule-select]').click();
    cy.contains('Nuzlocke Custom').should('exist').click();
    cy.get('[data-testid=add-rule]').click();
    cy.get('[data-testid=add-rule-input] > input')
      .type('This is a test rule')
      .should('have.value', 'This is a test rule');
    cy.contains('Save').click();
    cy.contains('This is a test rule').should('exist');
    cy.get('[data-testid=delete-rule-0]').click();
    cy.contains('This is a test rule').should('not.exist');
    cy.get('[data-testid=delete-ruleset]').click();
    cy.contains('OK').click();
    cy.get('[data-testid=rule-select]').click();
    cy.contains('Nuzlocke Custom').should('not.exist');
  });
});
