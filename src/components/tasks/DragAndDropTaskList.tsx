import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import TaskCard from './TaskCard';
import { useTheme } from '@/contexts/ThemeContext';

interface Task {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

interface DragAndDropTaskListProps {
  tasks: Task[];
  onToggle: (taskId: string) => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
  showPriorityIndicator?: boolean;
  showDueDate?: boolean;
}

interface DraggableTaskCardProps {
  task: Task;
  index: number;
  onMove: (fromIndex: number, toIndex: number) => void;
  onToggle: (taskId: string) => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  showPriorityIndicator?: boolean;
  showDueDate?: boolean;
}

// Draggable Task Card Component
const DraggableTaskCard: React.FC<DraggableTaskCardProps> = ({
  task,
  index,
  onMove,
  onToggle,
  onEdit,
  onDelete,
  showPriorityIndicator,
  showDueDate
}) => {
  const { theme } = useTheme();
  const ref = React.useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { index },
    collect: (monitor: { isDragging: () => any; }) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'TASK',
    hover(item: { index: number }, monitor: { getClientOffset: () => any; }) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      if (!clientOffset) return;

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      onMove(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <motion.div
      ref={ref}
      className="cursor-move"
      style={{
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'rotate(2deg)' : 'none',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <TaskCard
        task={task}
        onToggle={onToggle}
        onEdit={onEdit}
        onDelete={onDelete}
        showPriorityIndicator={showPriorityIndicator}
        showDueDate={showDueDate}
      />
    </motion.div>
  );
};

// Main Drag and Drop Task List Component
const DragAndDropTaskList: React.FC<DragAndDropTaskListProps> = ({
  tasks,
  onToggle,
  onEdit,
  onDelete,
  onReorder,
  showPriorityIndicator = true,
  showDueDate = true,
}) => {
  const moveTask = (fromIndex: number, toIndex: number) => {
    onReorder(fromIndex, toIndex);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-3 sm:space-y-4 rounded-xl p-1">
        <AnimatePresence initial={false}>
          {tasks.map((task, index) => (
            <DraggableTaskCard
              key={task.id}
              task={task}
              index={index}
              onMove={moveTask}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
              showPriorityIndicator={showPriorityIndicator}
              showDueDate={showDueDate}
            />
          ))}
        </AnimatePresence>
      </div>
    </DndProvider>
  );
};

export default DragAndDropTaskList;