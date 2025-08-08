import React, { createContext, useContext, useState, useEffect } from "react";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

const mockFetchNotifications = () => {
  // Simulate fetching notifications from backend or logic
  // In real app, replace with API call or websocket
  return [
    {
      id: 1,
      color: "success",
      image: (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: '12px',
            background: 'rgba(24,28,42,0.85)',
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
            border: '1.5px solid rgba(67,233,123,0.18)',
            transition: 'background 0.2s',
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.92 }}>
            <path d="M20 2H4C2.9 2 2 2.9 2 4V20L6 16H20C21.1 16 22 15.1 22 14V4C22 2.9 21.1 2 20 2Z" fill="#232a3b"/>
            <circle cx="8" cy="10" r="1.5" fill="#43e97b"/>
            <circle cx="12" cy="10" r="1.5" fill="#43e97b"/>
            <circle cx="16" cy="10" r="1.5" fill="#43e97b"/>
          </svg>
        </span>
      ),
      title: ["Doctor Message", "Dr. Smith sent you a message"],
      date: "13 minutes ago",
    },
    {
      id: 2,
      color: "info",
      image: (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: '12px',
            background: 'rgba(24,28,42,0.85)',
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
            border: '1.5px solid rgba(33,203,243,0.18)',
            transition: 'background 0.2s',
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.92 }}>
            <rect x="3" y="4" width="18" height="18" rx="4" fill="#232a3b"/>
            <path d="M7 10H17V12H7V10ZM7 14H14V16H7V14Z" fill="#2196f3"/>
          </svg>
        </span>
      ),
      title: ["Appointment", "Tomorrow at 10:00 AM"],
      date: "in 1 day",
    },
    {
      id: 3,
      color: "warning",
      image: (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: '12px',
            background: 'rgba(24,28,42,0.85)',
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
            border: '1.5px solid rgba(255,179,0,0.18)',
            transition: 'background 0.2s',
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.92 }}>
            <rect x="3" y="4" width="18" height="18" rx="4" fill="#232a3b"/>
            <path d="M7 14H17V16H7V14ZM7 10H17V12H7V10Z" fill="#ffb300"/>
          </svg>
        </span>
      ),
      title: ["Payment", "Bill due in 3 days"],
      date: "3 days left",
    },
    {
      id: 4,
      color: "success",
      image: (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: '12px',
            background: 'rgba(24,28,42,0.85)',
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
            border: '1.5px solid rgba(67,233,123,0.18)',
            transition: 'background 0.2s',
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.92 }}>
            <path d="M20 2H4C2.9 2 2 2.9 2 4V20L6 16H20C21.1 16 22 15.1 22 14V4C22 2.9 21.1 2 20 2Z" fill="#232a3b"/>
            <circle cx="8" cy="10" r="1.5" fill="#43e97b"/>
            <circle cx="12" cy="10" r="1.5" fill="#43e97b"/>
            <circle cx="16" cy="10" r="1.5" fill="#43e97b"/>
          </svg>
        </span>
      ),
      title: ["Doctor Message", "Dr. Patel sent you a message"],
      date: "2 hours ago",
    },
    {
      id: 5,
      color: "info",
      image: (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: '12px',
            background: 'rgba(24,28,42,0.85)',
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
            border: '1.5px solid rgba(33,203,243,0.18)',
            transition: 'background 0.2s',
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.92 }}>
            <rect x="3" y="4" width="18" height="18" rx="4" fill="#232a3b"/>
            <path d="M7 10H17V12H7V10ZM7 14H14V16H7V14Z" fill="#2196f3"/>
          </svg>
        </span>
      ),
      title: ["Appointment", "Annual checkup next week"],
      date: "6 days left",
    },
  ];
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Simulate fetching notifications
    setNotifications(mockFetchNotifications());
  }, []);

  // In real app, add logic to update notifications on events

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
