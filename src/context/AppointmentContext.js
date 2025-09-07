import React, { createContext, useState, useContext, useEffect } from 'react';
import getApiBase from '../lib/apiBase';
import { onAppointments as onAppts, addAppointment as addAppt, updateAppointment as updAppt, deleteAppointment as delAppt } from '../lib/appointmentsData';
import { auth } from '../lib/firebase';
import { useTodos } from './TodoContext';
import { onPrescriptions } from '../lib/caringHubData';

const AppointmentContext = createContext();

export function AppointmentProvider({ children }) {
  const API = getApiBase();
  const [appointments, setAppointments] = useState([]);
  const [providers, setProviders] = useState([]);
  // Also project todos and prescription pickups into calendar events (read-only overlays)
  const { todos = [] } = useTodos?.() || {};
  const [rxDates, setRxDates] = useState([]); // prescriptions overlay

  useEffect(() => {
    // Prefer per-user Firestore persistence when auth is configured
    if (auth && auth.currentUser) {
      const unsub = onAppts({}, (items) => setAppointments(items));
      // Still load providers from API if available
      (async () => {
        try {
          const pr = await fetch(`${API}/api/providers`).then(r => r.json());
          if (pr?.ok && Array.isArray(pr.providers)) setProviders(pr.providers);
        } catch (_) {}
      })();
      return () => unsub && unsub();
    }
    // Fallback to existing API-based loading if no auth
    (async () => {
      try {
        const [ap, pr] = await Promise.all([
          fetch(`${API}/api/appointments`).then(r => r.json()),
          fetch(`${API}/api/providers`).then(r => r.json())
        ]);
        if (ap?.ok && Array.isArray(ap.appointments)) setAppointments(ap.appointments.map(a => ({ ...a, start: new Date(a.start), end: new Date(a.end) })));
        if (pr?.ok && Array.isArray(pr.providers)) setProviders(pr.providers);
      } catch (_) {}
    })();
  }, [API]);
  // Add global selectedDate state
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Project To-do's (with dates) into the calendar view as read-only pseudo-appointments
  const todoAsAppointments = React.useMemo(() => {
    try {
      return (Array.isArray(todos) ? todos : [])
        .filter(t => t && t.date)
        .map((t, idx) => ({
          id: `todo-${idx}-${new Date(t.date).toISOString()}`,
          title: t.label || t.text || 'Task',
          start: new Date(t.date),
          end: new Date(new Date(t.date).getTime() + 30 * 60000),
          source: 'todo',
          task: t.label || t.text
        }));
    } catch (_) { return []; }
  }, [todos]);

  // Read prescriptions from Firestore if signed in; else from localStorage
  useEffect(() => {
    if (auth && auth.currentUser) {
      const unsub = onPrescriptions({}, (items) => setRxDates(items));
      return () => unsub && unsub();
    }
    try {
      const raw = localStorage.getItem('prescriptions');
      const list = raw ? JSON.parse(raw) : null;
      if (Array.isArray(list)) setRxDates(list);
    } catch (_) { setRxDates([]); }
  }, []);
  const rxAsAppointments = React.useMemo(() => {
    try {
      return (Array.isArray(rxDates) ? rxDates : [])
        .filter(r => r && r.date)
        .map((r, idx) => ({
          id: `rx-${idx}-${r.date}`,
          title: r.medicine ? `Pick up: ${r.medicine}` : 'Prescription pick-up',
          start: new Date(r.date),
          end: new Date(new Date(r.date).getTime() + 30 * 60000),
          source: 'prescription',
        }));
    } catch (_) { return []; }
  }, [rxDates]);

  const addAppointment = async (appointment) => {
  if (auth && auth.currentUser) {
      try {
        await addAppt({
          title: appointment.title,
          start: appointment.start,
          end: appointment.end,
          providerId: appointment.providerId || null,
          location: appointment.location || '',
          reason: appointment.reason || '',
          details: appointment.details || ''
        });
        return;
      } catch (_) {}
    }
    // Fallback to existing API
    try {
      const payload = {
        title: appointment.title,
        start: appointment.start instanceof Date ? appointment.start.toISOString() : appointment.start,
        end: appointment.end instanceof Date ? appointment.end.toISOString() : appointment.end,
        providerId: appointment.providerId || null,
        location: appointment.location || '',
        reason: appointment.reason || '',
        details: appointment.details || ''
      };
      const res = await fetch(`${API}/api/appointments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data?.ok && data.appointment) {
        const a = data.appointment;
        setAppointments(prev => [...prev, { ...a, start: new Date(a.start), end: new Date(a.end) }]);
      }
    } catch (_) {
      setAppointments(prev => [...prev, appointment]);
    }
  };

  // Assistant-triggered appointment add
  React.useEffect(() => {
    const onAddAppt = async (e) => {
      try {
        const d = e.detail || {};
        // Parse start time; fallback to now
        let start = d.startTime ? new Date(d.startTime) : new Date();
        if (isNaN(start.getTime())) start = new Date();
        const end = new Date(start.getTime() + (Number(d.durationMinutes) || 30) * 60000);
        const payload = {
          title: d.title || d.doctor || 'Appointment',
          start,
          end,
          providerId: null,
          location: d.location || d.hospital || '',
          reason: '',
          details: ''
        };
        await addAppointment(payload);
      } catch (_) {}
    };
    window.addEventListener('assistant:add_appointment', onAddAppt);
    // Drain queued
    try {
      const raw = localStorage.getItem('assistant_queue_add_appointment');
      const list = JSON.parse(raw || '[]');
      if (Array.isArray(list)) list.forEach((p) => onAddAppt({ detail: p }));
      localStorage.removeItem('assistant_queue_add_appointment');
    } catch (_) {}
    return () => window.removeEventListener('assistant:add_appointment', onAddAppt);
  }, []);

  const assignProvider = async (id, providerId) => {
    if (auth && auth.currentUser) {
      try { await updAppt({ id, patch: { providerId } }); return; } catch (_) {}
    }
    try {
      const res = await fetch(`${API}/api/appointments/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ providerId }) });
      const data = await res.json();
      if (data?.ok && data.appointment) {
        const a = data.appointment;
        setAppointments(prev => prev.map(x => x.id === id ? { ...a, start: new Date(a.start), end: new Date(a.end) } : x));
      }
    } catch (_) {}
  };

  const removeAppointment = async (id) => {
    if (auth && auth.currentUser) {
      try { await delAppt({ id }); return; } catch (_) {}
    }
    try { await fetch(`${API}/api/appointments/${id}`, { method: 'DELETE' }); } catch (_) {}
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const suggestSlots = async (providerId, date, durationMinutes = 30) => {
    try {
      const r = await fetch(`${API}/api/appointments/suggest`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ providerId, date, durationMinutes }) });
      const j = await r.json();
      if (j?.ok) return j.slots || [];
    } catch (_) {}
    return [];
  };

  // Save a provider (e.g., from external search) and update local providers list
  const addProvider = async (provider) => {
    try {
      const res = await fetch(`${API}/api/providers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(provider)
      });
      const data = await res.json();
      if (data?.ok && data.provider) {
        setProviders(prev => {
          const exists = prev.some(p => (p.id && p.id === data.provider.id) || (p.npi && data.provider.npi && String(p.npi) === String(data.provider.npi)));
          return exists ? prev : [...prev, data.provider];
        });
        return data.provider;
      }
    } catch (_) {}
    return null;
  };

  const getNextAppointment = () => {
    const now = new Date();
    return appointments
      .filter(app => app.start > now)
      .sort((a, b) => a.start - b.start)[0];
  };

  // Get appointments/tasks for a specific date
  const getAppointmentsForDate = (date) => {
  // Merge core appointments with overlays (todo + rx) for display
  const merged = [...appointments, ...todoAsAppointments, ...rxAsAppointments];
  return merged.filter(app => {
      const appDate = new Date(app.start);
      return appDate.toDateString() === date.toDateString();
    });
  };

  return (
  <AppointmentContext.Provider value={{ appointments, addAppointment, assignProvider, removeAppointment, providers, suggestSlots, addProvider, getNextAppointment, selectedDate, setSelectedDate, getAppointmentsForDate }}>
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointments() {
  return useContext(AppointmentContext);
}
