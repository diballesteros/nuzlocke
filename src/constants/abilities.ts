const ABILITIES = [
  {
    id: '091',
    name: 'Adaptability',
    description: 'Powers up moves of the same type as the Pokémon.',
    generation: 'IV',
  },
  {
    id: '184',
    name: 'Aerilate',
    description:
      'Normal-type moves become Flying-type moves. The power of those moves is boosted a little.',
    generation: 'VI',
  },
  {
    id: '106',
    name: 'Aftermath',
    description: 'Damages the attacker if it contacts the Pokémon with a finishing hit.',
    generation: 'IV',
  },
  {
    id: '076',
    name: 'Air Lock',
    description: 'Eliminates the effects of weather.',
    generation: 'III',
  },
  {
    id: '148',
    name: 'Analytic',
    description: 'Boosts move power when the Pokémon moves last.',
    generation: 'V',
  },
  {
    id: '083',
    name: 'Anger Point',
    description:
      'The Pokémon is angered when it takes a critical hit, and that maxes its Attack stat.',
    generation: 'IV',
  },
  {
    id: '107',
    name: 'Anticipation',
    description: "The Pokémon can sense an opposing Pokémon's dangerous moves.",
    generation: 'IV',
  },
  {
    id: '071',
    name: 'Arena Trap',
    description: 'Prevents opposing Pokémon from fleeing.',
    generation: 'III',
  },
  {
    id: '165',
    name: 'Aroma Veil',
    description: 'Protects itself and its allies from attacks that limit their move choices.',
    generation: 'VI',
  },
  {
    id: '266',
    name: 'As One',
    description:
      "This Ability combines the effects of both Calyrex's Unnerve Ability and Glastrier's Chilling Neigh Ability.",
    generation: 'VIII',
  },
  {
    id: '188',
    name: 'Aura Break',
    description:
      'The effects of "Aura" Abilities are reversed to lower the power of affected moves.',
    generation: 'VI',
  },
  {
    id: '123',
    name: 'Bad Dreams',
    description: 'Reduces the HP of sleeping opposing Pokémon.',
    generation: 'IV',
  },
  {
    id: '237',
    name: 'Ball Fetch',
    description:
      'If the Pokémon is not holding an item, it will fetch the Poké Ball from the first failed throw of the battle.',
    generation: 'VIII',
  },
  {
    id: '217',
    name: 'Battery',
    description: "Powers up ally Pokémon's special moves.",
    generation: 'VII',
  },
  {
    id: '004',
    name: 'Battle Armor',
    description: 'Hard armor protects the Pokémon from critical hits.',
    generation: 'III',
  },
  {
    id: '210',
    name: 'Battle Bond',
    description:
      "Defeating an opposing Pokémon strengthens the Pokémon's bond with its Trainer, and it becomes Ash-Greninja. Water Shuriken gets more powerful.",
    generation: 'VII',
  },
  {
    id: '224',
    name: 'Beast Boost',
    description: 'The Pokémon boosts its most proficient stat each time it knocks out a Pokémon.',
    generation: 'VII',
  },
  {
    id: '201',
    name: 'Berserk',
    description:
      "Boosts the Pokémon's Sp. Atk stat when it takes a hit that causes its HP to become half or less.",
    generation: 'VII',
  },
  {
    id: '145',
    name: 'Big Pecks',
    description: 'Protects the Pokémon from Defense-lowering effects.',
    generation: 'V',
  },
  {
    id: '066',
    name: 'Blaze',
    description: "Powers up Fire-type moves when the Pokémon's HP is low.",
    generation: 'III',
  },
  {
    id: '171',
    name: 'Bulletproof',
    description: 'Protects the Pokémon from some ball and bomb moves.',
    generation: 'VI',
  },
  {
    id: '—',
    name: 'Cacophony',
    description: 'Avoids sound-based moves.',
    generation: 'III',
  },
  {
    id: '167',
    name: 'Cheek Pouch',
    description: 'Restores HP as well when the Pokémon eats a Berry.',
    generation: 'VI',
  },
  {
    id: '264',
    name: 'Chilling Neigh',
    description:
      'When the Pokémon knocks out a target, it utters a chilling neigh, which boosts its Attack stat.',
    generation: 'VIII',
  },
  {
    id: '034',
    name: 'Chlorophyll',
    description: "Boosts the Pokémon's Speed stat in harsh sunlight.",
    generation: 'III',
  },
  {
    id: '029',
    name: 'Clear Body',
    description: "Prevents other Pokémon's moves or Abilities from lowering the Pokémon's stats.",
    generation: 'III',
  },
  {
    id: '013',
    name: 'Cloud Nine',
    description: 'Eliminates the effects of weather.',
    generation: 'III',
  },
  {
    id: '016',
    name: 'Color Change',
    description: "The Pokémon's type becomes the type of the move used on it.",
    generation: 'III',
  },
  {
    id: '213',
    name: 'Comatose',
    description: "It's always drowsing and will never wake up. It can attack without waking up.",
    generation: 'VII',
  },
  {
    id: '172',
    name: 'Competitive',
    description: 'Boosts the Sp. Atk stat sharply when a stat is lowered.',
    generation: 'VI',
  },
  {
    id: '014',
    name: 'Compound Eyes',
    description: "The Pokémon's compound eyes boost its accuracy.",
    generation: 'III',
  },
  {
    id: '126',
    name: 'Contrary',
    description: 'Makes stat changes have an opposite effect.',
    generation: 'V',
  },
  {
    id: '212',
    name: 'Corrosion',
    description: "The Pokémon can poison the target even if it's a Steel or Poison type.",
    generation: 'VII',
  },
  {
    id: '238',
    name: 'Cotton Down',
    description:
      'When the Pokémon is hit by an attack, it scatters cotton fluff around and lowers the Speed stat of all Pokémon except itself.',
    generation: 'VIII',
  },
  {
    id: '261',
    name: 'Curious Medicine',
    description:
      'When the Pokémon enters a battle, it scatters medicine from its shell, which removes all stat changes from allies.',
    generation: 'VIII',
  },
  {
    id: '130',
    name: 'Cursed Body',
    description: 'May disable a move used on the Pokémon.',
    generation: 'V',
  },
  {
    id: '056',
    name: 'Cute Charm',
    description: 'Contact with the Pokémon may cause infatuation.',
    generation: 'III',
  },
  {
    id: '006',
    name: 'Damp',
    description:
      'Prevents the use of explosive moves, such as Self-Destruct, by dampening its surroundings.',
    generation: 'III',
  },
  {
    id: '216',
    name: 'Dancer',
    description:
      'When another Pokémon uses a dance move, it can use a dance move following it regardless of its Speed.',
    generation: 'VII',
  },
  {
    id: '186',
    name: 'Dark Aura',
    description: "Powers up each Pokémon's Dark-type moves.",
    generation: 'VI',
  },
  {
    id: '235',
    name: 'Dauntless Shield',
    description: "Boosts the Pokémon's Defense stat when the Pokémon enters a battle.",
    generation: 'VIII',
  },
  {
    id: '219',
    name: 'Dazzling',
    description: 'Surprises the opposing Pokémon, making it unable to attack using priority moves.',
    generation: 'VII',
  },
  {
    id: '129',
    name: 'Defeatist',
    description: "Halves the Pokémon's Attack and Sp. Atk stats when its HP becomes half or less.",
    generation: 'V',
  },
  {
    id: '128',
    name: 'Defiant',
    description: "Boosts the Pokémon's Attack stat sharply when its stats are lowered.",
    generation: 'V',
  },
  {
    id: '191',
    name: 'Delta Stream',
    description:
      "The Pokémon changes the weather to eliminate all of the Flying type's weaknesses.",
    generation: 'VI',
  },
  {
    id: '190',
    name: 'Desolate Land',
    description: 'The Pokémon changes the weather to nullify Water-type attacks.',
    generation: 'VI',
  },
  {
    id: '209',
    name: 'Disguise',
    description:
      'Once per battle, the shroud that covers the Pokémon can protect it from an attack.',
    generation: 'VII',
  },
  {
    id: '088',
    name: 'Download',
    description:
      "Compares an opposing Pokémon's Defense and Sp. Def stats before raising its own Attack or Sp. Atk stat—whichever will be more effective.",
    generation: 'IV',
  },
  {
    id: '263',
    name: "Dragon's Maw",
    description: 'Powers up Dragon-type moves.',
    generation: 'VIII',
  },
  {
    id: '002',
    name: 'Drizzle',
    description: 'The Pokémon makes it rain when it enters a battle.',
    generation: 'III',
  },
  {
    id: '070',
    name: 'Drought',
    description: 'Turns the sunlight harsh when the Pokémon enters a battle.',
    generation: 'III',
  },
  {
    id: '087',
    name: 'Dry Skin',
    description:
      'Restores HP in rain or when hit by Water-type moves. Reduces HP in harsh sunlight, and increases the damage received from Fire-type moves.',
    generation: 'IV',
  },
  {
    id: '048',
    name: 'Early Bird',
    description: 'The Pokémon awakens from sleep twice as fast as other Pokémon.',
    generation: 'III',
  },
  {
    id: '027',
    name: 'Effect Spore',
    description:
      'Contact with the Pokémon may inflict poison, sleep, or paralysis on its attacker.',
    generation: 'III',
  },
  {
    id: '226',
    name: 'Electric Surge',
    description: 'Turns the ground into Electric Terrain when the Pokémon enters a battle.',
    generation: 'VII',
  },
  {
    id: '194',
    name: 'Emergency Exit',
    description: 'The Pokémon, sensing danger, switches out when its HP becomes half or less.',
    generation: 'VII',
  },
  {
    id: '187',
    name: 'Fairy Aura',
    description: "Powers up each Pokémon's Fairy-type moves.",
    generation: 'VI',
  },
  {
    id: '111',
    name: 'Filter',
    description: 'Reduces the power of supereffective attacks taken.',
    generation: 'IV',
  },
  {
    id: '049',
    name: 'Flame Body',
    description: 'Contact with the Pokémon may burn the attacker.',
    generation: 'III',
  },
  {
    id: '138',
    name: 'Flare Boost',
    description: 'Powers up special attacks when the Pokémon is burned.',
    generation: 'V',
  },
  {
    id: '018',
    name: 'Flash Fire',
    description: "Powers up the Pokémon's Fire-type moves if it's hit by one.",
    generation: 'III',
  },
  {
    id: '122',
    name: 'Flower Gift',
    description: 'Boosts the Attack and Sp. Def stats of itself and allies in harsh sunlight.',
    generation: 'IV',
  },
  {
    id: '166',
    name: 'Flower Veil',
    description:
      'Ally Grass-type Pokémon are protected from status conditions and the lowering of their stats.',
    generation: 'VI',
  },
  {
    id: '218',
    name: 'Fluffy',
    description:
      'Halves the damage taken from moves that make direct contact, but doubles that of Fire-type moves.',
    generation: 'VII',
  },
  {
    id: '059',
    name: 'Forecast',
    description:
      'The Pokémon transforms with the weather to change its type to Water, Fire, or Ice.',
    generation: 'III',
  },
  {
    id: '108',
    name: 'Forewarn',
    description:
      'When it enters a battle, the Pokémon can tell one of the moves an opposing Pokémon has.',
    generation: 'IV',
  },
  {
    id: '132',
    name: 'Friend Guard',
    description: 'Reduces damage done to allies.',
    generation: 'V',
  },
  {
    id: '119',
    name: 'Frisk',
    description: "When it enters a battle, the Pokémon can check an opposing Pokémon's held item.",
    generation: 'IV',
  },
  {
    id: '230',
    name: 'Full Metal Body',
    description: "Prevents other Pokémon's moves or Abilities from lowering the Pokémon's stats.",
    generation: 'VII',
  },
  {
    id: '169',
    name: 'Fur Coat',
    description: 'Halves the damage from physical moves.',
    generation: 'VI',
  },
  {
    id: '177',
    name: 'Gale Wings',
    description: "Gives priority to Flying-type moves when the Pokémon's HP is full.",
    generation: 'VI',
  },
  {
    id: '206',
    name: 'Galvanize',
    description:
      'Normal-type moves become Electric-type moves. The power of those moves is boosted a little.',
    generation: 'VII',
  },
  {
    id: '082',
    name: 'Gluttony',
    description:
      'Makes the Pokémon eat a held Berry when its HP drops to half or less, which is sooner than usual.',
    generation: 'IV',
  },
  {
    id: '183',
    name: 'Gooey',
    description: "Contact with the Pokémon lowers the attacker's Speed stat.",
    generation: 'VI',
  },
  {
    id: '255',
    name: 'Gorilla Tactics',
    description:
      "Boosts the Pokémon's Attack stat but only allows the use of the first selected move.",
    generation: 'VIII',
  },
  {
    id: '179',
    name: 'Grass Pelt',
    description: "Boosts the Pokémon's Defense stat on Grassy Terrain.",
    generation: 'VI',
  },
  {
    id: '229',
    name: 'Grassy Surge',
    description: 'Turns the ground into Grassy Terrain when the Pokémon enters a battle.',
    generation: 'VII',
  },
  {
    id: '265',
    name: 'Grim Neigh',
    description:
      'When the Pokémon knocks out a target, it utters a terrifying neigh, which boosts its Sp. Atk stat.',
    generation: 'VIII',
  },
  {
    id: '241',
    name: 'Gulp Missile',
    description:
      'When the Pokémon uses Surf or Dive, it will come back with prey. When it takes damage, it will spit out the prey to attack.',
    generation: 'VIII',
  },
  {
    id: '062',
    name: 'Guts',
    description: "It's so gutsy that having a status condition boosts the Pokémon's Attack stat.",
    generation: 'III',
  },
  {
    id: '139',
    name: 'Harvest',
    description: 'May create another Berry after one is used.',
    generation: 'V',
  },
  {
    id: '131',
    name: 'Healer',
    description: "Sometimes heals an ally's status condition.",
    generation: 'V',
  },
  {
    id: '085',
    name: 'Heatproof',
    description:
      'The heatproof body of the Pokémon halves the damage from Fire-type moves that hit it.',
    generation: 'IV',
  },
  {
    id: '134',
    name: 'Heavy Metal',
    description: "Doubles the Pokémon's weight.",
    generation: 'V',
  },
  {
    id: '118',
    name: 'Honey Gather',
    description: 'The Pokémon may gather Honey after a battle.',
    generation: 'IV',
  },
  {
    id: '037',
    name: 'Huge Power',
    description: "Doubles the Pokémon's Attack stat.",
    generation: 'III',
  },
  {
    id: '258',
    name: 'Hunger Switch',
    description:
      'The Pokémon changes its form, alternating between its Full Belly Mode and Hangry Mode after the end of each turn.',
    generation: 'VIII',
  },
  {
    id: '055',
    name: 'Hustle',
    description: 'Boosts the Attack stat, but lowers accuracy.',
    generation: 'III',
  },
  {
    id: '093',
    name: 'Hydration',
    description: "Heals status conditions if it's raining.",
    generation: 'IV',
  },
  {
    id: '052',
    name: 'Hyper Cutter',
    description:
      "The Pokémon's proud of its powerful pincers. They prevent other Pokémon from lowering its Attack stat.",
    generation: 'III',
  },
  {
    id: '115',
    name: 'Ice Body',
    description: 'The Pokémon gradually regains HP in a hailstorm.',
    generation: 'IV',
  },
  {
    id: '248',
    name: 'Ice Face',
    description:
      "The Pokémon's ice head can take a physical attack as a substitute, but the attack also changes the Pokémon's appearance. The ice will be restored when it hails.",
    generation: 'VIII',
  },
  {
    id: '246',
    name: 'Ice Scales',
    description:
      'The Pokémon is protected by ice scales, which halve the damage taken from special moves.',
    generation: 'VIII',
  },
  {
    id: '035',
    name: 'Illuminate',
    description: 'Raises the likelihood of meeting wild Pokémon by illuminating the surroundings.',
    generation: 'III',
  },
  {
    id: '149',
    name: 'Illusion',
    description: "Comes out disguised as the Pokémon in the party's last spot.",
    generation: 'V',
  },
  {
    id: '017',
    name: 'Immunity',
    description: 'The immune system of the Pokémon prevents it from getting poisoned.',
    generation: 'III',
  },
  {
    id: '150',
    name: 'Imposter',
    description: "The Pokémon transforms itself into the Pokémon it's facing.",
    generation: 'V',
  },
  {
    id: '151',
    name: 'Infiltrator',
    description:
      "Passes through the opposing Pokémon's barrier, substitute, and the like and strikes.",
    generation: 'V',
  },
  {
    id: '215',
    name: 'Innards Out',
    description:
      'Damages the attacker landing the finishing hit by the amount equal to its last HP.',
    generation: 'VII',
  },
  {
    id: '039',
    name: 'Inner Focus',
    description: "The Pokémon's intensely focused, and that protects the Pokémon from flinching.",
    generation: 'III',
  },
  {
    id: '015',
    name: 'Insomnia',
    description: 'The Pokémon is suffering from insomnia and cannot fall asleep.',
    generation: 'III',
  },
  {
    id: '022',
    name: 'Intimidate',
    description:
      'The Pokémon intimidates opposing Pokémon upon entering battle, lowering their Attack stat.',
    generation: 'III',
  },
  {
    id: '234',
    name: 'Intrepid Sword',
    description: "Boosts the Pokémon's Attack stat when the Pokémon enters a battle.",
    generation: 'VIII',
  },
  {
    id: '160',
    name: 'Iron Barbs',
    description: 'Inflicts damage on the attacker upon contact with iron barbs.',
    generation: 'V',
  },
  {
    id: '089',
    name: 'Iron Fist',
    description: 'Powers up punching moves.',
    generation: 'IV',
  },
  {
    id: '154',
    name: 'Justified',
    description:
      'Being hit by a Dark-type move boosts the Attack stat of the Pokémon, for justice.',
    generation: 'V',
  },
  {
    id: '051',
    name: 'Keen Eye',
    description: "Keen eyes prevent other Pokémon from lowering this Pokémon's accuracy.",
    generation: 'III',
  },
  {
    id: '103',
    name: 'Klutz',
    description: "The Pokémon can't use any held items.",
    generation: 'IV',
  },
  {
    id: '102',
    name: 'Leaf Guard',
    description: 'Prevents status conditions in harsh sunlight.',
    generation: 'IV',
  },
  {
    id: '026',
    name: 'Levitate',
    description:
      'By floating in the air, the Pokémon receives full immunity to all Ground-type moves.',
    generation: 'III',
  },
  {
    id: '236',
    name: 'Libero',
    description: "Changes the Pokémon's type to the type of the move it's about to use.",
    generation: 'VIII',
  },
  {
    id: '135',
    name: 'Light Metal',
    description: "Halves the Pokémon's weight.",
    generation: 'V',
  },
  {
    id: '031',
    name: 'Lightning Rod',
    description:
      'The Pokémon draws in all Electric-type moves. Instead of being hit by Electric-type moves, it boosts its Sp. Atk.',
    generation: 'III',
  },
  {
    id: '007',
    name: 'Limber',
    description: 'Its limber body protects the Pokémon from paralysis.',
    generation: 'III',
  },
  {
    id: '064',
    name: 'Liquid Ooze',
    description:
      'The oozed liquid has a strong stench, which damages attackers using any draining move.',
    generation: 'III',
  },
  {
    id: '204',
    name: 'Liquid Voice',
    description: 'All sound-based moves become Water-type moves.',
    generation: 'VII',
  },
  {
    id: '203',
    name: 'Long Reach',
    description: 'The Pokémon uses its moves without making contact with the target.',
    generation: 'VII',
  },
  {
    id: '156',
    name: 'Magic Bounce',
    description: 'Reflects status moves instead of getting hit by them.',
    generation: 'V',
  },
  {
    id: '098',
    name: 'Magic Guard',
    description: 'The Pokémon only takes damage from attacks.',
    generation: 'IV',
  },
  {
    id: '170',
    name: 'Magician',
    description: 'The Pokémon steals the held item of a Pokémon it hits with a move.',
    generation: 'VI',
  },
  {
    id: '040',
    name: 'Magma Armor',
    description:
      'The Pokémon is covered with hot magma, which prevents the Pokémon from becoming frozen.',
    generation: 'III',
  },
  {
    id: '042',
    name: 'Magnet Pull',
    description: 'Prevents Steel-type Pokémon from escaping using its magnetic force.',
    generation: 'III',
  },
  {
    id: '063',
    name: 'Marvel Scale',
    description:
      "The Pokémon's marvelous scales boost the Defense stat if it has a status condition.",
    generation: 'III',
  },
  {
    id: '178',
    name: 'Mega Launcher',
    description: 'Powers up aura and pulse moves.',
    generation: 'VI',
  },
  {
    id: '196',
    name: 'Merciless',
    description: "The Pokémon's attacks become critical hits if the target is poisoned.",
    generation: 'VII',
  },
  {
    id: '250',
    name: 'Mimicry',
    description: "Changes the Pokémon's type depending on the terrain.",
    generation: 'VIII',
  },
  {
    id: '058',
    name: 'Minus',
    description:
      'Boosts the Sp. Atk stat of the Pokémon if an ally with the Plus or Minus Ability is also in battle.',
    generation: 'III',
  },
  {
    id: '240',
    name: 'Mirror Armor',
    description: 'Bounces back only the stat-lowering effects that the Pokémon receives.',
    generation: 'VIII',
  },
  {
    id: '228',
    name: 'Misty Surge',
    description: 'Turns the ground into Misty Terrain when the Pokémon enters a battle.',
    generation: 'VII',
  },
  {
    id: '104',
    name: 'Mold Breaker',
    description: 'Moves can be used on the target regardless of its Abilities.',
    generation: 'IV',
  },
  {
    id: '141',
    name: 'Moody',
    description: 'Raises one stat sharply and lowers another every turn.',
    generation: 'V',
  },
  {
    id: '078',
    name: 'Motor Drive',
    description: 'Boosts its Speed stat if hit by an Electric-type move instead of taking damage.',
    generation: 'IV',
  },
  {
    id: '153',
    name: 'Moxie',
    description:
      'The Pokémon shows moxie, and that boosts the Attack stat after knocking out any Pokémon.',
    generation: 'V',
  },
  {
    id: '136',
    name: 'Multiscale',
    description: 'Reduces the amount of damage the Pokémon takes while its HP is full.',
    generation: 'V',
  },
  {
    id: '121',
    name: 'Multitype',
    description: "Changes the Pokémon's type to match the Plate or Z-Crystal it holds.",
    generation: 'IV',
  },
  {
    id: '152',
    name: 'Mummy',
    description: "Contact with the Pokémon changes the attacker's Ability to Mummy.",
    generation: 'V',
  },
  {
    id: '030',
    name: 'Natural Cure',
    description: 'All status conditions heal when the Pokémon switches out.',
    generation: 'III',
  },
  {
    id: '233',
    name: 'Neuroforce',
    description: 'Powers up moves that are super effective.',
    generation: 'VII',
  },
  {
    id: '256',
    name: 'Neutralizing Gas',
    description:
      "If the Pokémon with Neutralizing Gas is in the battle, the effects of all Pokémon's Abilities will be nullified or will not be triggered.",
    generation: 'VIII',
  },
  {
    id: '099',
    name: 'No Guard',
    description:
      'The Pokémon employs no-guard tactics to ensure incoming and outgoing attacks always land.',
    generation: 'IV',
  },
  {
    id: '096',
    name: 'Normalize',
    description:
      "All the Pokémon's moves become Normal type. The power of those moves is boosted a little.",
    generation: 'IV',
  },
  {
    id: '012',
    name: 'Oblivious',
    description:
      'The Pokémon is oblivious, and that keeps it from being infatuated or falling for taunts.',
    generation: 'III',
  },
  {
    id: '142',
    name: 'Overcoat',
    description: 'Protects the Pokémon from things like sand, hail, and powder.',
    generation: 'V',
  },
  {
    id: '065',
    name: 'Overgrow',
    description: "Powers up Grass-type moves when the Pokémon's HP is low.",
    generation: 'III',
  },
  {
    id: '020',
    name: 'Own Tempo',
    description: 'This Pokémon has its own tempo, and that prevents it from becoming confused.',
    generation: 'III',
  },
  {
    id: '185',
    name: 'Parental Bond',
    description: 'Parent and child each attacks.',
    generation: 'VI',
  },
  {
    id: '257',
    name: 'Pastel Veil',
    description: 'Protects the Pokémon and its ally Pokémon from being poisoned.',
    generation: 'VIII',
  },
  {
    id: '253',
    name: 'Perish Body',
    description:
      'When hit by a move that makes direct contact, the Pokémon and the attacker will faint after three turns unless they switch out of battle.',
    generation: 'VIII',
  },
  {
    id: '124',
    name: 'Pickpocket',
    description: 'Steals an item from an attacker that made direct contact.',
    generation: 'V',
  },
  {
    id: '053',
    name: 'Pickup',
    description:
      'The Pokémon may pick up the item an opposing Pokémon used during a battle. It may pick up items outside of battle, too.',
    generation: 'III',
  },
  {
    id: '182',
    name: 'Pixilate',
    description:
      'Normal-type moves become Fairy-type moves. The power of those moves is boosted a little.',
    generation: 'VI',
  },
  {
    id: '057',
    name: 'Plus',
    description:
      'Boosts the Sp. Atk stat of the Pokémon if an ally with the Plus or Minus Ability is also in battle.',
    generation: 'III',
  },
  {
    id: '090',
    name: 'Poison Heal',
    description: 'Restores HP if the Pokémon is poisoned instead of losing HP.',
    generation: 'IV',
  },
  {
    id: '038',
    name: 'Poison Point',
    description: 'Contact with the Pokémon may poison the attacker.',
    generation: 'III',
  },
  {
    id: '143',
    name: 'Poison Touch',
    description: 'May poison a target when the Pokémon makes contact.',
    generation: 'V',
  },
  {
    id: '211',
    name: 'Power Construct',
    description:
      'Other Cells gather to aid when its HP becomes half or less. Then the Pokémon changes its form to Complete Forme.',
    generation: 'VII',
  },
  {
    id: '223',
    name: 'Power of Alchemy',
    description: 'The Pokémon copies the Ability of a defeated ally.',
    generation: 'VII',
  },
  {
    id: '249',
    name: 'Power Spot',
    description: 'Just being next to the Pokémon powers up moves.',
    generation: 'VIII',
  },
  {
    id: '158',
    name: 'Prankster',
    description: 'Gives priority to a status move.',
    generation: 'V',
  },
  {
    id: '046',
    name: 'Pressure',
    description: 'By putting pressure on the opposing Pokémon, it raises their PP usage.',
    generation: 'III',
  },
  {
    id: '189',
    name: 'Primordial Sea',
    description: 'The Pokémon changes the weather to nullify Fire-type attacks.',
    generation: 'VI',
  },
  {
    id: '232',
    name: 'Prism Armor',
    description: 'Reduces the power of supereffective attacks taken.',
    generation: 'VII',
  },
  {
    id: '239',
    name: 'Propeller Tail',
    description:
      "Ignores the effects of opposing Pokémon's Abilities and moves that draw in moves.",
    generation: 'VIII',
  },
  {
    id: '168',
    name: 'Protean',
    description: "Changes the Pokémon's type to the type of the move it's about to use.",
    generation: 'VI',
  },
  {
    id: '227',
    name: 'Psychic Surge',
    description: 'Turns the ground into Psychic Terrain when the Pokémon enters a battle.',
    generation: 'VII',
  },
  {
    id: '244',
    name: 'Punk Rock',
    description:
      'Boosts the power of sound-based moves. The Pokémon also takes half the damage from these kinds of moves.',
    generation: 'VIII',
  },
  {
    id: '074',
    name: 'Pure Power',
    description: 'Using its pure power, the Pokémon doubles its Attack stat.',
    generation: 'III',
  },
  {
    id: '214',
    name: 'Queenly Majesty',
    description:
      'Its majesty pressures the opposing Pokémon, making it unable to attack using priority moves.',
    generation: 'VII',
  },
  {
    id: '259',
    name: 'Quick Draw',
    description: 'Enables the Pokémon to move first occasionally.',
    generation: 'VIII',
  },
  {
    id: '095',
    name: 'Quick Feet',
    description: 'Boosts the Speed stat if the Pokémon has a status condition.',
    generation: 'IV',
  },
  {
    id: '044',
    name: 'Rain Dish',
    description: 'The Pokémon gradually regains HP in rain.',
    generation: 'III',
  },
  {
    id: '155',
    name: 'Rattled',
    description: 'Dark-, Ghost-, and Bug-type moves scare the Pokémon and boost its Speed stat.',
    generation: 'V',
  },
  {
    id: '222',
    name: 'Receiver',
    description: 'The Pokémon copies the Ability of a defeated ally.',
    generation: 'VII',
  },
  {
    id: '120',
    name: 'Reckless',
    description: 'Powers up moves that have recoil damage.',
    generation: 'IV',
  },
  {
    id: '174',
    name: 'Refrigerate',
    description:
      'Normal-type moves become Ice-type moves. The power of those moves is boosted a little.',
    generation: 'VI',
  },
  {
    id: '144',
    name: 'Regenerator',
    description: 'Restores a little HP when withdrawn from battle.',
    generation: 'V',
  },
  {
    id: '247',
    name: 'Ripen',
    description: 'Ripens Berries and doubles their effect.',
    generation: 'VIII',
  },
  {
    id: '079',
    name: 'Rivalry',
    description:
      'Becomes competitive and deals more damage to Pokémon of the same gender, but deals less to Pokémon of the opposite gender.',
    generation: 'IV',
  },
  {
    id: '225',
    name: 'RKS System',
    description: "Changes the Pokémon's type to match the memory disc it holds.",
    generation: 'VII',
  },
  {
    id: '069',
    name: 'Rock Head',
    description: 'Protects the Pokémon from recoil damage.',
    generation: 'III',
  },
  {
    id: '024',
    name: 'Rough Skin',
    description: 'This Pokémon inflicts damage with its rough skin to the attacker on contact.',
    generation: 'III',
  },
  {
    id: '050',
    name: 'Run Away',
    description: 'Enables a sure getaway from wild Pokémon.',
    generation: 'III',
  },
  {
    id: '159',
    name: 'Sand Force',
    description: 'Boosts the power of Rock-, Ground-, and Steel-type moves in a sandstorm.',
    generation: 'V',
  },
  {
    id: '146',
    name: 'Sand Rush',
    description: "Boosts the Pokémon's Speed stat in a sandstorm.",
    generation: 'V',
  },
  {
    id: '245',
    name: 'Sand Spit',
    description: "The Pokémon creates a sandstorm when it's hit by an attack.",
    generation: 'VIII',
  },
  {
    id: '045',
    name: 'Sand Stream',
    description: 'The Pokémon summons a sandstorm when it enters a battle.',
    generation: 'III',
  },
  {
    id: '008',
    name: 'Sand Veil',
    description: "Boosts the Pokémon's evasiveness in a sandstorm.",
    generation: 'III',
  },
  {
    id: '157',
    name: 'Sap Sipper',
    description: 'Boosts the Attack stat if hit by a Grass-type move instead of taking damage.',
    generation: 'V',
  },
  {
    id: '208',
    name: 'Schooling',
    description:
      'When it has a lot of HP, the Pokémon forms a powerful school. It stops schooling when its HP is low.',
    generation: 'VII',
  },
  {
    id: '113',
    name: 'Scrappy',
    description: 'The Pokémon can hit Ghost-type Pokémon with Normal- and Fighting-type moves.',
    generation: 'IV',
  },
  {
    id: '251',
    name: 'Screen Cleaner',
    description:
      'When the Pokémon enters a battle, the effects of Light Screen, Reflect, and Aurora Veil are nullified for both opposing and ally Pokémon.',
    generation: 'VIII',
  },
  {
    id: '032',
    name: 'Serene Grace',
    description: 'Boosts the likelihood of additional effects occurring when attacking.',
    generation: 'III',
  },
  {
    id: '231',
    name: 'Shadow Shield',
    description: 'Reduces the amount of damage the Pokémon takes while its HP is full.',
    generation: 'VII',
  },
  {
    id: '023',
    name: 'Shadow Tag',
    description: "This Pokémon steps on the opposing Pokémon's shadow to prevent it from escaping.",
    generation: 'III',
  },
  {
    id: '061',
    name: 'Shed Skin',
    description: 'The Pokémon may heal its own status conditions by shedding its skin.',
    generation: 'III',
  },
  {
    id: '125',
    name: 'Sheer Force',
    description: 'Removes additional effects to increase the power of moves when attacking.',
    generation: 'V',
  },
  {
    id: '075',
    name: 'Shell Armor',
    description: 'A hard shell protects the Pokémon from critical hits.',
    generation: 'III',
  },
  {
    id: '019',
    name: 'Shield Dust',
    description: "This Pokémon's dust blocks the additional effects of attacks taken.",
    generation: 'III',
  },
  {
    id: '197',
    name: 'Shields Down',
    description:
      "When its HP becomes half or less, the Pokémon's shell breaks and it becomes aggressive.",
    generation: 'VII',
  },
  {
    id: '086',
    name: 'Simple',
    description: 'The stat changes the Pokémon receives are doubled.',
    generation: 'IV',
  },
  {
    id: '092',
    name: 'Skill Link',
    description: 'Maximizes the number of times multistrike moves hit.',
    generation: 'IV',
  },
  {
    id: '112',
    name: 'Slow Start',
    description: "For five turns, the Pokémon's Attack and Speed stats are halved.",
    generation: 'IV',
  },
  {
    id: '202',
    name: 'Slush Rush',
    description: "Boosts the Pokémon's Speed stat in a hailstorm.",
    generation: 'VII',
  },
  {
    id: '097',
    name: 'Sniper',
    description: 'Powers up moves if they become critical hits when attacking.',
    generation: 'IV',
  },
  {
    id: '081',
    name: 'Snow Cloak',
    description: 'Boosts evasiveness in a hailstorm.',
    generation: 'IV',
  },
  {
    id: '117',
    name: 'Snow Warning',
    description: 'The Pokémon summons a hailstorm when it enters a battle.',
    generation: 'IV',
  },
  {
    id: '094',
    name: 'Solar Power',
    description: 'Boosts the Sp. Atk stat in harsh sunlight, but HP decreases every turn.',
    generation: 'IV',
  },
  {
    id: '116',
    name: 'Solid Rock',
    description: 'Reduces the power of supereffective attacks taken.',
    generation: 'IV',
  },
  {
    id: '220',
    name: 'Soul-Heart',
    description: 'Boosts its Sp. Atk stat every time a Pokémon faints.',
    generation: 'VII',
  },
  {
    id: '043',
    name: 'Soundproof',
    description: 'Soundproofing gives the Pokémon full immunity to all sound-based moves.',
    generation: 'III',
  },
  {
    id: '003',
    name: 'Speed Boost',
    description: 'Its Speed stat is boosted every turn.',
    generation: 'III',
  },
  {
    id: '198',
    name: 'Stakeout',
    description: "Doubles the damage dealt to the target's replacement if the target switches out.",
    generation: 'VII',
  },
  {
    id: '100',
    name: 'Stall',
    description: 'The Pokémon moves after all other Pokémon do.',
    generation: 'IV',
  },
  {
    id: '242',
    name: 'Stalwart',
    description:
      "Ignores the effects of opposing Pokémon's Abilities and moves that draw in moves.",
    generation: 'VIII',
  },
  {
    id: '192',
    name: 'Stamina',
    description: 'Boosts the Defense stat when hit by an attack.',
    generation: 'VII',
  },
  {
    id: '176',
    name: 'Stance Change',
    description:
      "The Pokémon changes its form to Blade Forme when it uses an attack move and changes to Shield Forme when it uses King's Shield.",
    generation: 'VI',
  },
  {
    id: '009',
    name: 'Static',
    description:
      'The Pokémon is charged with static electricity, so contact with it may cause paralysis.',
    generation: 'III',
  },
  {
    id: '080',
    name: 'Steadfast',
    description:
      "The Pokémon's determination boosts the Speed stat each time the Pokémon flinches.",
    generation: 'IV',
  },
  {
    id: '243',
    name: 'Steam Engine',
    description:
      "Boosts the Pokémon's Speed stat drastically if hit by a Fire- or Water-type move.",
    generation: 'VIII',
  },
  {
    id: '200',
    name: 'Steelworker',
    description: 'Powers up Steel-type moves.',
    generation: 'VII',
  },
  {
    id: '252',
    name: 'Steely Spirit',
    description: "Powers up ally Pokémon's Steel-type moves.",
    generation: 'VIII',
  },
  {
    id: '001',
    name: 'Stench',
    description: 'By releasing stench when attacking, this Pokémon may cause the target to flinch.',
    generation: 'III',
  },
  {
    id: '060',
    name: 'Sticky Hold',
    description: 'Items held by the Pokémon are stuck fast and cannot be removed by other Pokémon.',
    generation: 'III',
  },
  {
    id: '114',
    name: 'Storm Drain',
    description:
      'Draws in all Water-type moves. Instead of being hit by Water-type moves, it boosts its Sp. Atk.',
    generation: 'IV',
  },
  {
    id: '173',
    name: 'Strong Jaw',
    description: "The Pokémon's strong jaw boosts the power of its biting moves.",
    generation: 'VI',
  },
  {
    id: '005',
    name: 'Sturdy',
    description:
      'It cannot be knocked out with one hit. One-hit KO moves cannot knock it out, either.',
    generation: 'III',
  },
  {
    id: '021',
    name: 'Suction Cups',
    description:
      'This Pokémon uses suction cups to stay in one spot to negate all moves and items that force switching out.',
    generation: 'III',
  },
  {
    id: '105',
    name: 'Super Luck',
    description: 'The Pokémon is so lucky that the critical-hit ratios of its moves are boosted.',
    generation: 'IV',
  },
  {
    id: '207',
    name: 'Surge Surfer',
    description: "Doubles the Pokémon's Speed stat on Electric Terrain.",
    generation: 'VII',
  },
  {
    id: '068',
    name: 'Swarm',
    description: "Powers up Bug-type moves when the Pokémon's HP is low.",
    generation: 'III',
  },
  {
    id: '175',
    name: 'Sweet Veil',
    description: 'Prevents itself and ally Pokémon from falling asleep.',
    generation: 'VI',
  },
  {
    id: '033',
    name: 'Swift Swim',
    description: "Boosts the Pokémon's Speed stat in rain.",
    generation: 'III',
  },
  {
    id: '180',
    name: 'Symbiosis',
    description: 'The Pokémon passes its item to an ally that has used up an item.',
    generation: 'VI',
  },
  {
    id: '028',
    name: 'Synchronize',
    description:
      'The attacker will receive the same status condition if it inflicts a burn, poison, or paralysis to the Pokémon.',
    generation: 'III',
  },
  {
    id: '077',
    name: 'Tangled Feet',
    description: 'Raises evasiveness if the Pokémon is confused.',
    generation: 'IV',
  },
  {
    id: '221',
    name: 'Tangling Hair',
    description: "Contact with the Pokémon lowers the attacker's Speed stat.",
    generation: 'VII',
  },
  {
    id: '101',
    name: 'Technician',
    description: "Powers up the Pokémon's weaker moves.",
    generation: 'IV',
  },
  {
    id: '140',
    name: 'Telepathy',
    description: "Anticipates an ally's attack and dodges it.",
    generation: 'V',
  },
  {
    id: '164',
    name: 'Teravolt',
    description: 'Moves can be used on the target regardless of its Abilities.',
    generation: 'V',
  },
  {
    id: '047',
    name: 'Thick Fat',
    description:
      'The Pokémon is protected by a layer of thick fat, which halves the damage taken from Fire- and Ice-type moves.',
    generation: 'III',
  },
  {
    id: '110',
    name: 'Tinted Lens',
    description: 'The Pokémon can use "not very effective" moves to deal regular damage.',
    generation: 'IV',
  },
  {
    id: '067',
    name: 'Torrent',
    description: "Powers up Water-type moves when the Pokémon's HP is low.",
    generation: 'III',
  },
  {
    id: '181',
    name: 'Tough Claws',
    description: 'Powers up moves that make direct contact.',
    generation: 'VI',
  },
  {
    id: '137',
    name: 'Toxic Boost',
    description: 'Powers up physical attacks when the Pokémon is poisoned.',
    generation: 'V',
  },
  {
    id: '036',
    name: 'Trace',
    description: "When it enters a battle, the Pokémon copies an opposing Pokémon's Ability.",
    generation: 'III',
  },
  {
    id: '262',
    name: 'Transistor',
    description: 'Powers up Electric-type moves.',
    generation: 'VIII',
  },
  {
    id: '205',
    name: 'Triage',
    description: 'Gives priority to a healing move.',
    generation: 'VII',
  },
  {
    id: '054',
    name: 'Truant',
    description: "The Pokémon can't use a move if it had used a move on the previous turn.",
    generation: 'III',
  },
  {
    id: '163',
    name: 'Turboblaze',
    description: 'Moves can be used on the target regardless of its Abilities.',
    generation: 'V',
  },
  {
    id: '109',
    name: 'Unaware',
    description: "When attacking, the Pokémon ignores the target Pokémon's stat changes.",
    generation: 'IV',
  },
  {
    id: '084',
    name: 'Unburden',
    description: "Boosts the Speed stat if the Pokémon's held item is used or lost.",
    generation: 'IV',
  },
  {
    id: '127',
    name: 'Unnerve',
    description: 'Unnerves opposing Pokémon and makes them unable to eat Berries.',
    generation: 'V',
  },
  {
    id: '260',
    name: 'Unseen Fist',
    description:
      'If the Pokémon uses moves that make direct contact, it can attack the target even if the target protects itself.',
    generation: 'VIII',
  },
  {
    id: '162',
    name: 'Victory Star',
    description: 'Boosts the accuracy of its allies and itself.',
    generation: 'V',
  },
  {
    id: '072',
    name: 'Vital Spirit',
    description: 'The Pokémon is full of vitality, and that prevents it from falling asleep.',
    generation: 'III',
  },
  {
    id: '010',
    name: 'Volt Absorb',
    description: 'Restores HP if hit by an Electric-type move instead of taking damage.',
    generation: 'III',
  },
  {
    id: '254',
    name: 'Wandering Spirit',
    description:
      'The Pokémon exchanges Abilities with a Pokémon that hits it with a move that makes direct contact.',
    generation: 'VIII',
  },
  {
    id: '011',
    name: 'Water Absorb',
    description: 'Restores HP if hit by a Water-type move instead of taking damage.',
    generation: 'III',
  },
  {
    id: '199',
    name: 'Water Bubble',
    description:
      'Lowers the power of Fire-type moves done to the Pokémon and prevents the Pokémon from getting a burn.',
    generation: 'VII',
  },
  {
    id: '195',
    name: 'Water Compaction',
    description: "Boosts the Pokémon's Defense stat sharply when hit by a Water-type move.",
    generation: 'VII',
  },
  {
    id: '041',
    name: 'Water Veil',
    description:
      'The Pokémon is covered with a water veil, which prevents the Pokémon from getting a burn.',
    generation: 'III',
  },
  {
    id: '133',
    name: 'Weak Armor',
    description:
      'Physical attacks to the Pokémon lower its Defense stat but sharply raise its Speed stat.',
    generation: 'V',
  },
  {
    id: '073',
    name: 'White Smoke',
    description:
      'The Pokémon is protected by its white smoke, which prevents other Pokémon from lowering its stats.',
    generation: 'III',
  },
  {
    id: '193',
    name: 'Wimp Out',
    description: 'The Pokémon cowardly switches out when its HP becomes half or less.',
    generation: 'VII',
  },
  {
    id: '025',
    name: 'Wonder Guard',
    description: 'Its mysterious power only lets supereffective moves hit the Pokémon.',
    generation: 'III',
  },
  {
    id: '147',
    name: 'Wonder Skin',
    description: 'Makes status moves more likely to miss.',
    generation: 'V',
  },
  {
    id: '161',
    name: 'Zen Mode',
    description: "Changes the Pokémon's shape when HP is half or less.",
    generation: 'V',
  },
];

export default ABILITIES;
