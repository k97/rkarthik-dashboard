'use client';

import { useState } from 'react';
import { Widget, WidgetHeader, WidgetTitle, WidgetContent } from './Widget';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Play, Pause, RotateCcw, Settings, SkipForward, Bolt } from 'lucide-react';
import { usePomodoro, PomodoroPhase } from '@/hooks/usePomodoro';
import { useWidgets } from '@/context/WidgetContext';

interface PomodoroWidgetProps {
  isDragging?: boolean;
  onPhaseComplete?: (phase: PomodoroPhase) => void;
}

export function PomodoroWidget({ isDragging, onPhaseComplete }: PomodoroWidgetProps) {
  const { pomodoroSettings, updatePomodoroSettings } = useWidgets();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {
    status,
    taskName,
    formattedTime,
    start,
    pause,
    reset,
    skip,
    setTaskName,
  } = usePomodoro(pomodoroSettings, onPhaseComplete);

  return (
    <Widget isDragging={isDragging}>
      <WidgetContent className="h-full flex flex-col">
        {/* Header */}
        <WidgetHeader className="mb-0">
          <WidgetTitle className='text-base'>Timer</WidgetTitle>
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                <Bolt className="h-5 w-5"/>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Timer Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
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

                {/* Short Break Duration */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Short Break</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      max={30}
                      value={pomodoroSettings.shortBreakDuration}
                      onChange={(e) =>
                        updatePomodoroSettings({
                          shortBreakDuration: parseInt(e.target.value) || 5,
                        })
                      }
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">min</span>
                  </div>
                </div>

                {/* Long Break Duration */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Long Break</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      max={60}
                      value={pomodoroSettings.longBreakDuration}
                      onChange={(e) =>
                        updatePomodoroSettings({
                          longBreakDuration: parseInt(e.target.value) || 15,
                        })
                      }
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">min</span>
                  </div>
                </div>

                {/* Auto-start breaks */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Auto-start breaks</label>
                  <Switch
                    checked={pomodoroSettings.autoStartBreaks}
                    onCheckedChange={(checked) =>
                      updatePomodoroSettings({ autoStartBreaks: checked })
                    }
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </WidgetHeader>

        {/* Main content - centered */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Timer display - large */}
          <div className="text-7xl font-light text-card-foreground tracking-tight">
            {formattedTime}
          </div>

          {/* Task name input */}
          <Input
            placeholder="Task name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="mt-3 text-center h-8 max-w-48 bg-transparent border-none shadow-none text-muted-foreground placeholder:text-muted-foreground/60 focus-visible:ring-0"
          />
        </div>

        {/* Control buttons - bottom */}
        <div className="flex items-center justify-center gap-3">
          {/* Play/Pause */}
          {status === 'running' ? (
            <Button
              variant="outline"
              size="icon"
              onClick={pause}
              className="h-9 w-9 rounded-full"
            >
              <Pause className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="icon"
              onClick={start}
              className="h-9 w-9 rounded-full"
            >
              <Play className="h-4 w-4" />
            </Button>
          )}

          {/* Reset */}
          <Button
            variant="outline"
            size="icon"
            onClick={reset}
            className="h-9 w-9 rounded-full"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          {/* Skip to next phase */}
          <Button
            variant="outline"
            size="icon"
            onClick={skip}
            className="h-9 w-9 rounded-full"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
      </WidgetContent>
    </Widget>
  );
}
