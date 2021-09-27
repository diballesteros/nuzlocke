describe('Builder', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Build Team', () => {
    cy.get('[data-testid=options]').click();
    cy.contains('Builder').click();
    cy.contains('Select a game to begin').should('exist');
    cy.get('[data-testid=game-select]').click();
    cy.contains('Sword and Shield').click();
    cy.get('[data-testid=builder-add]').click();
    cy.get('[data-testid=filter-button]').click();
    cy.contains('GRASS').click();
    cy.contains('GRASS').click();
    cy.get('[data-testid=filter-button]').click();
    cy.get('[data-testid=poke-Bulbasaur]').click();
    cy.get('.angle').click();
    cy.get('[data-testid=team-nature-Bulbasaur]').type('Bold');
    cy.get('[data-testid=team-ability-Bulbasaur] > input')
      .type('Ability')
      .should('have.value', 'Ability');
    cy.get('[data-testid=team-item-Bulbasaur] > input')
      .type('Oran Berry')
      .should('have.value', 'Oran Berry');
    cy.get(':nth-child(4) > b').click();
    cy.contains('Close').click();
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

  context('Export to builder', () => {
    afterEach(() => {
      cy.get('[data-testid=pokemon-0]').click();
      cy.get('[data-testid=poke-Scorbunny]').click({ force: true });
      cy.get('[data-testid=edit-encounter-0]').click();
      cy.pokemondetail();
      cy.contains('Export to Builder').click();
      cy.contains('Pokémon successfully exported').should('exist');
      cy.contains('Close').click({ force: true });
      cy.get('[data-testid=options]').click();
      cy.contains('Builder').click();
      cy.get('[data-testid=team-poke-Scorbunny] > div > .angle').click();
      cy.contains('Scorbunny').should('exist');
      cy.get('[data-testid=team-ability-Scorbunny] > input').should('have.value', 'Ability');
      cy.get('[data-testid=team-item-Scorbunny] > input').should('have.value', 'Oran Berry');
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
