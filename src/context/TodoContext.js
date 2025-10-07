import React, { createContext, useContext, useState, useRef } from "react";
import { auth } from "lib/firebase";
import { onTodos, addTodoDoc, deleteTodoDoc, isTodosAvailable } from "lib/todoData";

const TodoContext = createContext();

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState([]);
  const latestTodosRef = useRef([]);
  const [hydrated, setHydrated] = useState(false);
  const [remoteDisabled, setRemoteDisabled] = useState(false);

  const syncLatest = (next) => { latestTodosRef.current = next; setTodos(next); };

  // Hydration
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('todos');
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length) {
          const mapped = arr.map(t => ({ 
            ...t, 
            date: t.date ? new Date(t.date) : undefined,
            status: t.status || 'ongoing' // Add default status for existing todos
          }));
          syncLatest(mapped);
          setHydrated(true);
          return;
        }
      }
      const seed = [
        { id: `local_${Date.now()}_seed1`, type: 'medicine', label: 'Aspirin 100mg daily', date: new Date(Date.now()+2*86400000), status: 'ongoing' },
        { id: `local_${Date.now()}_seed2`, type: 'appointment', label: 'Schedule blood test', date: new Date(Date.now()+5*86400000), status: 'ongoing' }
      ];
      syncLatest(seed);
      localStorage.setItem('todos', JSON.stringify(seed));
    } catch(_) {}
    setHydrated(true);
  }, []);

  const persist = (arr) => { try { localStorage.setItem('todos', JSON.stringify(arr)); } catch(_) {} };

  // addTodo(todo, options) - options.forceLocal: skip remote persistence and add locally immediately
  const addTodo = async (todo, options = {}) => {
    const forceLocal = Boolean(options.forceLocal);
    if (!todo.label || !todo.label.trim()) todo = { ...todo, label: `New ${todo.type ? (todo.type[0].toUpperCase()+todo.type.slice(1)) : 'Task'}` };
    if (!todo.id) todo = { ...todo, id: `local_${Date.now()}_${Math.random().toString(36).slice(2,8)}` };
    if (!todo.status) todo = { ...todo, status: 'ongoing' }; // Default status is ongoing
    // optimistic
    syncLatest([...latestTodosRef.current, todo]);
    persist([...latestTodosRef.current]);
    if (!forceLocal && !remoteDisabled && auth?.currentUser) {
      try {
        const res = await addTodoDoc(todo);
        if (res && res.id) {
          const replaced = latestTodosRef.current.map(t => t.id === todo.id ? { ...res } : t);
          syncLatest(replaced);
          persist(replaced);
        }
      } catch (err) {
        // keep optimistic; if auth/permission error mark remote disabled
        if (String(err?.code||'').includes('permission') || String(err).includes('Missing')) setRemoteDisabled(true);
      }
    }
  };
  
  const updateTodoStatus = async (idx, newStatus) => {
    const arr = [...latestTodosRef.current];
    const target = arr[idx];
    if (!target) return;
    
    const updatedTodo = { ...target, status: newStatus };
    arr[idx] = updatedTodo;
    
    syncLatest(arr);
    persist(arr);
    
    // TODO: Add remote persistence for status updates if needed
  };
  
  const removeTodo = async (idx) => {
    const arr = [...latestTodosRef.current];
    const target = arr[idx];
    if (!target) return;
    // attempt remote delete only if target has real id (not local_) and remote enabled
    if (!target.id?.startsWith('local_') && !remoteDisabled && auth?.currentUser) {
      try { await deleteTodoDoc(target.id); } catch(_) {}
    }
    const next = arr.filter((_, i) => i !== idx);
    syncLatest(next);
    persist(next);
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

  // Firestore subscription
  React.useEffect(() => {
    if (!hydrated || remoteDisabled) return;
    if (!isTodosAvailable()) return; // user not ready
    const unsub = onTodos({}, (items) => {
      const mapped = items.map(t => ({ 
        ...t, 
        date: t.date ? new Date(t.date) : undefined,
        status: t.status || 'ongoing' // Add default status for remote todos
      }));
      const current = latestTodosRef.current;
      if (mapped.length === 0 && current.length > 0) return; // don't wipe
      // merge optimistic locals not yet in remote
      const optimistic = current.filter(t => t.id?.startsWith('local_') && !mapped.some(r => r.label === t.label));
      const merged = [...mapped, ...optimistic];
      syncLatest(merged);
      persist(merged);
    }, (err) => {
      // On 400 or permission errors disable remote so local persists
      const msg = String(err?.message || err || '');
      if (msg.includes('403') || msg.includes('permission') || msg.includes('Missing') || msg.includes('400')) {
        setRemoteDisabled(true);
      }
    });
    return () => unsub && unsub();
  }, [hydrated, remoteDisabled]);

  // If Firestore keeps throwing 400s, we rely purely on local state (remoteDisabled=true)
  // Expose the reactive state array (todos) so components re-render properly.
  return (
    <TodoContext.Provider value={{ todos, addTodo, removeTodo, updateTodoStatus, remoteDisabled }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodos() {
  return useContext(TodoContext);
}
