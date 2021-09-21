import { ExtendedNavigator } from '../support/commands';

const path = require('path');

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
    cy.get('[data-testid="cause of fainting"]')
      .type('Died to crit')
      .should('have.value', 'Died to crit');
    cy.get('[data-testid=nature-info]').click();
    cy.contains('Increased Stat').should('exist');
    cy.contains('Hardy').should('exist');
    cy.get('[data-testid=nature-close]').click();
    cy.get('[data-testid=nature-info]').click();
    cy.get('.dimmable > :nth-child(8)').click(1, 1);
    cy.pokemondetail();
    cy.contains('Save').click();

    cy.get('[data-testid=encounter-5]').click();
    cy.get('[data-testid=poke-Butterfree]').click({ force: true });
    cy.get('[data-testid=status-5]').click();
    cy.get('[data-testid=status-5] > .visible > :nth-child(5)').click();

    cy.get('[data-testid=options]').click();
    cy.contains('Stats').click();
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

  it('Team Badge', { scrollBehavior: 'center', viewportWidth: 550 }, () => {
    cy.get('[data-testid=encounter-0]').click();
    cy.get('[data-testid=poke-Scorbunny]').click({ force: true });
    cy.contains('Scorbunny').should('exist');
    cy.get('[data-testid=status-0]').click();
    cy.get('.visible.menu.transition').scrollTo('bottom');
    cy.get('.visible > :nth-child(7)').click();
    cy.get('[data-testid=edit-encounter-0]').click();
    cy.contains('Save').click();

    cy.get('[data-testid=encounter-1]').click();
    cy.get('[data-testid=poke-Butterfree]').click();
    cy.get('[data-testid=status-1]').click();
    cy.get('.visible.menu.transition').scrollTo('bottom');
    cy.get('.visible > :nth-child(7)').click();
    cy.get('[data-testid=edit-encounter-1]').click();
    cy.get('[data-testid=gender]').click();
    cy.get('[data-testid=gender] > .visible > :nth-child(1)').click();
    cy.contains('Save').click();

    cy.get('[data-testid=encounter-2]').click();
    cy.get('[data-testid=poke-Hoothoot]').click();
    cy.get('[data-testid=status-2]').click();
    cy.get('.visible.menu.transition').scrollTo('bottom');
    cy.get('.visible > :nth-child(7)').click();
    cy.get('[data-testid=edit-encounter-2]').click();
    cy.get('[data-testid=gender]').click();
    cy.get('[data-testid=gender] > .visible > :nth-child(3)').click();
    cy.contains('Save').click();

    cy.get('[data-testid=options]').click();
    cy.contains('Stats').click();
    cy.get('.secondary > :nth-child(2) > .ui').click();

    cy.get('[data-testid=team-0]').click();
    cy.contains('Met at: Starter').should('exist');
    cy.get('[data-testid=team-1]').click();
    cy.contains('Slumbering Weald').should('exist');
    cy.get('[data-testid=team-2]').click();
    cy.contains('Route 1').should('exist');
  });

  it('Summary Page', { scrollBehavior: 'center', viewportWidth: 550 }, () => {
    cy.get('[data-testid=encounter-0]').click();
    cy.get('[data-testid=poke-Scorbunny]').click({ force: true });
    cy.contains('Scorbunny').should('exist');
    cy.get('[data-testid=status-0]').click();
    cy.get('.visible.menu.transition').scrollTo('bottom');
    cy.get('.visible > :nth-child(7)').click();
    cy.get('[data-testid=edit-encounter-0]').click();
    cy.contains('Close').click();
    cy.get('[data-testid=edit-encounter-0]').click();
    cy.pokemondetail();
    cy.contains('Save').click();

    cy.get('[data-testid=pokemon-1]').click();
    cy.get('[data-testid=poke-Magikarp]').click({ force: true });
    cy.contains('Magikarp').should('exist');
    cy.get('[data-testid=status-1]').click();
    cy.get('[data-testid=status-1] > .visible > :nth-child(1)').click();

    cy.get('[data-testid=pokemon-2]').click();
    cy.get('[data-testid=poke-Caterpie]').click({ force: true });
    cy.contains('Magikarp').should('exist');
    cy.get('[data-testid=status-2]').click();
    cy.get('[data-testid=status-2] > .visible > :nth-child(2)').click();

    cy.get('[data-testid=options]').click();
    cy.contains('Stats').click();
    cy.contains('8%').should('exist');
    cy.contains('Pound').should('exist');
    cy.contains('Karate Chop').should('exist');
    cy.contains('Surf').should('exist');
    cy.contains('Scorbunny').should('exist');
    cy.get('[data-testid=image-box-0-true]').should('exist');
    cy.get('[data-testid=image-fainted-0-true]').should('exist');

    cy.get('[data-testid=display-settings]').click();
    cy.get(':nth-child(1) > summary').click();
    cy.get('[data-testid=summary-title] > input')
      .type(' New')
      .should('have.value', 'Nuzlocke Run New');
    cy.get('[data-testid=summary-status]').click();
    cy.get('[data-testid=summary-status] > .visible > :nth-child(2)').click();
    cy.get('[data-testid=summary-status]').click();
    cy.get('[data-testid=summary-status] > .visible > :nth-child(3)').click();
    cy.get(':nth-child(2) > summary').click();
    cy.get('[data-testid=summary-encounters] > label').click();
    cy.get(':nth-child(3) > summary').click();
    cy.get('[data-testid=summary-stats] > label').click();
    cy.get('[data-testid=summary-boxed] > label').click();
    cy.get('[data-testid=summary-fainted] > label').click();
    cy.get(':nth-child(4) > summary').click();
    cy.get('[data-testid=summary-rules] > label').click();
    cy.get(':nth-child(5) > summary').click();
    cy.get('[data-testid=summary-show-description] > label').click();
    cy.get('[data-testid=summary-show-description] > label').click();
    cy.get('[data-testid=summary-description]')
      .type('Summary description')
      .should('have.value', 'Summary description');
    cy.get('[data-testid=display-settings]').click();
    cy.contains('ENCOUNTERS').should('not.exist');
    cy.contains('STATS').should('not.exist');
    cy.contains('BOXED').should('not.exist');
    cy.contains('FAINTED').should('not.exist');
    cy.contains('RULES').should('not.exist');
    cy.contains('Summary description').should('exist');
  });

  it('Download Image', { browser: '!firefox' }, () => {
    cy.get('[data-testid=options]').click();
    cy.contains('Stats').click();
    cy.get('h1').click();
    const downloadsFolder = Cypress.config('downloadsFolder');
    cy.get('[data-testid=download-image]').click();
    cy.wait(3000);
    const filename = path.join(downloadsFolder, 'nuzlocke.png');
    cy.readFile(filename, 'binary', { timeout: 15000 }).should((buffer) => {
      expect(buffer.length).to.be.gt(1000);
    });
  });

  context('Webshare', () => {
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
      cy.get('[data-testid=game-select]').click();
      cy.contains('Sword and Shield').click();
      cy.get('[data-testid=options]').click();
      cy.contains('Stats').click();
      cy.get('h1').click();
      cy.get('[data-testid=share-image]').click();
      cy.contains('Generating Image').should('exist');
      cy.wait(2000);
    });

    it('Share Image - WebShare - Error', { browser: '!firefox' }, () => {
      cy.visit('/', {
        onBeforeLoad(win) {
          delete win.navigator.share;
          delete (win.navigator as ExtendedNavigator).canShare;
          (win.navigator as ExtendedNavigator).canShare = () => true;
          win.navigator.share = cy.stub().rejects(Error('test'));
          cy.stub(win.console, 'error').as('consoleError');
        },
      });
      cy.get('[data-testid=game-select]').click();
      cy.contains('Sword and Shield').click();
      cy.get('[data-testid=options]').click();
      cy.contains('Stats').click();
      cy.get('h1').click();
      cy.get('[data-testid=share-image]').click();
      cy.contains('Generating Image').should('exist');
      cy.get('@consoleError').should('be.calledOnce');
    });
  });
});
