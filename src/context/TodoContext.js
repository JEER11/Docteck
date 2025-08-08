import React, { createContext, useContext, useState } from "react";

const TodoContext = createContext();

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState([
    { type: "medicine", label: "Aspirin 100mg daily", date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
    { type: "appointment", label: "Schedule blood test", date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
  ]);

  const addTodo = (todo) => setTodos((prev) => [...prev, todo]);
  const removeTodo = (idx) => setTodos((prev) => prev.filter((_, i) => i !== idx));

  return (
    <TodoContext.Provider value={{ todos, addTodo, removeTodo }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  return useContext(TodoContext);
}
