const NPC = {
  id: "otto",
  name: "Otto",
  species: "Otter",
  description: "A wise otter who guides adventurers",
  
  dialogue: {
    greeting: "Welcome, friend! I'm Otto. Need some guidance?",
    questInfo: "There's trouble up ahead. Dark creatures have been spotted. Will you help?",
    controls: "Use WASD to move, SPACE to jump, Q to attack.",
    farewell: "Good luck out there!",
  },
  
  inspiration: {
    onHealthLoss: [
      "You can recover! Keep pushing forward.",
      "That's just a scratch. Don't give up now.",
      "Pain is temporary, victory is eternal.",
    ],
    onEnemyKill: [
      "Excellent work! You're getting stronger.",
      "One down, many more to go. Stay sharp!",
      "Your skills are impressive. Keep it up!",
    ],
    onQuestComplete: [
      "You did it! You're a true hero.",
      "Against all odds, you prevailed. Remarkable!",
      "The caves are safe once more, thanks to you.",
    ],
  },
};

export default NPC;