describe('Builder', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid=options]').click();
    cy.contains('Builder').click();
  });

  it('Build Team', () => {
    cy.contains('Select a game to begin').should('exist');
    cy.get('[data-testid=game-select]').click();
    cy.contains('Sword and Shield').click();
    cy.get('[data-testid=builder-add]').click();
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
});
