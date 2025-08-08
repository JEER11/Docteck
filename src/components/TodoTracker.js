import React, { useState } from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import VuiTypography from "components/VuiTypography";
import VuiInput from "components/VuiInput";
import { FiMoreHorizontal, FiX } from "react-icons/fi";

const initialTodos = [
  { desc: "Aspirin 100mg daily", done: true },
  { desc: "Schedule blood test", done: true },
];

export default function TodoTracker() {
  const [todos, setTodos] = useState(initialTodos);
  const [input, setInput] = useState("");

  const addTodo = () => {
    if (input.trim()) {
      setTodos([
        ...todos,
        {
          desc: input,
          done: false,
        },
      ]);
      setInput("");
    }
  };

  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, #181C3A 0%, #23295A 100%)',
        boxShadow: 8,
        borderRadius: 4,
        p: { xs: 2, md: 3 },
        color: 'white',
        minHeight: 0,
        height: 420,
        maxHeight: 420,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <VuiTypography variant="button" color="white" fontWeight="bold">
          To do's Track
        </VuiTypography>
        <Box display="flex" alignItems="center" gap={2}>
          <VuiTypography variant="button" color="white" fontWeight="bold">
            {todos.length}
          </VuiTypography>
          <FiMoreHorizontal color="#6C63FF" size={20} style={{ cursor: 'pointer' }} />
        </Box>
      </Box>
      <Box sx={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        // Ultra-minimal scrollbar: only thumb, no background/track
        '::-webkit-scrollbar': {
          width: '6px',
          background: 'transparent',
        },
        '::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '::-webkit-scrollbar-thumb': {
          background: 'rgba(255,255,255,0.13)',
          borderRadius: '6px',
          minHeight: '40px',
        },
        '::-webkit-scrollbar-corner': {
          background: 'transparent',
        },
        'scrollbarWidth': 'thin',
        'scrollbarColor': 'rgba(255,255,255,0.13) transparent',
      }}>
        <Stack spacing={2}>
          {todos.map((todo, idx) => (
            <Box
              key={idx}
              sx={{
                background: 'rgba(108,99,255,0.10)',
                borderRadius: 4,
                p: 2.5,
                display: 'flex',
                alignItems: 'center',
                minHeight: 60,
                position: 'relative',
                mb: 1.5,
                boxShadow: '0 2px 12px 0 rgba(108,99,255,0.08)',
              }}
            >
              <VuiTypography variant="button" color="white" fontWeight="bold" sx={{ fontSize: 18, flex: 1, wordBreak: 'break-word' }}>
                {todo.desc}
              </VuiTypography>
              <FiX
                size={20}
                color="#fff"
                style={{ cursor: 'pointer', marginLeft: 12, opacity: 0.7 }}
                onClick={() => setTodos(todos.filter((_, i) => i !== idx))}
                title="Delete note"
              />
            </Box>
          ))}
        </Stack>
      </Box>
      <Box sx={{ mt: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 3, px: 2, py: 2, display: 'flex', alignItems: 'center', minHeight: 56 }}>
        <VuiInput
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') addTodo(); }}
          placeholder="Write a new task and press Enter..."
          sx={{
            background: 'transparent',
            color: 'white',
            border: 'none',
            boxShadow: 'none',
            borderRadius: 2,
            fontSize: 18,
            width: '100%',
            p: 1.5,
            minHeight: 40,
            'input': {
              background: 'transparent',
              color: 'white',
              '::placeholder': { color: 'rgba(255,255,255,0.5)' },
              border: 'none',
              fontSize: 18,
              borderRadius: 2,
              padding: 0,
            },
          }}
          disableUnderline
          fullWidth
        />
      </Box>
    </Card>
  );
}
