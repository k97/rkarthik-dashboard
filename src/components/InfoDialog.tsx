
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
          <DialogTitle>About This Project</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm text-muted-foreground">
          <p>
            This is a personal dashboard application built with Next.js,
            TypeScript, and Tailwind CSS. It was bootstrapped with{' '}
            <a
              href="https://create.t3.gg/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              create-t3-app
            </a>
            .
          </p>
          <p>
            The widgets are designed to be modular and configurable, allowing
            users to customize their dashboard to their liking. The project
            showcases the use of modern web development technologies and best
            practices.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
