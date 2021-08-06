describe('PokéStats', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid=game-select]').click();
    cy.contains('Sword and Shield').click();
  });

  it.only('Pokemon counters', () => {
    cy.get('[data-testid=pokemon-0] > .search').type('Scorbunny');
    cy.contains('Scorbunny').click();
    cy.get('#search-filter').click();
    cy.get('[data-testid=status-0]').click();
    cy.get('[data-testid=status-0] > .visible > :nth-child(1)').click();

    cy.get('[data-testid=pokemon-1] > .search').type('Magikarp');
    cy.contains('Magikarp').click();
    cy.get('#search-filter').click();
    cy.get('[data-testid=status-1]').click();
    cy.get('[data-testid=status-1] > .visible > :nth-child(3)').click();

    cy.get('[data-testid=pokemon-2] > .search').type('Caterpie');
    cy.contains('Caterpie').click();
    cy.get('#search-filter').click();
    cy.get('[data-testid=status-2]').click();
    cy.get('[data-testid=status-2] > .visible > :nth-child(4)').click();

    cy.get('[data-testid=pokemon-3] > .search').type('Slowpoke');
    cy.contains('Slowpoke').click();
    cy.get('#search-filter').click();
    cy.get('[data-testid=status-3]').click();
    cy.get('[data-testid=status-3] > .visible > :nth-child(6)').click();

    cy.get('[data-testid=pokemon-4] > .search').type('Feebas');
    cy.contains('Feebas').click();
    cy.get('#search-filter').click();
    cy.get('[data-testid=status-4]').click();
    cy.get('[data-testid=status-4] > .visible > :nth-child(2)').click();

    cy.get('[data-testid=pokemon-5] > .search').type('Roselia');
    cy.contains('Roselia').click();
    cy.get('#search-filter').click();
    cy.get('[data-testid=status-5]').click();
    cy.get('[data-testid=status-5] > .visible > :nth-child(5)').click();

    cy.contains('PokéStats').click();
    cy.get('.secondary > :nth-child(1) > .ui').should('have.text', '4');
    cy.get('.secondary > :nth-child(3) > .ui').should('have.text', '1');
    cy.get('.secondary > :nth-child(4) > .ui').should('have.text', '1');
    cy.get('[alt="Scorbunny"]').should('exist');
    cy.get('[alt="Magikarp"]').should('exist');
    cy.get('[alt="Caterpie"]').should('exist');
    cy.get('[alt="Slowpoke (Galarian)"]').should('exist');
    cy.get('.secondary > :nth-child(3)').click();
    cy.get('[alt="Roselia"]').should('exist');
    cy.get('.secondary > :nth-child(4)').click();
    cy.get('[alt="Feebas"]').should('exist').click();
    cy.contains('Met at: Route 2').should('exist');
  });
});
