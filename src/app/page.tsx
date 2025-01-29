"use client";
import { useState, useEffect } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { MdOutlineEdit } from "react-icons/md";

interface todo {
  id: number;
  name: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<todo[]>([]);
  const [todoName, setTodoName] = useState<string>("");
  const [error, setError] = useState("");

  useEffect(() => {
    const todos = localStorage.getItem("todos");
    if (todos) {
      setTodos(JSON.parse(todos));
    }
  }, []);

  const addTodo = () => {
    if (!todoName.length) {
      return setError("Please add a todo");
    };

    const newTodo = {
      id: Math.random(),
      name: todoName,
      completed: false
    };
    
    setTodos([...todos, newTodo]);
    localStorage.setItem("todos", JSON.stringify([...todos, newTodo]));
    setError("")
    setTodoName("");
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        addTodo();
      }
    };
  
    window.addEventListener('keydown', handleKeyPress);
  
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [todoName, todos]);

  const deleteTodo = (id: number) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos([...updatedTodos]);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const updateTodoStatus = (id: number) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return {
          ...todo,
          completed: !todo.completed
        }
      }
      return todo;
    })
    setTodos([...updatedTodos]);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  }
 
  return (
    <div className="m-auto w-1/2 pt-4 text-4xl">
      <div className="flex items-start mb-4">
        <div className="flex flex-col mr-4">
          <input
            className="mr-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Add Your Todo Here"
            value={todoName}
            onChange={((e) => setTodoName(e.target.value))}
          />
          {<p className="text-red-500 text-sm italic">{error}</p>}
        </div>
        <button
          onClick={addTodo}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add
        </button>
      </div>
      <div className="flex flex-col">
        {todos.map((todo) => (
          <div className="flex items-center" key={todo.id}>
            <input
              type="checkbox"
              onChange={() => {updateTodoStatus(todo.id)}}
              checked={todo.completed}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-2"
            />
            <p className={todo.completed ? 'text-decoration-line: line-through mr-2' : 'mr-2'}>
              {todo.name}
            </p>
            <button className="mr-2" onClick={() => deleteTodo(todo.id)}>
              <FaRegTrashCan size={20} />
            </button>
            {/* <button className="mr-2" onClick={() => deleteTodo(todo.id)}>
              <MdOutlineEdit size={20} />
            </button> */}
          </div>
        ))}
      </div>
    </div>
  );
}
