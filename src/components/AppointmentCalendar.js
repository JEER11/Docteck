import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
} from "@mui/material";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAppointments } from "../context/AppointmentContext";
import AddIcon from "@mui/icons-material/Add";
import AppointmentDialog from "./AppointmentDialog";
import CalendarToolbar from "./CalendarToolbar";

const localizer = momentLocalizer(moment);

function AppointmentCalendar() {
  // Defensive: fallback to empty object if context is undefined
  const context = useAppointments() || {};
  const appointments = Array.isArray(context.appointments) ? context.appointments : [];
  const addAppointment = context.addAppointment || (() => {});
  const [view, setView] = useState(Views.MONTH);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Handle new appointments
  const handleSelect = ({ start, end }) => {
    const title = window.prompt("Enter appointment title:");
    if (title) {
      const newAppointment = {
        title,
        start,
        end,
        allDay: false,
      };
      addAppointment(newAppointment);
    }
  };

  // Manual add via + button
  const handleAddClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => setDialogOpen(false);
  const handleDialogSubmit = (form) => {
    // Convert form to appointment object
    const start = form.date && form.from ? new Date(`${form.date}T${form.from}`) : new Date();
    const end = form.date && form.to ? new Date(`${form.date}T${form.to}`) : new Date(start.getTime() + 60 * 60 * 1000);
    addAppointment({
      title: form.title,
      start,
      end,
      allDay: false,
      doctor: form.doctor,
      providerId: form.providerId || null,
      location: form.location,
      reason: form.reason,
      details: form.details
    });
    setDialogOpen(false);
  };

  return (
    <>
      <Card
        sx={{
          height: '100%',
          minHeight: { xs: 420, md: 520, lg: 600 },
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
        <Box sx={{ flex: 1, minHeight: { xs: 320, md: 420 }, width: "100%", minWidth: 0, display: 'flex', flexDirection: 'column' }}>
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
          <Calendar
            localizer={localizer}
            events={appointments}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%', minHeight: 320, width: "100%", minWidth: 0, fontSize: 13 }}
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
            dayPropGetter={() => ({
              style: {
                backgroundColor: "transparent",
                color: "#fff",
                fontSize: 13,
              },
            })}
            className="custom-calendar"
          />
        </Box>
      </Card>
      <AppointmentDialog open={dialogOpen} onClose={handleDialogClose} onSubmit={handleDialogSubmit} />
    </>
  );
}

export default AppointmentCalendar;
