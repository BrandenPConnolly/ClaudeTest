import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { GameState } from '../../src/models/GameState.js';
import { Character } from '../../src/models/Character.js';
import { Task } from '../../src/models/Task.js';
import fs from 'fs/promises';

// Mock fs module
vi.mock('fs/promises');

describe('GameState', () => {
  let gameState;

  beforeEach(() => {
    gameState = new GameState();
    vi.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should initialize with a default character', () => {
      expect(gameState.character).toBeInstanceOf(Character);
      expect(gameState.character.name).toBe('Hero');
    });

    it('should initialize with empty task lists', () => {
      expect(gameState.tasks).toEqual([]);
      expect(gameState.completedTasks).toEqual([]);
    });

    it('should initialize with no daily quest', () => {
      expect(gameState.dailyQuest).toBeNull();
    });

    it('should initialize with zero counters', () => {
      expect(gameState.totalTasksCompleted).toBe(0);
      expect(gameState.totalPomodorosCompleted).toBe(0);
    });

    it('should set today as lastPlayedDate', () => {
      const today = new Date().toISOString().split('T')[0];
      expect(gameState.lastPlayedDate).toBe(today);
    });

    it('should set default save file path', () => {
      expect(gameState.saveFilePath).toBe('game-save.json');
    });
  });

  describe('addTask', () => {
    it('should add a task to the game state', () => {
      const task = gameState.addTask('Test Task', 'EASY');
      expect(task).toBeInstanceOf(Task);
      expect(task.title).toBe('Test Task');
      expect(task.difficulty).toBe('EASY');
      expect(gameState.tasks).toContain(task);
    });

    it('should add task with description', () => {
      const task = gameState.addTask('Test Task', 'MEDIUM', 'Description');
      expect(task.description).toBe('Description');
    });

    it('should add multiple tasks', () => {
      gameState.addTask('Task 1', 'EASY');
      gameState.addTask('Task 2', 'HARD');
      gameState.addTask('Task 3', 'EPIC');
      expect(gameState.tasks.length).toBe(3);
    });

    it('should return the created task', () => {
      const task = gameState.addTask('Test', 'MEDIUM');
      expect(task.id).toBeDefined();
      expect(task.title).toBe('Test');
    });
  });

  describe('getActiveTasks', () => {
    it('should return only incomplete tasks', () => {
      const task1 = gameState.addTask('Task 1', 'EASY');
      const task2 = gameState.addTask('Task 2', 'MEDIUM');
      const task3 = gameState.addTask('Task 3', 'HARD');

      task2.complete();

      const activeTasks = gameState.getActiveTasks();
      expect(activeTasks).toHaveLength(2);
      expect(activeTasks).toContain(task1);
      expect(activeTasks).toContain(task3);
      expect(activeTasks).not.toContain(task2);
    });

    it('should return empty array when all tasks completed', () => {
      const task1 = gameState.addTask('Task 1', 'EASY');
      const task2 = gameState.addTask('Task 2', 'MEDIUM');

      task1.complete();
      task2.complete();

      expect(gameState.getActiveTasks()).toEqual([]);
    });

    it('should return empty array when no tasks exist', () => {
      expect(gameState.getActiveTasks()).toEqual([]);
    });
  });

  describe('getCompletedTasks', () => {
    it('should return only completed tasks', () => {
      const task1 = gameState.addTask('Task 1', 'EASY');
      const task2 = gameState.addTask('Task 2', 'MEDIUM');
      const task3 = gameState.addTask('Task 3', 'HARD');

      task1.complete();
      task3.complete();

      const completedTasks = gameState.getCompletedTasks();
      expect(completedTasks).toHaveLength(2);
      expect(completedTasks).toContain(task1);
      expect(completedTasks).toContain(task3);
      expect(completedTasks).not.toContain(task2);
    });

    it('should return empty array when no tasks completed', () => {
      gameState.addTask('Task 1', 'EASY');
      gameState.addTask('Task 2', 'MEDIUM');

      expect(gameState.getCompletedTasks()).toEqual([]);
    });
  });

  describe('completeTask', () => {
    it('should complete task and award XP', () => {
      const task = gameState.addTask('Test Task', 'MEDIUM');
      const result = gameState.completeTask(task.id);

      expect(result).toBeDefined();
      expect(result.task).toBe(task);
      expect(result.xpGained).toBe(50);
      expect(result.levelsGained).toEqual([]);
      expect(task.completed).toBe(true);
    });

    it('should increment totalTasksCompleted', () => {
      const task = gameState.addTask('Test Task', 'EASY');
      gameState.completeTask(task.id);

      expect(gameState.totalTasksCompleted).toBe(1);
    });

    it('should return null for non-existent task', () => {
      const result = gameState.completeTask('invalid-id');
      expect(result).toBeNull();
    });

    it('should return null for already completed task', () => {
      const task = gameState.addTask('Test Task', 'EASY');
      gameState.completeTask(task.id);
      const result = gameState.completeTask(task.id);

      expect(result).toBeNull();
    });

    it('should handle level ups from task completion', () => {
      gameState.character.xp = 80;
      const task = gameState.addTask('Test Task', 'MEDIUM');
      const result = gameState.completeTask(task.id);

      expect(result.levelsGained).toContain(2);
      expect(gameState.character.level).toBe(2);
    });

    it('should handle multiple level ups', () => {
      gameState.character.xp = 90;
      const task = gameState.addTask('Epic Task', 'EPIC');
      const result = gameState.completeTask(task.id);

      expect(result.levelsGained.length).toBeGreaterThan(0);
    });
  });

  describe('deleteTask', () => {
    it('should delete existing task', () => {
      const task = gameState.addTask('Test Task', 'EASY');
      const result = gameState.deleteTask(task.id);

      expect(result).toBe(true);
      expect(gameState.tasks).not.toContain(task);
      expect(gameState.tasks.length).toBe(0);
    });

    it('should return false for non-existent task', () => {
      const result = gameState.deleteTask('invalid-id');
      expect(result).toBe(false);
    });

    it('should not affect other tasks', () => {
      const task1 = gameState.addTask('Task 1', 'EASY');
      const task2 = gameState.addTask('Task 2', 'MEDIUM');
      const task3 = gameState.addTask('Task 3', 'HARD');

      gameState.deleteTask(task2.id);

      expect(gameState.tasks).toContain(task1);
      expect(gameState.tasks).toContain(task3);
      expect(gameState.tasks.length).toBe(2);
    });

    it('should be able to delete completed tasks', () => {
      const task = gameState.addTask('Test Task', 'EASY');
      task.complete();

      const result = gameState.deleteTask(task.id);
      expect(result).toBe(true);
      expect(gameState.tasks.length).toBe(0);
    });
  });

  describe('addPomodoroToTask', () => {
    it('should add pomodoro to existing task', () => {
      const task = gameState.addTask('Test Task', 'EASY');
      const result = gameState.addPomodoroToTask(task.id);

      expect(result).toBe(true);
      expect(task.pomodorosCompleted).toBe(1);
    });

    it('should increment totalPomodorosCompleted', () => {
      const task = gameState.addTask('Test Task', 'EASY');
      gameState.addPomodoroToTask(task.id);

      expect(gameState.totalPomodorosCompleted).toBe(1);
    });

    it('should return false for non-existent task', () => {
      const result = gameState.addPomodoroToTask('invalid-id');
      expect(result).toBe(false);
      expect(gameState.totalPomodorosCompleted).toBe(0);
    });

    it('should allow multiple pomodoros on same task', () => {
      const task = gameState.addTask('Test Task', 'EASY');
      gameState.addPomodoroToTask(task.id);
      gameState.addPomodoroToTask(task.id);
      gameState.addPomodoroToTask(task.id);

      expect(task.pomodorosCompleted).toBe(3);
      expect(gameState.totalPomodorosCompleted).toBe(3);
    });
  });

  describe('generateDailyQuest', () => {
    it('should generate a daily quest', () => {
      gameState.generateDailyQuest();

      expect(gameState.dailyQuest).toBeDefined();
      expect(gameState.dailyQuest.title).toBeDefined();
      expect(gameState.dailyQuest.target).toBeGreaterThan(0);
      expect(gameState.dailyQuest.type).toBeDefined();
      expect(gameState.dailyQuest.progress).toBe(0);
      expect(gameState.dailyQuest.completed).toBe(false);
    });

    it('should have valid quest types', () => {
      const validTypes = ['tasks', 'pomodoros', 'epic', 'hard'];
      gameState.generateDailyQuest();

      expect(validTypes).toContain(gameState.dailyQuest.type);
    });

    it('should update lastPlayedDate to today', () => {
      gameState.lastPlayedDate = '2024-01-01';
      gameState.generateDailyQuest();

      const today = new Date().toISOString().split('T')[0];
      expect(gameState.lastPlayedDate).toBe(today);
    });

    it('should not regenerate if already have quest for today', () => {
      const today = new Date().toISOString().split('T')[0];
      gameState.lastPlayedDate = today;
      gameState.dailyQuest = { title: 'Existing Quest', target: 5, type: 'tasks', progress: 2, completed: false };

      gameState.generateDailyQuest();

      expect(gameState.dailyQuest.title).toBe('Existing Quest');
      expect(gameState.dailyQuest.progress).toBe(2);
    });

    it('should regenerate if date changed', () => {
      gameState.lastPlayedDate = '2024-01-01';
      gameState.dailyQuest = { title: 'Old Quest', target: 5, type: 'tasks', progress: 2, completed: false };

      gameState.generateDailyQuest();

      expect(gameState.dailyQuest.title).not.toBe('Old Quest');
      expect(gameState.dailyQuest.progress).toBe(0);
    });

    it('should regenerate if no daily quest exists', () => {
      const today = new Date().toISOString().split('T')[0];
      gameState.lastPlayedDate = today;
      gameState.dailyQuest = null;

      gameState.generateDailyQuest();

      expect(gameState.dailyQuest).not.toBeNull();
    });
  });

  describe('checkAchievements', () => {
    it('should unlock "First Victory" on first task completion', () => {
      gameState.totalTasksCompleted = 1;
      const achievements = gameState.checkAchievements();

      expect(achievements).toContain('First Victory');
      expect(gameState.character.achievements).toContain('First Victory');
    });

    it('should not unlock "First Victory" on second task', () => {
      gameState.totalTasksCompleted = 1;
      gameState.checkAchievements();

      gameState.totalTasksCompleted = 2;
      const achievements = gameState.checkAchievements();

      expect(achievements).not.toContain('First Victory');
    });

    it('should unlock "Novice Warrior" at level 5', () => {
      gameState.character.level = 5;
      const achievements = gameState.checkAchievements();

      expect(achievements).toContain('Novice Warrior');
      expect(gameState.character.achievements).toContain('Novice Warrior');
    });

    it('should unlock "Skilled Fighter" at level 10', () => {
      gameState.character.level = 10;
      const achievements = gameState.checkAchievements();

      expect(achievements).toContain('Skilled Fighter');
      expect(gameState.character.achievements).toContain('Skilled Fighter');
    });

    it('should unlock "Task Slayer" at 10 tasks', () => {
      gameState.totalTasksCompleted = 10;
      const achievements = gameState.checkAchievements();

      expect(achievements).toContain('Task Slayer');
      expect(gameState.character.achievements).toContain('Task Slayer');
    });

    it('should unlock "Productivity Master" at 50 tasks', () => {
      gameState.totalTasksCompleted = 50;
      const achievements = gameState.checkAchievements();

      expect(achievements).toContain('Productivity Master');
      expect(gameState.character.achievements).toContain('Productivity Master');
    });

    it('should unlock "Focus Champion" at 25 pomodoros', () => {
      gameState.totalPomodorosCompleted = 25;
      const achievements = gameState.checkAchievements();

      expect(achievements).toContain('Focus Champion');
      expect(gameState.character.achievements).toContain('Focus Champion');
    });

    it('should unlock multiple achievements at once', () => {
      gameState.totalTasksCompleted = 1;
      gameState.character.level = 5;
      const achievements = gameState.checkAchievements();

      expect(achievements).toContain('First Victory');
      expect(achievements).toContain('Novice Warrior');
      expect(achievements.length).toBe(2);
    });

    it('should not return duplicate achievements', () => {
      gameState.totalTasksCompleted = 1;
      gameState.checkAchievements();

      // Check again with same stats
      const achievements = gameState.checkAchievements();
      expect(achievements).not.toContain('First Victory');
      expect(achievements.length).toBe(0);
    });

    it('should return empty array when no achievements unlocked', () => {
      gameState.totalTasksCompleted = 0;
      gameState.character.level = 1;
      const achievements = gameState.checkAchievements();

      expect(achievements).toEqual([]);
    });
  });

  describe('getStats', () => {
    it('should return complete game statistics', () => {
      gameState.addTask('Task 1', 'EASY');
      gameState.addTask('Task 2', 'MEDIUM');
      const task3 = gameState.addTask('Task 3', 'HARD');
      gameState.completeTask(task3.id);
      gameState.generateDailyQuest();

      const stats = gameState.getStats();

      expect(stats.character).toBeDefined();
      expect(stats.character.name).toBe('Hero');
      expect(stats.activeTasks).toBe(2);
      expect(stats.completedTasks).toBe(1);
      expect(stats.totalTasksCompleted).toBe(1);
      expect(stats.totalPomodorosCompleted).toBe(0);
      expect(stats.dailyQuest).toBeDefined();
    });

    it('should reflect current character state', () => {
      gameState.character.gainXp(100);
      const stats = gameState.getStats();

      expect(stats.character.level).toBe(2);
    });
  });

  describe('File I/O - save', () => {
    it('should save game state to file', async () => {
      gameState.character = new Character('TestHero');
      gameState.addTask('Task 1', 'EASY');
      gameState.totalTasksCompleted = 5;

      await gameState.save();

      expect(fs.writeFile).toHaveBeenCalledOnce();
      const [filepath, content] = fs.writeFile.mock.calls[0];
      expect(filepath).toBe('game-save.json');

      const data = JSON.parse(content);
      expect(data.character.name).toBe('TestHero');
      expect(data.tasks.length).toBe(1);
      expect(data.totalTasksCompleted).toBe(5);
      expect(data.savedAt).toBeDefined();
    });

    it('should save all task data', async () => {
      const task1 = gameState.addTask('Task 1', 'EASY');
      const task2 = gameState.addTask('Task 2', 'HARD');
      task1.complete();
      task2.addPomodoro();

      await gameState.save();

      const content = fs.writeFile.mock.calls[0][1];
      const data = JSON.parse(content);

      expect(data.tasks.length).toBe(2);
      expect(data.tasks[0].completed).toBe(true);
      expect(data.tasks[1].pomodorosCompleted).toBe(1);
    });

    it('should save daily quest', async () => {
      gameState.generateDailyQuest();

      await gameState.save();

      const content = fs.writeFile.mock.calls[0][1];
      const data = JSON.parse(content);

      expect(data.dailyQuest).toBeDefined();
      expect(data.dailyQuest.title).toBeDefined();
    });

    it('should save with formatted JSON', async () => {
      await gameState.save();

      const [, content, encoding] = fs.writeFile.mock.calls[0];
      expect(encoding).toBe('utf-8');
      expect(content).toContain('\n'); // Formatted JSON has newlines
    });
  });

  describe('File I/O - load', () => {
    it('should load game state from file', async () => {
      const saveData = {
        character: {
          name: 'LoadedHero',
          level: 5,
          xp: 75,
          stats: { productivity: 30, focus: 28, stamina: 32 },
          achievements: ['Test Achievement'],
          createdAt: '2025-01-01T00:00:00.000Z'
        },
        tasks: [
          {
            id: 'task-1',
            title: 'Loaded Task',
            difficulty: 'HARD',
            description: 'Test',
            completed: false,
            createdAt: '2025-01-01T00:00:00.000Z',
            completedAt: null,
            pomodorosCompleted: 2
          }
        ],
        dailyQuest: { title: 'Quest', target: 3, type: 'tasks', progress: 1, completed: false },
        lastPlayedDate: '2025-01-01',
        totalTasksCompleted: 10,
        totalPomodorosCompleted: 25
      };

      fs.readFile.mockResolvedValue(JSON.stringify(saveData));

      const result = await gameState.load();

      expect(result).toBe(true);
      expect(gameState.character.name).toBe('LoadedHero');
      expect(gameState.character.level).toBe(5);
      expect(gameState.tasks.length).toBe(1);
      expect(gameState.tasks[0].title).toBe('Loaded Task');
      expect(gameState.dailyQuest.title).toBe('Quest');
      expect(gameState.totalTasksCompleted).toBe(10);
      expect(gameState.totalPomodorosCompleted).toBe(25);
    });

    it('should handle missing save file gracefully', async () => {
      const error = new Error('File not found');
      error.code = 'ENOENT';
      fs.readFile.mockRejectedValue(error);

      const result = await gameState.load();

      expect(result).toBe(false);
    });

    it('should handle corrupted save file', async () => {
      fs.readFile.mockResolvedValue('invalid json{{{');

      // The load method catches JSON parse errors and returns false
      const result = await gameState.load();
      expect(result).toBe(false);
    });

    it('should handle missing totalTasksCompleted', async () => {
      const saveData = {
        character: { name: 'Hero', level: 1, xp: 0, stats: { productivity: 10, focus: 10, stamina: 10 }, achievements: [], createdAt: '2025-01-01T00:00:00.000Z' },
        tasks: [],
        dailyQuest: null,
        lastPlayedDate: '2025-01-01'
      };

      fs.readFile.mockResolvedValue(JSON.stringify(saveData));

      await gameState.load();

      expect(gameState.totalTasksCompleted).toBe(0);
      expect(gameState.totalPomodorosCompleted).toBe(0);
    });

    it('should restore task functionality after loading', async () => {
      const saveData = {
        character: { name: 'Hero', level: 1, xp: 0, stats: { productivity: 10, focus: 10, stamina: 10 }, achievements: [], createdAt: '2025-01-01T00:00:00.000Z' },
        tasks: [
          {
            id: 'task-1',
            title: 'Test Task',
            difficulty: 'MEDIUM',
            description: '',
            completed: false,
            createdAt: '2025-01-01T00:00:00.000Z',
            completedAt: null,
            pomodorosCompleted: 0
          }
        ],
        dailyQuest: null,
        lastPlayedDate: '2025-01-01',
        totalTasksCompleted: 0,
        totalPomodorosCompleted: 0
      };

      fs.readFile.mockResolvedValue(JSON.stringify(saveData));
      await gameState.load();

      // Should be able to complete the loaded task
      const result = gameState.completeTask('task-1');
      expect(result).toBeDefined();
      expect(result.xpGained).toBe(50);
    });
  });

  describe('File I/O - hasSaveFile', () => {
    it('should return true if save file exists', async () => {
      fs.access.mockResolvedValue();

      const result = await gameState.hasSaveFile();
      expect(result).toBe(true);
    });

    it('should return false if save file does not exist', async () => {
      fs.access.mockRejectedValue(new Error('File not found'));

      const result = await gameState.hasSaveFile();
      expect(result).toBe(false);
    });
  });

  describe('Integration - Complete Workflow', () => {
    it('should handle full game flow', () => {
      // Add tasks
      const task1 = gameState.addTask('Task 1', 'EASY');
      const task2 = gameState.addTask('Task 2', 'HARD');

      // Add pomodoros
      gameState.addPomodoroToTask(task1.id);
      gameState.addPomodoroToTask(task2.id);

      // Complete task
      const result = gameState.completeTask(task1.id);

      expect(result.xpGained).toBe(25);
      expect(gameState.character.xp).toBe(25);
      expect(gameState.totalTasksCompleted).toBe(1);
      expect(gameState.totalPomodorosCompleted).toBe(2);
      expect(gameState.getActiveTasks().length).toBe(1);
      expect(gameState.getCompletedTasks().length).toBe(1);
    });

    it('should trigger achievements through gameplay', () => {
      const task = gameState.addTask('First Task', 'EASY');
      gameState.completeTask(task.id);

      expect(gameState.character.achievements).toContain('First Victory');
    });
  });
});
