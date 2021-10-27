describe('Import', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid=options]').click();
    cy.get('[data-testid=import]').click();
  });

  it('Import - Success', () => {
    cy.get('[data-testid=import-file-input]').attachFile('PokemonList.json', { force: true });
    cy.get('[data-testid=apply-import]').click();
    cy.get('[data-testid=options]').click();
    cy.get('[data-testid=tracker]').click();
    cy.contains('Emerald Kaizo').should('exist');
    cy.contains('Super Secret Place').should('exist');
    cy.contains('Bulbasaur').should('exist');
    cy.contains('Team').should('exist');
    cy.get('[data-testid=options]').click();
    cy.contains('Rules').click();
    cy.contains('Have fun!').should('exist');
    cy.get('[data-testid=options]').click();
    cy.contains('Stats').click();
    cy.contains('ONGOING').should('exist');
    cy.get('[data-testid=options]').click();
    cy.contains('Builder').click();
    cy.get('[data-testid=team-poke-Venusaur]').should('exist');
    cy.get('[data-testid=options]').click();
    cy.get('[data-testid=calculator]').click();
    cy.contains('Bulbasaur').should('exist');
  });

  it('Import - Failure', () => {
    cy.get('[data-testid=import-file-input]').attachFile('Invalid.json');
    cy.get('[data-testid=apply-import]').click();
    cy.contains('Invalid file').should('exist');
  });

  context('PkHeX Imports', () => {
    beforeEach(() => {
      cy.get('[data-testid=game-select]').click();
      cy.contains('HeartGold and SoulSilver').click();
    });

    it('Import Game by Table', () => {
      cy.fixture('table.txt', 'utf8').then((data) => {
        cy.get('[data-testid=table-import-textarea]').type(data, { delay: 0 });
        cy.get('[data-testid=table-import-option] > label').click();
        cy.get('[data-testid=apply-import]').click();
        cy.contains('Successfully imported game encounters').should('exist');
        cy.get('[data-testid=options]').click();
        cy.get('[data-testid=tracker]').click();
        cy.contains('Bayleef').should('exist');
      });
    });

    it('Import Game by Table - Failure', () => {
      cy.get('[data-testid=table-import-textarea]').type('Invalid text');
      cy.get('[data-testid=table-import-option] > label').click();
      cy.get('[data-testid=apply-import]').click();
      cy.contains('Invalid text').should('exist');
      cy.get('[data-testid=all-import-option] > label').click();
    });
  });
});
