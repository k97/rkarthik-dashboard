'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export type PomodoroPhase = 'focus' | 'break';
export type PomodoroStatus = 'idle' | 'running' | 'paused' | 'completed';

interface PomodoroSettings {
  focusDuration: number;
  breakDuration: number;
  autoStartBreaks: boolean;
}

interface PomodoroState {
  phase: PomodoroPhase;
  status: PomodoroStatus;
  timeRemaining: number; // in seconds
  completedPomodoros: number;
  taskName: string;
}

interface PersistedPomodoroState extends PomodoroState {
  lastUpdatedAt: number; // timestamp when state was last saved
}

interface UsePomodoroReturn extends PomodoroState {
  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
  setTaskName: (name: string) => void;
  formattedTime: string;
  progress: number; // 0-100
}

const STORAGE_KEY = 'dashboard-pomodoro-state';
const RECENT_TASKS_KEY = 'dashboard-recent-tasks';
const MAX_RECENT_TASKS = 10;

function saveRecentTask(taskName: string): void {
  if (!taskName.trim()) return;

  try {
    const stored = sessionStorage.getItem(RECENT_TASKS_KEY);
    let tasks: string[] = stored ? JSON.parse(stored) : [];

    // Remove if already exists (to move it to the front)
    tasks = tasks.filter(t => t !== taskName);

    // Add to front (LIFO)
    tasks.unshift(taskName);

    // Keep only the most recent 10
    tasks = tasks.slice(0, MAX_RECENT_TASKS);

    sessionStorage.setItem(RECENT_TASKS_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save recent task:', e);
  }
}

export function getRecentTasks(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = sessionStorage.getItem(RECENT_TASKS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to load recent tasks:', e);
    return [];
  }
}

function getInitialState(settings: PomodoroSettings): PomodoroState {
  return {
    phase: 'focus',
    status: 'idle',
    timeRemaining: settings.focusDuration * 60,
    completedPomodoros: 0,
    taskName: '',
  };
}

function loadPersistedState(settings: PomodoroSettings): PomodoroState {
  if (typeof window === 'undefined') {
    return getInitialState(settings);
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return getInitialState(settings);
    }

    const persisted: PersistedPomodoroState = JSON.parse(stored);

    // Migrate old phase values
    const phase = persisted.phase as string;
    if (phase === 'shortBreak' || phase === 'longBreak') {
      persisted.phase = 'break' as PomodoroPhase;
    }

    const now = Date.now();
    const elapsedSeconds = Math.floor((now - persisted.lastUpdatedAt) / 1000);

    // If timer was running, calculate remaining time
    if (persisted.status === 'running') {
      const newTimeRemaining = persisted.timeRemaining - elapsedSeconds;

      if (newTimeRemaining <= 0) {
        // Timer has completed while away - set to completed state
        return {
          ...persisted,
          status: 'completed',
          timeRemaining: 0,
        };
      }

      return {
        ...persisted,
        timeRemaining: newTimeRemaining,
      };
    }

    // For paused/idle/completed states, just restore as-is
    return persisted;
  } catch (e) {
    console.error('Failed to load pomodoro state:', e);
    return getInitialState(settings);
  }
}

export function usePomodoro(
  settings: PomodoroSettings,
  onComplete?: (phase: PomodoroPhase) => void
): UsePomodoroReturn {
  const [state, setState] = useState<PomodoroState>(() =>
    loadPersistedState(settings)
  );
  const [isHydrated, setIsHydrated] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onCompleteRef = useRef(onComplete);

  // Hydrate state from localStorage on mount
  useEffect(() => {
    const loaded = loadPersistedState(settings);
    setState(loaded);
    setIsHydrated(true);
  }, []);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    if (!isHydrated) return;

    const persisted: PersistedPomodoroState = {
      ...state,
      lastUpdatedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
  }, [state, isHydrated]);

  // Keep callback ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Update time remaining when settings change (only if idle)
  useEffect(() => {
    if (state.status === 'idle') {
      const duration = getDurationForPhase(state.phase, settings);
      setState((prev) => ({ ...prev, timeRemaining: duration * 60 }));
    }
  }, [settings, state.phase, state.status]);

  const getDurationForPhase = useCallback(
    (phase: PomodoroPhase, s: PomodoroSettings): number => {
      switch (phase) {
        case 'focus':
          return s.focusDuration;
        case 'break':
          return s.breakDuration;
      }
    },
    []
  );

  const getNextPhase = useCallback(
    (currentPhase: PomodoroPhase): PomodoroPhase => {
      if (currentPhase === 'focus') {
        return 'break';
      }
      // After break, go back to focus
      return 'focus';
    },
    []
  );

  const handlePhaseComplete = useCallback(() => {
    setState((prev) => {
      const isFocusComplete = prev.phase === 'focus';
      const newCompletedPomodoros = isFocusComplete
        ? prev.completedPomodoros + 1
        : prev.completedPomodoros;

      const nextPhase = getNextPhase(prev.phase);
      const nextDuration = getDurationForPhase(nextPhase, settings);

      // Save task name to recent tasks when focus phase completes
      if (isFocusComplete && prev.taskName.trim()) {
        saveRecentTask(prev.taskName);
      }

      // Trigger callback
      onCompleteRef.current?.(prev.phase);

      return {
        ...prev,
        phase: nextPhase,
        status: settings.autoStartBreaks && isFocusComplete ? 'running' : 'completed',
        timeRemaining: nextDuration * 60,
        completedPomodoros: newCompletedPomodoros,
        // Clear task name when focus phase completes
        taskName: isFocusComplete ? '' : prev.taskName,
      };
    });
  }, [settings, getDurationForPhase, getNextPhase]);

  // Timer tick
  useEffect(() => {
    if (state.status === 'running') {
      intervalRef.current = setInterval(() => {
        setState((prev) => {
          if (prev.timeRemaining <= 0) {
            return prev; // Will be handled by the phase complete check
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.status]);

  // Check for phase completion
  useEffect(() => {
    if (state.status === 'running' && state.timeRemaining <= 0) {
      handlePhaseComplete();
    }
  }, [state.timeRemaining, state.status, handlePhaseComplete]);

  const start = useCallback(() => {
    setState((prev) => {
      if (prev.status === 'completed') {
        // Reset to focus if completed
        return {
          ...prev,
          status: 'running',
        };
      }
      return { ...prev, status: 'running' };
    });
  }, []);

  const pause = useCallback(() => {
    setState((prev) => ({ ...prev, status: 'paused' }));
  }, []);

  const reset = useCallback(() => {
    const duration = getDurationForPhase(state.phase, settings);
    setState((prev) => ({
      ...prev,
      status: 'idle',
      timeRemaining: duration * 60,
    }));
  }, [state.phase, settings, getDurationForPhase]);

  const skip = useCallback(() => {
    handlePhaseComplete();
  }, [handlePhaseComplete]);

  const setTaskName = useCallback((name: string) => {
    setState((prev) => ({ ...prev, taskName: name }));
  }, []);

  // Format time as MM:SS
  const formattedTime = `${Math.floor(state.timeRemaining / 60)
    .toString()
    .padStart(2, '0')}:${(state.timeRemaining % 60).toString().padStart(2, '0')}`;

  // Calculate progress (0-100)
  const totalDuration = getDurationForPhase(state.phase, settings) * 60;
  const progress = ((totalDuration - state.timeRemaining) / totalDuration) * 100;

  return {
    ...state,
    start,
    pause,
    reset,
    skip,
    setTaskName,
    formattedTime,
    progress,
  };
}
