// @ts-ignore
const stepTo = ($el, target) => {
  const step = $el[0].getAttribute('step') || 1;
  const current = $el[0].value;
  const diff = target - current;
  const steps = Math.abs(diff * step);
  if (diff > 0) {
    $el[0].stepUp(steps);
  } else {
    $el[0].stepDown(steps);
  }
};

describe('Encounters', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid=game-select]').click();
    cy.contains('Sword and Shield').click();
  });

  it('Filter', () => {
    cy.get('[data-testid=filter] > input')
      .type('Slumbering Weald')
      .should('have.value', 'Slumbering Weald');
    cy.get('[data-testid=pokemon-1]').click();
    cy.get('[data-testid="remove-tooltip"]').click();
    cy.get('[data-testid=poke-Butterfree]').click();
    cy.get('[data-testid=filter-button]').click();
    cy.get('[data-testid=filter-gen-1]').click();
    cy.get('[data-testid=filter-gen-1]').click();
    cy.get('[data-testid=filter-type-BUG]').click();
    cy.get('[data-testid=filter-type-BUG]').click();
    cy.get('[data-testid=filter-button]').click();
    cy.get('[data-testid=encounters-list]')
      .children()
      .children()
      .children()
      .should('have.length', 1);
    cy.get('[data-testid="filter"] > .ui > .question').click({ force: true });
    cy.contains('Search by Pokémon, location, or status').should('be.visible');
  });

  it('Edit base encounter', () => {
    cy.get('[data-testid="pokemon-0"]').click();
    cy.contains('Cancel').click();
    cy.get('[data-testid="pokemon-0"]').click();
    cy.get('.st0Fire').click({ force: true });
    cy.contains('Super effective against').should('exist');
    cy.get('.tabular > :nth-child(3)').click();
    cy.get('.st0Steel').click({ force: true, multiple: true });
    cy.get('[data-testid=effect-close]').click();
    cy.get('[data-testid=poke-Scorbunny]').click({ force: true });
    cy.contains('Scorbunny').should('exist');

    cy.get('[data-testid=edit-encounter-0]').click();
    cy.contains('Cancel').click();
    cy.get('[data-testid=status-0]').click();
    cy.get('[data-testid="status-0"] > .visible > :nth-child(2)').click({
      waitForAnimations: true,
      force: true,
    });
    cy.get('[data-testid=status-0]').click();
    cy.get('[data-testid="status-0"] > .visible > :nth-child(2)').click({
      waitForAnimations: true,
      force: true,
    });
    cy.get('[data-testid=status-0] > .divider').should('have.text', 'Fainted');
    cy.get('[data-testid=edit-encounter-0]').click();
    cy.get('[data-testid="cause of fainting"]')
      .type('Died to crit')
      .should('have.value', 'Died to crit');
    cy.get('[data-testid=nature-info]').click();
    cy.contains('Increased stat').should('exist');
    cy.contains('Hardy').should('exist');
    cy.get('[data-testid=nature-close]').click();
    cy.get('[data-testid=nature-info]').click();
    cy.get('.dimmable > div').click(1, 1, { force: true, multiple: true });

    cy.get('[data-testid="ability-info"]').click();
    cy.get('[data-testid="ability-search"] > input').type('Aftermath');
    cy.get('[data-testid="ability-close"]').click();
    cy.get('[data-testid="ability-info"]').click();
    cy.get('.dimmable > div').click(1, 1, { force: true, multiple: true });

    cy.get('[data-testid="stats-summary"]').click();
    cy.get('[data-testid="input-ivhp"]').type('10').should('have.value', 10);
    cy.get('[data-testid="input-ivhp"]').type('{backspace}{backspace}').should('have.value', 0);
    cy.get('[data-testid="evhp"]')
      .then(($el) => stepTo($el, 1))
      .trigger('change');
    cy.get('[data-testid="ivhp"]')
      .then(($el) => stepTo($el, 1))
      .trigger('change');
    cy.get('[data-testid="ivatk"]')
      .then(($el) => stepTo($el, 1))
      .trigger('change');
    cy.get('[data-testid="evatk"]')
      .then(($el) => stepTo($el, 1))
      .trigger('change');
    cy.get('[data-testid="ivdef"]')
      .then(($el) => stepTo($el, 1))
      .trigger('change');
    cy.get('[data-testid="evdef"]')
      .then(($el) => stepTo($el, 1))
      .trigger('change');
    cy.get('[data-testid="ivspatk"]')
      .then(($el) => stepTo($el, 1))
      .trigger('change');
    cy.get('[data-testid="evspatk"]')
      .then(($el) => stepTo($el, 1))
      .trigger('change');
    cy.get('[data-testid="ivspdef"]')
      .then(($el) => stepTo($el, 1))
      .trigger('change');
    cy.get('[data-testid="evspdef"]')
      .then(($el) => stepTo($el, 1))
      .trigger('change');
    cy.get('[data-testid="ivspeed"]')
      .then(($el) => stepTo($el, 1))
      .trigger('change');
    cy.get('[data-testid="evspeed"]')
      .then(($el) => stepTo($el, 1))
      .trigger('change');

    cy.get('[data-testid="ivhp-substract"]').click();
    cy.get('[data-testid="ivhp-add"]').click();

    cy.get('[data-testid="evhp-add"]').click();

    cy.contains('Save').click();

    cy.get('[data-testid="evolve-0}"]').click();
    cy.get(':nth-child(3) > .ui > label').click();
    cy.contains('Cancel').click();
    cy.get('[data-testid="evolve-0}"]').click();
    cy.get(':nth-child(2) > .ui > label').click();
    cy.contains('Save').click();
    cy.contains('Raboot').should('exist');
    cy.get('[data-testid="encounter-options-0"]').click();
    cy.get('[data-testid="reset-encounter-0"]').click();
    cy.get('[data-testid=encounter-empty-0]').should('exist');
    cy.get('[data-testid=status-0] > .divider').should('have.text', 'Status...');
  });

  it('Reset all encounters', () => {
    cy.get('[data-testid="pokemon-0"]').click();
    cy.get('[data-testid=poke-Scorbunny]').click({ force: true });
    cy.get('[data-testid=reset-all]').click();
    cy.contains('Cancel').click();
    cy.get('[data-testid=reset-all]').click();
    cy.get('.page').click(1, 1);
    cy.get('[data-testid=reset-all]').click();
    cy.contains('Save').click();
    cy.get('[data-testid=status-0] > .divider').should('have.text', 'Status...');
  });

  it('Delete encounter', () => {
    cy.get('[data-testid="encounter-options-0"]').click();
    cy.get('[data-testid="delete-encounter-0"]').click();
    cy.contains('Cancel').click();
    cy.get('[data-testid="encounter-options-0"]').click();
    cy.get('[data-testid="delete-encounter-0"]').click();
    cy.contains('OK').click();
    cy.get('[data-testid=filter] > input').type('Starter');
    cy.get('[data-testid=encounters-list]')
      .children()
      .children()
      .children()
      .should('have.length', 0);
  });

  it('Add encounter', () => {
    cy.get('[data-testid=add-encounter]').click();
    cy.contains('Cancel').click();
    cy.get('[data-testid=add-encounter]').click();
    cy.get('[data-testid=add-encounter-input] > input').type('Test').should('have.value', 'Test');
    cy.contains('Save').click();
    cy.get('[data-testid=filter] > input').type('Test');
    cy.get('[data-testid=encounters-list]')
      .children()
      .children()
      .children()
      .should('have.length', 1);
  });

  it('Export to another game', () => {
    cy.get('[data-testid="pokemon-0"]').click();
    cy.get('[data-testid=poke-Scorbunny]').click({ force: true });
    cy.get('[data-testid=edit-encounter-0]').click();
    cy.get('[data-testid=export-to-game]').click();
    cy.get('[data-testid=export-to-game] > .visible > :nth-child(2)').click();
    cy.get('[data-testid=game-select]').click();
    cy.contains('Gold, Silver and Crystal').click();
    cy.contains('From Sword and Shield').should('exist');
    cy.contains('Scorbunny').should('exist');
  });

  it('Direct leveling', () => {
    cy.get('[data-testid="pokemon-0"]').click();
    cy.get('[data-testid=poke-Scorbunny]').click({ force: true });
    cy.get('[data-testid="encounter-options-0"]').click();
    cy.get('[data-testid="level-up-0"]').click();
    cy.get('[data-testid="encounter-options-0"]').click();
    cy.get('[data-testid="level-up-0"]').click();
    cy.get('[data-testid="encounter-options-0"]').click();
    cy.get('[data-testid="level-down-0"]').click();
    cy.get('[data-testid="encounter-options-0"]').click();
    cy.get('[data-testid="reset-encounter-0"]').click();
    cy.get('[data-testid="pokemon-0"]').click();
    cy.get('[data-testid=poke-Scorbunny]').click({ force: true });
    cy.get('[data-testid=edit-encounter-0]').click();
    cy.get('[data-testid=metlevel] > input').type('5').should('have.value', 5);
    cy.contains('Save').click();
    cy.get('[data-testid="encounter-options-0"]').click();
    cy.get('[data-testid="level-up-0"]').click();
    cy.get('[data-testid="level-up-button-0"]').click();
    cy.get('[data-testid="level-down-button-0"]').click();
  });

  it('Swap & Scroll & Nature & Notes', () => {
    cy.get('[data-testid=options]').click();
    cy.get('[data-testid=import]').click();
    cy.get('[data-testid=import-file-input]').attachFile('over6.json', { force: true });
    cy.get('[data-testid=apply-import]').click();
    cy.get('[data-testid=options]').click();
    cy.get('[data-testid=tracker]').click();
    cy.get('[data-testid="open-scroll-list"]').click();
    cy.get('[data-testid="skip-encounter-7"]').click();
    cy.get('[data-testid="skip-encounter-7"]').click();
    cy.get('[data-testid="skip-encounter-8"]').click();
    cy.get('[data-testid="skip-encounter-8"]').click();
    cy.get('[data-testid="open-scroll-list"]').click();
    cy.get('[data-testid="scroll-to-last-encounter-7"]').click({ force: true });
    cy.get('[data-testid="pokemon-7"]').should('exist').click();
    cy.contains('DUPE').should('exist');
    cy.get('[data-testid="poke-Growlithe"]').click({ force: true });
    cy.get('[data-testid="status-7"]').click();
    cy.get('[data-testid="status-7"] > .visible > :nth-child(3)').click();
    cy.get('[data-testid="swap-7"]').click();
    cy.get('[data-testid="poke-Magikarp"]').click({ force: true });
    cy.get('[data-testid="swap-7"]').click();
    cy.get('[data-testid="swap-6"]').click();
    cy.get('[data-testid="status-6"]').click();
    cy.get('[data-testid="status-6"] > .visible > :nth-child(3)').click();
    cy.get('[data-testid="swap-6"]').click();
    cy.get('[data-testid="swap-6"]').click();
    cy.get('[data-testid="open-scroll-list"]').click();
    cy.get('[data-testid="close-scroll-list"]').click();
    cy.get('[data-testid="open-scroll-list"]').click();
    cy.get('[data-testid="scroll-to-encounter-0"]').click();
    cy.contains('Starter').should('be.visible');
    cy.get('[data-testid="nature-0"]').click();
    cy.get('[data-testid="nature-0"] > .visible > :nth-child(2)').click();
    cy.get('[data-testid="nature-0"]').click();
    cy.get('[data-testid="nature-0"] > .visible > :nth-child(3)').click();
    cy.get('[data-testid="open-notes"]').click();
    cy.get('[data-testid="game-notes"]')
      .type('These are notes')
      .should('have.value', 'These are notes');
  });

  context('Small screens', () => {
    beforeEach(() => {
      cy.viewport('iphone-6+');
      cy.get('[data-testid=fab-tracker] > .ui').click();
    });

    it('Add encounter - Small', () => {
      cy.get('[data-testid=fab-add-encounter] > [data-testid=add-encounter]').click();
      cy.get('[data-testid=add-encounter-input] > input').type('Test').should('have.value', 'Test');
      cy.contains('Save').click();
      cy.get('[data-testid=filter] > input').type('Test');
      cy.get('[data-testid=encounters-list]')
        .children()
        .children()
        .children()
        .should('have.length', 1);
    });

    it('Reset all encounters - Small', () => {
      cy.get('[data-testid="pokemon-0"]').click();
      cy.get('[data-testid=poke-Scorbunny]').click({ force: true });
      cy.get('[data-testid=fab-reset-encounters] > [data-testid=reset-all]').click();
      cy.contains('Save').click();
      cy.get('[data-testid=status-0] > .divider').should('have.text', 'Status...');
    });
  });
});
