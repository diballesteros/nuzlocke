describe('Calculator', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Base Calculations', { scrollBehavior: 'center' }, () => {
    cy.get('[data-testid=options]').click();
    cy.get('[data-testid=calculator]').click();
    cy.contains('Please select a game').should('exist');
    cy.get('[data-testid=game-select]').click();
    cy.contains('Sword and Shield').click();
    cy.get('[data-testid=minus-level1]').click();
    cy.get('[data-testid=level-input1]').should('have.value', '99');
    cy.get('[data-testid=plus-level1]').click();
    cy.get('[data-testid=level-input1]').should('have.value', '100');
    cy.get('[data-testid=level-input1]').clear().type('10').should('have.value', '10');
    cy.get('[data-testid=nature1] > .search').type('Bold');
    cy.get('[data-testid=nature1] > .visible > :nth-child(1)').click();
    cy.get('[data-testid=ability1] > .search').click().type('Overgrow');
    cy.get('[data-testid=ability1] > .visible > :nth-child(1)').click();
    cy.get('[data-testid=item1] > .search').type('Miracle Seed');
    cy.get('[data-testid=item1] > .visible > :nth-child(1)').click();
    cy.contains(
      'Lvl 10 0- Atk Bulbasaur Pound vs. 0 HP / 0 Def Bulbasaur: 1-2 (0.4 - 0.8%)'
    ).should('exist');
    cy.get('[data-testid=status1] > .search').type('Burned');
    cy.get('[data-testid=status1] > .visible > :nth-child(1)').click();
    cy.contains(
      'Lvl 10 0- Atk burned Bulbasaur Pound vs. 0 HP / 0 Def Bulbasaur: 1-1 (0.4 - 0.4%)'
    ).should('exist');
    cy.get('[data-testid=move1_crit1]').click();
    cy.contains(
      'Lvl 10 0- Atk burned Bulbasaur Pound vs. 0 HP / 0 Def Bulbasaur on a critical hit: 1-1 (0.4 - 0.4%)'
    ).should('exist');
    cy.get('[data-testid=move2_1] > div').click();
    cy.get('[data-testid=filter] > input').type('Razor leaf');
    cy.get('[data-testid="move-Razor Leaf"]').click();
    cy.get('[data-testid=move2_z1]').click();
    cy.get('[data-testid=hp1-detail]').click();
    cy.get('[data-testid=currenthp1]').clear().type('50');
    cy.get('[data-testid=atk1-detail]').click();
    cy.get('[data-testid=minus-modatk1]').click();
    cy.get('[data-testid=modatk1]').should('contain.text', '-1');
    cy.get('[data-testid=plus-modatk1]').click();
    cy.get('[data-testid=modatk1]').should('contain.text', '0');
    cy.get('[data-testid=isDynamaxed1]').click();
    cy.contains(
      'Lvl 10 0- Atk burned Bulbasaur Max Strike vs. 0 HP / 0 Def Dynamax Bulbasaur on a critical hit: 1-2 (0.2 - 0.4%)'
    ).should('exist');
    cy.get('[data-testid=spike-3-1] > label').click();
    cy.get('[data-testid=expand-moves]').click();
    cy.get('[data-testid=attacker-result-2]').click();
    cy.get('[data-testid=primary-damage]').should(
      'have.text',
      'Lvl 10 0- Atk Miracle Seed burned Bulbasaur Max Overgrowth vs. 0 HP / 0 Def Dynamax Bulbasaur: 1-1 (0.2 - 0.2%)'
    );
    cy.get('[data-testid=defender-result-1]').click();
    cy.get('[data-testid=primary-damage]').should(
      'have.text',
      '0 Atk Bulbasaur Pound vs. Lvl 10 0 HP / 0+ Def Dynamax Bulbasaur: 214-252 (334.3 - 393.7%) -- guaranteed OHKO'
    );
    cy.get('[data-testid=isSwitching1]').click();
    cy.get('[data-testid=field-settings]').click();
    cy.get('[data-testid=gameType-doubles] > label').click();
    cy.get('[data-testid=terrain-Grassy] > label').click();
    cy.get('[data-testid=weather-Rain] > label').click();
    cy.get('[data-testid=isGravity]').click();
    cy.get('[data-testid=field-settings]').click();
    cy.get('[data-testid=reset-calculator]').click();
    cy.contains(
      '0 Atk Bulbasaur Pound vs. 0 HP / 0 Def Bulbasaur: 29-35 (12.5 - 15.1%) -- possible 7HKO'
    ).should('exist');
  });
});
