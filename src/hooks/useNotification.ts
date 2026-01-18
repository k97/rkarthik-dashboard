'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useWidgets } from '@/context/WidgetContext';
import { toast } from 'sonner';

interface UseNotificationReturn {
  notifyPomodoroComplete: (phase: string, taskName?: string) => void;
  playSound: () => void;
  requestPermission: () => Promise<void>;
  showNotificationPrompt: () => void;
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
  const { pomodoroSettings, updatePomodoroSettings } = useWidgets();
  const playSoundRef = useRef<(() => void) | null>(null);

  // Initialize sound function
  useEffect(() => {
    if (typeof window !== 'undefined') {
      playSoundRef.current = createDingSound();
    }
  }, []);

  const playSound = useCallback(() => {
    const fn = playSoundRef.current;
    if (fn) {
      fn();
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'default') {
      try {
        await Notification.requestPermission();
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    }
  }, []);

  const showNotificationPrompt = useCallback(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return;
    }

    // Don't show if permission is already granted or denied
    if (Notification.permission === 'granted') {
      if (!pomodoroSettings.notificationsEnabled) {
        updatePomodoroSettings({ notificationsEnabled: true });
      }
      return;
    }

    if (Notification.permission === 'denied') {
      return;
    }

    // Show persistent toast for 2 minutes (120000ms)
    toast('Enable notifications to get alerted when your timer completes', {
      duration: 120000,
      action: {
        label: 'Enable',
        onClick: async () => {
          try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
              updatePomodoroSettings({ notificationsEnabled: true });
              toast.success('Notifications enabled! You\'ll be notified when your timer completes.', {
                duration: 5000,
              });
            }
          } catch (error) {
            console.error('Error requesting notification permission:', error);
          }
        },
      },
    });
  }, [pomodoroSettings.notificationsEnabled, updatePomodoroSettings]);

  const notifyPomodoroComplete = useCallback(
    (phase: string, taskName?: string) => {
      // Always play sound
      playSound();

      // Show notification only if enabled in settings and we have browser permission
      if (
        pomodoroSettings.notificationsEnabled &&
        typeof window !== 'undefined' &&
        'Notification' in window &&
        Notification.permission === 'granted'
      ) {
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
            icon: '/icons/android-chrome-192x192.png',
            tag: 'pomodoro',
          });
        } catch (error) {
          console.error('Could not show notification:', error);
        }
      }
    },
    [playSound, pomodoroSettings.notificationsEnabled]
  );

  return {
    notifyPomodoroComplete,
    playSound,
    requestPermission,
    showNotificationPrompt,
  };
}
