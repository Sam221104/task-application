import type { Todo } from "../model/model";
import SingleTask from "./SingleTask";
import './styles.css'
import { Droppable } from "@hello-pangea/dnd";
import React from "react";

type TodoListProps = {
  tasks: Todo[];
  inProgressTasks: Todo[];
  completedTasks: Todo[];
  isLoading: boolean;
  onDeleteTask: (id: string) => void;
  onToggleTask: (id: string) => void;
  onUpdateTask: (id: string, taskName: string) => void;
};

const TodoList = React.memo(({
  tasks,
  inProgressTasks,
  completedTasks,
  isLoading,
  onDeleteTask,
  onToggleTask,
  onUpdateTask,
}: TodoListProps) => {
  return (
    <div className="three-column-layout">
      <Droppable droppableId="ActiveTasks">
        {(provided) => (
          <div className="todo-list active" ref={provided.innerRef} {...provided.droppableProps}>
            <div className="column-header">
              <span className="column-title">Active Tasks</span>
              <span className="task-count">{tasks.length}</span>
            </div>
            <div className={`task-container ${tasks.length > 5 ? 'scrollable' : ''}`}>
              {isLoading ? (
                <div className="loading-message">Loading...</div>
              ) : tasks.length === 0 ? (
                <div className="no-tasks-message">No tasks found</div>
              ) : (
                tasks.map((task, index) => (
                  <SingleTask
                    index={index}
                    key={task.id}
                    task={task}
                    onDelete={(id) => onDeleteTask(id)}
                    onToggle={(id) => onToggleTask(id)}
                    onUpdate={(id, taskName) => onUpdateTask(id, taskName)}
                  />
                ))
              )}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
      
      <Droppable droppableId="InProgressTasks">
        {(provided) => (
          <div className="todo-list in-progress" ref={provided.innerRef} {...provided.droppableProps}>
            <div className="column-header">
              <span className="column-title">In Progress</span>
              <span className="task-count">{inProgressTasks.length}</span>
            </div>
            <div className={`task-container ${inProgressTasks.length > 5 ? 'scrollable' : ''}`}>
              {isLoading ? (
                <div className="loading-message">Loading...</div>
              ) : inProgressTasks.length === 0 ? (
                <div className="no-tasks-message">No tasks found</div>
              ) : (
                inProgressTasks.map((task, index) => (
                  <SingleTask
                    index={index}
                    key={task.id}
                    task={task}
                    onDelete={(id) => onDeleteTask(id)}
                    onToggle={(id) => onToggleTask(id)}
                    onUpdate={(id, taskName) => onUpdateTask(id, taskName)}
                  />
                ))
              )}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
      
      <Droppable droppableId="CompletedTasks">
        {(provided) => (
          <div className="todo-list completed" ref={provided.innerRef} {...provided.droppableProps}>
            <div className="column-header">
              <span className="column-title">Completed Tasks</span>
              <span className="task-count">{completedTasks.length}</span>
            </div>
            <div className={`task-container ${completedTasks.length > 5 ? 'scrollable' : ''}`}>
              {isLoading ? (
                <div className="loading-message">Loading...</div>
              ) : completedTasks.length === 0 ? (
                <div className="no-tasks-message">No tasks found</div>
              ) : (
                completedTasks.map((task, index) => (
                  <SingleTask
                    key={task.id}
                    index={index}
                    task={task}
                    onDelete={(id) => onDeleteTask(id)}
                    onToggle={(id) => onToggleTask(id)}
                    onUpdate={(id, taskName) => onUpdateTask(id, taskName)}
                  />
                ))
              )}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    </div>
  );
});

export default React.memo(TodoList);
