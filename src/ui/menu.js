import inquirer from 'inquirer';
import chalk from 'chalk';
import { Task } from '../models/Task.js';

// Main menu
export async function showMainMenu() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: chalk.cyan.bold('What would you like to do?'),
      choices: [
        { name: '📋 View Tasks', value: 'view_tasks' },
        { name: '➕ Add New Task', value: 'add_task' },
        { name: '✓ Complete Task', value: 'complete_task' },
        { name: '🍅 Start Pomodoro', value: 'start_pomodoro' },
        { name: '🗑️  Delete Task', value: 'delete_task' },
        { name: '👤 View Character', value: 'view_character' },
        { name: '📊 View Statistics', value: 'view_stats' },
        { name: '🌟 View Daily Quest', value: 'view_quest' },
        new inquirer.Separator(),
        { name: '💾 Save & Exit', value: 'exit' }
      ]
    }
  ]);

  return action;
}

// Add new task menu
export async function addTaskMenu() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Task title:',
      validate: (input) => input.trim().length > 0 || 'Task title cannot be empty'
    },
    {
      type: 'list',
      name: 'difficulty',
      message: 'Difficulty:',
      choices: [
        { name: `${chalk.green('⚔️  Easy')} (25 XP)`, value: 'EASY' },
        { name: `${chalk.yellow('⚔️⚔️  Medium')} (50 XP)`, value: 'MEDIUM' },
        { name: `${chalk.red('⚔️⚔️⚔️  Hard')} (100 XP)`, value: 'HARD' },
        { name: `${chalk.magenta('⚔️⚔️⚔️⚔️  Epic')} (200 XP)`, value: 'EPIC' }
      ]
    },
    {
      type: 'input',
      name: 'description',
      message: 'Description (optional):',
      default: ''
    }
  ]);

  return answers;
}

// Select task from list
export async function selectTaskMenu(tasks, message = 'Select a task:') {
  if (tasks.length === 0) {
    return null;
  }

  const choices = tasks.map((task, index) => {
    const diffInfo = task.getDifficultyInfo();
    const pomodoros = task.pomodorosCompleted > 0 ? ` 🍅${task.pomodorosCompleted}` : '';
    return {
      name: `${index + 1}. ${task.title} ${chalk[diffInfo.color](diffInfo.icon)} ${chalk.gray(`${diffInfo.xp}xp`)}${pomodoros}`,
      value: task.id
    };
  });

  choices.push(new inquirer.Separator());
  choices.push({ name: '← Back', value: null });

  const { taskId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'taskId',
      message: chalk.cyan(message),
      choices,
      pageSize: 10
    }
  ]);

  return taskId;
}

// Confirm action
export async function confirmMenu(message) {
  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message,
      default: false
    }
  ]);

  return confirmed;
}

// Select pomodoro duration
export async function selectPomodoroDuration() {
  const { duration } = await inquirer.prompt([
    {
      type: 'list',
      name: 'duration',
      message: chalk.cyan('Select Pomodoro duration:'),
      choices: [
        { name: '15 minutes (Quick)', value: 15 },
        { name: '25 minutes (Standard)', value: 25 },
        { name: '45 minutes (Deep Work)', value: 45 },
        { name: '60 minutes (Marathon)', value: 60 }
      ]
    }
  ]);

  return duration;
}

// Character creation
export async function createCharacterMenu() {
  const { name } = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: chalk.cyan.bold('Enter your character name:'),
      default: 'Hero',
      validate: (input) => input.trim().length > 0 || 'Name cannot be empty'
    }
  ]);

  return name;
}

// Welcome menu (new game or load)
export async function welcomeMenu(hasSave) {
  const choices = [];

  if (hasSave) {
    choices.push({ name: '📂 Load Saved Game', value: 'load' });
  }

  choices.push({ name: '✨ Start New Game', value: 'new' });

  if (hasSave) {
    choices.push(new inquirer.Separator());
    choices.push({ name: '⚠️  Delete Save & Start Fresh', value: 'delete' });
  }

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: chalk.cyan.bold('Welcome to Task Battle!'),
      choices
    }
  ]);

  return action;
}
