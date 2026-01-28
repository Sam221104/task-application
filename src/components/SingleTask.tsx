import './styles.css'
import type { Todo } from "../model/model";
import React from 'react';
import { CiEdit } from "react-icons/ci";
import { RxCrossCircled } from "react-icons/rx";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { useEffect, useRef, useState } from 'react';
import { Draggable } from "@hello-pangea/dnd";

type SingleTaskProps = {
  task: Todo;
  index: number;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onUpdate: (id: string, taskName: string) => void;
};

const SingleTask = ({ index, task, onDelete, onToggle, onUpdate }: SingleTaskProps) => {
  const [edit, setEdit] = useState<boolean>(false)
  const [editTodo, setEditTodo] = useState<string>(task.taskName)
  
  const handleEdit = (e: React.FormEvent) => { 
    e.preventDefault()
    if (editTodo.trim() && editTodo !== task.taskName) {
      onUpdate(task.id, editTodo.trim())
    }
    setEdit(false)
  }

  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    inputRef.current?.focus()
  }, [edit])

  return (
    <Draggable draggableId={task.id?.toString() || String(Math.random())} index={index}>
      {(provided) => (
        <form 
          className="todo-single" 
          onSubmit={handleEdit}  // No need to pass id anymore
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        > 
    {edit ? (
      <input 
      ref = {inputRef}
      type = "text"
      value={editTodo}
      onChange={(e) => setEditTodo(e.target.value)}
      />
    ) : (
      <>
      {task.completed?(
        <s className='todo-single-text'>{task.taskName}</s> )
        : (
          <span className='todo-single-text'>{task.taskName}</span>

        )
      }
      </>
    )}
      
      <div>
        <span className='icon' onClick={() => {
            if (!edit && !task.completed) {
              setEdit(!edit)
            }
        }}>
          <CiEdit />
        </span>
        <span className='icon' onClick={() => onDelete(task.id)}>
          <RxCrossCircled />
        </span>
        {task.completed ? null : (
        <span className='icon' onClick={() => onToggle(task.id)}>
          <IoIosCheckmarkCircleOutline />
        </span>
        )}
      </div>
    </form>
      )}
    </Draggable>
  )
}

export default React.memo(SingleTask);
