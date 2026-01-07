import { describe, it, expect, beforeEach } from 'vitest';
import { Character } from '../../src/models/Character.js';

describe('Character', () => {
  describe('Constructor', () => {
    it('should create a character with default name', () => {
      const char = new Character();
      expect(char.name).toBe('Hero');
      expect(char.level).toBe(1);
      expect(char.xp).toBe(0);
      expect(char.achievements).toEqual([]);
    });

    it('should create a character with custom name', () => {
      const char = new Character('TestWarrior');
      expect(char.name).toBe('TestWarrior');
    });

    it('should initialize with correct default stats', () => {
      const char = new Character();
      expect(char.stats.productivity).toBe(10);
      expect(char.stats.focus).toBe(10);
      expect(char.stats.stamina).toBe(10);
    });

    it('should set createdAt timestamp', () => {
      const char = new Character();
      expect(char.createdAt).toBeDefined();
      expect(typeof char.createdAt).toBe('string');
      expect(new Date(char.createdAt).toString()).not.toBe('Invalid Date');
    });
  });

  describe('xpForNextLevel', () => {
    it('should calculate correct XP for level 1', () => {
      const char = new Character();
      expect(char.xpForNextLevel()).toBe(100);
    });

    it('should calculate correct XP for level 2', () => {
      const char = new Character();
      char.level = 2;
      expect(char.xpForNextLevel()).toBe(150);
    });

    it('should calculate correct XP for level 3', () => {
      const char = new Character();
      char.level = 3;
      expect(char.xpForNextLevel()).toBe(225);
    });

    it('should calculate correct XP for level 10', () => {
      const char = new Character();
      char.level = 10;
      // 100 * (1.5^9) = 100 * 38.443... = 3844 (floored)
      expect(char.xpForNextLevel()).toBe(3844);
    });

    it('should use exponential scaling (1.5 multiplier)', () => {
      const char = new Character();
      const level1Xp = char.xpForNextLevel();
      char.level = 2;
      const level2Xp = char.xpForNextLevel();
      expect(level2Xp).toBe(Math.floor(level1Xp * 1.5));
    });
  });

  describe('gainXp', () => {
    it('should add XP without leveling up', () => {
      const char = new Character();
      const levelsGained = char.gainXp(50);
      expect(char.xp).toBe(50);
      expect(char.level).toBe(1);
      expect(levelsGained).toEqual([]);
    });

    it('should level up once when gaining enough XP', () => {
      const char = new Character();
      const levelsGained = char.gainXp(100);
      expect(char.level).toBe(2);
      expect(char.xp).toBe(0);
      expect(levelsGained).toEqual([2]);
    });

    it('should level up multiple times from single XP gain', () => {
      const char = new Character();
      // Level 1->2 needs 100, Level 2->3 needs 150, total 250
      const levelsGained = char.gainXp(250);
      expect(char.level).toBe(3);
      expect(char.xp).toBe(0);
      expect(levelsGained).toEqual([2, 3]);
    });

    it('should carry over excess XP after leveling', () => {
      const char = new Character();
      const levelsGained = char.gainXp(125);
      expect(char.level).toBe(2);
      expect(char.xp).toBe(25); // 125 - 100 = 25 leftover
      expect(levelsGained).toEqual([2]);
    });

    it('should handle gaining exactly the XP needed for next level', () => {
      const char = new Character();
      char.xp = 50;
      const levelsGained = char.gainXp(50);
      expect(char.level).toBe(2);
      expect(char.xp).toBe(0);
      expect(levelsGained).toEqual([2]);
    });

    it('should handle large XP gains spanning many levels', () => {
      const char = new Character();
      // Massive XP gain to test multiple levels
      const levelsGained = char.gainXp(1000);
      expect(char.level).toBeGreaterThan(3);
      expect(levelsGained.length).toBeGreaterThan(0);
      expect(levelsGained).toContain(2);
    });

    it('should increase stats when leveling up', () => {
      const char = new Character();
      const initialProductivity = char.stats.productivity;
      const initialFocus = char.stats.focus;
      const initialStamina = char.stats.stamina;

      char.gainXp(100);

      expect(char.stats.productivity).toBeGreaterThan(initialProductivity);
      expect(char.stats.focus).toBeGreaterThan(initialFocus);
      expect(char.stats.stamina).toBeGreaterThan(initialStamina);
    });
  });

  describe('levelUp', () => {
    it('should increase all stats by at least 2', () => {
      const char = new Character();
      const initialStats = { ...char.stats };

      char.levelUp();

      expect(char.stats.productivity).toBeGreaterThanOrEqual(initialStats.productivity + 2);
      expect(char.stats.focus).toBeGreaterThanOrEqual(initialStats.focus + 2);
      expect(char.stats.stamina).toBeGreaterThanOrEqual(initialStats.stamina + 2);
    });

    it('should increase all stats by at most 4', () => {
      const char = new Character();
      const initialStats = { ...char.stats };

      char.levelUp();

      expect(char.stats.productivity).toBeLessThanOrEqual(initialStats.productivity + 4);
      expect(char.stats.focus).toBeLessThanOrEqual(initialStats.focus + 4);
      expect(char.stats.stamina).toBeLessThanOrEqual(initialStats.stamina + 4);
    });

    it('should generate random stat increases', () => {
      const char = new Character();
      const increases = new Set();

      // Run multiple times to check randomness
      for (let i = 0; i < 10; i++) {
        const before = char.stats.productivity;
        char.levelUp();
        increases.add(char.stats.productivity - before);
      }

      // Should have some variance in increases (not all the same)
      expect(increases.size).toBeGreaterThan(1);
    });
  });

  describe('unlockAchievement', () => {
    it('should unlock a new achievement', () => {
      const char = new Character();
      const result = char.unlockAchievement('First Victory');
      expect(result).toBe(true);
      expect(char.achievements).toContain('First Victory');
      expect(char.achievements.length).toBe(1);
    });

    it('should not unlock duplicate achievements', () => {
      const char = new Character();
      char.unlockAchievement('First Victory');
      const result = char.unlockAchievement('First Victory');
      expect(result).toBe(false);
      expect(char.achievements.length).toBe(1);
    });

    it('should unlock multiple different achievements', () => {
      const char = new Character();
      char.unlockAchievement('First Victory');
      char.unlockAchievement('Novice Warrior');
      char.unlockAchievement('Task Slayer');

      expect(char.achievements).toEqual(['First Victory', 'Novice Warrior', 'Task Slayer']);
      expect(char.achievements.length).toBe(3);
    });

    it('should preserve achievement order', () => {
      const char = new Character();
      char.unlockAchievement('Achievement 1');
      char.unlockAchievement('Achievement 2');
      char.unlockAchievement('Achievement 3');

      expect(char.achievements[0]).toBe('Achievement 1');
      expect(char.achievements[1]).toBe('Achievement 2');
      expect(char.achievements[2]).toBe('Achievement 3');
    });
  });

  describe('getSummary', () => {
    it('should return complete character summary', () => {
      const char = new Character('TestHero');
      char.gainXp(50);
      char.unlockAchievement('Test Achievement');

      const summary = char.getSummary();

      expect(summary.name).toBe('TestHero');
      expect(summary.level).toBe(1);
      expect(summary.xp).toBe(50);
      expect(summary.xpNeeded).toBe(100);
      expect(summary.stats).toEqual(char.stats);
      expect(summary.achievements).toEqual(['Test Achievement']);
    });

    it('should not mutate original stats', () => {
      const char = new Character();
      const summary = char.getSummary();

      summary.stats.productivity = 999;
      expect(char.stats.productivity).toBe(10);
    });

    it('should not mutate original achievements', () => {
      const char = new Character();
      char.unlockAchievement('Test');
      const summary = char.getSummary();

      summary.achievements.push('Fake Achievement');
      expect(char.achievements).toEqual(['Test']);
    });
  });

  describe('Serialization', () => {
    it('should serialize to JSON', () => {
      const char = new Character('Hero');
      char.gainXp(150);
      char.unlockAchievement('Test Achievement');

      const json = char.toJSON();

      expect(json.name).toBe('Hero');
      expect(json.level).toBe(2);
      expect(json.xp).toBe(50);
      expect(json.stats).toEqual(char.stats);
      expect(json.achievements).toEqual(['Test Achievement']);
      expect(json.createdAt).toBeDefined();
    });

    it('should deserialize from JSON', () => {
      const data = {
        name: 'SavedHero',
        level: 5,
        xp: 75,
        stats: { productivity: 30, focus: 28, stamina: 32 },
        achievements: ['Achievement 1', 'Achievement 2'],
        createdAt: '2025-01-01T00:00:00.000Z'
      };

      const char = Character.fromJSON(data);

      expect(char.name).toBe('SavedHero');
      expect(char.level).toBe(5);
      expect(char.xp).toBe(75);
      expect(char.stats).toEqual(data.stats);
      expect(char.achievements).toEqual(data.achievements);
      expect(char.createdAt).toBe(data.createdAt);
    });

    it('should handle missing achievements in deserialization', () => {
      const data = {
        name: 'Hero',
        level: 1,
        xp: 0,
        stats: { productivity: 10, focus: 10, stamina: 10 },
        createdAt: '2025-01-01T00:00:00.000Z'
      };

      const char = Character.fromJSON(data);
      expect(char.achievements).toEqual([]);
    });

    it('should round-trip serialize and deserialize', () => {
      const original = new Character('Original');
      original.gainXp(200);
      original.unlockAchievement('Test 1');
      original.unlockAchievement('Test 2');

      const json = original.toJSON();
      const restored = Character.fromJSON(json);

      expect(restored.name).toBe(original.name);
      expect(restored.level).toBe(original.level);
      expect(restored.xp).toBe(original.xp);
      expect(restored.stats).toEqual(original.stats);
      expect(restored.achievements).toEqual(original.achievements);
      expect(restored.createdAt).toBe(original.createdAt);
    });
  });
});
