import React from 'react'

interface todo {
    id: number;
    title: string;
    completed: boolean;    
};

const Todo = (todo) => {
  return (
    <div>
        <p>{todo.title}</p>
        <button>Delete</button>
    </div>
  )
}

export default Todo