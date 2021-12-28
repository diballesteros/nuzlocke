describe('Builder', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Build Team', () => {
    cy.get('[data-testid=options]').click();
    cy.get('[data-testid=builder]').click();
    cy.contains('Please select a game').should('exist');
    cy.contains('Coverage').click();
    cy.get('[data-testid=game-select]').click();
    cy.contains('Sword and Shield').click();
    cy.get('.secondary > :nth-child(1)').click();
    cy.get('[data-testid=builder-add]').click();
    cy.get('[data-testid=filter-button]').click();
    cy.contains('GRASS').click();
    cy.contains('GRASS').click();
    cy.get('[data-testid=filter-button]').click();
    cy.get('[data-testid=poke-Bulbasaur]').click();
    cy.get('.angle').click();
    cy.get('[data-testid=team-nature-Bulbasaur]').type('Bold');
    cy.get('[data-testid=team-ability-Bulbasaur]').click();
    cy.get('[data-testid=team-ability-Bulbasaur] > .visible > :nth-child(2)').click();
    cy.contains('Arena Trap').should('exist');
    cy.get('[data-testid=team-item-Bulbasaur]').click();
    cy.get('[data-testid=team-item-Bulbasaur] > .visible > :nth-child(2)').click();
    cy.contains('Black Belt').should('exist');
    cy.get(':nth-child(4) > b').click();
    cy.contains('Cancel').click();
    cy.get(':nth-child(4) > b').click();
    cy.get('[data-testid=move-Pound]').click();
    cy.get(':nth-child(5) > b').click();
    cy.get('[data-testid=filter] > input').type('punch').should('have.value', 'PUNCH');
    cy.get('[data-testid=filter-button]').click();
    cy.get('[data-testid=filter-gen-1]').click();
    cy.get('[data-testid=filter-gen-2]').click();
    cy.get('[data-testid=filter-gen-2]').click();
    cy.contains('NORMAL').click();
    cy.contains('NORMAL').click();
    cy.contains('ICE').click();
    cy.get('[data-testid=filter-button]').click();
    cy.get('[data-testid="move-Ice Punch"]').click();
    cy.get(':nth-child(6) > b').click();
    cy.get('[data-testid=move-Pound]').click();
    cy.get(':nth-child(6) > .ui > .trash').click();
    cy.get(':nth-child(6) > b').click();
    cy.get('[data-testid=move-Pound]').click();
    cy.get(':nth-child(7) > b').click();
    cy.get('[data-testid=move-Pound]').click();
    cy.get('[data-testid=delete-team-0]').click();
    cy.contains('Bulbasaur').should('not.exist');
    cy.get('[data-testid=builder-add]').click();
    cy.get('[data-testid=poke-Bulbasaur]').click();
    cy.get('[data-testid=builder-add]').click();
    cy.get('[data-testid=poke-Ivysaur]').click({ force: true });
    cy.get('[data-testid=builder-add]').click();
    cy.get('[data-testid=poke-Charmander]').click({ force: true });
    cy.get('[data-testid=builder-add]').click();
    cy.get('[data-testid=poke-Charmeleon]').click({ force: true });
    cy.get('[data-testid=builder-add]').click();
    cy.get('[data-testid=poke-Charizard]').click({ force: true });
    cy.get('[data-testid=builder-add]').click();
    cy.get('[data-testid=poke-Bulbasaur]').click({ force: true });
    cy.get('[data-testid=builder-add]').should('be.disabled');
  });

  it('Coverage', () => {
    cy.get('[data-testid=options]').click();
    cy.get('[data-testid=builder]').click();
    cy.contains('Coverage').click();
    cy.get('[data-testid=options]').click();
    cy.get('[data-testid=import]').click();
    cy.get('[data-testid=import-file-input]').attachFile('Coverage.json', { force: true });
    cy.get('[data-testid=apply-import]').click();
    cy.get('[data-testid=options]').click();
    cy.get('[data-testid=builder]').click();
    cy.contains('Coverage').click();
    cy.contains('ICE 4').should('exist');
    cy.contains('WATER 1').should('exist');
    cy.get('[data-testid=game-select]').click();
    cy.contains('Ruby, Sapphire and Emerald').click();
    cy.get('.secondary > :nth-child(1)').click();
    cy.get('[data-testid="builder-add"]').click();
    cy.get('[data-testid="filter"] > input').type('Snub');
    cy.get('[data-testid="poke-Snubbull"]').click();
    cy.contains('NORMAL').should('exist');
    cy.contains('Coverage').click();
    cy.contains('FIGHTING 1').should('exist');
    cy.get('[data-testid=game-select]').click();
    cy.contains('Red, Blue and Yellow').click();
  });

  context('Export to builder', () => {
    afterEach(() => {
      cy.get('[data-testid=pokemon-0]').click();
      cy.get('[data-testid=poke-Scorbunny]').click({ force: true });
      cy.get('[data-testid=edit-encounter-0]').click();
      cy.pokemondetail();
      cy.contains('Export to Builder').click();
      cy.contains('Pokémon successfully exported').should('exist');
      cy.contains('Cancel').click({ force: true });
      cy.get('[data-testid=options]').click();
      cy.contains('Builder').click();
      cy.get('[data-testid=team-poke-Scorbunny] > div > .angle').click();
      cy.contains('Scorbunny').should('exist');
      cy.contains('Arena Trap').should('exist');
      cy.contains('Black Belt').should('exist');
      cy.contains('Pound').should('exist');
      cy.contains('Karate Chop').should('exist');
      cy.contains('Surf').should('exist');
      cy.contains('Bold').should('exist');
    });

    it('No team beforehand', () => {
      cy.get('[data-testid=game-select]').click();
      cy.contains('Sword and Shield').click();
    });

    it('With team beforehand', () => {
      cy.get('[data-testid=game-select]').click();
      cy.contains('Sword and Shield').click();
      cy.get('[data-testid=options]').click();
      cy.contains('Builder').click();
      cy.get('[data-testid=builder-add]').click();
      cy.get('[data-testid=poke-Bulbasaur]').click();
      cy.get('[data-testid=options]').click();
      cy.get('[data-testid=tracker]').click();
    });
  });
});
