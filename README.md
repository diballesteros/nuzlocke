# Nuzlocke Tracker

[![CodeQL](https://github.com/diballesteros/nuzlocke/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/diballesteros/nuzlocke/actions/workflows/codeql-analysis.yml) [![Cypress](https://github.com/diballesteros/nuzlocke/actions/workflows/main.yml/badge.svg)](https://github.com/diballesteros/nuzlocke/actions/workflows/main.yml) [![Netlify Status](https://api.netlify.com/api/v1/badges/1a2636a6-8db8-4386-8033-d280495aaf91/deploy-status)](https://app.netlify.com/sites/nuzlocke/deploys) ![GitHub release](https://img.shields.io/github/release/diballesteros/nuzlocke.svg?style=flat-square) [![Issues](https://img.shields.io/github/issues-raw/diballesteros/nuzlocke.svg?maxAge=25000)](https://github.com/diballesteros/nuzlocke/issues) [![codecov](https://codecov.io/gh/diballesteros/nuzlocke/branch/master/graph/badge.svg?token=SQPSF96J1S)](https://codecov.io/gh/diballesteros/nuzlocke)

## Table of Contents

- [About](#about)
  - [Features](#🚀-features)
  - [How it works](#✨-how-it-works)
- [Getting started](#getting-started)
- [Running the tests](#running-the-tests)
- [Roadmap](#roadmap)
- [Deployment](#deployment)
- [Versioning](#versioning)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)
- [Legal](#legal)
- [Contact](#contact)
- [Other](#other)

## About

https://nuzlocke.netlify.app

Web app to track and record encounters in any Pokémon game. Including custom games!

All Pokémon included up to generation 8.

Built with ReactJS, Create-React-App, Zustand and Semantic UI.

### 🚀 Features

- Record your encounters with detailed information, including: pokemon, level, gender, ability, nature, item and more!
- Accurate encounter tables for every location
- Level caps for all base games - customizable!
- Add and edit custom games and custom encounter locations
- Search and filter through all encounters - including only missing encounters
- Export, import and share Nuzlocke runs with others!
- Share, add and edit custom rules and rulesets - including smart rules that alert if they're broken
- View overview and summary of your nuzlocke run
- Dupes clause alerts
- Works offline
- Nickname randomizer
- Details on all gym and Elite Four pokémon for all base games
- Download a summary image
- Build an ideal team with the Team Builder!
- Quick access to details on type effectiveness and natures

### ✨ How it works

- Adding Encounter:

![til](https://media.giphy.com/media/3Vg6oiO9k2ki9SqurG/giphy.gif?cid=790b7611d41d7f9775f131bd3a5dba9e339d7b5f23ce359a&rid=giphy.gif&ct=g)

- Editing Encounter:

![til](https://media.giphy.com/media/JNKFRBlRkg0Fr9q9pX/giphy.gif?cid=790b7611346c86f533776d9f9f266eb63f88ba4d8e0b4758&rid=giphy.gif&ct=g)

- Badges:

![til](https://media.giphy.com/media/ew5Ooc73PE3YqwWgLA/giphy.gif?cid=790b7611ad6f0af63550c3107bc6bf981007b33ed5e93a39&rid=giphy.gif&ct=g)

- Team Builder:

![til](https://media.giphy.com/media/T0yMtbmR5hVX3ARLbN/giphy.gif?cid=790b761127516fcf192c309d7f6a15a9c452beade4f80b5f&rid=giphy.gif&ct=g)

- Summary Image:

![Imgur Image](https://imgur.com/y5uiriQ.jpg)

## Getting started

### 🔑 Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- [git](https://github.com/git-guides/install-git#:~:text=To%20install%20Git%2C%20run%20the,installation%20by%20typing%3A%20git%20version%20.)
- npm
  ```sh
  npm install npm@latest -g
  ```
- yarn
  ```sh
  npm install --global yarn
  ```

### 💻 Installation

1. Clone the repo
   ```sh
   git clone https://github.com/diballesteros/nuzlocke.git
   cd nuzlocke
   ```
2. Install NPM packages
   ```sh
   yarn
   ```
3. Run the project locally
   ```bash
   yarn start
   ```

## Running the tests

This project uses [Cypress](https://www.cypress.io/) for testing. To run them:

```sh
yarn run cypress open
```

In the new window execute any of the \*.spec.ts files.

## Roadmap

See the [open issues](https://github.com/diballesteros/nuzlocke/issues) for a list of proposed features (and known issues).

## Deployment

The project automatically deploys to [Netlify](https://www.netlify.com/) when changes are detected on the **master** branch.

## Versioning

We use [SemVer](https://semver.org/) for versioning. For the versions available, see the [tags](https://github.com/diballesteros/nuzlocke/releases) on this repository.

## Contributing

Please read [CONTRIBUTING.md](https://github.com/diballesteros/nuzlocke/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the BSD-3-Clause License - see the [LICENSE](https://github.com/diballesteros/nuzlocke/blob/master/LICENSE) file for details

## Acknowledgements

- Images provided by [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Main_Page)
- Icons made by [Darius Dan](http://www.dariusdan.com) from [Flaticon](https://www.flaticon.com/)
- Icons made by [Roundicons Freebies](http://www.roundicons.com) from [Flaticon](https://www.flaticon.com/)
- Icons made by [Nikita Golubev](https://www.flaticon.com/authors/nikita-golubev) from [Flaticon](https://www.flaticon.com/)
- Icons made by [Freepik](https://www.freepik.com) from [Flaticon](https://www.flaticon.com/)
- Icons made by [Vectors Market](https://www.flaticon.com/authors/vectors-market) from [Flaticon](https://www.flaticon.com/)
- Nickname list provided by [Find Nicknames](https://www.findnicknames.com/pokemon-nicknames/)

## Legal

Pokémon © 2002-2021 Pokémon. © 1995-2021 Nintendo/Creatures Inc./GAME FREAK inc. TM, ® and Pokémon character names are trademarks of Nintendo.

## Contact

Diego Ballesteros - [@relatablecoder](https://twitter.com/relatablecoder) - diballesteros@gmail.com
