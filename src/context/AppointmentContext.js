import React, { createContext, useState, useContext, useEffect } from 'react';
import getApiBase from '../lib/apiBase';

const AppointmentContext = createContext();

export function AppointmentProvider({ children }) {
  const API = getApiBase();
  const [appointments, setAppointments] = useState([]);
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    // Load initial data
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

  const addAppointment = async (appointment) => {
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
      // fallback local add
      setAppointments(prev => [...prev, appointment]);
    }
  };

  const assignProvider = async (id, providerId) => {
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

  const getNextAppointment = () => {
    const now = new Date();
    return appointments
      .filter(app => app.start > now)
      .sort((a, b) => a.start - b.start)[0];
  };

  // Get appointments/tasks for a specific date
  const getAppointmentsForDate = (date) => {
    return appointments.filter(app => {
      const appDate = new Date(app.start);
      return appDate.toDateString() === date.toDateString();
    });
  };

  return (
    <AppointmentContext.Provider value={{ appointments, addAppointment, assignProvider, removeAppointment, providers, suggestSlots, getNextAppointment, selectedDate, setSelectedDate, getAppointmentsForDate }}>
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointments() {
  return useContext(AppointmentContext);
}
