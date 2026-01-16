'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { LayoutDashboard, Settings, Settings2 } from 'lucide-react';
import { useWidgets, WidgetId } from '@/context/WidgetContext';

const widgetLabels: Record<WidgetId, string> = {
  'home-group': 'Home (Clock & Weather)',
  'world-clocks': 'World Clocks',
  'date': 'Date Widget',
  'pomodoro': 'Pomodoro',
};

export function WidgetToggleOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const { widgets, toggleWidget } = useWidgets();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed top-6 right-6 h-10 w-10 shadow-lg hover:bg-accent bg-white/80 cursor-pointer backdrop-blur-md z-50"
        >
          <Settings2 className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Widgets</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 py-3">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
