#!/usr/bin/env node

import { GameState } from './models/GameState.js';
import { Character } from './models/Character.js';
import { runPomodoro } from './utils/pomodoro.js';
import {
  displayBanner,
  displayCharacter,
  displayTasks,
  displayStats,
  displayDailyQuest,
  displayLevelUp,
  displayAchievement,
  displayTaskComplete,
  pause
} from './ui/display.js';
import {
  showMainMenu,
  addTaskMenu,
  selectTaskMenu,
  confirmMenu,
  selectPomodoroDuration,
  createCharacterMenu,
  welcomeMenu
} from './ui/menu.js';
import chalk from 'chalk';
import fs from 'fs/promises';

class Game {
  constructor() {
    this.gameState = new GameState();
    this.running = true;
  }

  async initialize() {
    displayBanner();

    const hasSave = await this.gameState.hasSaveFile();
    const welcomeAction = await welcomeMenu(hasSave);

    if (welcomeAction === 'load') {
      await this.gameState.load();
      console.log(chalk.green('\n✓ Game loaded successfully!\n'));
    } else if (welcomeAction === 'delete') {
      const confirmed = await confirmMenu('Are you sure? This will delete your saved game.');
      if (confirmed) {
        try {
          await fs.unlink(this.gameState.saveFilePath);
          console.log(chalk.yellow('\n✓ Save file deleted.\n'));
        } catch (error) {
          // File might not exist, that's okay
        }
        await this.createNewGame();
      } else {
        await this.gameState.load();
      }
    } else {
      await this.createNewGame();
    }

    // Generate daily quest
    this.gameState.generateDailyQuest();
  }

  async createNewGame() {
    const characterName = await createCharacterMenu();
    this.gameState.character = new Character(characterName);

    console.log(chalk.green(`\n✓ Welcome, ${characterName}! Your adventure begins!\n`));

    // Add a starter task
    this.gameState.addTask('Complete your first task', 'EASY', 'Get started with Task Battle!');
  }

  async run() {
    await this.initialize();

    while (this.running) {
      try {
        const action = await showMainMenu();
        await this.handleAction(action);
      } catch (error) {
        if (error.isTtyError || error.name === 'ExitPromptError') {
          // User cancelled or TTY error
          await this.exitGame();
        } else {
          console.error(chalk.red('An error occurred:'), error.message);
          await pause();
        }
      }
    }
  }

  async handleAction(action) {
    console.clear();

    switch (action) {
      case 'view_tasks':
        await this.viewTasks();
        break;

      case 'add_task':
        await this.addTask();
        break;

      case 'complete_task':
        await this.completeTask();
        break;

      case 'start_pomodoro':
        await this.startPomodoro();
        break;

      case 'delete_task':
        await this.deleteTask();
        break;

      case 'view_character':
        await this.viewCharacter();
        break;

      case 'view_stats':
        await this.viewStats();
        break;

      case 'view_quest':
        await this.viewQuest();
        break;

      case 'exit':
        await this.exitGame();
        break;
    }
  }

  async viewTasks() {
    const activeTasks = this.gameState.getActiveTasks();
    displayTasks(activeTasks, 'Active Tasks');

    const completedTasks = this.gameState.getCompletedTasks();
    if (completedTasks.length > 0) {
      console.log('\n');
      displayTasks(completedTasks.slice(-5), 'Recently Completed');
    }

    await pause();
  }

  async addTask() {
    const taskData = await addTaskMenu();
    const task = this.gameState.addTask(taskData.title, taskData.difficulty, taskData.description);

    console.log(chalk.green(`\n✓ Task added: ${task.title}\n`));
    await this.gameState.save();
    await pause();
  }

  async completeTask() {
    const activeTasks = this.gameState.getActiveTasks();

    if (activeTasks.length === 0) {
      console.log(chalk.yellow('No active tasks to complete.\n'));
      await pause();
      return;
    }

    const taskId = await selectTaskMenu(activeTasks, 'Select task to complete:');

    if (taskId) {
      const result = this.gameState.completeTask(taskId);

      if (result) {
        console.clear();
        displayTaskComplete(result.task, result.xpGained, result.levelsGained);

        // Check for level ups
        if (result.levelsGained.length > 0) {
          await pause();
          for (const level of result.levelsGained) {
            displayLevelUp(level, this.gameState.character);
            await pause();
          }
        }

        // Check for achievements
        const newAchievements = this.gameState.checkAchievements();
        if (newAchievements.length > 0) {
          for (const achievement of newAchievements) {
            displayAchievement(achievement);
            await pause();
          }
        }

        await this.gameState.save();
        await pause();
      }
    }
  }

  async startPomodoro() {
    const activeTasks = this.gameState.getActiveTasks();

    if (activeTasks.length === 0) {
      console.log(chalk.yellow('Add some tasks first before starting a Pomodoro!\n'));
      await pause();
      return;
    }

    const taskId = await selectTaskMenu(activeTasks, 'Select task to work on:');

    if (taskId) {
      const duration = await selectPomodoroDuration();

      console.log(chalk.cyan('\n🍅 Starting Pomodoro timer...\n'));
      await pause('Press Enter to start');

      const completed = await runPomodoro(duration);

      if (completed) {
        this.gameState.addPomodoroToTask(taskId);
        console.log(chalk.green('✓ Pomodoro added to task!\n'));
        await this.gameState.save();
      }

      await pause();
    }
  }

  async deleteTask() {
    const allTasks = this.gameState.tasks;

    if (allTasks.length === 0) {
      console.log(chalk.yellow('No tasks to delete.\n'));
      await pause();
      return;
    }

    const taskId = await selectTaskMenu(allTasks, 'Select task to delete:');

    if (taskId) {
      const confirmed = await confirmMenu('Are you sure you want to delete this task?');

      if (confirmed) {
        this.gameState.deleteTask(taskId);
        console.log(chalk.green('\n✓ Task deleted.\n'));
        await this.gameState.save();
      }

      await pause();
    }
  }

  async viewCharacter() {
    displayCharacter(this.gameState.character);
    await pause();
  }

  async viewStats() {
    displayStats(this.gameState);
    displayDailyQuest(this.gameState.dailyQuest);
    await pause();
  }

  async viewQuest() {
    displayDailyQuest(this.gameState.dailyQuest);
    await pause();
  }

  async exitGame() {
    console.clear();
    console.log(chalk.cyan('\n💾 Saving game...\n'));
    await this.gameState.save();
    console.log(chalk.green('✓ Game saved successfully!\n'));
    console.log(chalk.yellow('Thanks for playing Task Battle! Keep leveling up! ⚔️\n'));
    this.running = false;
    process.exit(0);
  }
}

// Error handler
process.on('unhandledRejection', (error) => {
  console.error(chalk.red('\nUnexpected error:'), error);
  process.exit(1);
});

// Start the game
const game = new Game();
game.run().catch((error) => {
  console.error(chalk.red('Fatal error:'), error);
  process.exit(1);
});
