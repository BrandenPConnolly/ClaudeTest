import chalk from 'chalk';
import cliProgress from 'cli-progress';

export class PomodoroTimer {
  constructor(duration = 25) {
    this.duration = duration * 60; // Convert to seconds
    this.remaining = this.duration;
    this.isRunning = false;
    this.isPaused = false;
    this.interval = null;
    this.progressBar = null;
  }

  // Format time as MM:SS
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // Create ASCII progress visualization
  createProgressBar() {
    const progress = ((this.duration - this.remaining) / this.duration) * 100;
    const barLength = 40;
    const filled = Math.floor((progress / 100) * barLength);
    const empty = barLength - filled;

    const filledBar = '█'.repeat(filled);
    const emptyBar = '░'.repeat(empty);

    return chalk.green(filledBar) + chalk.gray(emptyBar);
  }

  // Get tomato emoji based on time remaining
  getTomatoEmoji() {
    const progress = ((this.duration - this.remaining) / this.duration) * 100;
    if (progress < 25) return '🍅';
    if (progress < 50) return '🍅🍅';
    if (progress < 75) return '🍅🍅🍅';
    return '🍅🍅🍅🍅';
  }

  // Display current timer status
  display() {
    console.clear();
    console.log('\n');
    console.log(chalk.bold.cyan('═'.repeat(50)));
    console.log(chalk.bold.cyan('            🍅 POMODORO TIMER 🍅'));
    console.log(chalk.bold.cyan('═'.repeat(50)));
    console.log('\n');

    const timeStr = this.formatTime(this.remaining);
    const progress = this.createProgressBar();
    const percentage = Math.floor(((this.duration - this.remaining) / this.duration) * 100);

    console.log(`  ${this.getTomatoEmoji()}  Time Remaining: ${chalk.bold.yellow(timeStr)}`);
    console.log('\n');
    console.log(`  ${progress} ${percentage}%`);
    console.log('\n');

    if (this.isPaused) {
      console.log(chalk.yellow.bold('  ⏸  PAUSED'));
    } else if (this.isRunning) {
      console.log(chalk.green.bold('  ▶  RUNNING'));
    }

    console.log('\n');
    console.log(chalk.gray('  Press Ctrl+C to stop the timer'));
    console.log(chalk.bold.cyan('═'.repeat(50)));
  }

  // Start the timer
  start(onComplete) {
    if (this.isRunning) return;

    this.isRunning = true;
    this.isPaused = false;

    return new Promise((resolve) => {
      this.display();

      this.interval = setInterval(() => {
        if (!this.isPaused) {
          this.remaining--;
          this.display();

          if (this.remaining <= 0) {
            this.stop();
            if (onComplete) onComplete();
            resolve(true);
          }
        }
      }, 1000);
    });
  }

  // Pause the timer
  pause() {
    this.isPaused = true;
    this.display();
  }

  // Resume the timer
  resume() {
    this.isPaused = false;
    this.display();
  }

  // Stop the timer
  stop() {
    this.isRunning = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  // Reset the timer
  reset() {
    this.stop();
    this.remaining = this.duration;
    this.isPaused = false;
  }

  // Check if timer completed
  isCompleted() {
    return this.remaining === 0;
  }
}

// Run a pomodoro session
export async function runPomodoro(duration = 25) {
  const timer = new PomodoroTimer(duration);

  // Handle Ctrl+C gracefully
  const cleanup = () => {
    timer.stop();
    console.clear();
  };

  process.on('SIGINT', cleanup);

  try {
    await timer.start(() => {
      console.clear();
      console.log('\n');
      console.log(chalk.bold.green('═'.repeat(50)));
      console.log(chalk.bold.green('          🎉 POMODORO COMPLETE! 🎉'));
      console.log(chalk.bold.green('═'.repeat(50)));
      console.log('\n');
      console.log(chalk.yellow('  Great work! Take a break and stay productive!'));
      console.log('\n');
    });

    return timer.isCompleted();
  } finally {
    process.removeListener('SIGINT', cleanup);
  }
}
