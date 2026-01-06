// import React from 'react'
import { Button } from '@/components/ui/button'
import './styles.css'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'

type FormInputs = {
  todo: string
}

type InputProps = {
  handleAdd: (todo: string) => void
}

const InputField = ({ handleAdd }: InputProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormInputs>({
    defaultValues: {
      todo: ''
    }
  })

  const onSubmit = (data: FormInputs) => {
    if (data.todo.trim()) {
      handleAdd(data.todo.trim())
      reset() // Clears the form after submit
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='container'>

        <Input
          type="text"
          {...register('todo', {
            required: 'Task is required',
            minLength: {
              value: 3,
              message: 'Task must be at least 3 characters'
            },
            maxLength: {
              value: 100,
              message: 'Task must be less than 100 characters'
            }
          })}
          placeholder="Enter a task"
        />
        
        <Button type="submit" className='button-input'>Add Task</Button>
        <div>
          {errors.todo && (
          <span style={{ color: 'red', fontSize: '12px' }}>
            {errors.todo.message}
          </span>
        )}
        </div>
      </div>
    </form>
  )
}

export default InputField
