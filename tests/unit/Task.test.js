import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Task } from '../../src/models/Task.js';

describe('Task', () => {
  describe('Constructor', () => {
    it('should create a task with title and default difficulty', () => {
      const task = new Task('Test Task');
      expect(task.title).toBe('Test Task');
      expect(task.difficulty).toBe('MEDIUM');
      expect(task.description).toBe('');
      expect(task.completed).toBe(false);
      expect(task.pomodorosCompleted).toBe(0);
    });

    it('should create a task with custom difficulty', () => {
      const task = new Task('Hard Task', 'HARD');
      expect(task.difficulty).toBe('HARD');
    });

    it('should create a task with description', () => {
      const task = new Task('Test Task', 'EASY', 'This is a description');
      expect(task.description).toBe('This is a description');
    });

    it('should generate unique IDs for each task', () => {
      const task1 = new Task('Task 1');
      const task2 = new Task('Task 2');
      expect(task1.id).not.toBe(task2.id);
      expect(task1.id).toBeTruthy();
      expect(task2.id).toBeTruthy();
    });

    it('should set createdAt timestamp', () => {
      const task = new Task('Test Task');
      expect(task.createdAt).toBeDefined();
      expect(typeof task.createdAt).toBe('string');
      expect(new Date(task.createdAt).toString()).not.toBe('Invalid Date');
    });

    it('should initialize completedAt as null', () => {
      const task = new Task('Test Task');
      expect(task.completedAt).toBeNull();
    });
  });

  describe('Difficulty Levels', () => {
    it('should have EASY difficulty with correct properties', () => {
      expect(Task.DIFFICULTY.EASY).toEqual({
        name: 'Easy',
        xp: 25,
        color: 'green',
        icon: '⚔️'
      });
    });

    it('should have MEDIUM difficulty with correct properties', () => {
      expect(Task.DIFFICULTY.MEDIUM).toEqual({
        name: 'Medium',
        xp: 50,
        color: 'yellow',
        icon: '⚔️⚔️'
      });
    });

    it('should have HARD difficulty with correct properties', () => {
      expect(Task.DIFFICULTY.HARD).toEqual({
        name: 'Hard',
        xp: 100,
        color: 'red',
        icon: '⚔️⚔️⚔️'
      });
    });

    it('should have EPIC difficulty with correct properties', () => {
      expect(Task.DIFFICULTY.EPIC).toEqual({
        name: 'Epic',
        xp: 200,
        color: 'magenta',
        icon: '⚔️⚔️⚔️⚔️'
      });
    });
  });

  describe('getXpReward', () => {
    it('should return 25 XP for EASY tasks', () => {
      const task = new Task('Easy Task', 'EASY');
      expect(task.getXpReward()).toBe(25);
    });

    it('should return 50 XP for MEDIUM tasks', () => {
      const task = new Task('Medium Task', 'MEDIUM');
      expect(task.getXpReward()).toBe(50);
    });

    it('should return 100 XP for HARD tasks', () => {
      const task = new Task('Hard Task', 'HARD');
      expect(task.getXpReward()).toBe(100);
    });

    it('should return 200 XP for EPIC tasks', () => {
      const task = new Task('Epic Task', 'EPIC');
      expect(task.getXpReward()).toBe(200);
    });
  });

  describe('getDifficultyInfo', () => {
    it('should return difficulty info for EASY', () => {
      const task = new Task('Task', 'EASY');
      const info = task.getDifficultyInfo();
      expect(info.name).toBe('Easy');
      expect(info.xp).toBe(25);
      expect(info.color).toBe('green');
      expect(info.icon).toBe('⚔️');
    });

    it('should return difficulty info for EPIC', () => {
      const task = new Task('Task', 'EPIC');
      const info = task.getDifficultyInfo();
      expect(info.name).toBe('Epic');
      expect(info.xp).toBe(200);
      expect(info.color).toBe('magenta');
      expect(info.icon).toBe('⚔️⚔️⚔️⚔️');
    });
  });

  describe('complete', () => {
    it('should mark task as completed', () => {
      const task = new Task('Test Task');
      const result = task.complete();
      expect(result).toBe(true);
      expect(task.completed).toBe(true);
    });

    it('should set completedAt timestamp', () => {
      const task = new Task('Test Task');
      const before = new Date();
      task.complete();
      const completedAt = new Date(task.completedAt);
      const after = new Date();

      expect(completedAt).toBeInstanceOf(Date);
      expect(completedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(completedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should not re-complete already completed task', () => {
      const task = new Task('Test Task');
      task.complete();
      const firstCompletedAt = task.completedAt;

      // Try to complete again
      const result = task.complete();
      expect(result).toBe(false);
      expect(task.completedAt).toBe(firstCompletedAt);
    });

    it('should return false when trying to complete twice', () => {
      const task = new Task('Test Task');
      expect(task.complete()).toBe(true);
      expect(task.complete()).toBe(false);
      expect(task.complete()).toBe(false);
    });
  });

  describe('addPomodoro', () => {
    it('should increment pomodoro count', () => {
      const task = new Task('Test Task');
      task.addPomodoro();
      expect(task.pomodorosCompleted).toBe(1);
    });

    it('should allow multiple pomodoros', () => {
      const task = new Task('Test Task');
      task.addPomodoro();
      task.addPomodoro();
      task.addPomodoro();
      expect(task.pomodorosCompleted).toBe(3);
    });

    it('should track pomodoros on completed tasks', () => {
      const task = new Task('Test Task');
      task.complete();
      task.addPomodoro();
      expect(task.pomodorosCompleted).toBe(1);
    });

    it('should allow adding pomodoros before completion', () => {
      const task = new Task('Test Task');
      task.addPomodoro();
      task.addPomodoro();
      task.complete();
      expect(task.pomodorosCompleted).toBe(2);
      expect(task.completed).toBe(true);
    });
  });

  describe('getSummary', () => {
    it('should return task summary with all details', () => {
      const task = new Task('Test Task', 'HARD', 'Description');
      task.addPomodoro();

      const summary = task.getSummary();

      expect(summary.id).toBe(task.id);
      expect(summary.title).toBe('Test Task');
      expect(summary.difficulty).toBe('Hard');
      expect(summary.xpReward).toBe(100);
      expect(summary.completed).toBe(false);
      expect(summary.pomodorosCompleted).toBe(1);
    });

    it('should show completed status in summary', () => {
      const task = new Task('Test Task');
      task.complete();

      const summary = task.getSummary();
      expect(summary.completed).toBe(true);
    });

    it('should include difficulty name not key', () => {
      const task = new Task('Test Task', 'EPIC');
      const summary = task.getSummary();
      expect(summary.difficulty).toBe('Epic');
      expect(summary.difficulty).not.toBe('EPIC');
    });
  });

  describe('Serialization', () => {
    it('should serialize to JSON', () => {
      const task = new Task('Test Task', 'HARD', 'Test Description');
      task.addPomodoro();

      const json = task.toJSON();

      expect(json.id).toBe(task.id);
      expect(json.title).toBe('Test Task');
      expect(json.difficulty).toBe('HARD');
      expect(json.description).toBe('Test Description');
      expect(json.completed).toBe(false);
      expect(json.createdAt).toBeDefined();
      expect(json.completedAt).toBeNull();
      expect(json.pomodorosCompleted).toBe(1);
    });

    it('should serialize completed task with completedAt', () => {
      const task = new Task('Test Task');
      task.complete();

      const json = task.toJSON();
      expect(json.completed).toBe(true);
      expect(json.completedAt).toBeDefined();
      expect(json.completedAt).not.toBeNull();
    });

    it('should deserialize from JSON', () => {
      const data = {
        id: 'test-id-123',
        title: 'Restored Task',
        difficulty: 'EPIC',
        description: 'Restored Description',
        completed: true,
        createdAt: '2025-01-01T00:00:00.000Z',
        completedAt: '2025-01-02T00:00:00.000Z',
        pomodorosCompleted: 3
      };

      const task = Task.fromJSON(data);

      expect(task.id).toBe('test-id-123');
      expect(task.title).toBe('Restored Task');
      expect(task.difficulty).toBe('EPIC');
      expect(task.description).toBe('Restored Description');
      expect(task.completed).toBe(true);
      expect(task.createdAt).toBe('2025-01-01T00:00:00.000Z');
      expect(task.completedAt).toBe('2025-01-02T00:00:00.000Z');
      expect(task.pomodorosCompleted).toBe(3);
    });

    it('should handle missing pomodorosCompleted in deserialization', () => {
      const data = {
        id: 'test-id',
        title: 'Task',
        difficulty: 'EASY',
        description: '',
        completed: false,
        createdAt: '2025-01-01T00:00:00.000Z',
        completedAt: null
      };

      const task = Task.fromJSON(data);
      expect(task.pomodorosCompleted).toBe(0);
    });

    it('should round-trip serialize and deserialize', () => {
      const original = new Task('Original Task', 'HARD', 'Original Description');
      original.addPomodoro();
      original.addPomodoro();
      original.complete();

      const json = original.toJSON();
      const restored = Task.fromJSON(json);

      expect(restored.id).toBe(original.id);
      expect(restored.title).toBe(original.title);
      expect(restored.difficulty).toBe(original.difficulty);
      expect(restored.description).toBe(original.description);
      expect(restored.completed).toBe(original.completed);
      expect(restored.createdAt).toBe(original.createdAt);
      expect(restored.completedAt).toBe(original.completedAt);
      expect(restored.pomodorosCompleted).toBe(original.pomodorosCompleted);
    });

    it('should preserve all data through serialization', () => {
      const original = new Task('Task', 'MEDIUM');
      const json = original.toJSON();
      const restored = Task.fromJSON(json);

      // Should be able to get XP reward after restoration
      expect(restored.getXpReward()).toBe(50);
      // Should be able to get difficulty info after restoration
      expect(restored.getDifficultyInfo().name).toBe('Medium');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty title', () => {
      const task = new Task('');
      expect(task.title).toBe('');
    });

    it('should handle very long titles', () => {
      const longTitle = 'A'.repeat(1000);
      const task = new Task(longTitle);
      expect(task.title).toBe(longTitle);
    });

    it('should handle special characters in title', () => {
      const task = new Task('Task with émojis 🎉 and spëcial çharacters!');
      expect(task.title).toContain('🎉');
      expect(task.title).toContain('ë');
    });

    it('should handle empty description', () => {
      const task = new Task('Task', 'EASY', '');
      expect(task.description).toBe('');
    });

    it('should handle very long descriptions', () => {
      const longDesc = 'B'.repeat(5000);
      const task = new Task('Task', 'EASY', longDesc);
      expect(task.description).toBe(longDesc);
    });

    it('should maintain separate task instances', () => {
      const task1 = new Task('Task 1', 'EASY');
      const task2 = new Task('Task 2', 'HARD');

      task1.complete();
      task1.addPomodoro();

      expect(task2.completed).toBe(false);
      expect(task2.pomodorosCompleted).toBe(0);
    });
  });
});
