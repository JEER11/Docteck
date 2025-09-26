	import React, { useEffect, useRef, useState } from 'react';
import { Card, Stack, IconButton, Button } from '@mui/material';
import VuiBox from 'components/VuiBox';
import VuiTypography from 'components/VuiTypography';
import colors from 'assets/theme/base/colors';
import { FaEllipsisH, FaPlus } from 'react-icons/fa';
import linearGradient from 'assets/theme/functions/linearGradient';
import CircularProgress from '@mui/material/CircularProgress';
import { useTodos } from 'context/TodoContext';
import AddTodoDialog from 'components/AddTodoDialog';

function ReferralTracking({ title = 'TODO TRACK' }) {
	const { info, gradients } = colors;

	// Use todos from context
	const { todos, addTodo, removeTodo } = useTodos();
	const [dialogOpen, setDialogOpen] = useState(false);

	const totalTasks = todos.length;
	const percent = totalTasks === 0 ? 100 : 0;
	const shouldScroll = todos.length > 2;

	const fieldSx = {
		width: '100%',
		ml: 0,
		background: '#181a2f',
		borderRadius: 1.5,
		'& .MuiOutlinedInput-notchedOutline': { border: '1px solid #23244a' },
		'&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#2f3570' },
		'&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6a6afc' },
		'& .MuiInputBase-input': { color: '#e7e9f3', fontSize: 14, py: 1, background: 'transparent' },
	};

	// Render the card as a normal, static element in the layout (no floating/draggable behavior)
	const rootRef = useRef(null);
	const [floating, setFloating] = useState(false);
	const [dragging, setDragging] = useState(false);
	const beginDrag = () => {};

	// Optional: debug log inside component respecting hooks rules
	useEffect(() => { try { console.debug && console.debug('[ReferralTracking] todos length', todos.length); } catch(_) {} }, [todos]);

	const handleAdd = (todo) => {
		try { console.debug && console.debug('[ReferralTracking] onAdd via AddTodoDialog', todo); } catch(_) {}
		// Context addTodo will assign id & persist (optimistic). Accept Date object for date.
		addTodo(todo, { forceLocal: true });
	};

		return (
			<>
				<VuiBox ref={rootRef}
			sx={{
				position: 'static',
				width: 'auto'
			}}
			>
			<Card
				sx={{
					height: { xs: 300, md: 340 },
					maxHeight: { xs: 300, md: 340 },
					minHeight: { xs: 300, md: 340 },
					display: 'flex',
					flexDirection: 'column',
					overflow: 'hidden',
					background: linearGradient(gradients.cardDark.main, gradients.cardDark.state, gradients.cardDark.deg)
				}}
			>
				<VuiBox sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
					<VuiBox display='flex' alignItems='center' justifyContent='space-between' sx={{ width: '100%' }} mb='28px'>
							<VuiTypography variant='lg' color='white' mr='auto' fontWeight='bold'>
								{title}
							</VuiTypography>
						<VuiBox sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', mr: 1 }}>
							<CircularProgress size={36} thickness={5} variant='determinate' value={percent} style={{ color: info.main, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
							<VuiBox sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
								<VuiTypography variant='button' color='white' fontWeight='bold' sx={{ fontSize: 14 }}>
									{todos.length}
								</VuiTypography>
							</VuiBox>
						</VuiBox>
						<IconButton size='small' aria-label='Add to do' onClick={() => setDialogOpen(true)} sx={{ ml: 1, color: info.main, background: 'rgba(165,138,255,0.08)', borderRadius: 2, p: 0.5, '&:hover': { background: 'rgba(165,138,255,0.18)' } }}>
							<FaPlus size={16} />
						</IconButton>
						<VuiBox display='flex' justifyContent='center' alignItems='center' bgColor='#22234B' sx={{ width: '37px', height: '37px', cursor: 'default', borderRadius: '12px', ml: 1, userSelect: 'auto' }}>
						<FaEllipsisH color={info.main} size='18px' />
					</VuiBox>
					</VuiBox>
					<VuiBox
						sx={{
							flex: 1,
							minHeight: 0,
							overflowY: shouldScroll ? 'auto' : 'hidden',
							pr: 0.5,
							'::-webkit-scrollbar': { width: '6px', height: '6px', background: 'transparent' },
							'::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.18)', borderRadius: '6px' },
							'::-webkit-scrollbar-track': { background: 'transparent' },
							scrollbarWidth: 'thin',
							scrollbarColor: 'rgba(255,255,255,0.18) transparent'
						}}
					>
						<Stack spacing={2}>
							{todos.length === 0 && (
								<VuiBox display='flex' alignItems='center' justifyContent='center' sx={{ background: '#23244B', borderRadius: 2, p: 4 }}>
									<VuiTypography variant='button' color='white' fontWeight='regular' sx={{ opacity: 0.7 }}>
										No todos yet — add one with the + button.
									</VuiTypography>
								</VuiBox>
							)}
							{todos.map((todo, idx) => (
								<VuiBox key={todo.id || idx} display='flex' alignItems='center' justifyContent='space-between' sx={{ background: '#23244B', borderRadius: 2, p: 2 }}>
								<VuiBox>
									<VuiTypography variant='button' color='white' fontWeight='bold'>
										{todo.type?.charAt(0).toUpperCase() + todo.type?.slice(1) || 'Task'}
									</VuiTypography>
									<VuiTypography variant='caption' color='text' sx={{ fontSize: 12, display: 'block', mt: 0.5 }}>
										{todo.date ? new Date(todo.date).toLocaleDateString() : ''}
									</VuiTypography>
									<VuiTypography variant='body2' color='white'>
										{todo.label}
									</VuiTypography>
								</VuiBox>
								<Button size='small' color='success' onClick={() => removeTodo(idx)}>Done</Button>
							</VuiBox>
							))}
						</Stack>
					</VuiBox>
					<AddTodoDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onAdd={handleAdd} />
				</VuiBox>
					</Card>
				</VuiBox>
				</>
			);
}

export default ReferralTracking;
