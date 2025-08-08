import React from "react";
import { Card, Box, IconButton } from "@mui/material";
import VuiTypography from "components/VuiTypography";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

function MiniDayCalendar({ selectedDate, setSelectedDate }) {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - today.getDay() + i);
    return d;
  });

  return (
    <Card sx={{ height: 170, p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(30,32,60,0.9)', borderRadius: 3 }}>
      <VuiTypography variant="lg" color="white" fontWeight="bold" mb={1}>
        Daily Calendar
      </VuiTypography>
      <Box display="flex" gap={1}>
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
      <VuiTypography color="text" variant="caption" mt={1}>
        <CalendarTodayIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
        {selectedDate ? selectedDate.toDateString() : today.toDateString()}
      </VuiTypography>
    </Card>
  );
}

export default MiniDayCalendar;
