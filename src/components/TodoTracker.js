/* eslint-disable */
import React, { useState } from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import VuiTypography from "components/VuiTypography";
import VuiInput from "components/VuiInput";
import { FiMoreHorizontal, FiX, FiPlus } from "react-icons/fi";
import AddTodoDialog from './AddTodoDialog';
import { useTodos } from "context/TodoContext";

export default function TodoTracker() {
  const { todos: ctxTodos = [], addTodo: ctxAdd = () => {}, removeTodo: ctxRemove = () => {} } = useTodos() || {};
  // Local input only; items come from context to stay in sync across app
  const [input, setInput] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const addTodo = () => {
    if (input.trim()) {
      ctxAdd({ type: 'note', label: input, date: undefined });
      setInput("");
    }
  };

  return (
  <Card sx={{ height: 420, display: 'flex', flexDirection: 'column', p: { xs: 2, md: 3 }, color: 'white' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <VuiTypography variant="button" color="white" fontWeight="bold">
          NOTES
        </VuiTypography>
        <Box display="flex" alignItems="center" gap={1.5}>
          <VuiTypography variant="button" color="white" fontWeight="bold">{ctxTodos.length}</VuiTypography>
          <FiPlus
            size={22}
            color="#6C63FF"
            style={{ cursor: 'pointer' }}
            title="Add To Do"
            onClick={() => setDialogOpen(true)}
          />
          <FiMoreHorizontal color="#6C63FF" size={20} style={{ cursor: 'pointer', opacity: 0.75 }} title="More" />
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
            {ctxTodos.map((todo, idx) => {
              const hasDate = !!todo.date;
              const dt = hasDate ? new Date(todo.date) : null;
              return (
                <Box
                  key={idx}
                  sx={{
                    background: 'linear-gradient(135deg, rgba(108,99,255,0.18) 0%, rgba(108,99,255,0.10) 60%)',
                    borderRadius: 4,
                    p: 2.1,
                    display: 'flex',
                    alignItems: 'center',
                    minHeight: 60,
                    position: 'relative',
                    mb: 1.25,
                    boxShadow: '0 4px 16px -4px rgba(0,0,0,0.45)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <VuiTypography variant="button" color="white" fontWeight="bold" sx={{ fontSize: 16.5, lineHeight: 1.35, wordBreak: 'break-word' }}>
                      {todo.label || todo.desc}
                    </VuiTypography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      {todo.type && (
                        <Box sx={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.4, px: 1, py: 0.3, borderRadius: 2, background: 'rgba(255,255,255,0.08)', color: '#c9d0ee' }}>
                          {String(todo.type).toUpperCase()}
                        </Box>
                      )}
                      {dt && (
                        <Box sx={{ fontSize: 11, fontWeight: 500, px: 1, py: 0.3, borderRadius: 2, background: 'rgba(255,255,255,0.08)', color: '#b5bedf' }}>
                          {dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}{(dt.getHours() || dt.getMinutes()) ? ` • ${dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                        </Box>
                      )}
                    </Box>
                  </Box>
                  <FiX
                    size={18}
                    color="#fff"
                    style={{ cursor: 'pointer', marginLeft: 12, opacity: 0.65 }}
                    onClick={() => ctxRemove(idx)}
                    title="Delete note"
                  />
                </Box>
              );
            })}
        </Stack>
      </Box>
      <Box sx={{ mt: 2, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3, px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <VuiInput
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') addTodo(); }}
          placeholder="Quick add and press Enter..."
          sx={{
            background: 'transparent',
            color: 'white',
            border: 'none',
            boxShadow: 'none',
            borderRadius: 2,
            fontSize: 16,
            width: '100%',
            p: 1.2,
            minHeight: 40,
            'input': {
              background: 'transparent',
              color: 'white',
              '::placeholder': { color: 'rgba(255,255,255,0.5)' },
              border: 'none',
              fontSize: 16,
              borderRadius: 2,
              padding: 0,
            },
          }}
          disableUnderline
          fullWidth
        />
        <Box as="button" onClick={() => setDialogOpen(true)} style={{ background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', cursor: 'pointer', padding: '8px 14px', fontSize: 13, fontWeight: 600, borderRadius: 10, letterSpacing: 0.6 }}>
          Advanced
        </Box>
      </Box>
      <AddTodoDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={(todo) => ctxAdd(todo)}
      />
    </Card>
  );
}
