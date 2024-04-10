import path from 'path';

describe('Options', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid=options]').click();
  });

  it('Settings', () => {
    cy.contains('Settings').click();
    cy.contains('Settings').should('exist');
    cy.get('[data-testid=settings-dupes] > label').click();
    cy.get('[data-testid=settings-nickname] > label').click();
    cy.get('[data-testid=settings-missing] > label').click();
    cy.get('[data-testid=settings-showall] > label').click();
    cy.contains('Back').click();
    cy.get('[data-testid=game-select]').click();
    cy.contains('Sword and Shield').click();
    cy.get('[data-testid=pokemon-0]').click();
    cy.get('[data-testid=poke-Bulbasaur]').click({ force: true });
    cy.get('[data-testid=nickname-0] > input').type('Bulbadude').should('have.value', 'Bulbadude');
    cy.get('[data-testid=filter] > input').click();
    cy.get('[data-testid=pokemon-1]').click();
    cy.get('[data-testid=poke-Bulbasaur]').click({ force: true });
    cy.get('[data-testid="alert-0"]').click();
    cy.contains('DUPE').should('exist');
    cy.contains('Duplicate pokémon are not allowed').should('exist');
    cy.contains('Starter').should('exist');
    cy.get('[data-testid=status-0]').click();
    cy.get('[data-testid=status-0] > .visible > :nth-child(2)').click();
    cy.contains('Starter').should('not.exist');
    cy.get('[data-testid=nickname-1] > .ui').click();
    cy.get('[data-testid=nickname-1] > input').should('have.length.above', 0);
    cy.get('[data-testid=search-options]').click();
    cy.contains('Settings').should('exist');
  });

  it('About and Changelog', () => {
    cy.contains('!').should('exist');
    cy.get('[data-testid=about]').click();
    cy.contains('About').should('exist');
    cy.contains('Back').click();
    cy.get('[data-testid=options]').click();
    cy.get('[data-testid=changelog]').click();
    cy.contains('Changelog').should('exist');
    cy.get('[data-testid=changelog-list]').find('h4').should('have.length', 3);
    cy.get('[data-testid=see-more]').click();
    cy.get('[data-testid=changelog-list]').find('h4').should('have.length.above', 3);
    cy.contains('Back').click();
    cy.contains('!').should('not.exist');
  });

  it('Export', { browser: '!firefox' }, () => {
    const downloadsFolder = Cypress.config('downloadsFolder');
    cy.contains('Export').click();
    const filename = path.join(downloadsFolder, 'PokemonList.json');
    cy.readFile(filename).its('badges').should('exist');
    cy.readFile(filename).its('games').should('exist');
    cy.readFile(filename).its('gamesList').should('exist');
  });

  it('Report', () => {
    cy.contains('Report').click();
    cy.get('[data-testid=report-type]').select('Suggestion').should('have.value', 'suggestion');
    cy.get('[data-testid=report-device]').select('Mobile').should('have.value', 'mobile');
    cy.get('[data-testid=report-os]').select('Android').should('have.value', 'android');
    cy.get('[data-testid=report-browser]').select('Firefox').should('have.value', 'firefox');
    cy.get('[data-testid=report-selectedgame]')
      .type('Emerald Kaizo')
      .should('have.value', 'Emerald Kaizo');
    cy.get('[data-testid=report-description]')
      .type('Please implement new feature')
      .should('have.value', 'Please implement new feature');
  });

  it('Suggestions', () => {
    cy.get('[data-testid=import]').click();
    cy.get('[data-testid=import-file-input]').attachFile('Suggestions.json', { force: true });
    cy.get('[data-testid=apply-import]').click();
    cy.get('[data-testid=options]').click();
    cy.get('[data-testid=tracker]').click();
    cy.get('[data-testid=pokemon-1]').click();
    cy.contains('SUGGESTED').should('exist');
    cy.contains('Cancel').click();
    cy.get('[data-testid=game-select]').click();
    cy.get('[data-testid=game-select] > .visible > :nth-child(1)').click();
    cy.get('[data-testid=pokemon-1]').click();
    cy.contains('SUGGESTED').should('exist');
    cy.contains('Cancel').click();
    cy.get('[data-testid=game-select]').click();
    cy.contains('Sword and Shield').click();
    cy.get('[data-testid=pokemon-1]').click();
    cy.contains('SUGGESTED').should('exist');
    cy.contains('Cancel').click();
    cy.get('[data-testid=search-options]').click();
    cy.get('[data-testid=settings-suggestions] > label').click();
    cy.contains('Back').click();
    cy.get('[data-testid=pokemon-1]').click();
    cy.contains('SUGGESTED').should('not.exist');
  });

  it('Dark mode', () => {
    cy.clearLocalStorage();
    cy.visit('/', {
      onBeforeLoad: (win) => {
        cy.stub(win, 'matchMedia')
          .withArgs('(prefers-color-scheme:dark)')
          .returns({
            matches: false,
            addListener: () => {},
          });
      },
    });
    cy.get('[data-testid=options]').click();
    cy.get('[data-testid=app]').should('have.css', 'background-color', 'rgb(255, 255, 255)');
    cy.contains('Settings').click();
    cy.get('[data-testid="settings-darkmode"]').click();
    cy.get('[data-testid=app]').should('have.css', 'background-color', 'rgb(33, 33, 33)');
  });

  it('Prefers Dark Mode', () => {
    cy.visit('/', {
      onBeforeLoad: (win) => {
        cy.stub(win, 'matchMedia')
          .withArgs('(prefers-color-scheme:dark)')
          .returns({
            matches: true,
            addListener: () => {},
          });
      },
    });
    cy.get('[data-testid=app]').should('have.css', 'background-color', 'rgb(33, 33, 33)');
  });

  it('Language', () => {
    cy.contains('Settings').click();
    cy.get('[data-testid="settings-language"]').click();
    cy.contains('Español').click();
    cy.contains('Ajustes').should('exist');
    cy.get('[data-testid="settings-language"]').click();
    cy.contains('Deutsch').click();
    cy.contains('Optionen').should('exist');
  });

  it('Custom Status', { scrollBehavior: 'center', viewportWidth: 550 }, () => {
    cy.contains('Settings').click();
    cy.get('[data-testid="edit-custom-statuses"]').click();
    cy.get('[data-testid="custom-status-input"] > input')
      .type('Foobar')
      .should('have.value', 'Foobar');
    cy.get('[data-testid="add-status"]').click();
    cy.contains('Foobar').should('exist');
    cy.contains('Cancel').click();
    cy.get('[data-testid=options]').click();
    cy.get('[data-testid="tracker"]').click();
    cy.get('[data-testid=game-select]').click();
    cy.contains('Sword and Shield').click();
    cy.get('[data-testid="pokemon-0"]').click();
    cy.get('[data-testid=poke-Scorbunny]').click({ force: true });
    cy.get('[data-testid="status-0"]').click();
    cy.get('.visible.menu.transition').scrollTo('bottom');
    cy.get('.visible > :nth-child(7)').click();
    cy.get('[data-testid="status-0"]').click();
    cy.get('.visible.menu.transition').scrollTo('bottom');
    cy.get('.visible > :nth-child(7)').click();
    cy.contains('Foobar').should('exist');
    cy.get('[data-testid=options]').click();
    cy.contains('Settings').click();
    cy.get('[data-testid="edit-custom-statuses"]').click();
    cy.get('[data-testid="remove-custom-status-0"]').click();
    cy.contains('Cancel').click();
    cy.get('[data-testid=options]').click();
    cy.get('[data-testid="tracker"]').click();
    cy.contains('Foobar').should('not.exist');
  });

  it('Soul Link', () => {
    cy.contains('Settings').click();
    cy.get('[data-testid="settings-soulink"] > label').click();
    cy.get('[data-testid=options]').click();
    cy.get('[data-testid="tracker"]').click();
    cy.get('[data-testid=game-select]').click();
    cy.contains('Sword and Shield').click();
    cy.get('[data-testid="pokemon-0"]').click();
    cy.get('[data-testid=poke-Scorbunny]').click({ force: true });
    cy.get('[data-testid="status-0"]').click();
    cy.get('[data-testid=status-0] > .visible > :nth-child(2)').click();
    cy.get('[data-testid="edit-encounter-0"]').click();
    cy.get('[data-testid="soullink-0"]').click();
    cy.get('[data-testid="poke-Bulbasaur"]').click({ force: true });
    cy.get('[data-testid="delete-soullink-0"]').click();
    cy.get('[data-testid="soullink-0"]').click();
    cy.get('[data-testid="poke-Bulbasaur"]').click({ force: true });
    cy.contains('Save').click();
  });

  it('Delete', () => {
    cy.visit('/delete');
    cy.contains('Account Deletion').should('exist');
  });
});
