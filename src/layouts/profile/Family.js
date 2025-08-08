import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Header from "./components/Header";
import PlatformSettings from "./components/PlatformSettings";
import CarInformations from "./components/CarInformations";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Footer from "examples/Footer";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function Family() {
  // State for modals and editing
  const [openModal, setOpenModal] = useState(null); // 'parents', 'spouse', 'children', or null
  const [editIndex, setEditIndex] = useState(null);
  const [members, setMembers] = useState({
    parents: [
      { name: "Jane Doe", relation: "Mother", email: "jane@example.com", phone: "555-1234", blood: "A+", allergies: "None" },
      { name: "John Doe", relation: "Father", email: "john@example.com", phone: "555-5678", blood: "O-", allergies: "Peanuts" },
    ],
    spouse: [
      { name: "Alex Doe", relation: "Spouse", email: "alex@example.com", phone: "555-9999", blood: "B+", allergies: "None" },
    ],
    children: [
      { name: "Lucas Doe", relation: "Son", email: "lucas@example.com", phone: "555-1111", blood: "A-", allergies: "None" },
      { name: "Sophia Doe", relation: "Daughter", email: "sophia@example.com", phone: "555-2222", blood: "O+", allergies: "Milk" },
    ],
  });
  const [editMember, setEditMember] = useState({ name: "", relation: "", email: "", phone: "", blood: "", allergies: "" });
  const [openPopup, setOpenPopup] = useState(null); // for button popups

  // Modal open/close
  const handleOpenModal = (section) => { setOpenModal(section); setEditIndex(null); };
  const handleCloseModal = () => { setOpenModal(null); setEditIndex(null); };

  // Edit member
  const handleEdit = (section, idx) => {
    setEditIndex(idx);
    setEditMember(members[section][idx]);
  };
  const handleEditChange = (e) => {
    setEditMember({ ...editMember, [e.target.name]: e.target.value });
  };
  const handleSaveEdit = () => {
    setMembers((prev) => {
      const updated = { ...prev };
      updated[openModal][editIndex] = { ...editMember };
      return updated;
    });
    setEditIndex(null);
  };
  // Add member
  const handleAddMember = () => {
    setEditIndex(members[openModal].length);
    setEditMember({ name: "", relation: "", email: "", phone: "", blood: "", allergies: "" });
  };
  const handleSaveAdd = () => {
    setMembers((prev) => {
      const updated = { ...prev };
      updated[openModal] = [...updated[openModal], { ...editMember }];
      return updated;
    });
    setEditIndex(null);
  };

  const optionBtnStyle = {
    width: '100%',
    background: 'rgba(40,42,70,0.5)',
    border: '1.5px solid #23244a',
    color: '#b0b3c0', // grayish text like medical profile
    borderRadius: 8,
    padding: '10px 0',
    fontWeight: 600,
    fontSize: 15,
    cursor: 'pointer',
    margin: 0,
    outline: 'none',
    boxShadow: 'none',
    transition: 'background 0.2s, color 0.2s',
    '&:hover': {
      background: 'rgba(40,42,70,0.7)',
      color: '#fff',
    },
  };

  return (
    <DashboardLayout>
      <Header />
      <VuiBox mt={5} mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CarInformations />
          </Grid>
        </Grid>
      </VuiBox>
      <Grid container spacing={3} mb="30px">
        <Grid item xs={12} xl={3}>
          {/* Family Account Settings - Interactive Options */}
          <Card sx={{
            p: 3,
            background: 'rgba(30,32,60,0.7)', // same as Medical Profile and Account Settings
            borderRadius: 3,
            boxShadow: '0 4px 24px #0003',
            border: 'none',
            minHeight: 320,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <VuiTypography color="white" fontWeight="bold" fontSize={17} mb={2}>
              Family Settings
            </VuiTypography>
            <VuiBox component="ul" sx={{ color: '#fff', pl: 2, mb: 2, listStyle: 'none', fontSize: 15, p: 0 }}>
              {['Care Team', 'Visits', 'Test Results', 'Schedule Appointment', 'Search Provider', 'Insurance'].map((label, idx) => (
                <li key={label} style={{ marginBottom: idx === 5 ? 0 : 14 }}>
                  <button
                    style={optionBtnStyle}
                    onClick={() => setOpenPopup(label)}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </VuiBox>
            {/* Popup Dialog for each button */}
            <Dialog open={!!openPopup} onClose={() => setOpenPopup(null)} maxWidth="md" fullWidth
              PaperProps={{
                sx: {
                  backgroundColor: 'rgba(30, 32, 60, 0.7)',
                  boxShadow: 24,
                  borderRadius: 3,
                  color: 'white',
                  minWidth: 500,
                  maxWidth: 800,
                  backdropFilter: 'blur(4px)',
                },
              }}
            >
              <DialogTitle sx={{ fontSize: 22, fontWeight: 700, color: '#fff', mb: 1 }}>{openPopup}</DialogTitle>
              <DialogContent>
                {openPopup === 'Insurance' && (
                  <>
                    <VuiTypography color="text" variant="button" mb={2} sx={{ fontSize: 16 }}>Search and assign insurance companies for each family member.</VuiTypography>
                    {Object.keys(members).map(section => (
                      <div key={section} style={{ marginBottom: 20 }}>
                        <VuiTypography color="white" fontWeight="bold" mb={1} sx={{ fontSize: 18 }}>{section.charAt(0).toUpperCase() + section.slice(1)}</VuiTypography>
                        {members[section].map((m, i) => (
                          <VuiBox key={i} display="flex" alignItems="center" mb={1}>
                            <VuiTypography color="text" mr={2} sx={{ fontSize: 16 }}>{m.name}</VuiTypography>
                            <TextField size="small" variant="outlined" placeholder="Insurance Company" sx={{ background: '#181a2f', borderRadius: 1, input: { color: 'white', fontSize: 16 }, mr: 1, width: 220 }} />
                            <Button size="small" color="info" sx={{ fontSize: 15, fontWeight: 600 }}>Assign</Button>
                          </VuiBox>
                        ))}
                      </div>
                    ))}
                  </>
                )}
                {openPopup === 'Care Team' && (
                  <>
                    <VuiTypography color="text" variant="button" mb={2} sx={{ fontSize: 16 }}>Enter doctor and pharmacy for each family member.</VuiTypography>
                    {Object.keys(members).map(section => (
                      <div key={section} style={{ marginBottom: 20 }}>
                        <VuiTypography color="white" fontWeight="bold" mb={1} sx={{ fontSize: 18 }}>{section.charAt(0).toUpperCase() + section.slice(1)}</VuiTypography>
                        {members[section].map((m, i) => (
                          <VuiBox key={i} display="flex" alignItems="center" mb={1}>
                            <VuiTypography color="text" mr={2} sx={{ fontSize: 16 }}>{m.name}</VuiTypography>
                            <TextField size="small" variant="outlined" placeholder="Doctor" sx={{ background: '#181a2f', borderRadius: 1, input: { color: 'white', fontSize: 16 }, mr: 1, width: 160 }} />
                            <TextField size="small" variant="outlined" placeholder="Pharmacy" sx={{ background: '#181a2f', borderRadius: 1, input: { color: 'white', fontSize: 16 }, mr: 1, width: 160 }} />
                            <Button size="small" color="info" sx={{ fontSize: 15, fontWeight: 600 }}>Save</Button>
                          </VuiBox>
                        ))}
                      </div>
                    ))}
                  </>
                )}
                {openPopup === 'Visits' && (
                  <>
                    <VuiTypography color="text" variant="button" mb={2} sx={{ fontSize: 16 }}>Past visit records for each family member.</VuiTypography>
                    {Object.keys(members).map(section => (
                      <div key={section} style={{ marginBottom: 20 }}>
                        <VuiTypography color="white" fontWeight="bold" mb={1} sx={{ fontSize: 18 }}>{section.charAt(0).toUpperCase() + section.slice(1)}</VuiTypography>
                        {members[section].map((m, i) => (
                          <VuiBox key={i} mb={1}>
                            <VuiTypography color="text" sx={{ fontSize: 16 }}>{m.name}: <span style={{ color: '#6a6afc' }}>No past visits</span></VuiTypography>
                          </VuiBox>
                        ))}
                      </div>
                    ))}
                  </>
                )}
                {openPopup === 'Schedule Appointment' && (
                  <>
                    <VuiTypography color="text" variant="button" mb={2} sx={{ fontSize: 16 }}>Schedule a new appointment and view upcoming appointments.</VuiTypography>
                    <VuiBox mb={2} display="flex" alignItems="center" gap={2}>
                      <TextField size="small" variant="outlined" placeholder="Family Member" sx={{ background: '#181a2f', borderRadius: 1, input: { color: 'white', fontSize: 16 }, width: 180 }} />
                      <TextField size="small" variant="outlined" placeholder="Date" type="date" sx={{ background: '#181a2f', borderRadius: 1, input: { color: 'white', fontSize: 16 }, width: 150 }} InputLabelProps={{ shrink: true }} />
                      <TextField size="small" variant="outlined" placeholder="Reason" sx={{ background: '#181a2f', borderRadius: 1, input: { color: 'white', fontSize: 16 }, width: 220 }} />
                      <Button size="small" color="info" sx={{ fontSize: 15, fontWeight: 600 }}>Schedule</Button>
                    </VuiBox>
                    <VuiTypography color="white" fontWeight="bold" mb={1} sx={{ fontSize: 18 }}>Upcoming Appointments</VuiTypography>
                    <VuiTypography color="text" sx={{ fontSize: 16 }}>No upcoming appointments</VuiTypography>
                  </>
                )}
                {openPopup === 'Search Provider' && (
                  <>
                    <VuiTypography color="text" variant="button" mb={2} sx={{ fontSize: 16 }}>Search and book a doctor for your family.</VuiTypography>
                    <VuiBox mb={2} display="flex" alignItems="center" gap={2}>
                      <TextField size="small" variant="outlined" placeholder="Search Doctor or Specialty" sx={{ background: '#181a2f', borderRadius: 1, input: { color: 'white', fontSize: 16 }, width: 260 }} />
                      <Button size="small" color="info" sx={{ fontSize: 15, fontWeight: 600 }}>Search</Button>
                    </VuiBox>
                    <VuiTypography color="white" fontWeight="bold" mb={1} sx={{ fontSize: 18 }}>Results</VuiTypography>
                    <VuiTypography color="text" sx={{ fontSize: 16 }}>No providers found</VuiTypography>
                  </>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenPopup(null)} color="primary" sx={{ fontSize: 15, fontWeight: 600, px: 3, py: 1 }}>Close</Button>
              </DialogActions>
            </Dialog>
          </Card>
        </Grid>
        <Grid item xs={12} xl={9}>
          <VuiBox display="flex" flexDirection={{ xs: "column", md: "row" }} gap={3}>
            {/* Parents Section */}
            <Card sx={{
              flex: 1,
              minWidth: 0,
              maxWidth: 380,
              p: 3,
              background: '#0f1121',
              borderRadius: 4,
              boxShadow: '0 4px 24px #0003',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: 340,
              border: '1px solid #23244a',
            }}>
              <VuiTypography color="white" fontWeight="bold" fontSize={17} mb={1}>
                Parents
              </VuiTypography>
              <VuiTypography color="text" fontSize={13} mb={2}>
                View and manage parent information and permissions.
              </VuiTypography>
              <VuiBox component="ul" sx={{ color: '#fff', pl: 2, mb: 2, listStyle: 'disc', fontSize: 14 }}>
                {members.parents.map((m, i) => <li key={i}>{m.name} <span style={{ color: '#6a6afc', fontWeight: 500 }}>({m.relation})</span></li>)}
              </VuiBox>
              <VuiBox mt="auto" display="flex" justifyContent="flex-end">
                <Button variant="outlined" sx={{
                  borderColor: '#6a6afc',
                  color: '#6a6afc',
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: 13,
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  borderWidth: 2,
                  '&:hover': { borderColor: '#8b8bfc', color: '#8b8bfc' }
                }} onClick={() => handleOpenModal('parents')}>VIEW ALL</Button>
              </VuiBox>
            </Card>
            {/* Spouse Section (was Siblings) */}
            <Card sx={{
              flex: 1,
              minWidth: 0,
              maxWidth: 380,
              p: 3,
              background: '#0f1121',
              borderRadius: 4,
              boxShadow: '0 4px 24px #0003',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: 340,
              border: '1px solid #23244a',
            }}>
              <VuiTypography color="white" fontWeight="bold" fontSize={17} mb={1}>
                Spouse
              </VuiTypography>
              <VuiTypography color="text" fontSize={13} mb={2}>
                View and manage spouse information and permissions.
              </VuiTypography>
              <VuiBox component="ul" sx={{ color: '#fff', pl: 2, mb: 2, listStyle: 'disc', fontSize: 14 }}>
                {members.spouse && members.spouse.length > 0 ? (
                  members.spouse.map((m, i) => <li key={i}>{m.name} <span style={{ color: '#6a6afc', fontWeight: 500 }}>({m.relation})</span></li>)
                ) : (
                  <li style={{ color: '#bdbdfc' }}>No spouse added</li>
                )}
              </VuiBox>
              <VuiBox mt="auto" display="flex" justifyContent="flex-end">
                <Button variant="outlined" sx={{
                  borderColor: '#6a6afc',
                  color: '#6a6afc',
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: 13,
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  borderWidth: 2,
                  '&:hover': { borderColor: '#8b8bfc', color: '#8b8bfc' }
                }} onClick={() => handleOpenModal('spouse')}>VIEW ALL</Button>
              </VuiBox>
            </Card>
            {/* Children Section */}
            <Card sx={{
              flex: 1,
              minWidth: 0,
              maxWidth: 380,
              p: 3,
              background: '#0f1121',
              borderRadius: 4,
              boxShadow: '0 4px 24px #0003',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: 340,
              border: '1px solid #23244a',
            }}>
              <VuiTypography color="white" fontWeight="bold" fontSize={17} mb={1}>
                Children
              </VuiTypography>
              <VuiTypography color="text" fontSize={13} mb={2}>
                View and manage children information and permissions.
              </VuiTypography>
              <VuiBox component="ul" sx={{ color: '#fff', pl: 2, mb: 2, listStyle: 'disc', fontSize: 14 }}>
                {members.children.map((m, i) => <li key={i}>{m.name} <span style={{ color: '#6a6afc', fontWeight: 500 }}>({m.relation})</span></li>)}
              </VuiBox>
              <VuiBox mt="auto" display="flex" justifyContent="flex-end">
                <Button variant="outlined" sx={{
                  borderColor: '#6a6afc',
                  color: '#6a6afc',
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: 13,
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  borderWidth: 2,
                  '&:hover': { borderColor: '#8b8bfc', color: '#8b8bfc' }
                }} onClick={() => handleOpenModal('children')}>VIEW ALL</Button>
              </VuiBox>
            </Card>
          </VuiBox>
        </Grid>
      </Grid>
      {/* Modal for viewing and editing members */}
      <Dialog 
        open={!!openModal} 
        onClose={handleCloseModal} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(20, 22, 40, 0.7)',
            backdropFilter: 'blur(16px)',
            borderRadius: 4,
            boxShadow: '0 8px 40px #0008',
            border: '1.5px solid #23244a',
            color: '#fff',
            p: 0,
          }
        }}
      >
        <DialogTitle sx={{ background: 'transparent', color: '#fff', fontWeight: 700, fontSize: 20, px: 4, pt: 3, pb: 1, borderBottom: '1px solid #23244a' }}>
          {openModal ? `${openModal.charAt(0).toUpperCase() + openModal.slice(1)} Members` : ''}
        </DialogTitle>
        <DialogContent sx={{ background: 'transparent', color: '#fff', px: 4, pt: 2, pb: 1 }}>
          {openModal && editIndex === null && (
            <>
              <ul style={{ color: '#fff', paddingLeft: 18, marginBottom: 16, fontSize: 15 }}>
                {members[openModal].map((m, i) => (
                  <li key={i} style={{ marginBottom: 14, background: 'rgba(40,42,70,0.6)', borderRadius: 8, padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontWeight: 600, fontSize: 16 }}>{m.name} <span style={{ color: '#6a6afc', fontWeight: 500 }}>({m.relation})</span></span>
                    <span style={{ fontSize: 13, color: '#bdbdfc' }}>Email: {m.email} | Phone: {m.phone}</span>
                    <span style={{ fontSize: 13, color: '#bdbdfc' }}>Blood: {m.blood} | Allergies: {m.allergies}</span>
                    <Button size="small" sx={{ mt: 1, alignSelf: 'flex-end', color: '#6a6afc', textTransform: 'none', fontWeight: 600 }} onClick={() => handleEdit(openModal, i)}>Edit</Button>
                  </li>
                ))}
              </ul>
              <Button variant="contained" sx={{ mt: 1, background: 'linear-gradient(90deg,#6a6afc,#8b8bfc)', color: '#fff', borderRadius: 2, fontWeight: 600, textTransform: 'none', px: 3, py: 1, boxShadow: '0 2px 8px #6a6afc33' }} onClick={handleAddMember}>Add Member</Button>
            </>
          )}
          {openModal && editIndex !== null && (
            <form>
              <TextField label="Name" name="name" value={editMember.name} onChange={handleEditChange} fullWidth sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#bdbdfc' }, '& .MuiOutlinedInput-root': { background: 'rgba(40,42,70,0.5)', borderRadius: 2 } }} />
              <TextField label="Relation" name="relation" value={editMember.relation} onChange={handleEditChange} fullWidth sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#bdbdfc' }, '& .MuiOutlinedInput-root': { background: 'rgba(40,42,70,0.5)', borderRadius: 2 } }} />
              <TextField label="Email" name="email" value={editMember.email} onChange={handleEditChange} fullWidth sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#bdbdfc' }, '& .MuiOutlinedInput-root': { background: 'rgba(40,42,70,0.5)', borderRadius: 2 } }} />
              <TextField label="Phone" name="phone" value={editMember.phone} onChange={handleEditChange} fullWidth sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#bdbdfc' }, '& .MuiOutlinedInput-root': { background: 'rgba(40,42,70,0.5)', borderRadius: 2 } }} />
              <TextField label="Blood Type" name="blood" value={editMember.blood} onChange={handleEditChange} fullWidth sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#bdbdfc' }, '& .MuiOutlinedInput-root': { background: 'rgba(40,42,70,0.5)', borderRadius: 2 } }} />
              <TextField label="Allergies" name="allergies" value={editMember.allergies} onChange={handleEditChange} fullWidth sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#bdbdfc' }, '& .MuiOutlinedInput-root': { background: 'rgba(40,42,70,0.5)', borderRadius: 2 } }} />
            </form>
          )}
        </DialogContent>
        <DialogActions sx={{ background: 'transparent', px: 4, pb: 3, pt: 1 }}>
          <Button onClick={handleCloseModal} sx={{ color: '#fff', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2, py: 1, background: 'rgba(40,42,70,0.3)', '&:hover': { background: 'rgba(40,42,70,0.5)' } }}>Close</Button>
          {openModal && editIndex !== null && (
            <Button onClick={editIndex < members[openModal].length ? handleSaveEdit : handleSaveAdd} sx={{ color: '#fff', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2, py: 1, background: 'linear-gradient(90deg,#6a6afc,#8b8bfc)', boxShadow: '0 2px 8px #6a6afc33', '&:hover': { background: 'linear-gradient(90deg,#8b8bfc,#6a6afc)' } }}>
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Footer />
    </DashboardLayout>
  );
}
