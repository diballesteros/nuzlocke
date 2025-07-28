describe('Local Storage', () => {
  it('Migrate Zustand Version', () => {
    cy.visit('/');
    cy.get('[data-testid="app"]').should('be.visible');
    cy.get('[data-testid="options"]').should('be.visible');
    cy.window().then((win) => {
      const data = win.localStorage.getItem('pokemon-tracker');
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
      const replaceShiny = addFilter.replace(
        '"status":null',
        '"status":{"value":6}, "details":{ "id":1,"level":1,"moves":[]}'
      );
      const replaceSoulocke = replaceShiny.replace('Soulocke', 'SomethingElse');
      const replaceWedlocke = replaceSoulocke.replace('Wedlocke', 'SomethingElse');
      const replaceBadge = replaceWedlocke.replace('"badge":[]', '"badge":null');
      const changeVersion = replaceBadge.replace('"version":8', '"version":0');
      win.localStorage.setItem('pokemon-tracker', changeVersion);
    });
    cy.visit('/');
    cy.contains('Nuzlocke Tracker').should('exist');
  });

  it('Remake Brilliant Diamond and Shining Pearl', () => {
    cy.visit('/');
    cy.get('[data-testid="app"]').should('be.visible');
    cy.get('[data-testid="options"]').should('be.visible');
    cy.window().then((win) => {
      const data = win.localStorage.getItem('pokemon-tracker');
      const removeBDSP = data.replace(/13.1/gi, '15');
      const changeVersion = removeBDSP.replace('"version":8', '"version":4');
      win.localStorage.setItem('pokemon-tracker', changeVersion);
    });
    cy.visit('/');
    cy.contains('Nuzlocke Tracker').should('exist');
  });
});
