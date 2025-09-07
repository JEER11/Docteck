import React, { createContext, useContext, useState } from "react";
import { auth } from "lib/firebase";
import { onTodos, addTodoDoc, deleteTodoDoc } from "lib/todoData";

const TodoContext = createContext();

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState([
    { type: "medicine", label: "Aspirin 100mg daily", date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
    { type: "appointment", label: "Schedule blood test", date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
  ]);

  const addTodo = async (todo) => {
    // Persist for signed-in users
    if (auth?.currentUser) {
      try { await addTodoDoc(todo); return; } catch(_) {}
    }
    setTodos((prev) => {
      const next = [...prev, todo];
      try { localStorage.setItem('todos', JSON.stringify(next)); } catch (_) {}
      return next;
    });
  };
  const removeTodo = async (idx) => {
    // If the item has an id and user is signed in, delete in Firestore
    if (auth?.currentUser && todos[idx]?.id) {
      try { await deleteTodoDoc(todos[idx].id); return; } catch(_) {}
    }
    setTodos((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      try { localStorage.setItem('todos', JSON.stringify(next)); } catch (_) {}
      return next;
    });
  };

  // Listen for assistant-triggered adds without touching UI
  React.useEffect(() => {
    const onAdd = async (e) => {
      const { text, date } = e.detail || {};
      if (!text) return;
      const todo = { type: 'note', label: text, date: date ? new Date(date) : undefined };
      if (auth?.currentUser) {
        try { await addTodoDoc(todo); return; } catch (_) {}
      }
      setTodos((prev) => {
        const next = [...prev, todo];
        try { localStorage.setItem('todos', JSON.stringify(next)); } catch (_) {}
        return next;
      });
    };
    window.addEventListener('assistant:add_todo', onAdd);
    // Drain queued
    try {
      const key = 'assistant_queue_add_todo';
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      if (Array.isArray(list)) list.forEach((p) => onAdd({ detail: p }));
      localStorage.removeItem(key);
    } catch (_) {}
    return () => window.removeEventListener('assistant:add_todo', onAdd);
  }, []);

  // Subscribe to Firestore when signed in; otherwise hydrate from localStorage
  React.useEffect(() => {
    if (auth?.currentUser) {
      const unsub = onTodos({}, (items) => {
        // normalize dates
        const mapped = items.map(t => ({ ...t, date: t.date ? new Date(t.date) : undefined }));
        setTodos(mapped);
      });
      return () => unsub && unsub();
    }
    try {
      const raw = localStorage.getItem('todos');
      const arr = raw ? JSON.parse(raw) : null;
      if (Array.isArray(arr)) setTodos(arr.map(t => ({ ...t, date: t.date ? new Date(t.date) : undefined })));
    } catch (_) {}
  }, []);

  return (
    <TodoContext.Provider value={{ todos, addTodo, removeTodo }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  return useContext(TodoContext);
}
