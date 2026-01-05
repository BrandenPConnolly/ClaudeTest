import { Character } from './Character.js';
import { Task } from './Task.js';
import fs from 'fs/promises';
import path from 'path';

export class GameState {
  constructor() {
    this.character = new Character();
    this.tasks = [];
    this.completedTasks = [];
    this.dailyQuest = null;
    this.lastPlayedDate = new Date().toISOString().split('T')[0];
    this.totalTasksCompleted = 0;
    this.totalPomodorosCompleted = 0;
    this.saveFilePath = 'game-save.json';
  }

  // Add a new task
  addTask(title, difficulty, description = '') {
    const task = new Task(title, difficulty, description);
    this.tasks.push(task);
    return task;
  }

  // Get active (incomplete) tasks
  getActiveTasks() {
    return this.tasks.filter(task => !task.completed);
  }

  // Get completed tasks
  getCompletedTasks() {
    return this.tasks.filter(task => task.completed);
  }

  // Complete a task
  completeTask(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task && task.complete()) {
      const xpGained = task.getXpReward();
      const levelsGained = this.character.gainXp(xpGained);
      this.totalTasksCompleted++;

      // Check for achievements
      this.checkAchievements();

      return {
        task,
        xpGained,
        levelsGained
      };
    }
    return null;
  }

  // Delete a task
  deleteTask(taskId) {
    const index = this.tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      return true;
    }
    return false;
  }

  // Add pomodoro to a task
  addPomodoroToTask(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.addPomodoro();
      this.totalPomodorosCompleted++;
      return true;
    }
    return false;
  }

  // Generate daily quest
  generateDailyQuest() {
    const today = new Date().toISOString().split('T')[0];
    if (this.lastPlayedDate !== today || !this.dailyQuest) {
      this.lastPlayedDate = today;

      const quests = [
        { title: 'Complete 3 tasks today', target: 3, type: 'tasks' },
        { title: 'Complete 5 pomodoros', target: 5, type: 'pomodoros' },
        { title: 'Complete 1 Epic task', target: 1, type: 'epic' },
        { title: 'Complete 2 Hard tasks', target: 2, type: 'hard' }
      ];

      this.dailyQuest = quests[Math.floor(Math.random() * quests.length)];
      this.dailyQuest.progress = 0;
      this.dailyQuest.completed = false;
    }
  }

  // Check and unlock achievements
  checkAchievements() {
    const achievements = [];

    // First task
    if (this.totalTasksCompleted === 1) {
      if (this.character.unlockAchievement('First Victory')) {
        achievements.push('First Victory');
      }
    }

    // Level milestones
    if (this.character.level === 5) {
      if (this.character.unlockAchievement('Novice Warrior')) {
        achievements.push('Novice Warrior');
      }
    }
    if (this.character.level === 10) {
      if (this.character.unlockAchievement('Skilled Fighter')) {
        achievements.push('Skilled Fighter');
      }
    }

    // Task milestones
    if (this.totalTasksCompleted === 10) {
      if (this.character.unlockAchievement('Task Slayer')) {
        achievements.push('Task Slayer');
      }
    }
    if (this.totalTasksCompleted === 50) {
      if (this.character.unlockAchievement('Productivity Master')) {
        achievements.push('Productivity Master');
      }
    }

    // Pomodoro milestones
    if (this.totalPomodorosCompleted === 25) {
      if (this.character.unlockAchievement('Focus Champion')) {
        achievements.push('Focus Champion');
      }
    }

    return achievements;
  }

  // Save game state to file
  async save() {
    const data = {
      character: this.character.toJSON(),
      tasks: this.tasks.map(t => t.toJSON()),
      dailyQuest: this.dailyQuest,
      lastPlayedDate: this.lastPlayedDate,
      totalTasksCompleted: this.totalTasksCompleted,
      totalPomodorosCompleted: this.totalPomodorosCompleted,
      savedAt: new Date().toISOString()
    };

    await fs.writeFile(this.saveFilePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  // Load game state from file
  async load() {
    try {
      const data = await fs.readFile(this.saveFilePath, 'utf-8');
      const parsed = JSON.parse(data);

      this.character = Character.fromJSON(parsed.character);
      this.tasks = parsed.tasks.map(t => Task.fromJSON(t));
      this.dailyQuest = parsed.dailyQuest;
      this.lastPlayedDate = parsed.lastPlayedDate;
      this.totalTasksCompleted = parsed.totalTasksCompleted || 0;
      this.totalPomodorosCompleted = parsed.totalPomodorosCompleted || 0;

      return true;
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error('Error loading save file:', error.message);
      }
      return false;
    }
  }

  // Check if save file exists
  async hasSaveFile() {
    try {
      await fs.access(this.saveFilePath);
      return true;
    } catch {
      return false;
    }
  }

  // Get game statistics
  getStats() {
    return {
      character: this.character.getSummary(),
      activeTasks: this.getActiveTasks().length,
      completedTasks: this.getCompletedTasks().length,
      totalTasksCompleted: this.totalTasksCompleted,
      totalPomodorosCompleted: this.totalPomodorosCompleted,
      dailyQuest: this.dailyQuest
    };
  }
}
