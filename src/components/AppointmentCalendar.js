import React, { useState } from "react";
import {
  Card,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Snackbar,
  Alert
} from "@mui/material";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAppointments } from "../context/AppointmentContext";
import { useTodos } from "../context/TodoContext";
import { onPrescriptions } from "lib/caringHubData";
import { auth } from "lib/firebase";
import AddIcon from "@mui/icons-material/Add";
import AppointmentDialog from "./AppointmentDialog";
import CalendarToolbar from "./CalendarToolbar";

const localizer = momentLocalizer(moment);

function AppointmentCalendar() {
  // Defensive: fallback to empty object if context is undefined
  const context = useAppointments() || {};
  const appointments = React.useMemo(() => 
    Array.isArray(context.appointments) ? context.appointments : [], 
    [context.appointments]
  );
  // Safety net: also read persisted local appointments in case context didn't refresh yet
  const persistedAppointments = React.useMemo(() => {
    try {
      const raw = localStorage.getItem('appointments') || '[]';
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return [];
      return arr.map(a => ({ ...a, start: new Date(a.start), end: new Date(a.end) }));
    } catch (_) { return []; }
  }, [appointments]);
  const mergedAppointments = React.useMemo(() => {
    const key = (a) => (a.id ? `id:${a.id}` : `t:${new Date(a.start).toISOString()}`);
    const map = new Map();
    [...appointments, ...persistedAppointments].forEach(a => { try { map.set(key(a), a); } catch(_) {} });
    const list = Array.from(map.values());
    try { console.debug('[Cal] merged appointments', { ctx: appointments.length, persisted: persistedAppointments.length, merged: list.length }); } catch(_) {}
    return list;
  }, [appointments, persistedAppointments]);
  // Overlays
  const { todos = [] } = useTodos?.() || {};
  const [rxList, setRxList] = React.useState([]);
  React.useEffect(() => {
    // Subscribe to prescriptions from Firestore if signed in, else use localStorage
    if (auth && auth.currentUser) {
      const unsub = onPrescriptions({}, (items) => setRxList(items));
      return () => unsub && unsub();
    }
    try {
      const raw = localStorage.getItem('prescriptions');
      const list = raw ? JSON.parse(raw) : [];
      setRxList(Array.isArray(list) ? list : []);
    } catch (_) { setRxList([]); }
  }, []);

  const overlayEvents = React.useMemo(() => {
    const t = (Array.isArray(todos) ? todos : [])
      .filter(x => x && x.date)
      .map((x, i) => ({
        id: `todo-${i}-${x.date}`,
        title: x.label || x.text || 'Task',
        start: new Date(x.date),
        end: new Date(new Date(x.date).getTime() + 30 * 60000),
        source: 'todo',
      }));
    const rx = (Array.isArray(rxList) ? rxList : [])
      .filter(r => r && r.date)
      .map((r, i) => ({
        id: `rx-${i}-${r.date}`,
        title: r.medicine ? `Pick up: ${r.medicine}` : 'Prescription pick-up',
        start: new Date(r.date),
        end: new Date(new Date(r.date).getTime() + 30 * 60000),
        source: 'prescription',
      }));
    return [...t, ...rx];
  }, [todos, rxList]);
  const addAppointment = context.addAppointment || (() => {});
  const [view, setView] = useState(Views.MONTH);
  // Compact week sizing: fix the calendar height so Week view doesn't stretch the page
  const isWeek = view === Views.WEEK;
  const calendarHeight = isWeek ? 440 : 520; // keep week shorter, month a bit taller
  // Limit visible hours in Week to shrink vertical content
  const minTime = React.useMemo(() => new Date(1970, 0, 1, 6, 0, 0), []); // 6 AM
  const maxTime = React.useMemo(() => new Date(1970, 0, 1, 21, 0, 0), []); // 9 PM
  const scrollToTime = React.useMemo(() => new Date(1970, 0, 1, 8, 0, 0), []); // auto-scroll to 8 AM
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  // Handle new appointments
  const handleSelect = ({ start, end }) => {
    try { console.log('[Cal] handleSelect', start, end); } catch(_) {}
    const title = window.prompt("Enter appointment title:");
    if (title) {
      // Month view often returns start===end; ensure non-zero duration
      const s = new Date(start);
      const e = end && new Date(end) > s ? new Date(end) : new Date(s.getTime() + 60 * 60000);
      const newAppointment = {
        title,
        start: s,
        end: e,
        allDay: false,
      };
      try { console.log('[Cal] addAppointment from select', newAppointment); } catch(_) {}
      // Only use the context's addAppointment - don't duplicate with local adds
      Promise.resolve(addAppointment(newAppointment)).then((res) => {
        const status = res?.status || 'local';
        const message = status === 'firestore' ? 'Saved to Firestore' : status === 'server' ? 'Saved to server' : 'Saved locally';
        try { console.log('[Cal] add result', res); } catch(_) {}
        setToast({ open: true, message, severity: 'success' });
      }).catch(() => setToast({ open: true, message: 'Saved locally', severity: 'warning' }));
    }
  };

  // Manual add via + button
  const handleAddClick = () => {
    try { console.log('[Cal] handleAddClick: open dialog'); } catch(_) {}
    setDialogOpen(true);
  };

  const handleDialogClose = () => setDialogOpen(false);
  const handleDialogSubmit = (form) => {
    try { console.log('[Cal] handleDialogSubmit(raw)', form); } catch(_) {}
    // Convert form to appointment object
    let start;
    let end;
    if (form.date) {
      if (form.from) {
        start = new Date(`${form.date}T${form.from}`);
        if (form.to) {
          end = new Date(`${form.date}T${form.to}`);
        } else {
          end = new Date(start.getTime() + 60 * 60 * 1000);
        }
      } else {
        // No times provided — default to 09:00–10:00 on that date
        start = new Date(`${form.date}T09:00`);
        end = new Date(`${form.date}T10:00`);
      }
    } else {
      // No date provided — use now -> +1h
      start = new Date();
      end = new Date(start.getTime() + 60 * 60 * 1000);
    }
    const payload = {
      title: (form.title && String(form.title).trim()) || (form.doctor ? `Visit with ${form.doctor}` : (form.reason || 'Appointment')),
      start,
      end,
      allDay: false,
      doctor: form.doctor,
      providerId: form.providerId || null,
      location: form.location,
      reason: form.reason,
      details: form.details
    };
    try { console.log('[Cal] addAppointment from dialog', payload); } catch(_) {}
    // Only use the context's addAppointment - don't duplicate with local adds
    Promise.resolve(addAppointment(payload)).then((res) => {
      const status = res?.status || 'local';
      const message = status === 'firestore' ? 'Saved to Firestore' : status === 'server' ? 'Saved to server' : 'Saved locally';
      try { console.log('[Cal] add result', res); } catch(_) {}
      setToast({ open: true, message, severity: 'success' });
    }).catch(() => setToast({ open: true, message: 'Saved locally', severity: 'warning' }));
    setDialogOpen(false);
  };

  return (
    <>
      <style>
        {`
          .custom-calendar .today-highlight {
            position: relative;
          }
          
          .custom-calendar .today-highlight::before {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            right: 2px;
            bottom: 2px;
            background: linear-gradient(135deg, rgba(165, 138, 255, 0.15) 0%, rgba(124, 107, 255, 0.15) 100%);
            border: 2px solid rgba(165, 138, 255, 0.6);
            border-radius: 8px;
            z-index: 1;
          }
          
          .custom-calendar .today-highlight .rbc-button-link {
            position: relative;
            z-index: 2;
            color: #A58AFF !important;
            font-weight: 700 !important;
          }
          
          .custom-calendar .today-highlight:hover::before {
            background: linear-gradient(135deg, rgba(165, 138, 255, 0.25) 0%, rgba(124, 107, 255, 0.25) 100%);
            border-color: rgba(165, 138, 255, 0.8);
          }
        `}
      </style>
      <Card
        sx={{
          height: 'auto',
          minHeight: { xs: 380, md: 420 },
          width: "100%",
          minWidth: 0,
          background: "rgba(20,20,40,0.7)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 4,
          p: 2.5,
          boxSizing: "border-box",
          overflow: "hidden",
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ width: "100%", minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              mb: 1,
              gap: 1,
            }}
          >
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={(e, newView) => newView && setView(newView)}
              sx={{
                "& .MuiToggleButton-root": {
                  color: "#A58AFF",
                  borderColor: "rgba(165, 138, 255, 0.2)",
                  fontSize: 13,
                  px: 1.5,
                  py: 0.2,
                  minHeight: 28,
                  minWidth: 48,
                  "&.Mui-selected": {
                    backgroundColor: "rgba(165, 138, 255, 0.18)",
                    color: "#A58AFF",
                    "&:hover": {
                      backgroundColor: "rgba(165, 138, 255, 0.25)",
                    },
                  },
                  "&:hover": {
                    backgroundColor: "rgba(165, 138, 255, 0.1)",
                  },
                },
              }}
            >
              <ToggleButton value={Views.WEEK}>Week</ToggleButton>
              <ToggleButton value={Views.MONTH}>Month</ToggleButton>
              <ToggleButton value={Views.AGENDA}>Agenda</ToggleButton>
            </ToggleButtonGroup>
            <IconButton
              size="small"
              aria-label="Add appointment"
              onClick={handleAddClick}
              sx={{
                ml: 1,
                color: "#A58AFF",
                background: "rgba(165,138,255,0.08)",
                borderRadius: 2,
                p: 0.5,
                "&:hover": { background: "rgba(165,138,255,0.18)" },
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ height: { xs: calendarHeight - 40, md: calendarHeight }, transition: 'height 120ms ease' }}>
          <Calendar
            localizer={localizer}
            events={[...mergedAppointments, ...overlayEvents]}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%', width: "100%", minWidth: 0, fontSize: 13 }}
            view={view}
            onView={setView}
            components={{
              toolbar: (props) => (
                <CalendarToolbar {...props} onNavigate={props.onNavigate} />
              ),
            }}
            selectable
            onSelectSlot={handleSelect}
            views={[Views.MONTH, Views.WEEK, Views.AGENDA]}
            min={isWeek ? minTime : undefined}
            max={isWeek ? maxTime : undefined}
            step={isWeek ? 60 : 30}
            timeslots={isWeek ? 2 : 2}
            scrollToTime={isWeek ? scrollToTime : undefined}
            formats={{
              timeGutterFormat: "HH:mm",
              eventTimeRangeFormat: ({ start, end }) =>
                `${moment(start).format("HH:mm")} - ${moment(end).format("HH:mm")}`,
            }}
            eventPropGetter={() => ({
              style: {
                backgroundColor: "#A58AFF",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                fontSize: 13,
                padding: "1px 4px",
              },
            })}
            dayPropGetter={(date) => {
              const today = new Date();
              const isToday = date.toDateString() === today.toDateString();
              
              return {
                style: {
                  backgroundColor: "transparent",
                  color: "#fff",
                  fontSize: 13,
                  position: "relative",
                },
                className: isToday ? "today-highlight" : "",
              };
            }}
            className="custom-calendar"
          />
          </Box>
        </Box>
      </Card>
      <AppointmentDialog open={dialogOpen} onClose={handleDialogClose} onSubmit={handleDialogSubmit} />
      <Snackbar open={toast.open} autoHideDuration={2500} onClose={() => setToast(t => ({ ...t, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setToast(t => ({ ...t, open: false }))} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default AppointmentCalendar;
