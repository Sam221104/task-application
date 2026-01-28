import './components/styles.css'
import InputField from './components/InputField'
import TodoList from './components/TodoList'
import { useTodos } from './hooks/useTodos'
import { DragDropContext, type DropResult } from "@hello-pangea/dnd"

function App() {
  const { 
    activeTasks, 
    completedTasks,
    addTask, 
    deleteTask, 
    updateTask, 
    toggleTask,
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

    const sourceIsActive = source.droppableId === "TasksList";
    const destIsActive = destination.droppableId === "TasksList";
    
    const sourceTasks = sourceIsActive ? activeTasks : completedTasks;
    const destTasks = destIsActive ? activeTasks : completedTasks;
    
    const item = sourceTasks[source.index];
    if (!item) return;

    // If moving between different lists (active <-> completed)
    if (source.droppableId !== destination.droppableId) {
      const newCompleted = destination.droppableId === "CompletedTasks";
      
      // Remove from source
      const newSourceTasks = [...sourceTasks];
      newSourceTasks.splice(source.index, 1);
      
      // Add to destination
      const newDestTasks = [...destTasks];
      const updatedItem = { ...item, completed: newCompleted };
      newDestTasks.splice(destination.index, 0, updatedItem);
      
      // Create reorder payload for both lists
      const tasksToUpdate = [
        ...newSourceTasks.map((task, index) => ({ 
          id: task.id, 
          order: index, 
          completed: task.completed 
        })),
        ...newDestTasks.map((task, index) => ({ 
          id: task.id, 
          order: index, 
          completed: task.id === item.id ? newCompleted : task.completed 
        }))
      ];
      
      if (reorderTasks) {
        reorderTasks(tasksToUpdate);
      }
    } else {
      // Moving within the same list
      const newTasks = [...sourceTasks];
      const [movedItem] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, movedItem);
      
      const tasksToUpdate = newTasks.map((task, index) => ({
        id: task.id,
        order: index,
        completed: task.completed
      }));
      
      if (reorderTasks) {
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
          completedTasks={completedTasks}
          onDeleteTask={(id) => deleteTask(id)}
          onToggleTask={(id) => toggleTask({ id, completed: true })}
          onUpdateTask={(id, taskName) => updateTask({ id, taskName })}
        />
      </div>
    </DragDropContext>
  )
}

export default App