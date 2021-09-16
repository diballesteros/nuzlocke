describe('PokéStats', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid=game-select]').click();
    cy.contains('Sword and Shield').click();
  });

  it('Pokemon counters', () => {
    cy.get('[data-testid=encounter-0]').click();
    cy.get('[data-testid=poke-Scorbunny]').click({ force: true });
    cy.contains('Scorbunny').should('exist');
    cy.get('[data-testid=status-0]').click();
    cy.get('[data-testid=status-0] > .visible > :nth-child(1)').click();

    cy.get('[data-testid=encounter-1]').click();
    cy.get('[data-testid=poke-Magikarp]').click({ force: true });
    cy.get('[data-testid=status-1]').click();
    cy.get('[data-testid=status-1] > .visible > :nth-child(3)').click();

    cy.get('[data-testid=encounter-2]').click();
    cy.get('[data-testid=poke-Caterpie]').click({ force: true });
    cy.get('[data-testid=status-2]').click();
    cy.get('[data-testid=status-2] > .visible > :nth-child(4)').click();

    cy.get('[data-testid=encounter-3]').click();
    cy.get('[data-testid="poke-Slowpoke (Galarian)"]').click({ force: true });
    cy.get('[data-testid=status-3]').click();
    cy.get('[data-testid=status-3] > .visible > :nth-child(6)').click();

    cy.get('[data-testid=encounter-4]').click();
    cy.get('[data-testid=poke-Lapras]').click({ force: true });
    cy.get('[data-testid=status-4]').click();
    cy.get('[data-testid=status-4] > .visible > :nth-child(2)').click();
    cy.get('[data-testid=edit-encounter-4]').click();
    cy.get('[data-testid=level] > input').type('15').should('have.value', 15);
    cy.get('[data-testid=metlevel] > input').type('5').should('have.value', 5);
    cy.get('[data-testid=ability] > input').type('Ability').should('have.value', 'Ability');
    cy.get('[data-testid=item] > input').type('Oran Berry').should('have.value', 'Oran Berry');
    cy.get('[data-testid="cause of fainting"]')
      .type('Died to crit')
      .should('have.value', 'Died to crit');
    cy.get('[data-testid=gender-4]').click();
    cy.get('[data-testid=gender-4] > .visible > :nth-child(2)').click();
    cy.get('[data-testid=nature-4]').type('Bold');
    cy.get('[data-testid=move-summary]').click();
    cy.get('[data-testid=move-1] > div').click();
    cy.get('[data-testid=move-Pound]').click();
    cy.get('[data-testid=move-2] > div').click();
    cy.get('[data-testid="move-Karate Chop"]').click({ force: true });
    cy.get('[data-testid=move-3] > div').click();
    cy.get('[data-testid=filter-button]').click();
    cy.get('[data-testid=filter-gen-1]').click();
    cy.get('[data-testid=filter-type-WATER]').click();
    cy.get('[data-testid=filter-button]').click();
    cy.get('[data-testid=move-Surf]').click({ force: true });
    cy.get('[data-testid=move-4] > div').click();
    cy.get('[data-testid=move-Pound]').click();

    cy.contains('Save').click();

    cy.get('[data-testid=encounter-5]').click();
    cy.get('[data-testid=poke-Butterfree]').click({ force: true });
    cy.get('[data-testid=status-5]').click();
    cy.get('[data-testid=status-5] > .visible > :nth-child(5)').click();

    cy.get('[data-testid=options]').click();
    cy.contains('Stats').click();
    cy.contains('16%').should('exist');
    cy.get('.secondary > :nth-child(3) > .ui').click().should('have.text', '4');
    cy.get('.secondary > :nth-child(4) > .ui').should('have.text', '1');
    cy.get('.secondary > :nth-child(5) > .ui').should('have.text', '1');
    cy.get('[alt="Scorbunny"]').should('exist');
    cy.get('[alt="Magikarp"]').should('exist');
    cy.get('[alt="Caterpie"]').should('exist');
    cy.get('[alt="Slowpoke (Galarian)"]').should('exist');
    cy.get('.secondary > :nth-child(4)').click();
    cy.get('[alt="Butterfree"]').should('exist');
    cy.get('.secondary > :nth-child(5)').click();
    cy.get('[alt="Lapras"]').should('exist').click();
    cy.contains('Lv. 15').should('exist');
    cy.contains('Met at: Route 2, at lv. 5').should('exist');
    cy.contains('Bold nature').should('exist');
    cy.contains('Ability').should('exist');
    cy.contains('Item: Oran Berry').should('exist');
    cy.contains('Cause of Fainting: Died to crit').should('exist');
  });
});
