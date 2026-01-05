# ⚔️ Terminal Task Battle

A gamified Pomodoro/task manager where completing tasks levels up your character! Turn your productivity into an epic RPG adventure.

## 🎮 Features

- **📋 Task Management**: Create, complete, and delete tasks with different difficulty levels
- **⚔️ Character Leveling**: Gain XP and level up by completing tasks
- **🍅 Pomodoro Timer**: Beautiful ASCII timer with progress visualization
- **📊 RPG Stats**: Track Productivity, Focus, and Stamina stats
- **🏆 Achievements**: Unlock achievements as you progress
- **🌟 Daily Quests**: Complete daily challenges for bonus rewards
- **💾 Auto-Save**: Your progress is automatically saved
- **🎨 Beautiful UI**: Colorful terminal interface with boxes and gradients

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ClaudeTest

# Install dependencies
npm install

# Start the game
npm start
```

### Development Mode

```bash
# Run with auto-reload
npm run dev
```

## 🎯 How to Play

### First Time Setup

1. Run `npm start`
2. Choose "Start New Game"
3. Enter your character name
4. You're ready to battle tasks!

### Adding Tasks

Tasks come in four difficulty levels:

- **⚔️ Easy** (25 XP) - Quick tasks, small victories
- **⚔️⚔️ Medium** (50 XP) - Standard tasks, decent rewards
- **⚔️⚔️⚔️ Hard** (100 XP) - Challenging tasks, great XP
- **⚔️⚔️⚔️⚔️ Epic** (200 XP) - Major tasks, legendary rewards

### Completing Tasks

1. Select "✓ Complete Task" from the main menu
2. Choose which task you've finished
3. Gain XP and watch your character level up!
4. Unlock achievements along the way

### Pomodoro Timer

1. Select "🍅 Start Pomodoro"
2. Choose a task to work on
3. Select duration (15/25/45/60 minutes)
4. Watch the beautiful ASCII timer count down
5. Task automatically tracks completed pomodoros

### Character Progression

- **Level Up**: Gain XP to level up and increase your stats
- **Stats**:
  - 💪 **Productivity**: Increased by completing tasks
  - 🎯 **Focus**: Boosted by pomodoro sessions
  - ⚡ **Stamina**: Enhanced by consistent work

### Achievements

Unlock achievements by reaching milestones:

- 🏆 **First Victory** - Complete your first task
- 🏆 **Novice Warrior** - Reach level 5
- 🏆 **Skilled Fighter** - Reach level 10
- 🏆 **Task Slayer** - Complete 10 tasks
- 🏆 **Productivity Master** - Complete 50 tasks
- 🏆 **Focus Champion** - Complete 25 pomodoros

### Daily Quests

Each day brings a new quest:

- Complete 3 tasks
- Finish 5 pomodoros
- Complete 1 Epic task
- Complete 2 Hard tasks

## 📁 Project Structure

```
ClaudeTest/
├── src/
│   ├── models/
│   │   ├── Character.js      # Character stats and leveling
│   │   ├── Task.js           # Task model with difficulty
│   │   └── GameState.js      # Game state management
│   ├── utils/
│   │   └── pomodoro.js       # Pomodoro timer logic
│   ├── ui/
│   │   ├── display.js        # Display functions
│   │   └── menu.js           # Interactive menus
│   └── index.js              # Main application
├── package.json
├── README.md
└── CLAUDE.md                 # AI assistant guide
```

## 🎨 Tech Stack

- **Node.js** - Runtime environment
- **chalk** - Terminal colors
- **inquirer** - Interactive prompts
- **boxen** - Beautiful boxes
- **figlet** - ASCII art text
- **gradient-string** - Rainbow gradients
- **cli-progress** - Progress bars

## 🎮 Game Loop

1. **Plan** - Add tasks with appropriate difficulty
2. **Work** - Use Pomodoro timer to focus
3. **Complete** - Mark tasks as done
4. **Level Up** - Gain XP and increase stats
5. **Achieve** - Unlock achievements
6. **Repeat** - Keep building your character!

## 💡 Tips & Strategies

- **Break down large tasks** into smaller Epic/Hard tasks
- **Use Pomodoro** to stay focused and track work time
- **Check Daily Quests** each session for bonus motivation
- **Balance difficulties** - mix Easy wins with Hard challenges
- **Review stats** to see your productivity patterns

## 🔧 Configuration

Game saves are stored in `game-save.json` in the project root. This file is automatically created and managed by the game.

To reset your game:
- Delete `game-save.json` manually, or
- Choose "Delete Save & Start Fresh" from the welcome menu

## 🐛 Troubleshooting

### Colors not showing?

Make sure your terminal supports 256 colors. Most modern terminals do.

### Timer not displaying correctly?

Try resizing your terminal window to at least 80 characters wide.

### Save file issues?

Delete `game-save.json` and restart the game for a fresh start.

## 🤝 Contributing

This is a test project for Claude Code! Feel free to:

- Add new achievement types
- Create new daily quest variations
- Enhance the UI with more animations
- Add sound effects (with libraries like node-speaker)
- Implement multiplayer leaderboards
- Add task categories/tags

## 📝 License

MIT

## 🎯 Testing Claude Code

This project tests several Claude Code capabilities:

- ✅ Multi-file project structure
- ✅ Object-oriented design
- ✅ State management and persistence
- ✅ Interactive CLI development
- ✅ Async/await patterns
- ✅ Timer and interval handling
- ✅ Error handling
- ✅ File I/O operations
- ✅ Package management
- ✅ Beautiful terminal UI

## 🚀 Future Ideas

- [ ] Statistics graphs and charts
- [ ] Export task history to CSV
- [ ] Integration with calendar apps
- [ ] Mobile companion app
- [ ] Team/multiplayer mode
- [ ] Custom themes
- [ ] Task templates
- [ ] Recurring tasks

---

**Happy Task Battling! ⚔️**

Level up your productivity one task at a time!
