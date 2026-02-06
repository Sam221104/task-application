import './components/styles.css'
import InputField from './components/InputField'
import TodoList from './components/TodoList'
import { useTodos } from './hooks/useTodos'
import { DragDropContext, type DropResult } from "@hello-pangea/dnd"

function App() {
  const { 
    activeTasks, 
    inProgressTasks,
    completedTasks,
    isLoading,
    setTasksCache,
    addTask, 
    deleteTask, 
    updateTask, 
    updateTaskStatus,
    reorderTasks
  } = useTodos()

  const handleAdd = (todo: string) => {
    addTask({ taskName: todo })
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    // Map droppableId to status
    const droppableIdToStatus = {
      "ActiveTasks": "active",
      "InProgressTasks": "in_progress", 
      "CompletedTasks": "completed"
    } as const;

    const sourceStatus = droppableIdToStatus[source.droppableId as keyof typeof droppableIdToStatus];
    const destStatus = droppableIdToStatus[destination.droppableId as keyof typeof droppableIdToStatus];

    if (!sourceStatus || !destStatus) return;

    // Get all current tasks
    const allTasks = [...activeTasks, ...inProgressTasks, ...completedTasks];

    if (sourceStatus !== destStatus) {
      // Moving between different status columns
      const sourceArray = allTasks.filter(t => t.status === sourceStatus).sort((a, b) => a.order - b.order);
      const destArray = allTasks.filter(t => t.status === destStatus).sort((a, b) => a.order - b.order);

      const movedTask = sourceArray[source.index];
      if (!movedTask) return;

      // Remove from source
      sourceArray.splice(source.index, 1);
      // Add to destination
      const updatedMovedTask = { ...movedTask, status: destStatus };
      destArray.splice(destination.index, 0, updatedMovedTask);

      // Update orders
      sourceArray.forEach((task, index) => { task.order = index; });
      destArray.forEach((task, index) => { task.order = index; });

      // Create updated all tasks
      const updatedAllTasks = allTasks.map(task => {
        if (task.id === movedTask.id) return updatedMovedTask;
        const sourceIndex = sourceArray.findIndex(t => t.id === task.id);
        if (sourceIndex !== -1) return { ...task, order: sourceIndex };
        const destIndex = destArray.findIndex(t => t.id === task.id);
        if (destIndex !== -1) return { ...task, order: destIndex };
        return task;
      });

      // Update cache
      setTasksCache(() => updatedAllTasks);

      // Persist the changes
      const tasksToUpdate = [...sourceArray, ...destArray].map(task => ({
        id: task.id,
        order: task.order,
        status: task.status
      }));
      if (tasksToUpdate.length > 0) {
        reorderTasks(tasksToUpdate);
      }

      // Update the task status
      updateTaskStatus({ id: movedTask.id, status: destStatus });
    } else {
      // Moving within same status column - just reorder
      const statusArray = allTasks.filter(t => t.status === sourceStatus).sort((a, b) => a.order - b.order);

      const movedTask = statusArray[source.index];
      if (!movedTask) return;

      // Remove and reinsert
      statusArray.splice(source.index, 1);
      statusArray.splice(destination.index, 0, movedTask);

      // Update orders
      statusArray.forEach((task, index) => { task.order = index; });

      // Create updated all tasks
      const updatedAllTasks = allTasks.map(task => {
        if (task.status === sourceStatus) {
          const newIndex = statusArray.findIndex(t => t.id === task.id);
          return { ...task, order: newIndex };
        }
        return task;
      });

      // Update cache
      setTasksCache(() => updatedAllTasks);

      // Persist the order
      const tasksToUpdate = statusArray.map(task => ({
        id: task.id,
        order: task.order,
        status: task.status
      }));
      if (tasksToUpdate.length > 0) {
        reorderTasks(tasksToUpdate);
      }
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="App">
        <h1>Todo Application</h1>
        <InputField handleAdd={handleAdd} />
        <TodoList
          tasks={activeTasks}
          inProgressTasks={inProgressTasks}
          completedTasks={completedTasks}
          isLoading={isLoading}
          onDeleteTask={(id: string) => deleteTask(id)}
          onToggleTask={(id: string) => {
            // Find the task and move it to the next status
            const allTasks = [...activeTasks, ...inProgressTasks, ...completedTasks];
            const task = allTasks.find(t => t.id === id);
            if (task) {
              const nextStatus = task.status === 'active' ? 'in_progress' : task.status === 'in_progress' ? 'completed' : 'active';
              updateTaskStatus({ id, status: nextStatus });
            }
          }}
          onUpdateTask={(id: string, taskName: string) => updateTask({ id, taskName })}
        />
      </div>
    </DragDropContext>
  )
}

export default App
