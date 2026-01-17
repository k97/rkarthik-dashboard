'use client';

import { ReactNode, useState, KeyboardEvent } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useWidgets, WidgetId } from '@/context/WidgetContext';

const WIDGET_HEIGHT = 284; // Fixed height for all widgets in pixels

// Custom keyboard sensor filter to prevent drag from starting on interactive elements
const customKeyboardFilter = (event: KeyboardEvent<Element>) => {
  const interactiveElements = ['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT'];
  if (
    event.code === 'Space' &&
    event.target instanceof HTMLElement &&
    interactiveElements.includes(event.target.tagName)
  ) {
    return false;
  }
  return true;
};

interface SortableWidgetProps {
  id: WidgetId;
  children: ReactNode;
}

function SortableWidget({ id, children }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    height: WIDGET_HEIGHT,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="w-full">
      {children}
    </div>
  );
}

interface WidgetGridProps {
  children: (widgetId: WidgetId, isDragging: boolean) => ReactNode;
}

export function WidgetGrid({ children }: WidgetGridProps) {
  const { widgets, reorderWidgets, isWidgetVisible } = useWidgets();
  const [activeId, setActiveId] = useState<WidgetId | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      onActivation: ({ event }) => {
        return customKeyboardFilter(event as unknown as KeyboardEvent<Element>);
      },
    })
  );

  const visibleWidgets = widgets
    .filter((w) => isWidgetVisible(w.id))
    .sort((a, b) => a.order - b.order);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as WidgetId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = widgets.findIndex((w) => w.id === active.id);
      const newIndex = widgets.findIndex((w) => w.id === over.id);

      const newWidgets = arrayMove(widgets, oldIndex, newIndex).map(
        (w, index) => ({
          ...w,
          order: index,
        })
      );

      reorderWidgets(newWidgets);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={visibleWidgets.map((w) => w.id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {visibleWidgets.map((widget) => (
            <SortableWidget key={widget.id} id={widget.id}>
              {children(widget.id, activeId === widget.id)}
            </SortableWidget>
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeId ? (
          <div className="opacity-80 rotate-3 scale-105">
            {children(activeId, true)}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
