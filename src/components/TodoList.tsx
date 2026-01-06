import type { Todo } from "../model/model";
import SingleTask from "./SingleTask";
import './styles.css'
import { Droppable } from "@hello-pangea/dnd";
import SplitScreen from "./SplitScreenLayout";

type TodoListProps = {
  tasks: Todo[];
  completedTasks: Todo[];
  onDeleteTask: (id: string) => void;
  onToggleTask: (id: string) => void;
  onUpdateTask: (id: string, taskName: string) => void;
};

const TodoList = ({
  tasks,
  completedTasks,
  onDeleteTask,
  onToggleTask,
  onUpdateTask,
}: TodoListProps) => {
  return (
    <SplitScreen
      left={
        <Droppable droppableId="TasksList">
          {(provided) => (
            <div className="todo-list" ref={provided.innerRef} {...provided.droppableProps}>
              <span>Active Tasks</span>
              {tasks.map((task, index) => (
                <SingleTask
                  index={index}
                  key={task.id}
                  task={task}
                  onDelete={(id) => onDeleteTask(id)}
                  onToggle={(id) => onToggleTask(id)}
                  onUpdate={(id, taskName) => onUpdateTask(id, taskName)}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      }
      right={
        <Droppable droppableId="CompletedTasks">
          {(provided) => (
            <div className="todo-list remove" ref={provided.innerRef} {...provided.droppableProps}>
              <span>Completed Tasks</span>
              {completedTasks.map((task, index) => (
                <SingleTask
                  key={task.id}
                  index={index}
                  task={task}
                  onDelete={(id) => onDeleteTask(id)}
                  onToggle={(id) => onToggleTask(id)}
                  onUpdate={(id, taskName) => onUpdateTask(id, taskName)}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      }
    />
  );
};

export default TodoList;
