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
    console.log('Drag ended:', result);
    const { source, destination } = result;
    if (!destination) {
      console.log('No destination, returning');
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      console.log('Same position, returning');
      return;
    }

    const sourceIsActive = source.droppableId === "TasksList";
    const destIsActive = destination.droppableId === "TasksList";
    
    const sourceTasks = sourceIsActive ? activeTasks : completedTasks;
    const destTasks = destIsActive ? activeTasks : completedTasks;
    
    console.log('Source tasks:', sourceTasks);
    console.log('Dest tasks:', destTasks);
    
    const item = sourceTasks[source.index];
    if (!item) {
      console.log('No item found at source index');
      return;
    }

    console.log('Moving item:', item);

    // If moving between different lists (active <-> completed)
    if (source.droppableId !== destination.droppableId) {
      console.log('Moving between different lists');
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
      
      console.log('Tasks to update (cross-list):', tasksToUpdate);
      
      if (reorderTasks) {
        reorderTasks(tasksToUpdate);
      }
    } else {
      // Moving within the same list
      console.log('Moving within same list');
      const newTasks = [...sourceTasks];
      const [movedItem] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, movedItem);
      
      const tasksToUpdate = newTasks.map((task, index) => ({
        id: task.id,
        order: index,
        completed: task.completed
      }));
      
      console.log('Tasks to update (same list):', tasksToUpdate);
      console.log('Current task orders before update:', newTasks.map(t => ({ id: t.id, currentOrder: t.order, newOrder: newTasks.indexOf(t) })));
      
      if (reorderTasks) {
        console.log('Calling reorderTasks');
        reorderTasks(tasksToUpdate);
      } else {
        console.log('reorderTasks is not available');
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
