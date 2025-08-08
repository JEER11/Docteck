import React from "react";
import { Card, Box, IconButton } from "@mui/material";
import VuiTypography from "components/VuiTypography";
import { useAppointments } from "context/AppointmentContext";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

function MiniDayCalendar() {
  const { selectedDate, setSelectedDate, getAppointmentsForDate } = useAppointments();
  // Track the start of the visible week (scrollable window)
  const [offset, setOffset] = React.useState(0);
  const today = new Date();
  // Show all days in the current month
  const currentMonth = (selectedDate || today).getMonth();
  const currentYear = (selectedDate || today).getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(currentYear, currentMonth, i + 1);
    return d;
  });
  const handlePrev = () => setOffset(offset - 7);
  const handleNext = () => setOffset(offset + 7);

  // Appointments/tasks for selected day
  const appointments = getAppointmentsForDate(selectedDate || today);

  // For hover-scroll
  const scrollRef = React.useRef();
  const scrollAmount = 60; // px per scroll

  // Scroll left/right on hover
  const handleDayHover = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <Card sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(30,32,60,0.9)', borderRadius: 3, minWidth: 220, width: '100%', minHeight: 320, maxWidth: 270 }}>
      <VuiTypography variant="lg" color="white" fontWeight="bold" mb={1}>
        Daily Calendar
      </VuiTypography>
      <Box display="flex" alignItems="center" gap={1}>
        <IconButton onMouseEnter={() => handleDayHover('left')} sx={{ color: '#fff', borderRadius: 2, background: 'rgba(255,255,255,0.06)', p: 0.5, width: 28, height: 28, minWidth: 28, minHeight: 28, boxShadow: 'none', transition: 'background 0.2s', '&:hover': { background: 'rgba(255,255,255,0.13)' } }}>
          <ChevronLeftIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.7)' }} />
        </IconButton>
        <Box ref={scrollRef} sx={{ display: 'flex', gap: 1, overflowX: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' }, maxWidth: 210, px: 1 }}>
          {days.map((d, idx) => (
            <IconButton
              key={idx}
              onClick={() => setSelectedDate(new Date(d))}
              sx={{
                background: selectedDate && d.toDateString() === selectedDate.toDateString() ? 'linear-gradient(90deg,#6a6afc,#8b8bfc)' : 'rgba(255,255,255,0.08)',
                color: '#fff',
                borderRadius: 2,
                width: 36,
                height: 36,
                border: selectedDate && d.toDateString() === selectedDate.toDateString() ? '2px solid #6a6afc' : 'none',
                fontWeight: 700,
                fontSize: 16,
                transition: 'background 0.2s',
                '&:hover': { background: 'rgba(106,106,252,0.18)' },
              }}
            >
              {d.getDate()}
            </IconButton>
          ))}
        </Box>
        <IconButton onMouseEnter={() => handleDayHover('right')} sx={{ color: '#fff', borderRadius: 2, background: 'rgba(255,255,255,0.06)', p: 0.5, width: 28, height: 28, minWidth: 28, minHeight: 28, boxShadow: 'none', transition: 'background 0.2s', '&:hover': { background: 'rgba(255,255,255,0.13)' } }}>
          <ChevronRightIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.7)' }} />
        </IconButton>
      </Box>
      <VuiTypography color="text" variant="caption" mt={1}>
        <CalendarTodayIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
        {selectedDate ? selectedDate.toDateString() : today.toDateString()}
      </VuiTypography>
      <Box mt={2} width="100%">
        <VuiTypography color="white" fontWeight="bold" fontSize={15} mb={1}>
          Appointments & Tasks
        </VuiTypography>
        {appointments.length === 0 ? (
          <VuiTypography color="text" fontSize={14}>No appointments or tasks for this day.</VuiTypography>
        ) : (
          appointments.map((app, idx) => (
            <Card key={idx} sx={{ background: 'rgba(255,255,255,0.06)', color: '#fff', mb: 1, p: 1.5, borderRadius: 2, boxShadow: 'none' }}>
              <VuiTypography fontWeight="bold" fontSize={15}>{app.title || app.task}</VuiTypography>
              <VuiTypography color="text" fontSize={13}>{new Date(app.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</VuiTypography>
            </Card>
          ))
        )}
      </Box>
    </Card>
  );
}

export default MiniDayCalendar;
