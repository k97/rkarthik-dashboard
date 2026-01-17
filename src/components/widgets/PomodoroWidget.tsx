'use client';

import { Widget, WidgetHeader, WidgetTitle, WidgetContent } from './Widget';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, Pause, RotateCcw, SkipForward, Bolt } from 'lucide-react';
import { usePomodoro, PomodoroPhase } from '@/hooks/usePomodoro';
import { useNotification } from '@/hooks/useNotification';
import { useWidgets } from '@/context/WidgetContext';

interface PomodoroWidgetProps {
  isDragging?: boolean;
  onPhaseComplete?: (phase: PomodoroPhase, taskName: string) => void;
}

export function PomodoroWidget({ isDragging, onPhaseComplete }: PomodoroWidgetProps) {
  const { pomodoroSettings, openSettings } = useWidgets();
  const { notifyPomodoroComplete } = useNotification();

  const {
    status,
    taskName,
    formattedTime,
    start,
    pause,
    reset,
    skip,
    setTaskName,
  } = usePomodoro(pomodoroSettings, (phase, completedTaskName) => {
    // Call notification when phase completes with the task name from the completed phase
    notifyPomodoroComplete(phase, completedTaskName);
    // Call optional external callback
    onPhaseComplete?.(phase, completedTaskName);
  });

  return (
    <Widget isDragging={isDragging}>
      <WidgetContent className="h-full flex flex-col">
        {/* Header */}
        <WidgetHeader className="mb-0">
          <WidgetTitle className='text-base'>Timer</WidgetTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 cursor-pointer"
            onClick={() => openSettings('timer')}
          >
            <Bolt className="h-5 w-5"/>
          </Button>
        </WidgetHeader>

        {/* Main content - centered */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Timer display - large */}
          <div className="text-7xl font-light text-card-foreground tracking-tight font-mono">
            {formattedTime}
          </div>

          {/* Task name input */}
          <Input
            placeholder="Task name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            onMouseDown={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              // Prevent all keyboard events from propagating to dnd-kit
              e.stopPropagation();
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
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
