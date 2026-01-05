export class Character {
  constructor(name = 'Hero') {
    this.name = name;
    this.level = 1;
    this.xp = 0;
    this.stats = {
      productivity: 10,
      focus: 10,
      stamina: 10
    };
    this.achievements = [];
    this.createdAt = new Date().toISOString();
  }

  // XP required for next level (exponential scaling)
  xpForNextLevel() {
    return Math.floor(100 * Math.pow(1.5, this.level - 1));
  }

  // Add XP and check for level up
  gainXp(amount) {
    this.xp += amount;
    const leveledUp = [];

    while (this.xp >= this.xpForNextLevel()) {
      this.xp -= this.xpForNextLevel();
      this.level++;
      this.levelUp();
      leveledUp.push(this.level);
    }

    return leveledUp;
  }

  // Level up increases stats
  levelUp() {
    this.stats.productivity += Math.floor(Math.random() * 3) + 2;
    this.stats.focus += Math.floor(Math.random() * 3) + 2;
    this.stats.stamina += Math.floor(Math.random() * 3) + 2;
  }

  // Unlock achievement
  unlockAchievement(achievement) {
    if (!this.achievements.includes(achievement)) {
      this.achievements.push(achievement);
      return true;
    }
    return false;
  }

  // Get character summary
  getSummary() {
    return {
      name: this.name,
      level: this.level,
      xp: this.xp,
      xpNeeded: this.xpForNextLevel(),
      stats: { ...this.stats },
      achievements: [...this.achievements]
    };
  }

  // Serialize for saving
  toJSON() {
    return {
      name: this.name,
      level: this.level,
      xp: this.xp,
      stats: this.stats,
      achievements: this.achievements,
      createdAt: this.createdAt
    };
  }

  // Deserialize from saved data
  static fromJSON(data) {
    const character = new Character(data.name);
    character.level = data.level;
    character.xp = data.xp;
    character.stats = data.stats;
    character.achievements = data.achievements || [];
    character.createdAt = data.createdAt;
    return character;
  }
}
