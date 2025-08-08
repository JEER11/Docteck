import React, { createContext, useState, useContext } from 'react';

const AppointmentContext = createContext();

export function AppointmentProvider({ children }) {
  const [appointments, setAppointments] = useState([
    {
      title: "Sample Appointment",
      start: new Date(),
      end: new Date(),
      allDay: false,
      task: "Sample Task"
    }
  ]);
  // Add global selectedDate state
  const [selectedDate, setSelectedDate] = useState(new Date());

  const addAppointment = (appointment) => {
    setAppointments([...appointments, appointment]);
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
    <AppointmentContext.Provider value={{ appointments, addAppointment, getNextAppointment, selectedDate, setSelectedDate, getAppointmentsForDate }}>
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointments() {
  return useContext(AppointmentContext);
}
