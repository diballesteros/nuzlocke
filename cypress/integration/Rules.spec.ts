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
    cy.contains('Ruleset').should('exist');
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

  it('Smart Rules of type', () => {
    cy.get('[data-testid=add-rule]').click();
    cy.contains('Type').click();
    cy.get('[data-testid=add-rule-type]').click();
    cy.contains('GRASS').click();
    cy.contains('Add Rule').click();
    cy.contains('Save').click();
    cy.contains('Allowed types: GRASS').should('exist');
    cy.get('[data-testid=game-select]').click();
    cy.contains('Sword and Shield').click();
    cy.get('[data-testid=tab]').contains('Tracker').click();
    cy.get('[data-testid=pokemon-0] > .search').type('Scorb{enter}');
    cy.contains('FORBIDDEN TYPE').should('exist');
  })

  it('Smart Rules of generation', () => {
    cy.get('[data-testid=add-rule]').click();
    cy.contains('Generation').click();
    cy.get('[data-testid=add-rule-generation]').click();
    cy.get('[data-testid=add-rule-generation]').contains(1).click();
    cy.contains('Add Rule').click();
    cy.contains('Save').click();
    cy.contains('Allowed generations: 1').should('exist');
    cy.get('[data-testid=game-select]').click();
    cy.contains('Sword and Shield').click();
    cy.get('[data-testid=tab]').contains('Tracker').click();
    cy.get('[data-testid=pokemon-0] > .search').type('Scorb{enter}');
    cy.contains('FORBIDDEN GEN').should('exist');
  })

  it('Smart Rules of level', () => {
    cy.get('[data-testid=add-rule]').click();
    cy.contains('Level').click();
    cy.get('[data-testid=add-rule-level-input] > input')
      .type('1');
    cy.contains('Save').click();
    cy.contains('Max level 1').should('exist');
    cy.get('[data-testid=game-select]').click();
    cy.contains('Sword and Shield').click();
    cy.get('[data-testid=tab]').contains('Tracker').click();
    cy.get('[data-testid=pokemon-0] > .search').type('Scorb{enter}');
    cy.get('[data-testid=edit-encounter-0]').click();
    cy.get('[data-testid=level] > input')
      .type('5');
    cy.contains('Save').click();
    cy.contains('OVERLEVELED').should('exist');
  })
});
