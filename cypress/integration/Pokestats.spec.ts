describe('PokéStats', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid=game-select]').click();
    cy.contains('Sword and Shield').click();
  });

  it.only('Pokemon counters', () => {
    cy.get('[data-testid=pokemon-0] > .search').type('Bulbasaur');
    cy.contains('Bulbasaur').click();
    cy.get('#search-filter').click();
    cy.get('[data-testid=status-0]').click();
    cy.get('[data-testid=status-0] > .visible > :nth-child(1)').click();

    cy.get('[data-testid=pokemon-1] > .search').type('Charmander');
    cy.contains('Charmander').click();
    cy.get('#search-filter').click();
    cy.get('[data-testid=status-1]').click();
    cy.get('[data-testid=status-1] > .visible > :nth-child(3)').click();

    cy.get('[data-testid=pokemon-2] > .search').type('Squirtle');
    cy.contains('Squirtle').click();
    cy.get('#search-filter').click();
    cy.get('[data-testid=status-2]').click();
    cy.get('[data-testid=status-2] > .visible > :nth-child(4)').click();

    cy.get('[data-testid=pokemon-3] > .search').type('Caterpie');
    cy.contains('Caterpie').click();
    cy.get('#search-filter').click();
    cy.get('[data-testid=status-3]').click();
    cy.get('[data-testid=status-3] > .visible > :nth-child(6)').click();

    cy.get('[data-testid=pokemon-4] > .search').type('Weedle');
    cy.contains('Weedle').click();
    cy.get('#search-filter').click();
    cy.get('[data-testid=status-4]').click();
    cy.get('[data-testid=status-4] > .visible > :nth-child(2)').click();

    cy.get('[data-testid=pokemon-5] > .search').type('Pidgey');
    cy.contains('Pidgey').click();
    cy.get('#search-filter').click();
    cy.get('[data-testid=status-5]').click();
    cy.get('[data-testid=status-5] > .visible > :nth-child(5)').click();

    cy.contains('PokéStats').click();
    cy.get('.secondary > :nth-child(1) > .ui').should('have.text', '4');
    cy.get('.secondary > :nth-child(3) > .ui').should('have.text', '1');
    cy.get('.secondary > :nth-child(4) > .ui').should('have.text', '1');
    cy.get('[alt="Bulbasaur"]').should('exist');
    cy.get('[alt="Charmander"]').should('exist');
    cy.get('[alt="Squirtle"]').should('exist');
    cy.get('[alt="Caterpie"]').should('exist');
    cy.get('.secondary > :nth-child(3)').click();
    cy.get('[alt="Pidgey"]').should('exist');
    cy.get('.secondary > :nth-child(4)').click();
    cy.get('[alt="Weedle"]').should('exist').click();
    cy.contains('Met at: Route 2').should('exist');
  });
});
