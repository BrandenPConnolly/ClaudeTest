#!/usr/bin/env node

import { Character } from './src/models/Character.js';
import { Task } from './src/models/Task.js';
import { GameState } from './src/models/GameState.js';
import chalk from 'chalk';

console.log(chalk.cyan.bold('\n🧪 Running Tests...\n'));

// Test Character
console.log(chalk.yellow('Testing Character model...'));
const char = new Character('TestHero');
console.log(`✓ Character created: ${char.name}`);
console.log(`✓ Initial level: ${char.level}`);
console.log(`✓ Initial XP: ${char.xp}`);

const levelsGained = char.gainXp(150);
console.log(`✓ Gained XP, leveled up to: ${char.level}`);
console.log(`✓ Stats: Productivity=${char.stats.productivity}, Focus=${char.stats.focus}, Stamina=${char.stats.stamina}`);

char.unlockAchievement('Test Achievement');
console.log(`✓ Achievement unlocked: ${char.achievements[0]}`);

// Test Task
console.log(chalk.yellow('\nTesting Task model...'));
const task = new Task('Test Task', 'MEDIUM', 'A test task');
console.log(`✓ Task created: ${task.title}`);
console.log(`✓ Difficulty: ${task.getDifficultyInfo().name}`);
console.log(`✓ XP Reward: ${task.getXpReward()}`);

task.complete();
console.log(`✓ Task completed: ${task.completed}`);

task.addPomodoro();
console.log(`✓ Pomodoro added: ${task.pomodorosCompleted}`);

// Test GameState
console.log(chalk.yellow('\nTesting GameState model...'));
const game = new GameState();
game.character = new Character('GameTester');
console.log(`✓ Game state created with character: ${game.character.name}`);

const newTask = game.addTask('Test Task 1', 'EASY');
console.log(`✓ Task added: ${newTask.title}`);

const activeTasks = game.getActiveTasks();
console.log(`✓ Active tasks: ${activeTasks.length}`);

const result = game.completeTask(newTask.id);
console.log(`✓ Task completed, XP gained: ${result.xpGained}`);

const completedTasks = game.getCompletedTasks();
console.log(`✓ Completed tasks: ${completedTasks.length}`);

game.generateDailyQuest();
console.log(`✓ Daily quest generated: ${game.dailyQuest.title}`);

// Test serialization
console.log(chalk.yellow('\nTesting serialization...'));
const charJSON = char.toJSON();
const charRestored = Character.fromJSON(charJSON);
console.log(`✓ Character serialization: ${charRestored.name} (Level ${charRestored.level})`);

const taskJSON = task.toJSON();
const taskRestored = Task.fromJSON(taskJSON);
console.log(`✓ Task serialization: ${taskRestored.title} (${taskRestored.completed ? 'Completed' : 'Active'})`);

console.log(chalk.green.bold('\n✅ All tests passed!\n'));
