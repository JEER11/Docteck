
import React from "react";
import { BillingProvider } from "context/BillingContext";
import { NotificationProvider } from "context/NotificationContext";

export default function AppProviders({ children }) {
  return (
    <BillingProvider>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </BillingProvider>
  );
}
