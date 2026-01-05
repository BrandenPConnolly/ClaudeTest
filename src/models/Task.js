export class Task {
  static DIFFICULTY = {
    EASY: { name: 'Easy', xp: 25, color: 'green', icon: '⚔️' },
    MEDIUM: { name: 'Medium', xp: 50, color: 'yellow', icon: '⚔️⚔️' },
    HARD: { name: 'Hard', xp: 100, color: 'red', icon: '⚔️⚔️⚔️' },
    EPIC: { name: 'Epic', xp: 200, color: 'magenta', icon: '⚔️⚔️⚔️⚔️' }
  };

  constructor(title, difficulty = 'MEDIUM', description = '') {
    this.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    this.title = title;
    this.difficulty = difficulty;
    this.description = description;
    this.completed = false;
    this.createdAt = new Date().toISOString();
    this.completedAt = null;
    this.pomodorosCompleted = 0;
  }

  // Get XP reward for this task
  getXpReward() {
    return Task.DIFFICULTY[this.difficulty].xp;
  }

  // Get difficulty info
  getDifficultyInfo() {
    return Task.DIFFICULTY[this.difficulty];
  }

  // Complete the task
  complete() {
    if (!this.completed) {
      this.completed = true;
      this.completedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  // Add a completed pomodoro
  addPomodoro() {
    this.pomodorosCompleted++;
  }

  // Get task summary
  getSummary() {
    const diffInfo = this.getDifficultyInfo();
    return {
      id: this.id,
      title: this.title,
      difficulty: diffInfo.name,
      xpReward: this.getXpReward(),
      completed: this.completed,
      pomodorosCompleted: this.pomodorosCompleted
    };
  }

  // Serialize for saving
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      difficulty: this.difficulty,
      description: this.description,
      completed: this.completed,
      createdAt: this.createdAt,
      completedAt: this.completedAt,
      pomodorosCompleted: this.pomodorosCompleted
    };
  }

  // Deserialize from saved data
  static fromJSON(data) {
    const task = new Task(data.title, data.difficulty, data.description);
    task.id = data.id;
    task.completed = data.completed;
    task.createdAt = data.createdAt;
    task.completedAt = data.completedAt;
    task.pomodorosCompleted = data.pomodorosCompleted || 0;
    return task;
  }
}
