
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';

export function InfoDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Info</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm text-muted-foreground">
          <p>
            A lightweight dashboard experiment built to explore what's possible with modern AI-assisted development tools. Built entirely using Claude Code and Gemini with TypeScript and Tailwind CSS, this project features modular widgets for tracking time across multiple cities, current weather conditions, and a Pomodoro timer to help maintain focus.
          </p>
          <p>
            Each widget is designed to be configurable: swap cities, toggle features, and customise the layout to suit your workflow. It's a practical exploration of Claude Code's capabilities and a testbed for building functional, minimalist interfaces with AI assistance.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
