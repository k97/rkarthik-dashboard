'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';

export type WidgetId =
  | 'home-group'
  | 'world-clocks'
  | 'pomodoro'
  | 'date';

interface WidgetConfig {
  id: WidgetId;
  visible: boolean;
  order: number;
}

interface WorldClock {
  id: string;
  cityCode: string;
  cityName: string;
  country: string;
  timezone: string;
}

interface PomodoroSettings {
  focusDuration: number; // minutes
  breakDuration: number;
  autoStartBreaks: boolean;
  notificationsEnabled: boolean;
}

interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface ManualLocation {
  cityName: string;
  timezone: string;
}

export type LocationMode = 'auto' | 'manual' | 'pending';

interface LocationState {
  mode: LocationMode;
  coords: LocationCoords | null;
  manualLocation: ManualLocation | null;
  resolvedCityName: string | null; // City name resolved from coords
  resolvedTimezone: string | null; // Timezone resolved from coords
}

interface WidgetState {
  widgets: WidgetConfig[];
  location: LocationState;
  worldClocks: WorldClock[];
  pomodoroSettings: PomodoroSettings;
}

export type SettingsTab = 'widgets' | 'cities' | 'timer';
export type CitySubTab = 'home' | 'world';

interface WidgetContextValue extends WidgetState {
  toggleWidget: (id: WidgetId) => void;
  reorderWidgets: (widgets: WidgetConfig[]) => void;
  setAutoLocation: (coords: LocationCoords, cityName: string, timezone: string) => void;
  setManualLocation: (cityName: string, timezone: string) => void;
  clearLocation: () => void;
  addWorldClock: (clock: Omit<WorldClock, 'id'>) => void;
  removeWorldClock: (id: string) => void;
  updateWorldClock: (id: string, clock: Partial<WorldClock>) => void;
  updatePomodoroSettings: (settings: Partial<PomodoroSettings>) => void;
  isWidgetVisible: (id: WidgetId) => boolean;
  openSettings: (tab?: SettingsTab, citySubTab?: CitySubTab) => void;
  settingsOpen: boolean;
  settingsTab: SettingsTab;
  citySubTab: CitySubTab;
  setSettingsOpen: (open: boolean) => void;
  setSettingsTab: (tab: SettingsTab) => void;
  setCitySubTab: (tab: CitySubTab) => void;
}

const defaultWidgets: WidgetConfig[] = [
  { id: 'home-group', visible: true, order: 0 },
  { id: 'world-clocks', visible: true, order: 1 },
  { id: 'pomodoro', visible: true, order: 2 },
  { id: 'date', visible: true, order: 3 },
];

const defaultWorldClocks: WorldClock[] = [
  {
    id: '1',
    cityCode: 'MAA',
    cityName: 'Chennai',
    country: 'IND',
    timezone: 'Asia/Kolkata',
  },
  {
    id: '2',
    cityCode: 'BER',
    cityName: 'Berlin',
    country: 'DEU',
    timezone: 'Europe/Berlin',
  },
  {
    id: '3',
    cityCode: 'DXB',
    cityName: 'Dubai',
    country: 'UAE',
    timezone: 'Asia/Dubai',
  },
];

const defaultPomodoroSettings: PomodoroSettings = {
  focusDuration: 25,
  breakDuration: 5,
  autoStartBreaks: false,
  notificationsEnabled: false,
};

const defaultLocation: LocationState = {
  mode: 'pending',
  coords: null,
  manualLocation: null,
  resolvedCityName: null,
  resolvedTimezone: null,
};

const defaultState: WidgetState = {
  widgets: defaultWidgets,
  location: defaultLocation,
  worldClocks: defaultWorldClocks,
  pomodoroSettings: defaultPomodoroSettings,
};

const STORAGE_KEY = 'dashboard-widget-state';

const WidgetContext = createContext<WidgetContextValue | null>(null);

