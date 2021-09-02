describe('Badges', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid=game-select]').click();
    cy.contains('Sword and Shield').click();
    cy.contains('Builder').click();
  });

  it('Build Team', () => {
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
