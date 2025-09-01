
import React from "react";
import { BillingProvider } from "context/BillingContext";
import { NotificationProvider } from "context/NotificationContext";
import { AppointmentProvider } from "context/AppointmentContext";
import { TodoProvider } from "context/TodoContext";

export default function AppProviders({ children }) {
  return (
    <AppointmentProvider>
      <BillingProvider>
        <NotificationProvider>
          <TodoProvider>
            {children}
          </TodoProvider>
        </NotificationProvider>
      </BillingProvider>
    </AppointmentProvider>
  );
}
