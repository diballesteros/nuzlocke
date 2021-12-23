describe('Local Storage', () => {
  it('Migrate Zustand Version', () => {
    cy.visit('/');
    cy.getLocalStorage('pokemon-tracker').then((data) => {
      const addPokemon = data.replace('"pokemon":null', '"pokemon":{"value":1}');
      const addRule = addPokemon.replace(
        '"rules":{"Nuzlocke"',
        '"rules":{"Test":[{"content":"Test"}], "Nuzlocke"'
      );
      const addRuleset = addRule.replace(
        '"typeModal":null',
        '"typeModal":null,"rulesets":[{"text": "Nuzlocke", "value":"Nuzlocke"}, {"text":"Test","value":"Test"}]'
      );
      const addFilter = addRuleset.replace('"pokemon":null', '"pokemon":null,"filter":["Test"]');
      const replaceSoulocke = addFilter.replace('Soulocke', 'SomethingElse');
      const changeVersion = replaceSoulocke.replace('"version":6', '"version":0');
      cy.setLocalStorage('pokemon-tracker', changeVersion);
    });
    cy.visit('/');
    cy.contains('Nuzlocke Tracker').should('exist');
  });

  it('Remake Brilliant Diamond and Shining Pearl', () => {
    cy.visit('/');
    cy.getLocalStorage('pokemon-tracker').then((data) => {
      const removeBDSP = data.replace('13.1', '15');
      cy.setLocalStorage('pokemon-tracker', removeBDSP);
    });
    cy.visit('/');
    cy.contains('Nuzlocke Tracker').should('exist');
  });
});