export function WidgetProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WidgetState>(() => {
    if (typeof window === 'undefined') {
      return defaultState;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaultState;
    }

    try {
      const parsed = JSON.parse(stored);

      // Migrate old pomodoro settings format
      let pomodoroSettings = parsed.pomodoroSettings || defaultPomodoroSettings;
      if ('shortBreakDuration' in pomodoroSettings) {
        // Migrate from old format
        pomodoroSettings = {
          focusDuration: pomodoroSettings.focusDuration,
          breakDuration: pomodoroSettings.shortBreakDuration,
          autoStartBreaks: pomodoroSettings.autoStartBreaks,
          notificationsEnabled: false,
        };
      }
      // Ensure notificationsEnabled exists (migration for existing users)
      if (!('notificationsEnabled' in pomodoroSettings)) {
        // Initialize based on current browser permission
        const hasNotificationPermission = typeof window !== 'undefined' &&
          'Notification' in window &&
          Notification.permission === 'granted';
        pomodoroSettings.notificationsEnabled = hasNotificationPermission;
      }

      return {
        ...defaultState,
        ...parsed,
        pomodoroSettings,
        // Ensure all default widgets exist
        widgets: defaultWidgets.map((defaultWidget) => {
          const storedWidget = parsed.widgets?.find(
            (w: WidgetConfig) => w.id === defaultWidget.id
          );
          return storedWidget || defaultWidget;
        }),
      };
    } catch (e) {
      console.error('Failed to parse widget state from localStorage:', e);
      return defaultState;
    }
  });
  const [isHydrated, setIsHydrated] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('widgets');
  const [citySubTab, setCitySubTab] = useState<CitySubTab>('home');

  // Set hydrated flag on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHydrated(true);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isHydrated]);

  const toggleWidget = useCallback((id: WidgetId) => {
    setState((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) =>
        w.id === id ? { ...w, visible: !w.visible } : w
      ),
    }));
  }, []);

  const reorderWidgets = useCallback((widgets: WidgetConfig[]) => {
    setState((prev) => ({ ...prev, widgets }));
  }, []);

  const setAutoLocation = useCallback(
    (coords: LocationCoords, cityName: string, timezone: string) => {
      setState((prev) => ({
        ...prev,
        location: {
          mode: 'auto',
          coords,
          manualLocation: null,
          resolvedCityName: cityName,
          resolvedTimezone: timezone,
        },
      }));
    },
    []
  );

  const setManualLocation = useCallback((cityName: string, timezone: string) => {
    setState((prev) => ({
      ...prev,
      location: {
        mode: 'manual',
        coords: null,
        manualLocation: { cityName, timezone },
        resolvedCityName: null,
        resolvedTimezone: null,
      },
    }));
  }, []);

  const clearLocation = useCallback(() => {
    setState((prev) => ({
      ...prev,
      location: defaultLocation,
    }));
  }, []);

  const addWorldClock = useCallback((clock: Omit<WorldClock, 'id'>) => {
    setState((prev) => ({
      ...prev,
      worldClocks: [
        ...prev.worldClocks,
        { ...clock, id: Date.now().toString() },
      ],
    }));
  }, []);

  const removeWorldClock = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      worldClocks: prev.worldClocks.filter((c) => c.id !== id),
    }));
  }, []);

  const updateWorldClock = useCallback(
    (id: string, clock: Partial<WorldClock>) => {
      setState((prev) => ({
        ...prev,
        worldClocks: prev.worldClocks.map((c) =>
          c.id === id ? { ...c, ...clock } : c
        ),
      }));
    },
    []
  );

  const updatePomodoroSettings = useCallback(
    (settings: Partial<PomodoroSettings>) => {
      setState((prev) => ({
        ...prev,
        pomodoroSettings: { ...prev.pomodoroSettings, ...settings },
      }));
    },
    []
  );

  const isWidgetVisible = useCallback(
    (id: WidgetId) => {
      return state.widgets.find((w) => w.id === id)?.visible ?? true;
    },
    [state.widgets]
  );

  const openSettings = useCallback((tab: SettingsTab = 'widgets', cityTab: CitySubTab = 'home') => {
    setSettingsTab(tab);
    if (tab === 'cities') {
      setCitySubTab(cityTab);
    }
    setSettingsOpen(true);
  }, []);

  const value: WidgetContextValue = {
    ...state,
    toggleWidget,
    reorderWidgets,
    setAutoLocation,
    setManualLocation,
    clearLocation,
    addWorldClock,
    removeWorldClock,
    updateWorldClock,
    updatePomodoroSettings,
    isWidgetVisible,
    openSettings,
    settingsOpen,
    settingsTab,
    citySubTab,
    setSettingsOpen,
    setSettingsTab,
    setCitySubTab,
  };

  // Prevent hydration mismatch by not rendering until hydrated
  if (!isHydrated) {
    return null;
  }

  return (
    <WidgetContext.Provider value={value}>{children}</WidgetContext.Provider>
  );
}

export function useWidgets() {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error('useWidgets must be used within a WidgetProvider');
  }
  return context;
}
