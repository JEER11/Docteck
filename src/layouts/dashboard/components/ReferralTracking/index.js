import React, { useEffect, useRef, useState } from 'react';
import { Card, Stack, IconButton, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import VuiBox from 'components/VuiBox';
import VuiTypography from 'components/VuiTypography';
import colors from 'assets/theme/base/colors';
import { FaEllipsisH, FaPlus } from 'react-icons/fa';
import linearGradient from 'assets/theme/functions/linearGradient';
import CircularProgress from '@mui/material/CircularProgress';
import { useTodos } from 'context/TodoContext';

function ReferralTracking() {
	const { info, gradients } = colors;

	// Use todos from context
	const { todos, addTodo, removeTodo } = useTodos();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [newType, setNewType] = useState('medicine');
	const [newLabel, setNewLabel] = useState('');
	const [newDate, setNewDate] = useState('');

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

	// Draggable with persistence (page-anchored)
	const STORAGE_KEY = 'todos-track-pos';
		const rootRef = useRef(null);
		const placeholderRef = useRef(null);
	const [floating, setFloating] = useState(false);
	const [dragging, setDragging] = useState(false);
	const [pos, setPos] = useState({ x: 0, y: 0 }); // viewport coords
	const posRef = useRef(pos);
	const [absPos, setAbsPos] = useState(null);     // page coords
	const [boxSize, setBoxSize] = useState(null);
	const snapThreshold = 80; // px tolerance for snapping to placeholder edges

	useEffect(() => { posRef.current = pos; }, [pos]);

		// Restore saved absolute position on mount and align with baseline if slightly off
	useEffect(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				const { ax, ay, w, h } = JSON.parse(saved);
				const maxX = Math.max(8, (document.documentElement.scrollWidth || window.innerWidth) - (w || 0) - 8);
				const maxY = Math.max(8, (document.documentElement.scrollHeight || window.innerHeight) - (h || 0) - 8);
				let finalAX = Math.max(8, Math.min(ax || 8, maxX));
				let finalAY = Math.max(8, Math.min(ay || 8, maxY));
				// Snap to placeholder top/left for even spacing with Weather
				const phRect = placeholderRef.current?.getBoundingClientRect();
				if (phRect) {
					const baselineTop = phRect.top + window.scrollY;
					const baselineLeft = phRect.left + window.scrollX;
					const dy = finalAY - baselineTop;
					if (dy > 4 && dy < snapThreshold) finalAY = baselineTop;
					if (Math.abs(finalAX - baselineLeft) < snapThreshold) finalAX = baselineLeft;
				}
				setAbsPos({ x: finalAX, y: finalAY });
				setBoxSize({ w, h });
				setPos({ x: finalAX - window.scrollX, y: finalAY - window.scrollY });
				setFloating(true);
			}
		} catch {}

		const onResize = () => {
			if (!boxSize || !absPos) return;
			const maxX = Math.max(8, (document.documentElement.scrollWidth || window.innerWidth) - boxSize.w - 8);
			const maxY = Math.max(8, (document.documentElement.scrollHeight || window.innerHeight) - boxSize.h - 8);
			setAbsPos(p => {
				const nx = Math.max(8, Math.min(p.x, maxX));
				const ny = Math.max(8, Math.min(p.y, maxY));
				setPos({ x: nx - window.scrollX, y: ny - window.scrollY });
				return { x: nx, y: ny };
			});
		};
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, [boxSize, absPos]);

	// Sync position on scroll
	useEffect(() => {
		const onScroll = () => {
			if (!floating || !absPos) return;
			setPos({ x: absPos.x - window.scrollX, y: absPos.y - window.scrollY });
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, [floating, absPos]);

	const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

	const beginDrag = (e) => {
		e.preventDefault();
		const el = rootRef.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		setBoxSize({ w: rect.width, h: rect.height });
		setFloating(true);
		setDragging(true);
		const dx = e.clientX - rect.left;
		const dy = e.clientY - rect.top;
		const onMove = (ev) => {
			const x = clamp(ev.clientX - dx, 8, window.innerWidth - rect.width - 8);
			const y = clamp(ev.clientY - dy, 8, window.innerHeight - rect.height - 8);
			setPos({ x, y });
		};
		const onUp = () => {
			setDragging(false);
			window.removeEventListener('mousemove', onMove);
			window.removeEventListener('mouseup', onUp);
			const latest = posRef.current;
			let ax = clamp(latest.x + window.scrollX, 8, (document.documentElement.scrollWidth || window.innerWidth) - rect.width - 8);
			let ay = clamp(latest.y + window.scrollY, 8, (document.documentElement.scrollHeight || window.innerHeight) - rect.height - 8);
			// Snap to placeholder's left/top for consistent spacing with adjacent cards
			const phRect = placeholderRef.current?.getBoundingClientRect();
			if (phRect) {
				const baselineLeft = phRect.left + window.scrollX;
				if (Math.abs(ax - baselineLeft) < snapThreshold) ax = baselineLeft;
				const baselineTop = phRect.top + window.scrollY;
				if (ay > baselineTop && ay - baselineTop < snapThreshold) ay = baselineTop;
			}
			setAbsPos({ x: ax, y: ay });
			setPos({ x: ax - window.scrollX, y: ay - window.scrollY });
			setFloating(true);
			localStorage.setItem(STORAGE_KEY, JSON.stringify({ ax, ay, w: rect.width, h: rect.height }));
		};
		window.addEventListener('mousemove', onMove);
		window.addEventListener('mouseup', onUp);
	};

	const handleAddTodo = () => {
		if (!newLabel.trim()) return;
		addTodo({ type: newType, label: newLabel.trim(), date: newDate ? new Date(newDate) : null });
		setDialogOpen(false);
		setNewLabel('');
		setNewType('medicine');
		setNewDate('');
	};

		return (
			<>
				{/* Placeholder to preserve layout and provide a baseline for alignment */}
				<VuiBox
					ref={placeholderRef}
					sx={{
						height: floating ? (boxSize?.h || 340) : 0,
						m: 0,
						p: 0,
						visibility: 'hidden'
					}}
				/>
				<VuiBox ref={rootRef}
			sx={{
				position: floating ? 'fixed' : 'static',
				top: floating ? pos.y : 'unset',
				left: floating ? pos.x : 'unset',
				width: floating && boxSize ? boxSize.w : 'auto',
				zIndex: floating ? 1400 : 'auto',
				cursor: dragging ? 'grabbing' : 'default',
				userSelect: dragging ? 'none' : 'auto',
				transition: dragging ? 'none' : 'top 120ms ease, left 120ms ease',
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
							To do's Track
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
						<VuiBox display='flex' justifyContent='center' alignItems='center' bgColor='#22234B' sx={{ width: '37px', height: '37px', cursor: 'grab', borderRadius: '12px', ml: 1, userSelect: 'none' }} onMouseDown={beginDrag}>
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
							{todos.map((todo, idx) => (
								<VuiBox key={idx} display='flex' alignItems='center' justifyContent='space-between' sx={{ background: '#23244B', borderRadius: 2, p: 2 }}>
									<VuiBox>
										<VuiTypography variant='button' color='white' fontWeight='bold'>
											{todo.type.charAt(0).toUpperCase() + todo.type.slice(1)}
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
					<Dialog
						open={dialogOpen}
						onClose={() => setDialogOpen(false)}
						PaperProps={{
							sx: {
								background: 'rgba(34, 40, 74, 0.65)',
								boxShadow: 24,
								borderRadius: 4,
								color: 'white',
								backdropFilter: 'blur(10px)',
								p: 4,
								minWidth: 400,
								maxWidth: 600,
							}
						}}
					>
						<DialogTitle sx={{ color: 'white', fontWeight: 700, fontSize: 22, pb: 2, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
							Add To Do
						</DialogTitle>
						<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1, background: 'transparent', color: 'white', px: 2, minWidth: 400 }}>
							<Stack spacing={1}>
								<TextField label='Type' select value={newType} onChange={e => setNewType(e.target.value)} fullWidth InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={{ ...fieldSx, mt: 2, mb: 0.5, color: 'white', '& .MuiSelect-select': { color: '#e7e9f3', py: 1, background: 'transparent' } }}>
									<MenuItem value='medicine'>Medicine</MenuItem>
									<MenuItem value='appointment'>Appointment</MenuItem>
									<MenuItem value='other'>Other</MenuItem>
								</TextField>
								<TextField label='Description' value={newLabel} onChange={e => setNewLabel(e.target.value)} fullWidth variant='outlined' multiline minRows={3} InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} sx={{ ...fieldSx, mb: 0.5 }} />
								<TextField label='Date' type='date' InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }} value={newDate} onChange={e => setNewDate(e.target.value)} fullWidth sx={{ ...fieldSx, mb: 0.5 }} />
							</Stack>
						</DialogContent>
						<DialogActions sx={{ background: 'transparent', px: 2, pb: 2, display: 'flex', justifyContent: 'flex-end' }}>
							<Button onClick={() => setDialogOpen(false)} sx={{ color: '#bfc6e0', mr: 1 }}>Cancel</Button>
							<Button onClick={() => handleAddTodo()} variant='contained' color='info' sx={{ borderRadius: 2, px: 3, fontWeight: 600 }}>Add</Button>
						</DialogActions>
					</Dialog>
				</VuiBox>
					</Card>
				</VuiBox>
				</>
			);
}

export default ReferralTracking;
