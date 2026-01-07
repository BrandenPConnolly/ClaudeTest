import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PomodoroTimer } from '../../src/utils/pomodoro.js';

describe('PomodoroTimer', () => {
  describe('Constructor', () => {
    it('should create timer with default 25 minute duration', () => {
      const timer = new PomodoroTimer();
      expect(timer.duration).toBe(25 * 60); // 1500 seconds
      expect(timer.remaining).toBe(25 * 60);
    });

    it('should create timer with custom duration', () => {
      const timer = new PomodoroTimer(45);
      expect(timer.duration).toBe(45 * 60); // 2700 seconds
      expect(timer.remaining).toBe(45 * 60);
    });

    it('should initialize with stopped state', () => {
      const timer = new PomodoroTimer();
      expect(timer.isRunning).toBe(false);
      expect(timer.isPaused).toBe(false);
      expect(timer.interval).toBeNull();
    });

    it('should handle edge case durations', () => {
      const timer1 = new PomodoroTimer(1);
      expect(timer1.duration).toBe(60);

      const timer2 = new PomodoroTimer(60);
      expect(timer2.duration).toBe(3600);
    });
  });

  describe('formatTime', () => {
    it('should format time as MM:SS', () => {
      const timer = new PomodoroTimer();
      expect(timer.formatTime(0)).toBe('00:00');
      expect(timer.formatTime(59)).toBe('00:59');
      expect(timer.formatTime(60)).toBe('01:00');
      expect(timer.formatTime(125)).toBe('02:05');
      expect(timer.formatTime(3599)).toBe('59:59');
    });

    it('should pad single digits with zeros', () => {
      const timer = new PomodoroTimer();
      expect(timer.formatTime(5)).toBe('00:05');
      expect(timer.formatTime(65)).toBe('01:05');
    });

    it('should handle large durations', () => {
      const timer = new PomodoroTimer();
      expect(timer.formatTime(3600)).toBe('60:00');
      expect(timer.formatTime(7200)).toBe('120:00');
    });
  });

  describe('createProgressBar', () => {
    it('should create empty progress bar at start', () => {
      const timer = new PomodoroTimer(25);
      timer.remaining = timer.duration; // 100% remaining
      const bar = timer.createProgressBar();

      expect(bar).toContain('░');
      expect(bar).not.toContain('█');
    });

    it('should create full progress bar at end', () => {
      const timer = new PomodoroTimer(25);
      timer.remaining = 0; // 0% remaining = 100% complete
      const bar = timer.createProgressBar();

      expect(bar).toContain('█');
      expect(bar).not.toContain('░');
    });

    it('should create partial progress bar', () => {
      const timer = new PomodoroTimer(25);
      timer.remaining = timer.duration / 2; // 50% remaining = 50% complete
      const bar = timer.createProgressBar();

      expect(bar).toContain('█');
      expect(bar).toContain('░');
    });

    it('should have consistent length', () => {
      const timer = new PomodoroTimer(25);

      timer.remaining = timer.duration;
      const bar1 = timer.createProgressBar();

      timer.remaining = timer.duration / 2;
      const bar2 = timer.createProgressBar();

      timer.remaining = 0;
      const bar3 = timer.createProgressBar();

      // Remove ANSI color codes to check actual bar length
      const stripAnsi = (str) => str.replace(/\u001b\[\d+m/g, '');
      const len1 = stripAnsi(bar1).length;
      const len2 = stripAnsi(bar2).length;
      const len3 = stripAnsi(bar3).length;

      expect(len1).toBe(len2);
      expect(len2).toBe(len3);
      expect(len1).toBe(40); // Default bar length
    });
  });

  describe('getTomatoEmoji', () => {
    it('should return one tomato at start (0-25%)', () => {
      const timer = new PomodoroTimer(100); // 100 minutes for easy calculation
      timer.remaining = 100 * 60; // 0% progress
      expect(timer.getTomatoEmoji()).toBe('🍅');

      timer.remaining = 76 * 60; // 24% progress
      expect(timer.getTomatoEmoji()).toBe('🍅');
    });

    it('should return two tomatoes at 25-50%', () => {
      const timer = new PomodoroTimer(100);
      timer.remaining = 75 * 60; // 25% progress
      expect(timer.getTomatoEmoji()).toBe('🍅🍅');

      timer.remaining = 51 * 60; // 49% progress
      expect(timer.getTomatoEmoji()).toBe('🍅🍅');
    });

    it('should return three tomatoes at 50-75%', () => {
      const timer = new PomodoroTimer(100);
      timer.remaining = 50 * 60; // 50% progress
      expect(timer.getTomatoEmoji()).toBe('🍅🍅🍅');

      timer.remaining = 26 * 60; // 74% progress
      expect(timer.getTomatoEmoji()).toBe('🍅🍅🍅');
    });

    it('should return four tomatoes at 75-100%', () => {
      const timer = new PomodoroTimer(100);
      timer.remaining = 25 * 60; // 75% progress
      expect(timer.getTomatoEmoji()).toBe('🍅🍅🍅🍅');

      timer.remaining = 0; // 100% progress
      expect(timer.getTomatoEmoji()).toBe('🍅🍅🍅🍅');
    });
  });

  describe('pause and resume', () => {
    it('should pause the timer', () => {
      const timer = new PomodoroTimer();
      timer.pause();
      expect(timer.isPaused).toBe(true);
    });

    it('should resume the timer', () => {
      const timer = new PomodoroTimer();
      timer.pause();
      timer.resume();
      expect(timer.isPaused).toBe(false);
    });

    it('should not change remaining time when pausing', () => {
      const timer = new PomodoroTimer(25);
      const initialRemaining = timer.remaining;
      timer.pause();
      expect(timer.remaining).toBe(initialRemaining);
    });
  });

  describe('stop', () => {
    it('should stop the timer', () => {
      const timer = new PomodoroTimer();
      timer.isRunning = true;
      timer.interval = setInterval(() => {}, 1000);

      timer.stop();

      expect(timer.isRunning).toBe(false);
      expect(timer.interval).toBeNull();
    });

    it('should clear interval when stopping', () => {
      const timer = new PomodoroTimer();
      timer.interval = setInterval(() => {}, 1000);
      const intervalId = timer.interval;

      timer.stop();

      expect(timer.interval).toBeNull();
    });

    it('should handle stopping when not running', () => {
      const timer = new PomodoroTimer();
      expect(() => timer.stop()).not.toThrow();
    });
  });

  describe('reset', () => {
    it('should reset timer to initial duration', () => {
      const timer = new PomodoroTimer(25);
      timer.remaining = 100;

      timer.reset();

      expect(timer.remaining).toBe(25 * 60);
    });

    it('should stop timer when resetting', () => {
      const timer = new PomodoroTimer();
      timer.isRunning = true;

      timer.reset();

      expect(timer.isRunning).toBe(false);
    });

    it('should clear pause state', () => {
      const timer = new PomodoroTimer();
      timer.isPaused = true;

      timer.reset();

      expect(timer.isPaused).toBe(false);
    });
  });

  describe('isCompleted', () => {
    it('should return false when time remaining', () => {
      const timer = new PomodoroTimer();
      timer.remaining = 100;
      expect(timer.isCompleted()).toBe(false);
    });

    it('should return true when time is zero', () => {
      const timer = new PomodoroTimer();
      timer.remaining = 0;
      expect(timer.isCompleted()).toBe(true);
    });

    it('should return false immediately after creation', () => {
      const timer = new PomodoroTimer();
      expect(timer.isCompleted()).toBe(false);
    });
  });

  describe('start - with fake timers', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      // Mock console methods to avoid cluttering test output
      vi.spyOn(console, 'clear').mockImplementation(() => {});
      vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
      vi.useRealTimers();
    });

    it('should set isRunning to true when started', async () => {
      const timer = new PomodoroTimer(1); // 1 minute
      const promise = timer.start();

      expect(timer.isRunning).toBe(true);

      timer.stop();
      vi.advanceTimersByTime(1000);
    });

    it('should decrement remaining time each second', async () => {
      const timer = new PomodoroTimer(1); // 1 minute = 60 seconds
      timer.start();

      const initialRemaining = timer.remaining;

      vi.advanceTimersByTime(1000); // 1 second
      expect(timer.remaining).toBe(initialRemaining - 1);

      vi.advanceTimersByTime(1000); // Another second
      expect(timer.remaining).toBe(initialRemaining - 2);

      timer.stop();
    });

    it('should not decrement when paused', async () => {
      const timer = new PomodoroTimer(1);
      timer.start();

      vi.advanceTimersByTime(1000); // 1 second
      const remainingBeforePause = timer.remaining;

      timer.pause();
      vi.advanceTimersByTime(5000); // 5 seconds while paused

      expect(timer.remaining).toBe(remainingBeforePause);

      timer.stop();
    });

    it('should continue after resume', async () => {
      const timer = new PomodoroTimer(1);
      timer.start();

      vi.advanceTimersByTime(1000); // 1 second
      timer.pause();
      const remainingAtPause = timer.remaining;

      timer.resume();
      vi.advanceTimersByTime(1000); // 1 second after resume

      expect(timer.remaining).toBe(remainingAtPause - 1);

      timer.stop();
    });

    it('should call onComplete when timer finishes', async () => {
      const timer = new PomodoroTimer(1); // 1 minute
      const onComplete = vi.fn();

      timer.remaining = 3; // Start with 3 seconds for faster test
      const promise = timer.start(onComplete);

      vi.advanceTimersByTime(3000); // Complete the timer

      await vi.runAllTimersAsync();

      expect(onComplete).toHaveBeenCalledOnce();
      expect(timer.remaining).toBe(0);
      expect(timer.isRunning).toBe(false);
    });

    it('should resolve promise when completed', async () => {
      const timer = new PomodoroTimer(1);
      timer.remaining = 2; // Start with 2 seconds

      const promise = timer.start();
      vi.advanceTimersByTime(2000);

      await expect(promise).resolves.toBe(true);
    });

    it('should not start if already running', () => {
      const timer = new PomodoroTimer(1);
      timer.isRunning = true;

      const result = timer.start();

      expect(result).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero duration', () => {
      const timer = new PomodoroTimer(0);
      expect(timer.duration).toBe(0);
      expect(timer.isCompleted()).toBe(true);
    });

    it('should handle very long duration', () => {
      const timer = new PomodoroTimer(999);
      expect(timer.duration).toBe(999 * 60);
      expect(timer.formatTime(timer.remaining)).toMatch(/^\d{3}:\d{2}$/);
    });

    it('should handle fractional durations by flooring', () => {
      const timer = new PomodoroTimer(25.7);
      expect(timer.duration).toBe(Math.floor(25.7 * 60));
    });

    it('should maintain state across multiple operations', () => {
      const timer = new PomodoroTimer(25);

      timer.pause();
      expect(timer.isPaused).toBe(true);

      timer.resume();
      expect(timer.isPaused).toBe(false);

      timer.pause();
      timer.reset();
      expect(timer.isPaused).toBe(false);
      expect(timer.remaining).toBe(timer.duration);
    });
  });

  describe('Display Method', () => {
    beforeEach(() => {
      vi.spyOn(console, 'clear').mockImplementation(() => {});
      vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should call display without errors', () => {
      const timer = new PomodoroTimer();
      expect(() => timer.display()).not.toThrow();
    });

    it('should call console.clear and console.log', () => {
      const timer = new PomodoroTimer();
      timer.display();

      expect(console.clear).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalled();
    });

    it('should display paused state', () => {
      const timer = new PomodoroTimer();
      timer.isPaused = true;
      timer.display();

      expect(console.log).toHaveBeenCalled();
      // Should display some indication of paused state
    });

    it('should display running state', () => {
      const timer = new PomodoroTimer();
      timer.isRunning = true;
      timer.display();

      expect(console.log).toHaveBeenCalled();
      // Should display some indication of running state
    });
  });
});
