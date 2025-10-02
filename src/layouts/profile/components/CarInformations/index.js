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
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
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

	// Consistent popup styles like other account setting dialogs (enhanced)
	const popupPaperSx = {
		background: 'linear-gradient(145deg, rgba(20,22,40,0.90), rgba(24,26,47,0.94))',
		backdropFilter: 'blur(18px) saturate(140%)',
		borderRadius: 5,
		boxShadow: '0 18px 60px -4px rgba(0,0,0,0.65), 0 4px 18px rgba(0,0,0,0.4)',
		border: '1.5px solid rgba(90,98,160,0.35)',
		color: '#fff',
		overflow: 'hidden',
		minHeight: 520,
	};

	const rowBoxSx = {
		p: 1.15,
		borderRadius: 2.2,
		mb: 1,
		background: 'linear-gradient(180deg, rgba(28,30,55,0.72) 0%, rgba(24,26,50,0.68) 100%)',
		border: '1px solid rgba(255,255,255,0.09)',
		transition: 'background .25s,border-color .25s',
		'&:hover': { background: 'linear-gradient(180deg, rgba(34,36,63,0.82) 0%, rgba(30,32,58,0.8) 100%)', borderColor: 'rgba(255,255,255,0.18)' }
	};

		const inputSx = {
			'& .MuiOutlinedInput-root': {
				background: 'linear-gradient(180deg, rgba(34,36,65,0.9) 0%, rgba(30,32,58,0.9) 100%)',
				borderRadius: 2.2,
				border: '1px solid #2b2d55',
				color: '#fff',
				cursor: 'pointer',
				'& fieldset': { borderColor: 'transparent' },
				'&:hover fieldset': { borderColor: 'rgba(255,255,255,0.18)' },
				'&.Mui-focused fieldset': { borderColor: '#3b3df2', boxShadow: '0 0 0 1px #3b3df255' }
			},
			'& .MuiInputBase-input': { color: '#e7e9f3', fontSize: 14, fontWeight: 400, padding: '10px 12px', cursor: 'pointer' },
			'& .MuiOutlinedInput-input': { '::placeholder': { color: '#95a0d4', opacity: 1 } },
			'& .MuiInputAdornment-root': { color: '#aeb3d5' },
			'& .MuiInputLabel-root': { color: '#aeb3d5', fontSize: 12, fontWeight: 600 },
			'& .MuiInputLabel-root.Mui-focused': { color: '#e7e9f3' },
			// Select specific styling
			'& .MuiSelect-select': { pr: '36px !important', cursor: 'pointer' },
			'& .MuiSvgIcon-root': { color: '#9fa5cb' }
		};

	// Common Select props with custom arrow
	const selectProps = {
		IconComponent: ExpandMoreRoundedIcon,
		MenuProps: {
			PaperProps: {
				sx: {
					bgcolor: 'rgba(30,32,55,0.96)',
					backdropFilter: 'blur(12px)',
					border: '1px solid rgba(255,255,255,0.08)',
					'& .MuiMenuItem-root': { fontSize: 14 }
				}
			}
		}
	};

	const relationshipOptions = ['Parent','Spouse','Sibling','Child','Relative','Friend','Doctor','Neighbor','Other'];

	// Reusable date field with custom arrow (no duplicate native icon shown) and full-surface click
	const QuickDateField = ({ label, value, onChange }) => (
		<TextField
			size='small'
			label={label}
			type='date'
			value={value || ''}
			onChange={(e)=> onChange(e.target.value)}
			sx={{
				...inputSx,
				'& input[type="date"]::-webkit-calendar-picker-indicator': { opacity: 0, display: 'none' },
				'& input[type="date"]': { cursor: 'pointer' },
			}}
			InputLabelProps={{ shrink: true }}
			InputProps={{ endAdornment: (<InputAdornment position='end'><CalendarTodayIcon sx={{ fontSize: 18, color: '#9fa5cb' }} /></InputAdornment>) }}
			onMouseDown={(e)=> {
				// Open native picker immediately if supported
				const input = e.currentTarget.querySelector('input');
				if (input && input.showPicker) {
					e.preventDefault();
					input.showPicker();
				}
			}}
		/>
	);

	// Friendly label (e.g., emergencyContacts -> Emergency Contacts)
	const formatLabel = (key) => key ? key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()) : '';

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
					<Dialog open={!!openBox && openBox !== 'all'} onClose={handleBoxClose} maxWidth='md' fullWidth
						PaperProps={{ sx: popupPaperSx }}>
						<DialogTitle sx={{ position: 'relative', px: 5, pt: 3.25, pb: 2.25 }}>
							<VuiTypography variant='lg' fontWeight='bold' color='white' sx={{ fontSize: 23, letterSpacing: 0.3 }}>
								Edit {formatLabel(openBox || '')}
							</VuiTypography>
							<IconButton aria-label='close' onClick={handleBoxClose}
								sx={{ position: 'absolute', right: 14, top: 12, color: '#9fa3c1', '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.08)' } }}>
								<CloseRoundedIcon />
							</IconButton>
						</DialogTitle>
						<Divider sx={{ borderColor: '#23244a' }} />
						<DialogContent sx={{ px: 5, py: 3.5 }}>
							{['conditions', 'allergies', 'medications', 'emergencyContacts'].includes(openBox) && (
																						<>
													{/* Collapsible editor — clean like Settings (enhanced panel) */}
													<Accordion disableGutters expanded={editorOpen} onChange={() => setEditorOpen((v) => !v)} sx={{ bgcolor: 'transparent', boxShadow: 'none', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden', backdropFilter: 'blur(10px)', background: 'radial-gradient(circle at 30% 20%, rgba(60,65,110,0.18), rgba(30,32,55,0.25))', '&:before': { display: 'none' } }}>
														<AccordionSummary expandIcon={<ExpandMoreRoundedIcon sx={{ color: '#aeb3d5' }} />} sx={{ px: 2.25, py: 1.25 }}>
															<VuiTypography color='white' fontWeight='bold'>Add {openBox === 'conditions' ? 'condition' : openBox === 'allergies' ? 'allergy' : openBox === 'medications' ? 'medication' : 'contact'}</VuiTypography>
														</AccordionSummary>
																					<AccordionDetails sx={{ pt: 0, px: 2.25, pb: 2.25 }}>
																															{openBox === 'conditions' && (
																								<VuiBox display='grid' gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={1} mt={1}>
																																	<TextField size='small' label='Condition' placeholder='e.g., Hypertension' value={editItem?.name || ''} onChange={(e) => setEditItem({ ...(editItem||{}), name: e.target.value })} sx={inputSx} />
																																	<TextField size='small' select label='Severity' value={editItem?.severity || 'Mild'} onChange={(e) => setEditItem({ ...(editItem||{}), severity: e.target.value })} sx={inputSx} SelectProps={selectProps}>
																																		{['Mild','Moderate','Severe'].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
																																	</TextField>
																																	<TextField size='small' select label='Status' value={editItem?.status || 'Active'} onChange={(e) => setEditItem({ ...(editItem||{}), status: e.target.value })} sx={inputSx} SelectProps={selectProps}>
																																		{['Active','Resolved'].map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
																																	</TextField>
																																<QuickDateField label='Onset date' value={editItem?.onset} onChange={(val)=> setEditItem({ ...(editItem||{}), onset: val })} />
																									<TextField size='small' label='Notes' placeholder='optional' value={editItem?.notes || ''} onChange={(e) => setEditItem({ ...(editItem||{}), notes: e.target.value })} sx={{ gridColumn: '1 / -1', ...inputSx }} multiline minRows={2} />
																									  <VuiBox gridColumn='1 / -1' display='flex' justifyContent='flex-end' gap={1} mt={0.5}>
																										<VuiButton size='small' color='info' onClick={commitItem} sx={{ fontWeight: 700 }}>{editingIndex !== null ? 'Update' : 'Add'}</VuiButton>
																									</VuiBox>
																								</VuiBox>
																							)}
																															{openBox === 'allergies' && (
																								<VuiBox display='grid' gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={1} mt={1}>
																																<TextField size='small' label='Allergen' placeholder='e.g., Peanuts' value={editItem?.allergen || ''} onChange={(e) => setEditItem({ ...(editItem||{}), allergen: e.target.value })} sx={inputSx} />
																																	<Autocomplete
																																		size='small'
																																		options={['Food','Drug','Environmental','Other']}
																																		value={editItem?.type || 'Food'}
																																		onChange={(_, val) => setEditItem({ ...(editItem||{}), type: val || 'Food' })}
																																		autoHighlight
																																		clearOnEscape
																																		disableClearable
																																		renderInput={(params) => (
																																			<TextField
																																				{...params}
																																				label="Type"
																																				placeholder="Select type"
																																				sx={{
																																					...inputSx,
																																					'& .MuiOutlinedInput-input': { py: 1 },
																																				}}
																																			/>
																																		)}
																																		sx={{
																																			'& .MuiOutlinedInput-root': { p: 0.25, pr: 1 },
																																			'& .MuiAutocomplete-endAdornment': {
																																				'& .MuiSvgIcon-root': {
																																					color: '#9fa5cb',
																																					fontSize: '1.2rem',
																																				},
																																			},
																																		}}
																																		ListboxProps={{ 
																																			style: { 
																																				maxHeight: 240,
																																				backgroundColor: 'rgba(30,32,55,0.96)',
																																				backdropFilter: 'blur(12px)',
																																				border: '1px solid rgba(255,255,255,0.08)',
																																				borderRadius: 8,
																																			}
																																		}}
																																		componentsProps={{
																																			paper: {
																																				sx: {
																																					backgroundColor: 'rgba(30,32,55,0.96)',
																																					backdropFilter: 'blur(12px)',
																																					border: '1px solid rgba(255,255,255,0.08)',
																																					borderRadius: 2,
																																					'& .MuiAutocomplete-option': {
																																						color: '#fff',
																																						fontSize: 14,
																																						'&:hover': {
																																							backgroundColor: 'rgba(106, 106, 252, 0.1)',
																																						},
																																						'&.Mui-focused': {
																																							backgroundColor: 'rgba(106, 106, 252, 0.2)',
																																						},
																																					},
																																				},
																																			},
																																		}}
																																	/>
																																<TextField size='small' label='Reaction' placeholder='e.g., Hives' value={editItem?.reaction || ''} onChange={(e) => setEditItem({ ...(editItem||{}), reaction: e.target.value })} sx={inputSx} />
																																	<Autocomplete
																																		size='small'
																																		options={['Mild','Moderate','Severe']}
																																		value={editItem?.severity || 'Mild'}
																																		onChange={(_, val) => setEditItem({ ...(editItem||{}), severity: val || 'Mild' })}
																																		autoHighlight
																																		clearOnEscape
																																		disableClearable
																																		renderInput={(params) => (
																																			<TextField
																																				{...params}
																																				label="Severity"
																																				placeholder="Select severity"
																																				sx={{
																																					...inputSx,
																																					'& .MuiOutlinedInput-input': { py: 1 },
																																				}}
																																			/>
																																		)}
																																		sx={{
																																			'& .MuiOutlinedInput-root': { p: 0.25, pr: 1 },
																																			'& .MuiAutocomplete-endAdornment': {
																																				'& .MuiSvgIcon-root': {
																																					color: '#9fa5cb',
																																					fontSize: '1.2rem',
																																				},
																																			},
																																		}}
																																		ListboxProps={{ 
																																			style: { 
																																				maxHeight: 240,
																																				backgroundColor: 'rgba(30,32,55,0.96)',
																																				backdropFilter: 'blur(12px)',
																																				border: '1px solid rgba(255,255,255,0.08)',
																																				borderRadius: 8,
																																			}
																																		}}
																																		componentsProps={{
																																			paper: {
																																				sx: {
																																					backgroundColor: 'rgba(30,32,55,0.96)',
																																					backdropFilter: 'blur(12px)',
																																					border: '1px solid rgba(255,255,255,0.08)',
																																					borderRadius: 2,
																																					'& .MuiAutocomplete-option': {
																																						color: '#fff',
																																						fontSize: 14,
																																						'&:hover': {
																																							backgroundColor: 'rgba(106, 106, 252, 0.1)',
																																						},
																																						'&.Mui-focused': {
																																							backgroundColor: 'rgba(106, 106, 252, 0.2)',
																																						},
																																					},
																																				},
																																			},
																																		}}
																																	/>
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
																								<QuickDateField label='Start date' value={editItem?.start} onChange={(val)=> setEditItem({ ...(editItem||{}), start: val })} />
																								<QuickDateField label='End date' value={editItem?.end} onChange={(val)=> setEditItem({ ...(editItem||{}), end: val })} />
																									  <VuiBox gridColumn='1 / -1' display='flex' justifyContent='flex-end' gap={1} mt={0.5}>
																										<VuiButton size='small' color='info' onClick={commitItem} sx={{ fontWeight: 700 }}>{editingIndex !== null ? 'Update' : 'Add'}</VuiButton>
																									</VuiBox>
																								</VuiBox>
																							)}
																							{openBox === 'emergencyContacts' && (
																								<VuiBox display='grid' gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={1} mt={1}>
																									<TextField size='small' label='Name' value={editItem?.name || ''} onChange={(e) => setEditItem({ ...(editItem||{}), name: e.target.value })} sx={inputSx} InputProps={{ startAdornment: (<InputAdornment position='start'><PersonOutlineRoundedIcon sx={{ color: '#aeb3d5' }} /></InputAdornment>) }} />
																									<Autocomplete
																										size='small'
																										options={relationshipOptions}
																										value={relationshipOptions.includes(editItem?.relationship) ? editItem?.relationship : null}
																										onChange={(_, val) => {
																											if (val === 'Other') {
																												setEditItem({ ...(editItem||{}), relationship: editItem?.relationship && !relationshipOptions.includes(editItem.relationship) ? editItem.relationship : '' });
																											} else {
																												setEditItem({ ...(editItem||{}), relationship: val || '' });
																											}
																										}}
																										autoHighlight
																										clearOnEscape
																										disableClearable
																										renderInput={(params) => (
																											<TextField
																												{...params}
																												label="Relationship"
																												placeholder="Select relationship"
																												sx={{
																													...inputSx,
																													'& .MuiOutlinedInput-input': { py: 1 },
																												}}
																											/>
																										)}
																										sx={{
																											'& .MuiOutlinedInput-root': { p: 0.25, pr: 1 },
																											'& .MuiAutocomplete-endAdornment': {
																												'& .MuiSvgIcon-root': {
																													color: '#9fa5cb',
																													fontSize: '1.2rem',
																												},
																											},
																										}}
																										ListboxProps={{ 
																											style: { 
																												maxHeight: 240,
																												backgroundColor: 'rgba(30,32,55,0.96)',
																												backdropFilter: 'blur(12px)',
																												border: '1px solid rgba(255,255,255,0.08)',
																												borderRadius: 8,
																											}
																										}}
																										componentsProps={{
																											paper: {
																												sx: {
																													backgroundColor: 'rgba(30,32,55,0.96)',
																													backdropFilter: 'blur(12px)',
																													border: '1px solid rgba(255,255,255,0.08)',
																													borderRadius: 2,
																													'& .MuiAutocomplete-option': {
																														color: '#fff',
																														fontSize: 14,
																														'&:hover': {
																															backgroundColor: 'rgba(106, 106, 252, 0.1)',
																														},
																														'&.Mui-focused': {
																															backgroundColor: 'rgba(106, 106, 252, 0.2)',
																														},
																													},
																												},
																											},
																										}}
																									/>
																									{/* Custom relationship input when Other selected */}
																									{(!editItem?.relationship || !relationshipOptions.includes(editItem.relationship)) && (
																										<TextField size='small' label='Custom relationship' placeholder='e.g., Cousin' value={editItem?.relationship || ''} onChange={(e) => setEditItem({ ...(editItem||{}), relationship: e.target.value })} sx={{ gridColumn: '1 / -1', ...inputSx }} />
																									)}
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
																																	<VuiBox display='flex' gap={0.75} alignItems='center' flexWrap='wrap'>
																																		{item.relationship && <Chip size='small' label={item.relationship} sx={{ height: 22, color: '#cfd3f7', borderColor: 'rgba(255,255,255,0.25)' }} variant='outlined' />}
																																		{item.phone && <VuiTypography variant='caption' color='text'>{item.phone}</VuiTypography>}
																																		{item.email && <VuiTypography variant='caption' color='text'>{item.email}</VuiTypography>}
																																		{item.primary && <Chip size='small' label='Primary' sx={{ height: 22, color: '#00ffd0', borderColor: 'rgba(0,255,208,0.45)' }} variant='outlined' />}
																																	</VuiBox>
																																) : null;
																																return (
																																	<VuiBox key={idx} sx={{ ...rowBoxSx, borderColor: (openBox === 'emergencyContacts' && isObj && item.primary) ? 'rgba(0,255,208,0.5)' : rowBoxSx.border, boxShadow: (openBox === 'emergencyContacts' && isObj && item.primary) ? '0 0 0 1px rgba(0,255,208,0.25)' : 'none' }} display='flex' alignItems='center' justifyContent='space-between'>
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
																								<TextField size='small' select label='Unit' value={editUnit} onChange={(e) => setEditUnit(e.target.value)} sx={{ width: 120, ...inputSx }} SelectProps={selectProps}>
																									{['kg','lbs'].map(u => <MenuItem key={u} value={u}>{u}</MenuItem>)}
																								</TextField>
																							</VuiBox>
																							<FormControlLabel control={<Switch checked={pairedHeight.enabled} onChange={(e) => setPairedHeight({ ...pairedHeight, enabled: e.target.checked })} />} label={<VuiTypography variant='button' color='text'>Also update height</VuiTypography>} />
																							{pairedHeight.enabled && (
																								<VuiBox display='flex' alignItems='center' gap={1}>
																									<TextField size='small' variant='outlined' label='Height' type='number' value={pairedHeight.value} onChange={(e) => setPairedHeight({ ...pairedHeight, value: e.target.value })} sx={{ width: 180, ...inputSx }} InputProps={{ startAdornment: (<InputAdornment position='start'><HeightIcon sx={{ color: '#aeb3d5' }} /></InputAdornment>) }} />
																								<TextField size='small' select label='Unit' value={pairedHeight.unit} onChange={(e) => setPairedHeight({ ...pairedHeight, unit: e.target.value })} sx={{ width: 120, ...inputSx }} SelectProps={selectProps}>
																										{['cm','in'].map(u => <MenuItem key={u} value={u}>{u}</MenuItem>)}
																									</TextField>
																								</VuiBox>
																							)}
																						</VuiBox>
																					)}
						</DialogContent>
						<Divider sx={{ borderColor: '#23244a', mt: 0.5 }} />
						<DialogActions sx={{ px: 5, py: 2.4 }}>
							<Button onClick={handleBoxClose} sx={{ color: '#fff', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2.2, py: 1, background: 'rgba(255,255,255,0.04)', '&:hover': { background: 'rgba(255,255,255,0.08)' } }}>
								Close
							</Button>
							<Button onClick={handleEditSave} color='primary' sx={{ color: '#fff', borderRadius: 2.2, textTransform: 'none', fontWeight: 700, px: 2.7, py: 1.05, background: 'linear-gradient(90deg,#5353f6,#7d7dfc)', boxShadow: '0 4px 14px -2px #5353f666', '&:hover': { background: 'linear-gradient(90deg,#7d7dfc,#5353f6)' } }}>
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
