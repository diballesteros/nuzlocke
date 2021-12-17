import path = require('path');

describe('PokéStats', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid=game-select]').click();
    cy.contains('Sword and Shield').click();
  });

  it('Tips', () => {
    cy.get('[data-testid=options]').click();
    cy.contains('Stats').click();
    cy.get('.secondary > :nth-child(2) > .ui').click();
    cy.get('[data-testid=status-tip]').should('exist');
    cy.get('.secondary > :nth-child(3) > .ui').click();
    cy.get('[data-testid=status-tip]').should('exist');
    cy.get('.secondary > :nth-child(4) > .ui').click();
    cy.get('[data-testid=status-tip]').should('exist');
    cy.get('.secondary > :nth-child(5) > .ui').click();
    cy.get('[data-testid=status-tip]').should('exist');
  });

  it('General Stats Page', () => {
    cy.get('[data-testid=options]').click();
    cy.get('[data-testid=import]').click();
    cy.get('[data-testid=import-file-input]').attachFile('Team.json', { force: true });
    cy.get('[data-testid=apply-import]').click();
    cy.get('[data-testid=options]').click();
    cy.get('[data-testid=tracker]').click();
    cy.get('[data-testid="open-scroll-list"]').click();
    cy.get('[data-testid="open-scroll-list"]').click();
    cy.get('[data-testid=options]').click();
    cy.get('[data-testid=stats]').click();

    cy.contains('18%').should('exist');
    cy.contains('Pound').should('exist');
    cy.contains('Karate Chop').should('exist');
    cy.contains('Surf').should('exist');
    cy.contains('Vulpix').should('exist');
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
    cy.get('.secondary > :nth-child(5) > .ui').click().should('have.text', '1');
    cy.get('.secondary > :nth-child(4) > .ui').click().should('have.text', '1');
    cy.get('.secondary > :nth-child(3) > .ui').click().should('have.text', '5');

    cy.get('[alt="Scorbunny"]').should('exist').click();
    cy.get('[alt="Magikarp"]').should('exist').click();
    cy.get('[alt="Caterpie"]').should('exist');
    cy.get('[alt="Slowpoke (Galarian)"]').should('exist');
    cy.get('.secondary > :nth-child(4)').click();
    cy.get('[alt="Butterfree"]').should('exist');
    cy.get('.secondary > :nth-child(5)').click();
    cy.get('[alt="Lapras"]').should('exist').click();
    cy.contains('Lv. 15').should('exist');
    cy.contains('Met at: Route 2, at lv. 5').should('exist');
    cy.contains('Bold nature').should('exist');
    cy.contains('Arena Trap').should('exist');
    cy.contains('Item: Black Belt').should('exist');
    cy.contains('Cause of Fainting: Died to crit').should('exist');
    cy.get('.secondary > :nth-child(2)').click();
    cy.get('[data-testid=team-6]').click();
    cy.contains('Wild Area: Dappled Grove').should('exist');
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

  context('WebShare', () => {
    it('Success', { browser: '!firefox' }, () => {
      cy.visit('/', {
        onBeforeLoad(win) {
          win.navigator.canShare = () => {
            return true;
          };
          delete win.navigator.share;
          delete win.navigator.canShare;
          win.navigator.canShare = cy.stub().resolves(true);
          win.navigator.share = cy.stub().resolves(true);
        },
      });
      cy.get('[data-testid=game-select]').click();
      cy.contains('Sword and Shield').click();
      cy.get('[data-testid=options]').click();
      cy.contains('Stats').click();
      cy.get('h1').click();
      cy.get('[data-testid=share-image]').click();
      cy.contains('Generating image').should('exist');
      cy.wait(2000);
      cy.contains('Share the image').should('exist');
    });

    context('Errors', { browser: '!firefox' }, () => {
      afterEach(() => {
        cy.get('[data-testid=game-select]').click();
        cy.contains('Sword and Shield').click();
        cy.get('[data-testid=options]').click();
        cy.contains('Stats').click();
        cy.get('h1').click();
        cy.get('[data-testid=share-image]').click();
        cy.contains('Generating image').should('exist');
        cy.wait(2000);
        cy.contains('Unable to share').should('exist');
      });

      it('Share error', () => {
        cy.visit('/', {
          onBeforeLoad(win) {
            delete win.navigator.share;
            delete win.navigator.canShare;
            win.navigator.canShare = () => true;
            win.navigator.share = cy.stub().rejects(Error('test'));
          },
        });
      });

      it('canShare error', () => {
        cy.visit('/', {
          onBeforeLoad(win) {
            delete win.navigator.share;
            delete win.navigator.canShare;
            win.navigator.canShare = () => false;
            win.navigator.share = cy.stub().rejects(Error('test'));
          },
        });
      });
    });
  });
});
