import React from "react";
import { IconButton, Box, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function CalendarToolbar({ label, onNavigate }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#1B1642",
        color: "#A58AFF",
        py: 1,
        borderRadius: 2,
        mb: 1,
        fontSize: 14,
        gap: 2,
      }}
    >
      <IconButton size="small" onClick={() => onNavigate("PREV")}
        sx={{ color: "#A58AFF", mr: 1 }} aria-label="Previous">
        <ArrowBackIosNewIcon fontSize="small" />
      </IconButton>
      <Typography
        variant="h6"
        sx={{
          color: "#A58AFF",
          fontWeight: 700,
          fontSize: 16,
          minWidth: 120,
          textAlign: "center"
        }}
      >
        {label}
      </Typography>
      <IconButton size="small" onClick={() => onNavigate("NEXT")}
        sx={{ color: "#A58AFF", ml: 1 }} aria-label="Next">
        <ArrowForwardIosIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
