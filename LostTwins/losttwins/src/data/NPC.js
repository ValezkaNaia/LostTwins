const NPCData = [
  {
    id: 'elder',
    name: 'Elder Sage',
    location: 'Forest Village',
    dialogue: [
      "Welcome, travelers. The twins have been separated by dark magic.",
      "Seek the three sacred items to reunite them.",
      "The forest holds many secrets..."
    ],
    questGiver: true,
    reward: { score: 100 }
  },
  {
    id: 'merchant',
    name: 'Wandering Merchant',
    location: 'Crossroads',
    dialogue: [
      "Looking for supplies? I have what you need.",
      "These potions might help you on your journey.",
      "Beware the creatures deeper in the forest..."
    ],
    questGiver: false,
    reward: null
  },
  {
    id: 'healer',
    name: 'Forest Healer',
    location: 'Hidden Grove',
    dialogue: [
      "I sense great pain in your hearts.",
      "Let me mend your wounds.",
      "The water spirits may help you find what you seek."
    ],
    questGiver: true,
    reward: { health: 50 }
  },
  {
    id: 'guardian',
    name: 'Water Guardian',
    location: 'Crystal Lake',
    dialogue: [
      "Only the pure of heart may pass.",
      "Prove your worth through the trial.",
      "The reunion awaits those who persevere."
    ],
    questGiver: true,
    reward: { score: 200 }
  }
];

export default NPCData;