import { ExtendedNavigator } from '../support/commands';

describe('Rules', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid=options]').click();
    cy.contains('Rules').click();
  });

  it('Rule CRUD', () => {
    cy.get('[data-testid=add-rule]').click();
    cy.contains('Cancel').click();
    cy.get('[data-testid=add-rule]').click();
    cy.get('[data-testid=add-rule-input] > input')
      .type('This is a test rule')
      .should('have.value', 'This is a test rule');
    cy.contains('Save').click();
    cy.contains('This is a test rule').should('exist');
    cy.get('[data-testid=edit-rule-3]').click();
    cy.get('[data-testid=edit-rule-input] > input')
      .type(' this is now an edited rule')
      .should('have.value', 'This is a test rule this is now an edited rule');
    cy.contains('Save').click();
    cy.contains('This is a test rule this is now an edited rule').should('exist');
    cy.get('[data-testid=delete-rule-3]').click();
    cy.contains('This is a test rule').should('not.exist');
    cy.get('[data-testid=arrow-down-0]').click();
    cy.get('[data-testid=ruleslist] > :nth-child(2)').should(
      'have.text',
      '2.Any Pokémon that faints is considered dead, and must be released or put in the Pokémon Storage System permanently'
    );
    cy.get('[data-testid=arrow-up-1]').click();
    cy.get('[data-testid=ruleslist] > :nth-child(1)').should(
      'have.text',
      '1.Any Pokémon that faints is considered dead, and must be released or put in the Pokémon Storage System permanently'
    );
  });

  it('Custom ruleset', () => {
    cy.get('[data-testid=add-ruleset]').click();
    cy.contains('Cancel').click();
    cy.get('[data-testid=add-ruleset]').click();
    cy.get('[data-testid=add-ruleset-input] > input')
      .type('Nuzlocke Custom')
      .should('have.value', 'Nuzlocke Custom');
    cy.contains('Save').click();
    cy.get('[data-testid=rule-select]').click();
    cy.contains('Nuzlocke Custom').should('exist').click();
    cy.get('[data-testid=add-rule]').click();
    cy.get('[data-testid=add-rule-input] > input')
      .type('This is a test rule')
      .should('have.value', 'This is a test rule');
    cy.contains('Save').click();
    cy.contains('This is a test rule').should('exist');
    cy.get('[data-testid=delete-rule-0]').click();
    cy.contains('This is a test rule').should('not.exist');
    cy.get('[data-testid=delete-ruleset]').click();
    cy.contains('Cancel').click();
    cy.get('[data-testid=delete-ruleset]').click();
    cy.contains('OK').click();
    cy.get('[data-testid=rule-select]').click();
    cy.contains('Nuzlocke Custom').should('not.exist');
  });

  it('Smart Rules of type', () => {
    cy.get('[data-testid=add-rule]').click();
    cy.contains('Type').click();
    cy.get('[data-testid=add-rule-type]').click();
    cy.contains('GRASS').click();
    cy.contains('Add Rule').click();
    cy.contains('Save').click();
    cy.contains('Allowed types: GRASS').should('exist');
    cy.get('[data-testid=edit-rule-3]').click();
    cy.contains('Cancel').click();
    cy.get('[data-testid=edit-rule-3]').click();
    cy.get('[data-testid=edit-rule-type]').click();
    cy.contains('ICE').click();
    cy.contains('Edit Rule').click();
    cy.contains('Save').click();
    cy.get('[data-testid=game-select]').click();
    cy.contains('Sword and Shield').click();
    cy.get('[data-testid=options]').click();
    cy.get('.vertical > :nth-child(1)').click();
    cy.get('[data-testid=pokemon-0]').click();
    cy.contains('Scorbunny').click();
    cy.contains('FORBIDDEN TYPE').should('exist');
  });

  it('Smart Rules of generation', () => {
    cy.get('[data-testid=add-rule]').click();
    cy.contains('Generation').click();
    cy.get('[data-testid=add-rule-generation]').click();
    cy.get('[data-testid=add-rule-generation]').contains(1).click();
    cy.contains('Add Rule').click();
    cy.contains('Save').click();
    cy.contains('Allowed generations: 1').should('exist');
    cy.get('[data-testid=edit-rule-3]').click();
    cy.get('[data-testid=edit-rule-generation]').click();
    cy.contains('6').click();
    cy.contains('Edit Rule').click();
    cy.contains('Save').click();
    cy.get('[data-testid=game-select]').click();
    cy.contains('Sword and Shield').click();
    cy.get('[data-testid=options]').click();
    cy.get('.vertical > :nth-child(1)').click();
    cy.get('[data-testid=pokemon-0]').click();
    cy.contains('Scorbunny').click();
    cy.contains('FORBIDDEN GEN').should('exist');
  });

  it('Smart Rules of level', () => {
    cy.get('[data-testid=add-rule]').click();
    cy.contains('Level').click();
    cy.get('[data-testid=add-rule-level-input] > input').type('1');
    cy.contains('Save').click();
    cy.contains('Max level 1').should('exist');
    cy.get('[data-testid=edit-rule-3]').click();
    cy.get('[data-testid=edit-rule-level-input] > input').clear().type('2');
    cy.contains('Save').click();
    cy.get('[data-testid=game-select]').click();
    cy.contains('Sword and Shield').click();
    cy.get('[data-testid=options]').click();
    cy.get('.vertical > :nth-child(1)').click();
    cy.get('[data-testid=pokemon-0]').click();
    cy.contains('Scorbunny').click();
    cy.get('[data-testid=edit-encounter-0]').click();
    cy.get('[data-testid=level] > input').type('5');
    cy.contains('Save').click();
    cy.contains('OVERLEVELED').should('exist');
  });

  it('Over 6 alert', { scrollBehavior: 'center' }, () => {
    cy.visit('/');
    cy.get('[data-testid=game-select]').click();
    cy.contains('Sword and Shield').click();
    cy.get('[data-testid=pokemon-0]').click();
    cy.contains('Scorbunny').click();
    cy.get('[data-testid=status-0]').click();
    cy.get('.visible.menu.transition').scrollTo('bottom');
    cy.get('.visible > :nth-child(7)').click();

    cy.get('[data-testid=pokemon-1]').click();
    cy.contains('Butterfree').click();
    cy.get('[data-testid=status-1]').click();
    cy.get('.visible.menu.transition').scrollTo('bottom');
    cy.get('.visible > :nth-child(7)').click();

    cy.get('[data-testid=pokemon-2]').click();
    cy.contains('Caterpie').click();
    cy.get('[data-testid=status-2]').click();
    cy.get('.visible.menu.transition').scrollTo('bottom');
    cy.get('.visible > :nth-child(7)').click();

    cy.get('[data-testid=pokemon-3]').click();
    cy.get('[data-testid="poke-Slowpoke (Galarian)"]').click();
    cy.get('[data-testid=status-3]').click();
    cy.get('.visible.menu.transition').scrollTo('bottom');
    cy.get('.visible > :nth-child(7)').click();

    cy.get('[data-testid=pokemon-4]').click();
    cy.contains('Magikarp').click();
    cy.get('[data-testid=status-4]').click();
    cy.get('.visible.menu.transition').scrollTo('bottom');
    cy.get('.visible > :nth-child(7)').click();

    cy.get('[data-testid=pokemon-5]').click();
    cy.contains('Metapod').click();
    cy.get('[data-testid=status-5]').click();
    cy.get('.visible.menu.transition').scrollTo('bottom');
    cy.get('.visible > :nth-child(7)').click();

    cy.get('[data-testid=pokemon-6]').click();
    cy.get('[data-testid=poke-Vulpix]').click({ force: true });
    cy.get('[data-testid=status-6]').click();
    cy.get('.visible.menu.transition').scrollTo('bottom');
    cy.get('.visible > :nth-child(7)').click();

    cy.contains('TEAM OVER 6').should('exist');
  });

  it('Share', { browser: 'firefox' }, () => {
    cy.get('h1').click();
    cy.get('[data-testid=share-encounters]').click();
    cy.get('[data-testid=share-textarea]').should('exist').clear().type('Test');
    cy.contains('Copy').click();
    cy.contains('Close').click();
    cy.get('[data-testid=share-encounters]').click();
    cy.get('.page').click(1, 1);
  });

  it('Share Image - WebShare', { browser: '!firefox' }, () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        (win.navigator as ExtendedNavigator).canShare = () => {
          return true;
        };
        delete win.navigator.share;
        delete (win.navigator as ExtendedNavigator).canShare;
        (win.navigator as ExtendedNavigator).canShare = cy.stub().resolves(true);
        win.navigator.share = cy.stub().resolves(true);
      },
    });
    cy.get('[data-testid=options]').click();
    cy.contains('Rules').click();
    cy.get('h1').click();
    cy.get('[data-testid=share-encounters]').click();
  });
});
