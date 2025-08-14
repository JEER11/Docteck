import React, { useState } from 'react';
import { Card, Stack, Grid } from '@mui/material';
import VuiBox from 'components/VuiBox';
import VuiTypography from 'components/VuiTypography';
import VuiInput from 'components/VuiInput';
import VuiButton from 'components/VuiButton';
import GreenLightning from 'assets/images/shapes/green-lightning.svg';
import WhiteLightning from 'assets/images/shapes/white-lightning.svg';
import linearGradient from 'assets/theme/functions/linearGradient';
import colors from 'assets/theme/base/colors';
import carProfile from 'assets/images/shapes/car-profile.svg';
import LineChart from 'examples/Charts/LineCharts/LineChart';
import { lineChartDataProfile1, lineChartDataProfile2 } from 'variables/charts';
import { lineChartOptionsProfile2, lineChartOptionsProfile1 } from 'variables/charts';
import CircularProgress from '@mui/material/CircularProgress';
import HeightIcon from '@mui/icons-material/Height';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicationIcon from '@mui/icons-material/Medication';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
// removed CalendarMonthRoundedIcon (not used)
import MenuItem from '@mui/material/MenuItem';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const CarInformations = ({ popupVariant = 'legacy' }) => {
	const { gradients, info } = colors;
	const { cardContent } = gradients;

	// Medical profile state
	// Arrays may contain strings (legacy) or rich objects as added below
	const [emergencyContacts, setEmergencyContacts] = useState([]); // {name, relationship, phone, email, primary}
	const [conditions, setConditions] = useState([]); // {name, severity, status, onset, notes}
	const [allergies, setAllergies] = useState([]); // {allergen, type, reaction, severity}
	const [medications, setMedications] = useState([]); // {name, dosage, frequency, start, end, prescriber}
	const [pregnancy, setPregnancy] = useState('Not pregnant');
	const [height, setHeight] = useState('');
	const [heightUnit, setHeightUnit] = useState('cm');
	const [weight, setWeight] = useState('');
	const [weightUnit, setWeightUnit] = useState('kg');
	const [editMedicalOpen, setEditMedicalOpen] = useState(false);
	const [openBox, setOpenBox] = useState(null);
	const [editValue, setEditValue] = useState(''); // used for height/weight only
	const [editList, setEditList] = useState([]); // legacy variant only
	const [editUnit, setEditUnit] = useState('');
	// Rich editor state (settings variant)
	const [editItem, setEditItem] = useState(null);
	const [editingIndex, setEditingIndex] = useState(null);
	const [pairedHeight, setPairedHeight] = useState({ enabled: false, value: '', unit: 'cm' });
	const [editorOpen, setEditorOpen] = useState(false);

	// removed legacy handleAdd/handleRemove that depended on deleted state
	const handleBoxOpen = (box) => {
		setOpenBox(box);
		// Default to open the editor for list-based popups to match the Settings UX
		const openEditor = ['conditions', 'allergies', 'medications', 'emergencyContacts'].includes(box);
		setEditorOpen(openEditor);
		switch (box) {
			case 'emergencyContacts':
				setEditList([...emergencyContacts]); // legacy support
				setEditItem({ name: '', relationship: '', phone: '', email: '', primary: false });
				setEditingIndex(null);
				break;
			case 'conditions':
				setEditList([...conditions]);
				setEditItem({ name: '', severity: 'Mild', status: 'Active', onset: '', notes: '' });
				setEditingIndex(null);
				break;
			case 'allergies':
				setEditList([...allergies]);
				setEditItem({ allergen: '', type: 'Food', reaction: '', severity: 'Mild' });
				setEditingIndex(null);
				break;
			case 'medications':
				setEditList([...medications]);
				setEditItem({ name: '', dosage: '', frequency: '', start: '', end: '', prescriber: '' });
				setEditingIndex(null);
				break;
			case 'height':
				setEditValue(height);
				setEditUnit(heightUnit);
				break;
			case 'weight':
				setEditValue(weight);
				setEditUnit(weightUnit);
				setPairedHeight({ enabled: false, value: height || '', unit: heightUnit || 'cm' });
				break;
			default:
				setEditValue('');
				setEditList([]);
				setEditUnit('');
		}
	};
	const handleBoxClose = () => {
		setOpenBox(null);
		setEditValue('');
		setEditList([]);
		setEditUnit('');
		setEditItem(null);
		setEditingIndex(null);
	setPairedHeight({ enabled: false, value: '', unit: 'cm' });
	setEditorOpen(false);
	};
	const handleEditSave = () => {
		switch (openBox) {
			case 'emergencyContacts':
				// nothing to do; adds done inline
				break;
			case 'conditions':
				// nothing to do; adds done inline
				break;
			case 'allergies':
				// nothing to do; adds done inline
				break;
			case 'medications':
				// nothing to do; adds done inline
				break;
			case 'height':
				setHeight(editValue);
				setHeightUnit(editUnit);
				break;
			case 'weight':
				setWeight(editValue);
				setWeightUnit(editUnit);
				if (pairedHeight.enabled) {
					setHeight(pairedHeight.value);
					setHeightUnit(pairedHeight.unit);
				}
				break;
			default:
				break;
		}
		handleBoxClose();
	};
	const handleListAdd = () => {
		if (editValue) setEditList([...editList, editValue]);
		setEditValue('');
	};
	const handleListRemove = (idx) => {
		setEditList(editList.filter((_, i) => i !== idx));
	};

	// Helpers for rich list editing (settings variant)
	const commitItem = () => {
		if (!openBox || !editItem) return;
		const push = (setter, current, item) => setter([...(current || []), item]);
		if (openBox === 'conditions') {
			if (!editItem.name) return; // require name
			if (editingIndex !== null) {
				const next = [...conditions];
				next[editingIndex] = editItem;
				setConditions(next);
			} else {
				push(setConditions, conditions, editItem);
			}
		} else if (openBox === 'allergies') {
			if (!editItem.allergen) return;
			if (editingIndex !== null) {
				const next = [...allergies];
				next[editingIndex] = editItem;
				setAllergies(next);
			} else {
				push(setAllergies, allergies, editItem);
			}
		} else if (openBox === 'medications') {
			if (!editItem.name) return;
			if (editingIndex !== null) {
				const next = [...medications];
				next[editingIndex] = editItem;
				setMedications(next);
			} else {
				push(setMedications, medications, editItem);
			}
		} else if (openBox === 'emergencyContacts') {
			if (!editItem.name) return;
			if (editingIndex !== null) {
				const next = [...emergencyContacts];
				next[editingIndex] = editItem;
				setEmergencyContacts(next);
			} else {
				push(setEmergencyContacts, emergencyContacts, editItem);
			}
		}
		setEditItem(
			openBox === 'conditions' ? { name: '', severity: 'Mild', status: 'Active', onset: '', notes: '' } :
			openBox === 'allergies' ? { allergen: '', type: 'Food', reaction: '', severity: 'Mild' } :
			openBox === 'medications' ? { name: '', dosage: '', frequency: '', start: '', end: '', prescriber: '' } :
			{ name: '', relationship: '', phone: '', email: '', primary: false }
		);
		setEditingIndex(null);
		setEditorOpen(false);
	};
	const removeItem = (idx) => {
		if (openBox === 'conditions') setConditions(conditions.filter((_, i) => i !== idx));
		else if (openBox === 'allergies') setAllergies(allergies.filter((_, i) => i !== idx));
		else if (openBox === 'medications') setMedications(medications.filter((_, i) => i !== idx));
		else if (openBox === 'emergencyContacts') setEmergencyContacts(emergencyContacts.filter((_, i) => i !== idx));
	};
	const startEdit = (idx) => {
		if (openBox === 'conditions') setEditItem(conditions[idx] || null);
		else if (openBox === 'allergies') setEditItem(allergies[idx] || null);
		else if (openBox === 'medications') setEditItem(medications[idx] || null);
		else if (openBox === 'emergencyContacts') setEditItem(emergencyContacts[idx] || null);
		setEditingIndex(idx);
		setEditorOpen(true);
	};

	// Consistent popup styles like other account setting dialogs
	const popupPaperSx = {
		background: 'linear-gradient(145deg, rgba(20,22,40,0.92), rgba(24,26,47,0.96))',
		backdropFilter: 'blur(16px)',
		borderRadius: 4,
		boxShadow: '0 12px 48px rgba(0,0,0,0.55)',
		border: '1.5px solid #23244a',
		color: '#fff',
		overflow: 'hidden'
	};

	const rowBoxSx = {
		p: 1.25,
		borderRadius: 2,
		mb: 1,
		background: 'linear-gradient(180deg, rgba(24,26,47,0.7) 0%, rgba(22,24,45,0.7) 100%)',
		border: '1px solid rgba(255,255,255,0.08)'
	};

		const inputSx = {
			'& .MuiOutlinedInput-root': {
				background: 'rgba(26,28,52,0.85)',
				borderRadius: 2,
				border: '1px solid #2b2d55',
				color: '#fff',
				'& fieldset': { borderColor: 'transparent' },
				'&:hover fieldset': { borderColor: 'rgba(255,255,255,0.14)' },
					'&.Mui-focused fieldset': { borderColor: '#3b3df2' }
			},
				'& .MuiInputBase-input': { color: '#e7e9f3', fontSize: 14, fontWeight: 400, padding: '10px 12px' },
				'& .MuiOutlinedInput-input': { '::placeholder': { color: '#95a0d4', opacity: 1 } },
				'& .MuiInputAdornment-root': { color: '#aeb3d5' },
				'& .MuiInputLabel-root': { color: '#aeb3d5', fontSize: 12, fontWeight: 600 },
				'& .MuiInputLabel-root.Mui-focused': { color: '#e7e9f3' }
		};

	return (
		<Card
			sx={({ breakpoints }) => ({
				[breakpoints.up('xxl')]: {
					maxHeight: 'none'
				},
				mt: 4,
				minHeight: { xs: 320, md: 340, lg: 360 }, // Reduced minHeight for better fit
				display: 'flex',
				flexDirection: 'column',
			})}
		>
			<VuiBox display='flex' flexDirection='column' position='relative'>
				<VuiTypography variant='h6' color='white' fontWeight='bold' mb='6px' display='flex' alignItems='center' justifyContent='space-between' sx={{ fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
					Medical Profile
				</VuiTypography>
				<Grid container spacing={2} mb={2} mt={1}>
					<Grid item xs={12} md={4}>
						<VuiBox
							onClick={() => handleBoxOpen('emergencyContacts')}
							sx={{ cursor: 'pointer', transition: 'box-shadow 0.2s', ':hover': { boxShadow: 6 } }}
							display='flex'
							flexDirection='column'
							justifyContent='center'
							alignItems='center'
							p={2}
							borderRadius={3}
							background='rgba(30,32,60,0.7)'
							minHeight={100}
						>
							<PermContactCalendarIcon style={{ color: 'white', fontSize: 32, marginBottom: 8 }} />
							<VuiTypography color='text' variant='caption' fontWeight='medium' align='center'>
								Emergency Contacts
							</VuiTypography>
							<VuiTypography color='white' variant='button' fontWeight='bold' mt={1} align='center' sx={{ width: '100%' }}>
								{emergencyContacts.length ? emergencyContacts.map((c) => (typeof c === 'string' ? c : c.name)).filter(Boolean).join(', ') : '--'}
							</VuiTypography>
						</VuiBox>
					</Grid>
					<Grid item xs={12} md={4}>
						<VuiBox
							onClick={() => handleBoxOpen('allergies')}
							sx={{ cursor: 'pointer', transition: 'box-shadow 0.2s', ':hover': { boxShadow: 6 } }}
							display='flex'
							flexDirection='column'
							justifyContent='center'
							alignItems='center'
							p={2}
							borderRadius={3}
							background='rgba(30,32,60,0.7)'
							minHeight={100}
						>
							<WarningAmberIcon style={{ color: 'white', fontSize: 32, marginBottom: 8 }} />
							<VuiTypography color='text' variant='caption' fontWeight='medium'>
								Allergies
							</VuiTypography>
							<VuiTypography color='white' variant='button' fontWeight='bold' mt={1}>
								{allergies.length ? allergies.map((a) => (typeof a === 'string' ? a : a.allergen)).filter(Boolean).join(', ') : '--'}
							</VuiTypography>
						</VuiBox>
					</Grid>
					<Grid item xs={12} md={4}>
						<VuiBox
							onClick={() => handleBoxOpen('conditions')}
							sx={{ cursor: 'pointer', transition: 'box-shadow 0.2s', ':hover': { boxShadow: 6 } }}
							display='flex'
							flexDirection='column'
							justifyContent='center'
							alignItems='center'
							p={2}
							borderRadius={3}
							background='rgba(30,32,60,0.7)'
							minHeight={100}
						>
							<LocalHospitalIcon style={{ color: 'white', fontSize: 32, marginBottom: 8 }} />
							<VuiTypography color='text' variant='caption' fontWeight='medium'>
								Conditions
							</VuiTypography>
							<VuiTypography color='white' variant='button' fontWeight='bold' mt={1}>
								{conditions.length ? conditions.map((c) => (typeof c === 'string' ? c : c.name)).filter(Boolean).join(', ') : '--'}
							</VuiTypography>
						</VuiBox>
					</Grid>
					<Grid item xs={12} md={4}>
						<VuiBox
							onClick={() => handleBoxOpen('height')}
							sx={{ cursor: 'pointer', transition: 'box-shadow 0.2s', ':hover': { boxShadow: 6 } }}
							display='flex'
							flexDirection='column'
							justifyContent='center'
							alignItems='center'
							p={2}
							borderRadius={3}
							background='rgba(30,32,60,0.7)'
							minHeight={100}
						>
							<HeightIcon style={{ color: 'white', fontSize: 32, marginBottom: 8 }} />
							<VuiTypography color='text' variant='caption' fontWeight='medium'>
								Height
							</VuiTypography>
							<VuiTypography color='white' variant='button' fontWeight='bold' mt={1}>
								{height ? `${height} ${heightUnit}` : '--'}
							</VuiTypography>
						</VuiBox>
					</Grid>
					<Grid item xs={12} md={4}>
						<VuiBox
							onClick={() => handleBoxOpen('weight')}
							sx={{ cursor: 'pointer', transition: 'box-shadow 0.2s', ':hover': { boxShadow: 6 } }}
							display='flex'
							flexDirection='column'
							justifyContent='center'
							alignItems='center'
							p={2}
							borderRadius={3}
							background='rgba(30,32,60,0.7)'
							minHeight={100}
						>
							<MonitorWeightIcon style={{ color: 'white', fontSize: 32, marginBottom: 8 }} />
							<VuiTypography color='text' variant='caption' fontWeight='medium'>
								Weight
							</VuiTypography>
							<VuiTypography color='white' variant='button' fontWeight='bold' mt={1}>
								{weight ? `${weight} ${weightUnit}` : '--'}
							</VuiTypography>
						</VuiBox>
					</Grid>
					<Grid item xs={12} md={4}>
						<VuiBox
							onClick={() => handleBoxOpen('medications')}
							sx={{ cursor: 'pointer', transition: 'box-shadow 0.2s', ':hover': { boxShadow: 6 } }}
							display='flex'
							flexDirection='column'
							justifyContent='center'
							alignItems='center'
							p={2}
							borderRadius={3}
							background='rgba(30,32,60,0.7)'
							minHeight={100}
						>
							<MedicationIcon style={{ color: 'white', fontSize: 32, marginBottom: 8 }} />
							<VuiTypography color='text' variant='caption' fontWeight='medium'>
								Medications
							</VuiTypography>
							<VuiTypography color='white' variant='button' fontWeight='bold' mt={1}>
								{medications.length ? medications.map((m) => (typeof m === 'string' ? m : m.name)).filter(Boolean).join(', ') : '--'}
							</VuiTypography>
						</VuiBox>
					</Grid>
				</Grid>
				{/* Dialog for editing each box - choose variant */}
				{popupVariant === 'settings' ? (
					<Dialog open={!!openBox && openBox !== 'all'} onClose={handleBoxClose} maxWidth='sm' fullWidth
						PaperProps={{ sx: popupPaperSx }}>
						<DialogTitle sx={{ position: 'relative', px: 4, pt: 3, pb: 2 }}>
							<VuiTypography variant='lg' fontWeight='bold' color='white' sx={{ fontSize: 22 }}>
								Edit {openBox && openBox.charAt(0).toUpperCase() + openBox.slice(1)}
							</VuiTypography>
							<IconButton aria-label='close' onClick={handleBoxClose}
								sx={{ position: 'absolute', right: 12, top: 10, color: '#9fa3c1', '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.06)' } }}>
								<CloseRoundedIcon />
							</IconButton>
						</DialogTitle>
						<Divider sx={{ borderColor: '#23244a' }} />
						<DialogContent sx={{ px: 4, py: 3 }}>
							{['conditions', 'allergies', 'medications', 'emergencyContacts'].includes(openBox) && (
																						<>
																														{/* Collapsible editor — clean like Settings */}
																														<Accordion disableGutters expanded={editorOpen} onChange={() => setEditorOpen((v) => !v)} sx={{ bgcolor: 'transparent', boxShadow: 'none', '&:before': { display: 'none' } }}>
																															<AccordionSummary expandIcon={<ExpandMoreRoundedIcon sx={{ color: '#aeb3d5' }} />} sx={{ px: 0 }}>
																																<VuiTypography color='white' fontWeight='bold'>Add {openBox === 'conditions' ? 'condition' : openBox === 'allergies' ? 'allergy' : openBox === 'medications' ? 'medication' : 'contact'}</VuiTypography>
																															</AccordionSummary>
																															<AccordionDetails sx={{ pt: 0, px: 0, pb: 1.5 }}>
																															{openBox === 'conditions' && (
																								<VuiBox display='grid' gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={1} mt={1}>
																																	<TextField size='small' label='Condition' placeholder='e.g., Hypertension' value={editItem?.name || ''} onChange={(e) => setEditItem({ ...(editItem||{}), name: e.target.value })} sx={inputSx} />
																																	<TextField size='small' select label='Severity' value={editItem?.severity || 'Mild'} onChange={(e) => setEditItem({ ...(editItem||{}), severity: e.target.value })} sx={inputSx}>
																																		{['Mild','Moderate','Severe'].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
																																	</TextField>
																																	<TextField size='small' select label='Status' value={editItem?.status || 'Active'} onChange={(e) => setEditItem({ ...(editItem||{}), status: e.target.value })} sx={inputSx}>
																																		{['Active','Resolved'].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
																																	</TextField>
																									<TextField size='small' label='Onset date' type='date' value={editItem?.onset || ''} onChange={(e) => setEditItem({ ...(editItem||{}), onset: e.target.value })} sx={inputSx} InputLabelProps={{ shrink: true }} />
																									<TextField size='small' label='Notes' placeholder='optional' value={editItem?.notes || ''} onChange={(e) => setEditItem({ ...(editItem||{}), notes: e.target.value })} sx={{ gridColumn: '1 / -1', ...inputSx }} multiline minRows={2} />
																									  <VuiBox gridColumn='1 / -1' display='flex' justifyContent='flex-end' gap={1} mt={0.5}>
																										<VuiButton size='small' color='info' onClick={commitItem} sx={{ fontWeight: 700 }}>{editingIndex !== null ? 'Update' : 'Add'}</VuiButton>
																									</VuiBox>
																								</VuiBox>
																							)}
																															{openBox === 'allergies' && (
																								<VuiBox display='grid' gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={1} mt={1}>
																									<TextField size='small' label='Allergen' placeholder='e.g., Peanuts' value={editItem?.allergen || ''} onChange={(e) => setEditItem({ ...(editItem||{}), allergen: e.target.value })} sx={inputSx} />
																																	<TextField size='small' select label='Type' value={editItem?.type || 'Food'} onChange={(e) => setEditItem({ ...(editItem||{}), type: e.target.value })} sx={inputSx}>
																																		{['Food','Drug','Environmental','Other'].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
																																	</TextField>
																									<TextField size='small' label='Reaction' placeholder='e.g., Hives' value={editItem?.reaction || ''} onChange={(e) => setEditItem({ ...(editItem||{}), reaction: e.target.value })} sx={inputSx} />
																																	<TextField size='small' select label='Severity' value={editItem?.severity || 'Mild'} onChange={(e) => setEditItem({ ...(editItem||{}), severity: e.target.value })} sx={inputSx}>
																																		{['Mild','Moderate','Severe'].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
																																	</TextField>
																									  <VuiBox gridColumn='1 / -1' display='flex' justifyContent='flex-end' gap={1} mt={0.5}>
																										<VuiButton size='small' color='info' onClick={commitItem} sx={{ fontWeight: 700 }}>{editingIndex !== null ? 'Update' : 'Add'}</VuiButton>
																									</VuiBox>
																								</VuiBox>
																							)}
																							{openBox === 'medications' && (
																								<VuiBox display='grid' gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={1} mt={1}>
																								<TextField size='small' label='Medication' value={editItem?.name || ''} onChange={(e) => setEditItem({ ...(editItem||{}), name: e.target.value })} sx={inputSx} />
																								<TextField size='small' label='Dosage' value={editItem?.dosage || ''} onChange={(e) => setEditItem({ ...(editItem||{}), dosage: e.target.value })} sx={inputSx} />
																								<TextField size='small' label='Frequency' value={editItem?.frequency || ''} onChange={(e) => setEditItem({ ...(editItem||{}), frequency: e.target.value })} sx={inputSx} />
																								<TextField size='small' label='Prescriber' value={editItem?.prescriber || ''} onChange={(e) => setEditItem({ ...(editItem||{}), prescriber: e.target.value })} sx={inputSx} />
																									<TextField size='small' label='Start date' type='date' value={editItem?.start || ''} onChange={(e) => setEditItem({ ...(editItem||{}), start: e.target.value })} sx={inputSx} InputLabelProps={{ shrink: true }} />
																									<TextField size='small' label='End date' type='date' value={editItem?.end || ''} onChange={(e) => setEditItem({ ...(editItem||{}), end: e.target.value })} sx={inputSx} InputLabelProps={{ shrink: true }} />
																									  <VuiBox gridColumn='1 / -1' display='flex' justifyContent='flex-end' gap={1} mt={0.5}>
																										<VuiButton size='small' color='info' onClick={commitItem} sx={{ fontWeight: 700 }}>{editingIndex !== null ? 'Update' : 'Add'}</VuiButton>
																									</VuiBox>
																								</VuiBox>
																							)}
																							{openBox === 'emergencyContacts' && (
																								<VuiBox display='grid' gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={1} mt={1}>
																									<TextField size='small' label='Name' value={editItem?.name || ''} onChange={(e) => setEditItem({ ...(editItem||{}), name: e.target.value })} sx={inputSx} InputProps={{ startAdornment: (<InputAdornment position='start'><PersonOutlineRoundedIcon sx={{ color: '#aeb3d5' }} /></InputAdornment>) }} />
																									<TextField size='small' label='Relationship' value={editItem?.relationship || ''} onChange={(e) => setEditItem({ ...(editItem||{}), relationship: e.target.value })} sx={inputSx} />
																									<TextField size='small' label='Phone' value={editItem?.phone || ''} onChange={(e) => setEditItem({ ...(editItem||{}), phone: e.target.value })} sx={inputSx} InputProps={{ startAdornment: (<InputAdornment position='start'><PhoneRoundedIcon sx={{ color: '#aeb3d5' }} /></InputAdornment>) }} />
																									<TextField size='small' label='Email' type='email' value={editItem?.email || ''} onChange={(e) => setEditItem({ ...(editItem||{}), email: e.target.value })} sx={inputSx} InputProps={{ startAdornment: (<InputAdornment position='start'><EmailRoundedIcon sx={{ color: '#aeb3d5' }} /></InputAdornment>) }} />
																									<VuiBox gridColumn='1 / -1' display='flex' justifyContent='space-between' alignItems='center'>
																										<VuiTypography variant='caption' color='text'>Mark as primary contact</VuiTypography>
																										<Button onClick={() => setEditItem({ ...(editItem||{}), primary: !editItem?.primary })} sx={{ color: editItem?.primary ? '#00FFD0' : '#c6c9e5', textTransform: 'none' }}>{editItem?.primary ? 'Primary' : 'Not primary'}</Button>
																									</VuiBox>
																									  <VuiBox gridColumn='1 / -1' display='flex' justifyContent='flex-end' gap={1} mt={0.5}>
																										<VuiButton size='small' color='info' onClick={commitItem} sx={{ fontWeight: 700 }}>{editingIndex !== null ? 'Update' : 'Add'}</VuiButton>
																									</VuiBox>
																								</VuiBox>
																							)}
																															</AccordionDetails>
																														</Accordion>

																														{/* List below the editor with empty state */}
															{(() => {
																															const list = (openBox === 'conditions' ? conditions : openBox === 'allergies' ? allergies : openBox === 'medications' ? medications : emergencyContacts);
																															if (!list || list.length === 0) {
																																const label = openBox === 'conditions' ? 'No condition added' : openBox === 'allergies' ? 'No allergies added' : openBox === 'medications' ? 'No medication added' : 'No contact added';
																return <VuiTypography color='text' sx={{ mt: 1.25 }}>{label}</VuiTypography>;
																															}
																															return list.map((item, idx) => {
																																const isObj = typeof item === 'object' && item !== null;
																																const primaryText = openBox === 'conditions' ? (isObj ? item.name : item) :
																																	openBox === 'allergies' ? (isObj ? item.allergen : item) :
																																	openBox === 'medications' ? (isObj ? item.name : item) :
																																	(isObj ? item.name : item);
																																const meta = openBox === 'conditions' && isObj ? (
																																	<VuiBox display='flex' gap={0.75} alignItems='center'>
																																		{item.severity && <Chip size='small' label={item.severity} sx={{ height: 22, color: '#cfd3f7', borderColor: 'rgba(255,255,255,0.25)' }} variant='outlined' />}
																																		{item.status && <Chip size='small' label={item.status} sx={{ height: 22, color: '#cfd3f7', borderColor: 'rgba(255,255,255,0.25)' }} variant='outlined' />}
																																		{item.onset && <VuiTypography variant='caption' color='text'>Onset: {item.onset}</VuiTypography>}
																																	</VuiBox>
																																) : openBox === 'allergies' && isObj ? (
																																	<VuiBox display='flex' gap={0.75} alignItems='center'>
																																		{item.type && <Chip size='small' label={item.type} sx={{ height: 22, color: '#cfd3f7', borderColor: 'rgba(255,255,255,0.25)' }} variant='outlined' />}
																																		{item.severity && <Chip size='small' label={item.severity} sx={{ height: 22, color: '#cfd3f7', borderColor: 'rgba(255,255,255,0.25)' }} variant='outlined' />}  
																																		{item.reaction && <VuiTypography variant='caption' color='text'>Reaction: {item.reaction}</VuiTypography>}
																																	</VuiBox>
																																) : openBox === 'medications' && isObj ? (
																																	<VuiTypography variant='caption' color='text'>
																																		{item.dosage ? `${item.dosage}` : ''}{item.frequency ? `, ${item.frequency}` : ''}{item.start ? ` • ${item.start}` : ''}{item.end ? ` → ${item.end}` : ''}
																																	</VuiTypography>
																																) : openBox === 'emergencyContacts' && isObj ? (
																																	<VuiTypography variant='caption' color='text'>
																																		{item.relationship ? `${item.relationship} • ` : ''}{item.phone || ''}{item.primary ? ' • Primary' : ''}
																																	</VuiTypography>
																																) : null;
																																return (
																																	<VuiBox key={idx} sx={rowBoxSx} display='flex' alignItems='center' justifyContent='space-between'>
																																		<VuiBox>
																																			<VuiTypography color='white' variant='button' fontWeight='bold'>
																																				{primaryText}
																																			</VuiTypography>
																																			{meta}
																																		</VuiBox>
																																		<VuiBox display='flex' alignItems='center' gap={1}>
																																			<Tooltip title='Edit'><IconButton size='small' onClick={() => startEdit(idx)} sx={{ color: '#c6c9e5' }}><EditIcon fontSize='small' /></IconButton></Tooltip>
																																			<Tooltip title='Remove'><IconButton size='small' onClick={() => removeItem(idx)} sx={{ color: '#c6c9e5' }}><CloseRoundedIcon fontSize='small' /></IconButton></Tooltip>
																																		</VuiBox>
																																	</VuiBox>
																																);
																															});
																														})()}
																						</>
																					)}
														{openBox === 'height' && (
															<VuiBox display='flex' alignItems='center' gap={1}>
																<TextField
																	size='small'
																	variant='outlined'
																	placeholder='Height'
																	type='number'
																	value={editValue}
																	onChange={(e) => setEditValue(e.target.value)}
																	sx={{ width: 160, ...inputSx }}
																	InputProps={{
																		startAdornment: (
																			<InputAdornment position='start'>
																				<HeightIcon sx={{ color: '#aeb3d5' }} />
																			</InputAdornment>
																		)
																	}}
																/>
																<select
																	value={editUnit}
																	onChange={(e) => setEditUnit(e.target.value)}
																	style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(26,28,52,0.85)', color: '#fff', border: '1px solid #2b2d55' }}
																>
																	<option value='cm'>cm</option>
																	<option value='in'>in</option>
																</select>
															</VuiBox>
														)}
																					{openBox === 'weight' && (
																						<VuiBox display='flex' flexDirection='column' gap={1}>
																							<VuiBox display='flex' alignItems='center' gap={1}>
																								<TextField
																									size='small'
																									variant='outlined'
																									label='Weight'
																									type='number'
																									value={editValue}
																									onChange={(e) => setEditValue(e.target.value)}
																									sx={{ width: 180, ...inputSx }}
																									InputProps={{
																										startAdornment: (
																											<InputAdornment position='start'>
																												<MonitorWeightIcon sx={{ color: '#aeb3d5' }} />
																											</InputAdornment>
																										)
																									}}
																								/>
																								<TextField size='small' select label='Unit' value={editUnit} onChange={(e) => setEditUnit(e.target.value)} sx={{ width: 120, ...inputSx }}>
																									{['kg','lbs'].map(u => <MenuItem key={u} value={u}>{u}</MenuItem>)}
																								</TextField>
																							</VuiBox>
																							<FormControlLabel control={<Switch checked={pairedHeight.enabled} onChange={(e) => setPairedHeight({ ...pairedHeight, enabled: e.target.checked })} />} label={<VuiTypography variant='button' color='text'>Also update height</VuiTypography>} />
																							{pairedHeight.enabled && (
																								<VuiBox display='flex' alignItems='center' gap={1}>
																									<TextField size='small' variant='outlined' label='Height' type='number' value={pairedHeight.value} onChange={(e) => setPairedHeight({ ...pairedHeight, value: e.target.value })} sx={{ width: 180, ...inputSx }} InputProps={{ startAdornment: (<InputAdornment position='start'><HeightIcon sx={{ color: '#aeb3d5' }} /></InputAdornment>) }} />
																									<TextField size='small' select label='Unit' value={pairedHeight.unit} onChange={(e) => setPairedHeight({ ...pairedHeight, unit: e.target.value })} sx={{ width: 120, ...inputSx }}>
																										{['cm','in'].map(u => <MenuItem key={u} value={u}>{u}</MenuItem>)}
																									</TextField>
																								</VuiBox>
																							)}
																						</VuiBox>
																					)}
						</DialogContent>
						<Divider sx={{ borderColor: '#23244a' }} />
						<DialogActions sx={{ px: 4, py: 2 }}>
							<Button onClick={handleBoxClose} sx={{ color: '#fff', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2, py: 1 }}>
								Close
							</Button>
							<Button onClick={handleEditSave} color='primary' sx={{ color: '#fff', borderRadius: 2, textTransform: 'none', fontWeight: 700, px: 2.5, py: 1, background: 'linear-gradient(90deg,#6a6afc,#8b8bfc)', boxShadow: '0 2px 8px #6a6afc33', '&:hover': { background: 'linear-gradient(90deg,#8b8bfc,#6a6afc)' } }}>
								Save
							</Button>
						</DialogActions>
					</Dialog>
				) : (
					<Dialog open={!!openBox && openBox !== 'all'} onClose={handleBoxClose} maxWidth='xs' fullWidth>
						<DialogTitle>Edit {openBox && openBox.charAt(0).toUpperCase() + openBox.slice(1)}</DialogTitle>
						<DialogContent>
							{['emergencyContacts', 'conditions', 'allergies', 'medications'].includes(openBox) && (
								<>
									{editList.map((item, idx) => (
										<VuiBox key={idx} display='flex' alignItems='center' mb={1}>
											<VuiTypography color='white' variant='button' mr={1}>
												{item}
											</VuiTypography>
											<VuiButton size='small' color='error' onClick={() => handleListRemove(idx)}>
												Remove
											</VuiButton>
										</VuiBox>
									))}
									<VuiBox display='flex' mt={1}>
										<VuiInput
											placeholder={`Add ${openBox.slice(0, -1)}`}
											value={editValue}
											onChange={(e) => setEditValue(e.target.value)}
											sx={{ mr: 1 }}
										/>
										<VuiButton size='small' color='info' onClick={handleListAdd}>
											Add
										</VuiButton>
									</VuiBox>
								</>
							)}
							{openBox === 'height' && (
								<VuiBox display='flex' alignItems='center'>
									<VuiInput
										placeholder='Height'
										type='number'
										value={editValue}
										onChange={(e) => setEditValue(e.target.value)}
										sx={{ mr: 1, width: '80px' }}
									/>
									<select
										value={editUnit}
										onChange={(e) => setEditUnit(e.target.value)}
										style={{
											padding: '6px',
											borderRadius: '6px'
										}}
									>
										<option value='cm'>cm</option>
										<option value='in'>in</option>
									</select>
								</VuiBox>
							)}
							{openBox === 'weight' && (
								<VuiBox display='flex' alignItems='center'>
									<VuiInput
										placeholder='Weight'
										type='number'
										value={editValue}
										onChange={(e) => setEditValue(e.target.value)}
										sx={{ mr: 1, width: '80px' }}
									/>
									<select
										value={editUnit}
										onChange={(e) => setEditUnit(e.target.value)}
										style={{
											padding: '6px',
											borderRadius: '6px'
										}}
									>
										<option value='kg'>kg</option>
										<option value='lbs'>lbs</option>
									</select>
								</VuiBox>
							)}
						</DialogContent>
						<DialogActions>
							<Button onClick={handleBoxClose}>Cancel</Button>
							<Button onClick={handleEditSave} color='primary'>
								Save
							</Button>
						</DialogActions>
					</Dialog>
				)}
			</VuiBox>
		</Card>
	);
};

export default CarInformations;
