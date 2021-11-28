describe('Local Storage', () => {
  beforeEach(() => {
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
      const changeVersion = addFilter.replace('"version":5', '"version":0');
      cy.setLocalStorage('pokemon-tracker', changeVersion);
    });
  });

  it('Migrate Zustand Version', () => {
    cy.visit('/');
    cy.contains('Nuzlocke Tracker').should('exist');
  });
});
