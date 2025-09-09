import React, { createContext, useContext, useState } from "react";
import { auth } from "lib/firebase";
import { onTodos, addTodoDoc, deleteTodoDoc, isTodosAvailable } from "lib/todoData";

const TodoContext = createContext();

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState([
    { type: "medicine", label: "Aspirin 100mg daily", date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
    { type: "appointment", label: "Schedule blood test", date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
  ]);

  // Ensure initial todos are persisted locally so reloads keep them when Firestore unavailable
  React.useEffect(() => {
    try {
      const key = 'todos';
      const raw = localStorage.getItem(key);
      if (!raw) localStorage.setItem(key, JSON.stringify(todos));
    } catch (_) {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // addTodo(todo, options) - options.forceLocal: skip remote persistence and add locally immediately
  const addTodo = async (todo, options = {}) => {
    try { console.debug && console.debug('[TodoContext] addTodo called', todo, options); } catch(_) {}
    const forceLocal = Boolean(options.forceLocal);
    // Persist for signed-in users unless forceLocal requested
    if (!forceLocal && auth?.currentUser) {
      try {
        const res = await addTodoDoc(todo);
        // If the server returned a created doc, we're done. Otherwise fall back to local state.
        if (res) {
          try { console.debug && console.debug('[TodoContext] addTodo: remote add succeeded', res); } catch(_) {}
          return;
        }
      } catch(_) {}
    }
    setTodos((prev) => {
      const next = [...prev, todo];
      try { console.debug && console.debug('[TodoContext] addTodo: falling back to local, new todos length', next.length); } catch(_) {}
      try { localStorage.setItem('todos', JSON.stringify(next)); } catch (_) {}
      return next;
    });
  };
  const removeTodo = async (idx) => {
    try { console.debug && console.debug('[TodoContext] removeTodo called', idx, todos[idx]); } catch(_) {}
    // If the item has an id and user is signed in, delete in Firestore
    if (auth?.currentUser && todos[idx]?.id) {
      try {
        const ok = await deleteTodoDoc(todos[idx].id);
        if (ok) return;
      } catch(_) {}
    }
    setTodos((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      try { console.debug && console.debug('[TodoContext] removeTodo: removed locally, new length', next.length); } catch(_) {}
      try { localStorage.setItem('todos', JSON.stringify(next)); } catch (_) {}
      return next;
    });
  };

  // Listen for assistant-triggered adds without touching UI
  React.useEffect(() => {
    const onAdd = async (e) => {
      const { text, date } = e.detail || {};
      try { console.debug && console.debug('[TodoContext] assistant onAdd event', e.detail); } catch(_) {}
      if (!text) return;
      const todo = { type: 'note', label: text, date: date ? new Date(date) : undefined };
      if (auth?.currentUser) {
        try {
          const res = await addTodoDoc(todo);
          if (res) return;
        } catch (_) {}
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

  // Subscribe to Firestore when it's actually available; otherwise hydrate from localStorage
  React.useEffect(() => {
    const useRemote = isTodosAvailable();
    if (useRemote) {
      const unsub = onTodos({}, (items) => {
        // normalize dates
        const mapped = items.map(t => ({ ...t, date: t.date ? new Date(t.date) : undefined }));
        try {
          // If remote returned no items but we have local items saved, avoid wiping them.
          const raw = localStorage.getItem('todos');
          const localArr = raw ? JSON.parse(raw) : null;
          if (Array.isArray(mapped) && mapped.length === 0 && Array.isArray(localArr) && localArr.length > 0) {
            // keep local list
            return;
          }
        } catch (_) {}
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
