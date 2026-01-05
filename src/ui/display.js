import chalk from 'chalk';
import boxen from 'boxen';
import figlet from 'figlet';
import gradient from 'gradient-string';
import { Task } from '../models/Task.js';

// Display welcome banner
export function displayBanner() {
  console.clear();
  const title = figlet.textSync('Task Battle', {
    font: 'Standard',
    horizontalLayout: 'default'
  });

  console.log(gradient.pastel.multiline(title));
  console.log(chalk.cyan.bold('  ⚔️  Level up by completing tasks! ⚔️\n'));
}

// Display character status
export function displayCharacter(character) {
  const summary = character.getSummary();
  const xpProgress = `${summary.xp}/${summary.xpNeeded}`;
  const xpBar = createBar(summary.xp, summary.xpNeeded, 20, '▓', '░');

  const content = `
${chalk.bold.yellow('👤 ' + summary.name)}

${chalk.cyan('Level:')} ${chalk.bold.white(summary.level)}
${chalk.magenta('XP:')} ${chalk.white(xpProgress)} ${xpBar}

${chalk.bold.green('⚔️  Stats:')}
  💪 Productivity: ${chalk.yellow(summary.stats.productivity)}
  🎯 Focus:        ${chalk.yellow(summary.stats.focus)}
  ⚡ Stamina:      ${chalk.yellow(summary.stats.stamina)}

${chalk.bold.cyan('🏆 Achievements:')} ${summary.achievements.length}
${summary.achievements.slice(0, 3).map(a => `  ✨ ${a}`).join('\n')}
${summary.achievements.length > 3 ? chalk.gray(`  ... and ${summary.achievements.length - 3} more`) : ''}
`;

  console.log(boxen(content, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'cyan',
    title: '⚔️  Character Status',
    titleAlignment: 'center'
  }));
}

// Display task list
export function displayTasks(tasks, title = 'Tasks') {
  if (tasks.length === 0) {
    console.log(boxen(chalk.gray('No tasks found. Add some tasks to get started!'), {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'gray'
    }));
    return;
  }

  const taskLines = tasks.map((task, index) => {
    const diffInfo = task.getDifficultyInfo();
    const diffColor = diffInfo.color;
    const status = task.completed ? chalk.green('✓') : chalk.yellow('○');
    const pomodoros = task.pomodorosCompleted > 0 ? chalk.gray(` (🍅 ${task.pomodorosCompleted})`) : '';

    return `${status} ${index + 1}. ${chalk.bold(task.title)} ${chalk[diffColor](diffInfo.icon)} ${chalk[diffColor](`${diffInfo.xp}xp`)}${pomodoros}`;
  }).join('\n');

  console.log(boxen(taskLines, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'yellow',
    title: `📋 ${title}`,
    titleAlignment: 'center'
  }));
}

// Display daily quest
export function displayDailyQuest(quest) {
  if (!quest) {
    console.log(chalk.gray('  No daily quest available.\n'));
    return;
  }

  const progress = `${quest.progress}/${quest.target}`;
  const progressBar = createBar(quest.progress, quest.target, 15, '█', '░');
  const status = quest.completed ? chalk.green('COMPLETE ✓') : chalk.yellow('IN PROGRESS');

  const content = `
${chalk.bold.cyan(quest.title)}

${chalk.white('Progress:')} ${progress} ${progressBar}
${chalk.white('Status:')} ${status}
${quest.completed ? chalk.green('\n🎁 Bonus XP Earned!') : ''}
`;

  console.log(boxen(content, {
    padding: 1,
    margin: 1,
    borderStyle: 'double',
    borderColor: 'magenta',
    title: '🌟 Daily Quest',
    titleAlignment: 'center'
  }));
}

// Display game stats
export function displayStats(gameState) {
  const stats = gameState.getStats();

  const content = `
${chalk.cyan('Active Tasks:')} ${chalk.white(stats.activeTasks)}
${chalk.green('Completed Tasks:')} ${chalk.white(stats.completedTasks)}
${chalk.yellow('Total Tasks Completed:')} ${chalk.white(stats.totalTasksCompleted)}
${chalk.magenta('Total Pomodoros:')} ${chalk.white(stats.totalPomodorosCompleted)}
`;

  console.log(boxen(content, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'green',
    title: '📊 Statistics',
    titleAlignment: 'center'
  }));
}

// Create a progress bar
function createBar(current, max, length, fillChar = '█', emptyChar = '░') {
  const filled = Math.floor((current / max) * length);
  const empty = length - filled;
  return chalk.green(fillChar.repeat(filled)) + chalk.gray(emptyChar.repeat(empty));
}

// Display level up notification
export function displayLevelUp(newLevel, character) {
  console.clear();

  const message = figlet.textSync('LEVEL UP!', {
    font: 'Banner',
    horizontalLayout: 'default'
  });

  console.log('\n');
  console.log(gradient.rainbow.multiline(message));
  console.log('\n');

  const content = `
${chalk.bold.yellow(`Congratulations! You reached Level ${newLevel}!`)}

${chalk.cyan('New Stats:')}
  💪 Productivity: ${chalk.yellow(character.stats.productivity)}
  🎯 Focus:        ${chalk.yellow(character.stats.focus)}
  ⚡ Stamina:      ${chalk.yellow(character.stats.stamina)}
`;

  console.log(boxen(content, {
    padding: 2,
    margin: 1,
    borderStyle: 'double',
    borderColor: 'yellow'
  }));

  console.log(chalk.green.bold('\n  Keep up the great work!\n'));
}

// Display achievement unlock
export function displayAchievement(achievementName) {
  const content = `
${chalk.bold.yellow('🏆 ACHIEVEMENT UNLOCKED! 🏆')}

${chalk.cyan(achievementName)}

${chalk.gray('Keep pushing forward!')}
`;

  console.log(boxen(content, {
    padding: 1,
    margin: 1,
    borderStyle: 'double',
    borderColor: 'yellow'
  }));
}

// Display task completion
export function displayTaskComplete(task, xpGained, levelsGained) {
  const diffInfo = task.getDifficultyInfo();

  let message = `
${chalk.green.bold('✓ Task Complete!')}

${chalk.white(task.title)}

${chalk.yellow(`+${xpGained} XP`)} ${chalk[diffInfo.color](diffInfo.icon)}
`;

  if (levelsGained.length > 0) {
    message += `\n${chalk.bold.cyan('🎉 Level Up!')} ${levelsGained.map(l => `Level ${l}`).join(', ')}`;
  }

  console.log(boxen(message, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'green'
  }));
}

// Pause and wait for user
export function pause(message = 'Press Enter to continue...') {
  return new Promise((resolve) => {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    console.log(chalk.gray(`\n  ${message}`));

    const onData = (key) => {
      if (key === '\r' || key === '\n' || key === ' ') {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdin.removeListener('data', onData);
        resolve();
      }
    };

    process.stdin.on('data', onData);
  });
}
