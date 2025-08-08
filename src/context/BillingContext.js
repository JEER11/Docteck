import React, { createContext, useContext, useState } from "react";

// Example initial data for demo purposes
const initialPayments = [
  {
    type: 'insurance',
    name: 'Blue Cross Insurance',
    description: 'Paid monthly premium',
    value: -120,
    date: '2025-07-02T09:00:00',
    cardId: '7812 2139 0823 7916',
  },
  {
    type: 'pharmacy',
    name: 'CVS Pharmacy',
    description: 'Atorvastatin 20mg',
    value: -45,
    date: '2025-07-01T10:30:00',
    cardId: '7812 2139 0823 7916',
  },
  {
    type: 'prescription',
    name: 'Walgreens',
    description: 'Lisinopril 10mg',
    value: -30,
    date: '2025-07-01T11:00:00',
    cardId: '7812 2139 0823 7916',
  },
  {
    type: 'appointment',
    name: 'Dr. Smith',
    description: 'General Checkup',
    value: -80,
    date: '2025-06-30T14:00:00',
    cardId: '7812 2139 0823 7916',
  },
  {
    type: 'appointment',
    name: 'Dr. Lee',
    description: 'Dermatology Visit',
    value: -100,
    date: '2025-06-28T13:00:00',
    cardId: '7812 2139 0823 7916',
  },
];

const initialCards = [
  {
    cardId: '7812 2139 0823 7916',
    name: 'Vision UI',
    validThru: '05/24',
    cvv: '09X',
    type: 'Mastercard',
  },
];

const BillingContext = createContext();

export function BillingProvider({ children }) {
  const [payments, setPayments] = useState(initialPayments);
  const [cards, setCards] = useState(initialCards);

  // Add a new card
  const addCard = (card) => setCards((prev) => [...prev, card]);

  // Add a new payment (simulate a real transaction)
  const addPayment = (payment) => setPayments((prev) => [payment, ...prev]);

  return (
    <BillingContext.Provider value={{ payments, cards, addCard, addPayment }}>
      {children}
    </BillingContext.Provider>
  );
}

export function useBilling() {
  return useContext(BillingContext);
}
