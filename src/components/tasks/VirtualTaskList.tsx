import React, { memo, useCallback, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import TaskCard from './TaskCard';

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

interface VirtualTaskListProps {
  tasks: Task[];
  onToggle: (taskId: string) => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  showPriorityIndicator?: boolean;
  showDueDate?: boolean;
  itemHeight?: number;
}

const VirtualTaskList: React.FC<VirtualTaskListProps> = ({
  tasks,
  onToggle,
  onEdit,
  onDelete,
  showPriorityIndicator = true,
  showDueDate = true,
  itemHeight = 150
}) => {
  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const task = tasks[index];

    return (
      <div style={style}>
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          showPriorityIndicator={showPriorityIndicator}
          showDueDate={showDueDate}
        />
      </div>
    );
  }, [tasks, onToggle, onEdit, onDelete, showPriorityIndicator, showDueDate]);

  const itemCount = useMemo(() => tasks.length, [tasks]);

  return (
    <div className="virtual-task-list" style={{ height: '100%', width: '100%' }}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            itemCount={itemCount}
            itemSize={itemHeight}
            width={width}
            overscanCount={5}
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </div>
  );
};

export default memo(VirtualTaskList);