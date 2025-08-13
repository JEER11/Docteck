import React, { useState } from 'react';
import { Card, Stack, IconButton, MenuItem, Select, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import VuiBox from 'components/VuiBox';
import VuiTypography from 'components/VuiTypography';
import colors from 'assets/theme/base/colors';
import { FaEllipsisH, FaPlus } from 'react-icons/fa';
import linearGradient from 'assets/theme/functions/linearGradient';
import CircularProgress from '@mui/material/CircularProgress';
import { useTodos } from "context/TodoContext";

function ReferralTracking() {
	const { info, gradients } = colors;
	const { cardContent } = gradients;

	// Use todos from context
	const { todos, addTodo, removeTodo } = useTodos();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [newType, setNewType] = useState('medicine');
	const [newLabel, setNewLabel] = useState('');
	const [newDate, setNewDate] = useState('');

	 // Track completed tasks
	const [completed, setCompleted] = useState([]); // array of completed indices

	const handleAddTodo = () => {
		if (newLabel.trim()) {
			addTodo({ type: newType, label: newLabel.trim(), date: newDate ? new Date(newDate) : null });
			setDialogOpen(false);
			setNewLabel('');
			setNewType('medicine');
			setNewDate('');
		}
	};

	const handleCompleteTodo = idx => {
		setCompleted(c => [...c, idx]);
		setTimeout(() => {
			removeTodo(idx);
			setCompleted(c => c.filter(i => i !== idx));
		}, 350); // brief delay for animation
	};

	const totalTasks = todos.length + completed.length;
	const remainingTasks = todos.length;
	const percent = totalTasks === 0 ? 100 : ((totalTasks - remainingTasks) / totalTasks) * 100;

	// Only show scrollbar if more than two todos (otherwise keep it hidden)
	const shouldScroll = todos.length > 2;

	return (
		<Card
			sx={{
				// Fix height so the card never grows with content; allow inner area to scroll instead
				height: { xs: 300, md: 340 },
				maxHeight: { xs: 300, md: 340 },
				minHeight: { xs: 300, md: 340 },
				display: 'flex',
				flexDirection: 'column',
				overflow: 'hidden',
				background: linearGradient(gradients.cardDark.main, gradients.cardDark.state, gradients.cardDark.deg)
			}}>
			<VuiBox sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
				<VuiBox
					display='flex'
					alignItems='center'
					justifyContent='space-between'
					sx={{ width: '100%' }}
					mb='28px'
				>
					<VuiTypography variant='lg' color='white' mr='auto' fontWeight='bold'>
						To do's Track
					</VuiTypography>
					{/* Small circle track with number of todos left */}
					<VuiBox sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', mr: 1 }}>
						<CircularProgress 
							size={36} 
							thickness={5} 
							variant='determinate' 
							value={percent} 
							style={{ color: info.main, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }}
						/>
						<VuiBox
							sx={{
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								height: '100%',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<VuiTypography variant='button' color='white' fontWeight='bold' sx={{ fontSize: 14 }}>
								{todos.length}
							</VuiTypography>
						</VuiBox>
					</VuiBox>
					<IconButton
						size='small'
						aria-label='Add to do'
						onClick={() => setDialogOpen(true)}
						sx={{ ml: 1, color: info.main, background: 'rgba(165,138,255,0.08)', borderRadius: 2, p: 0.5, '&:hover': { background: 'rgba(165,138,255,0.18)' } }}
					>
						<FaPlus size={16} />
					</IconButton>
					<VuiBox
						display='flex'
						justifyContent='center'
						alignItems='center'
						bgColor='#22234B'
						sx={{ width: '37px', height: '37px', cursor: 'pointer', borderRadius: '12px', ml: 1 }}
					>
						<FaEllipsisH color={info.main} size='18px' />
					</VuiBox>
				</VuiBox>
				{/* Scrollable list area: flexes to fill the fixed-height card; shows scrollbar only when > 2 todos */}
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
								<Button size='small' color='success' onClick={() => handleCompleteTodo(idx)}>
									Done
								</Button>
							</VuiBox>
						))}
					</Stack>
				</VuiBox>
				<Dialog 
					open={dialogOpen} 
					onClose={() => setDialogOpen(false)}
					PaperProps={{
						sx: {
							backgroundColor: 'rgba(34,35,75,0.85)',
							backdropFilter: 'blur(4px)',
							width: 500, // bigger dialog
							maxWidth: '95vw',
							borderRadius: 3,
							p: 3
						}
					}}
				>
					<DialogTitle sx={{ color: 'white', fontWeight: 'bold', fontSize: 26, pb: 2 }}>Add To Do</DialogTitle>
					<DialogContent>
						<Stack spacing={3} sx={{ minWidth: 400 }}>
							<Select 
								value={newType} 
								onChange={e => setNewType(e.target.value)}
								fullWidth
								variant="outlined"
								sx={{ background: 'rgba(255,255,255,0.08)', color: 'white', borderRadius: 1, fontSize: 18 }}
							>
								<MenuItem value='medicine'>Medicine</MenuItem>
								<MenuItem value='appointment'>Appointment</MenuItem>
								<MenuItem value='other'>Other</MenuItem>
							</Select>
							<TextField 
								label='Description' 
								value={newLabel} 
								onChange={e => setNewLabel(e.target.value)} 
								fullWidth
								variant="outlined"
								multiline
								minRows={3}
								InputLabelProps={{ style: { color: '#aaa', fontSize: 16 }, shrink: true }}
								InputProps={{ style: { color: 'white', background: 'rgba(255,255,255,0.08)', borderRadius: 4, fontSize: 16, padding: 10 } }}
							/>
							<TextField 
								label='Date' 
								type='date' 
								InputLabelProps={{ shrink: true, style: { color: '#aaa', fontSize: 16 } }} 
								value={newDate} 
								onChange={e => setNewDate(e.target.value)} 
								fullWidth
								variant="outlined"
								InputProps={{ style: { color: 'white', background: 'rgba(255,255,255,0.08)', borderRadius: 4, fontSize: 16 } }}
							/>
						</Stack>
					</DialogContent>
					<DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
						<Button onClick={() => setDialogOpen(false)} sx={{ color: '#aaa', fontSize: 16 }}>Cancel</Button>
						<Button onClick={handleAddTodo} variant='contained' color='primary' sx={{ fontSize: 16, px: 4 }}>
							Add
						</Button>
					</DialogActions>
				</Dialog>
			</VuiBox>
		</Card>
	);
}

export default ReferralTracking;
