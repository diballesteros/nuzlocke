import path from 'path';

// Semantic UI's Checkbox focuses its hidden input on mousedown. On Firefox 158 that focus undoes
// the scroll Cypress makes before clicking, so mouseup lands on another element and the toggle is
// dropped. Clicking without that scroll avoids it; the state is asserted after each toggle.
const toggleSetting = (testId: string, checked: boolean) => {
  cy.get(`[data-testid="${testId}"] > label`).click({ scrollBehavior: false });
  cy.get(`[data-testid="${testId}"]`).should(checked ? 'have.class' : 'not.have.class', 'checked');
};

describe('PokéStats', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.selectGame('Sword and Shield');
  });

  it('Tips', () => {
    cy.get('[data-testid="options"]').click();
    cy.contains('Stats').click();
    cy.get('.secondary > :nth-child(2) > .ui').click();
    cy.get('[data-testid="status-tip"]').should('exist');
    cy.get('.secondary > :nth-child(3) > .ui').click();
    cy.get('[data-testid="status-tip"]').should('exist');
    cy.get('.secondary > :nth-child(4) > .ui').click();
    cy.get('[data-testid="status-tip"]').should('exist');
    cy.get('.secondary > :nth-child(5) > .ui').click();
    cy.get('[data-testid="status-tip"]').should('exist');
  });

  it('General Stats Page', () => {
    cy.get('[data-testid="options"]').click();
    cy.get('[data-testid="import"]').click();
    cy.get('[data-testid="import-file-input"]').selectFile('cypress/fixtures/Team.json', {
      force: true,
    });
    cy.get('[data-testid="apply-import"]').click();
    cy.get('[data-testid="options"]').click();
    cy.get('[data-testid="tracker"]').click();
    cy.get('[data-testid="open-scroll-list"]').click();
    cy.get('[data-testid="open-scroll-list"]').click();
    cy.get('[data-testid="options"]').click();
    cy.get('[data-testid="stats"]').click();

    cy.contains('18%').should('exist');
    cy.contains('Pound').should('exist');
    cy.contains('Karate Chop').should('exist');
    cy.contains('Surf').should('exist');
    cy.contains('Vulpix').should('exist');
    cy.get('[data-testid="image-box-0-true"]').should('exist');
    cy.get('[data-testid="image-fainted-0-true"]').should('exist');
    cy.get('[data-testid="display-settings"]').click();
    cy.get(':nth-child(1) > summary').click();
    cy.get('[data-testid="summary-title"] > input').type(' New');
    cy.get('[data-testid="summary-title"] > input').should('have.value', 'Nuzlocke Run New');
    cy.get('[data-testid="summary-status"]').click();
    cy.get('[data-testid="summary-status"] > .visible > :nth-child(2)').click();
    cy.get('[data-testid="summary-status"]').click();
    cy.get('[data-testid="summary-status"] > .visible > :nth-child(3)').click();
    cy.get(':nth-child(2) > summary').click();
    toggleSetting('summary-encounters', false);
    cy.get(':nth-child(3) > summary').click();
    toggleSetting('summary-stats', false);
    toggleSetting('summary-boxed', false);
    toggleSetting('summary-fainted', false);
    cy.get(':nth-child(4) > summary').click();
    toggleSetting('summary-rules', false);
    cy.get(':nth-child(5) > summary').click();
    cy.get('[data-testid="summary-show-description"]').should('have.class', 'checked');
    toggleSetting('summary-show-description', false);
    toggleSetting('summary-show-description', true);
    cy.get('[data-testid="summary-description"]').type('Summary description');
    cy.get('[data-testid="summary-description"]').should('have.value', 'Summary description');
    cy.get('[data-testid="display-settings"]').click();
    cy.contains('ENCOUNTERS').should('not.exist');
    cy.contains('STATS').should('not.exist');
    cy.contains('BOXED').should('not.exist');
    cy.contains('FAINTED').should('not.exist');
    cy.contains('RULES').should('not.exist');
    cy.contains('Summary description').should('exist');
    cy.get('.secondary > :nth-child(5) > .ui').click();
    cy.get('.secondary > :nth-child(5) > .ui').should('have.text', '1');
    cy.get('.secondary > :nth-child(4) > .ui').click();
    cy.get('.secondary > :nth-child(4) > .ui').should('have.text', '1');
    cy.get('.secondary > :nth-child(3) > .ui').click();
    cy.get('.secondary > :nth-child(3) > .ui').should('have.text', '4');

    cy.get('[data-testid="caught-0"]').should('exist').click();
    cy.get('[data-testid="caught-1"]').should('exist').click();
    cy.get('[data-testid="caught-2"]').should('exist').click();
    cy.get('.secondary > :nth-child(4)').click();
    cy.get('[data-testid="failed-5"]').should('exist');
    cy.get('.secondary > :nth-child(5)').click();
    cy.get('[data-testid="fainted-4"]').should('exist').click();
    cy.contains('Lv. 15').should('exist');
    cy.contains('Met at: Route 2, at lv. 5').should('exist');
    cy.contains('Bold nature').should('exist');
    cy.contains('Arena Trap').should('exist');
    cy.contains('Item: Black Belt').should('exist');
    cy.contains('Cause of Fainting: Died to crit').should('exist');
    cy.get('.secondary > :nth-child(2)').click();
    cy.get('[data-testid="team-6"]').click();
    cy.contains('Wild Area: Dappled Grove').should('exist');
  });

  it('Download Image', { browser: '!firefox' }, () => {
    cy.get('[data-testid=options]').click();
    cy.contains('Stats').click();
    cy.get('h1').click();
    const downloadsFolder = Cypress.config('downloadsFolder');
    cy.get('[data-testid="download-image"]').click();
    const filename = path.join(downloadsFolder, 'nuzlocke.png');
    cy.readFile(filename, 'binary', { timeout: 15000 }).should((buffer) => {
      expect(buffer.length).greaterThan(1000);
    });
  });

  context('Share Image', { browser: '!firefox' }, () => {
    const visitWithShare = (canShare: boolean) => {
      cy.visit('/stats', {
        onBeforeLoad(win) {
          Object.defineProperty(win.navigator, 'canShare', { value: () => canShare });
          Object.defineProperty(win.navigator, 'share', {
            value: cy.stub().as('share').resolves(),
          });
        },
      });
    };

    it('Share Success', () => {
      visitWithShare(true);
      cy.get('[data-testid="share-image"]').click();
      cy.contains('Share the image!', { timeout: 15000 }).should('exist');
      cy.get('@share').should('have.been.calledOnce');
    });

    it('Share Unsupported', () => {
      visitWithShare(false);
      cy.get('[data-testid="share-image"]').click();
      cy.contains('Unable to share', { timeout: 15000 }).should('exist');
      cy.get('@share').should('not.have.been.called');
    });
  });
});
