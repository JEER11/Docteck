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

const CarInformations = () => {
	const { gradients, info } = colors;
	const { cardContent } = gradients;

	// Medical profile state
	const [emergencyContacts, setEmergencyContacts] = useState([]);
	const [newContact, setNewContact] = useState('');
	const [conditions, setConditions] = useState([]);
	const [newCondition, setNewCondition] = useState('');
	const [allergies, setAllergies] = useState([]);
	const [newAllergy, setNewAllergy] = useState('');
	const [medications, setMedications] = useState([]);
	const [newMedication, setNewMedication] = useState('');
	const [pregnancy, setPregnancy] = useState('Not pregnant');
	const [height, setHeight] = useState('');
	const [heightUnit, setHeightUnit] = useState('cm');
	const [weight, setWeight] = useState('');
	const [weightUnit, setWeightUnit] = useState('kg');
	const [editMedicalOpen, setEditMedicalOpen] = useState(false);
	const [openBox, setOpenBox] = useState(null);
	const [editValue, setEditValue] = useState('');
	const [editList, setEditList] = useState([]);
	const [editUnit, setEditUnit] = useState('');

	// Handlers for add/remove
	const handleAdd = (type) => {
		switch (type) {
			case 'contact':
				if (newContact) setEmergencyContacts([...emergencyContacts, newContact]);
				setNewContact('');
				break;
			case 'condition':
				if (newCondition) setConditions([...conditions, newCondition]);
				setNewCondition('');
				break;
			case 'allergy':
				if (newAllergy) setAllergies([...allergies, newAllergy]);
				setNewAllergy('');
				break;
			case 'medication':
				if (newMedication) setMedications([...medications, newMedication]);
				setNewMedication('');
				break;
			default:
				break;
		}
	};
	const handleRemove = (type, idx) => {
		switch (type) {
			case 'contact':
				setEmergencyContacts(emergencyContacts.filter((_, i) => i !== idx));
				break;
			case 'condition':
				setConditions(conditions.filter((_, i) => i !== idx));
				break;
			case 'allergy':
				setAllergies(allergies.filter((_, i) => i !== idx));
				break;
			case 'medication':
				setMedications(medications.filter((_, i) => i !== idx));
				break;
			default:
				break;
		}
	};
	const handleBoxOpen = (box) => {
		setOpenBox(box);
		switch (box) {
			case 'emergencyContacts':
				setEditList([...emergencyContacts]);
				setEditValue('');
				break;
			case 'conditions':
				setEditList([...conditions]);
				setEditValue('');
				break;
			case 'allergies':
				setEditList([...allergies]);
				setEditValue('');
				break;
			case 'medications':
				setEditList([...medications]);
				setEditValue('');
				break;
			case 'height':
				setEditValue(height);
				setEditUnit(heightUnit);
				break;
			case 'weight':
				setEditValue(weight);
				setEditUnit(weightUnit);
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
	};
	const handleEditSave = () => {
		switch (openBox) {
			case 'emergencyContacts':
				setEmergencyContacts(editList);
				break;
			case 'conditions':
				setConditions(editList);
				break;
			case 'allergies':
				setAllergies(editList);
				break;
			case 'medications':
				setMedications(editList);
				break;
			case 'height':
				setHeight(editValue);
				setHeightUnit(editUnit);
				break;
			case 'weight':
				setWeight(editValue);
				setWeightUnit(editUnit);
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
							<VuiTypography
								color='white'
								variant='button'
								fontWeight='bold'
								mt={1}
								align='center'
								sx={{ width: '100%' }}
							>
								{emergencyContacts.length ? emergencyContacts.join(', ') : '--'}
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
								{allergies.length ? allergies.join(', ') : '--'}
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
								{conditions.length ? conditions.join(', ') : '--'}
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
								{medications.length ? medications.join(', ') : '--'}
							</VuiTypography>
						</VuiBox>
					</Grid>
				</Grid>
				{/* Dialog for editing each box */}
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
			</VuiBox>
		</Card>
	);
};

export default CarInformations;
