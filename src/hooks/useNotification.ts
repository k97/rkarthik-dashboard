'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseNotificationReturn {
  notifyPomodoroComplete: (phase: string, taskName?: string) => void;
  requestPermission: () => Promise<boolean>;
  hasPermission: boolean;
  playSound: () => void;
}

// Create a pleasant ding sound using Web Audio API
function createDingSound(): () => void {
  return () => {
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

      // Create oscillator for the main tone
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Set up the sound
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
      oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.3); // Slide down to A4

      // Volume envelope
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      // Play the sound
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);

      // Clean up
      setTimeout(() => {
        audioContext.close();
      }, 600);
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
  };
}

export function useNotification(): UseNotificationReturn {
  const [hasPermission, setHasPermission] = useState(false);
  const playSoundRef = useRef<(() => void) | null>(null);

  // Check and set initial permission state
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setHasPermission(Notification.permission === 'granted');
    }

    // Initialize sound function
    if (typeof window !== 'undefined') {
      playSoundRef.current = createDingSound();
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.warn('Notifications not supported');
      return false;
    }

    if (Notification.permission === 'granted') {
      setHasPermission(true);
      return true;
    }

    if (Notification.permission === 'denied') {
      console.warn('Notification permission denied');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      setHasPermission(granted);
      return granted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, []);

  const playSound = useCallback(() => {
    const fn = playSoundRef.current;
    if (fn) {
      fn();
    }
  }, []);

  const notifyPomodoroComplete = useCallback(
    (phase: string, taskName?: string) => {
      // Always play sound
      playSound();

      // Show notification if we have permission
      if (hasPermission && typeof window !== 'undefined' && 'Notification' in window) {
        const phaseLabels: Record<string, string> = {
          focus: 'Focus session',
          break: 'Break',
        };

        const title = `${phaseLabels[phase] || phase} complete!`;
        const body = taskName
          ? `Great work on "${taskName}"! Time for a break.`
          : phase === 'focus'
          ? 'Time for a break!'
          : 'Ready to get back to work?';

        try {
          new Notification(title, {
            body,
            icon: '/favicon.ico',
            tag: 'pomodoro',
          });
        } catch (error) {
          console.warn('Could not show notification:', error);
        }
      }
    },
    [hasPermission, playSound]
  );

  return {
    notifyPomodoroComplete,
    requestPermission,
    hasPermission,
    playSound,
  };
}
