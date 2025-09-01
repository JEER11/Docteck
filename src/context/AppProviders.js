
import React from "react";
import { BillingProvider } from "context/BillingContext";
import { NotificationProvider } from "context/NotificationContext";
import { AppointmentProvider } from "context/AppointmentContext";

export default function AppProviders({ children }) {
  return (
    <AppointmentProvider>
      <BillingProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </BillingProvider>
    </AppointmentProvider>
  );
}
