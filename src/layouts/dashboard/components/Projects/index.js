import { useProjects } from "../../../../context/ProjectsContext";
import { BsCheckCircleFill } from "react-icons/bs";

// @mui material components
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";

// Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiAvatar from "components/VuiAvatar";
import VuiProgress from "components/VuiProgress";

// Dashboard Material-UI example components
import Table from "examples/Tables/Table";

function Projects() {
  const { projects } = useProjects();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuProjectId, setMenuProjectId] = useState(null);

  // Helper to render avatars (doctors)
  const renderAvatars = (doctors) =>
    doctors.map((name, idx) => (
      <VuiAvatar
        key={name}
        src={null}
        alt={name}
        size="xs"
        sx={{
          border: ({ borders: { borderWidth }, palette: { dark } }) =>
            `${borderWidth[2]} solid ${dark.focus}`,
          cursor: "pointer",
          position: "relative",
          "&:not(:first-of-type)": { ml: -1.25 },
          "&:hover, &:focus": { zIndex: "10" },
        }}
      >{name[0]}</VuiAvatar>
    ));

  // Table columns
  const columns = [
    { name: "hospital", align: "left", label: "Hospitals" },
    { name: "doctor", align: "left", label: "Doctors" },
    { name: "bill", align: "center", label: "Bill" },
    { name: "completion", align: "center", label: "Completion" },
    { name: "actions", align: "center", label: "Actions" },
  ];

  // Table rows from context
  const rows = projects.map((project) => ({
    hospital: (
      <VuiTypography pl="8px" color="white" variant="button" fontWeight="medium">
        {project.hospital}
      </VuiTypography>
    ),
    doctor: (
      <VuiBox display="flex" py={1}>
        {renderAvatars(project.doctors)}
      </VuiBox>
    ),
    bill: (
      <VuiTypography variant="button" color="white" fontWeight="bold">
        {project.bill}
      </VuiTypography>
    ),
    completion: (
      <VuiBox width="8rem" textAlign="left">
        <VuiTypography color="white" variant="button" fontWeight="bold">
          {project.completion}%
        </VuiTypography>
        <VuiProgress value={project.completion} color="info" label={false} sx={{ background: "#2D2E5F" }} />
      </VuiBox>
    ),
    actions: (
      <IconButton color="primary" onClick={e => { setMenuAnchor(e.currentTarget); setMenuProjectId(project.id); }} size="small">
        <MoreVertIcon />
      </IconButton>
    ),
  }));

  // Menu for actions (edit/delete) - just for visual, no actual edit/delete in dashboard
  const renderMenu = (
    <Menu
      anchorEl={menuAnchor}
      open={Boolean(menuAnchor)}
      onClose={() => setMenuAnchor(null)}
    >
      <MenuItem disabled>Edit</MenuItem>
      <MenuItem disabled>Delete</MenuItem>
    </Menu>
  );

  return (
    <Card
      sx={{
  height: "100%",
  width: "100%",
  minWidth: 0,
  ml: 0,
      }}
    >
      <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="32px">
        <VuiBox mb="auto">
          <VuiTypography color="white" variant="lg" mb="6px" gutterBottom>
            HUB
          </VuiTypography>
          <VuiBox display="flex" alignItems="center" lineHeight={0}>
            <BsCheckCircleFill color="#b39ddb" size="15px" />
            <VuiTypography variant="button" fontWeight="regular" color="text" ml="5px">
              &nbsp;<strong>{projects.length} done</strong> this month
            </VuiTypography>
          </VuiBox>
        </VuiBox>
      </VuiBox>
      <VuiBox
        sx={{
          maxHeight: 340,
          minHeight: 180,
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
          "& th": {
            borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
              `${borderWidth[1]} solid ${grey[700]}`,
          },
          "& .MuiTableRow-root:not(:last-child)": {
            "& td": {
              borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                `${borderWidth[1]} solid ${grey[700]}`,
            },
          },
        }}
      >
        <Table columns={columns} rows={rows} />
        {renderMenu}
      </VuiBox>
    </Card>
  );
}

export default Projects;
