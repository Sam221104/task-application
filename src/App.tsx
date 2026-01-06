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
    toggleTask
  } = useTodos()

  const handleAdd = (todo: string) => {
    addTask({ taskName: todo })
  }

  const onDragEnd = (result: DropResult) => { //dropresult provides source and destination of the dragged item and other info like draggableId, mode etc.
    const { source, destination } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    const fromActive = source.droppableId === "TasksList";
    const item = fromActive
      ? activeTasks[source.index]
      : completedTasks[source.index];

    if (item) {
      //toggle the completed status
      toggleTask({
        id: item.id,
        completed: destination.droppableId === "CompletedTasks",
      });
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
