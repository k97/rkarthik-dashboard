'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Settings2, LayoutDashboard, Globe, Timer } from 'lucide-react';
import { useWidgets, WidgetId } from '@/context/WidgetContext';
import { CitySelector } from './CitySelector';

const widgetLabels: Record<WidgetId, string> = {
  'home-group': 'Home (Clock & Weather)',
  'world-clocks': 'World Clocks',
  'date': 'Date Widget',
  'pomodoro': 'Pomodoro',
};

export function SettingsOverlay() {
  const {
    widgets,
    toggleWidget,
    pomodoroSettings,
    updatePomodoroSettings,
    settingsOpen,
    settingsTab,
    setSettingsOpen,
    setSettingsTab,
  } = useWidgets();

  return (
    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed top-6 right-6 h-10 w-10 shadow-lg hover:bg-accent bg-white/80 cursor-pointer backdrop-blur-md z-50"
        >
          <Settings2 className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <Tabs value={settingsTab} onValueChange={(value) => setSettingsTab(value as any)} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="widgets" className="flex items-center gap-2 data-[state=active]:text-white">
              <LayoutDashboard className="h-4 w-4" />
              Widgets
            </TabsTrigger>
            <TabsTrigger value="cities" className="flex items-center gap-2 data-[state=active]:text-white">
              <Globe className="h-4 w-4" />
              Cities
            </TabsTrigger>
            <TabsTrigger value="timer" className="flex items-center gap-2 data-[state=active]:text-white">
              <Timer className="h-4 w-4" />
              Timer
            </TabsTrigger>
          </TabsList>

          {/* Widgets Tab */}
          <TabsContent value="widgets" className="space-y-2 py-3 overflow-auto">
            <p className="text-sm text-muted-foreground mb-4">
              Choose which widgets to display on your dashboard
            </p>
            {widgets.map((widget) => (
              <div
                key={widget.id}
                className="flex items-center justify-between py-2"
              >
                <label
                  htmlFor={widget.id}
                  className="text-sm font-medium cursor-pointer"
                >
                  {widgetLabels[widget.id]}
                </label>
                <Switch
                  id={widget.id}
                  checked={widget.visible}
                  onCheckedChange={() => toggleWidget(widget.id)}
                />
              </div>
            ))}
          </TabsContent>

          {/* Cities Tab */}
          <TabsContent value="cities" className="flex-1 overflow-hidden">
            <CitySelector />
          </TabsContent>

          {/* Timer Tab */}
          <TabsContent value="timer" className="space-y-6 py-3">
            <p className="text-sm text-muted-foreground mb-4">
              Configure your Pomodoro timer settings
            </p>

            {/* Focus Duration */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Focus Duration</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  max={60}
                  value={pomodoroSettings.focusDuration}
                  onChange={(e) =>
                    updatePomodoroSettings({
                      focusDuration: parseInt(e.target.value) || 25,
                    })
                  }
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">min</span>
              </div>
            </div>

            {/* Break Duration */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Break Duration</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  max={30}
                  value={pomodoroSettings.breakDuration}
                  onChange={(e) =>
                    updatePomodoroSettings({
                      breakDuration: parseInt(e.target.value) || 5,
                    })
                  }
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">min</span>
              </div>
            </div>

            {/* Auto-start breaks */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Auto-Start Breaks</label>
              <Switch
                checked={pomodoroSettings.autoStartBreaks}
                onCheckedChange={(checked) =>
                  updatePomodoroSettings({ autoStartBreaks: checked })
                }
              />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
