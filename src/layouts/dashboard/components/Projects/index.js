import { useProjects } from "../../../../context/ProjectsContext";
import { BsCheckCircleFill } from "react-icons/bs";

// @mui material components
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useEffect, useMemo, useRef, useState } from "react";
import Tooltip from "@mui/material/Tooltip";

// Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiAvatar from "components/VuiAvatar";
import VuiProgress from "components/VuiProgress";

// Dashboard Material-UI example components
import Table from "examples/Tables/Table";

// Compact-mode circular progress with gradient stroke
function GradientCircularProgress({ value, size = 42, stroke = 4, id = "gcp" }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - value / 100);
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${value}%`}>
      <defs>
        <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0A2E7B" />
          <stop offset="50%" stopColor="#3FA9F5" />
          <stop offset="100%" stopColor="#0A2E7B" />
        </linearGradient>
      </defs>
      {/* track */}
      <circle cx={cx} cy={cy} r={r} stroke="rgba(255,255,255,0.18)" strokeWidth={stroke} fill="none" />
      {/* progress */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        stroke={`url(#grad-${id})`}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={`${c} ${c}`}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
    </svg>
  );
}

function Projects() {
  const { projects, updateProject, removeProject } = useProjects();
  const [menuProjectId, setMenuProjectId] = useState(null);
  // Edit dialog state (match Caring Hub HUB dialog UI)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ hospital: "", doctors: "", bill: "", status: "Working", completion: 0 });
  // local ref to detect when the table overflows horizontally (scrollbar shows)
  const tableRegionRef = useRef(null);
  const [compact, setCompact] = useState(false);

  // Utility: deterministic color per hospital
  const getHospitalColor = (name) => {
    if (!name) return "#5A6ABF";
    // simple hash to index a palette
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash << 5) - hash + name.charCodeAt(i);
    const palette = [
      "#6C63FF", // indigo
      "#00D1FF", // cyan
      "#FF6B6B", // coral
      "#FFD166", // amber
      "#06D6A0", // teal
      "#9C27B0", // purple
      "#29B6F6", // light blue
      "#EF5350", // red
      "#66BB6A", // green
      "#FFA726", // orange
    ];
    const idx = Math.abs(hash) % palette.length;
    return palette[idx];
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] || "";
    const second = parts[1]?.[0] || "";
    return (first + second).toUpperCase();
  };

  // Smooth compact-mode toggle using width thresholds + hysteresis to avoid flicker
  useEffect(() => {
    const host = tableRegionRef.current;
    if (!host) return;
    const container = host.querySelector('.MuiTableContainer-root') || host;

    // Enter/exit thresholds (px). Between them we keep current state.
    const ENTER_COMPACT = 680; // go compact below this width
    const EXIT_COMPACT = 740;  // go normal above this width

    let rafId = null;
    const checkWidth = () => {
      if (!container) return;
      const w = container.clientWidth;
      setCompact(prev => {
        if (!prev && w < ENTER_COMPACT) return true;
        if (prev && w > EXIT_COMPACT) return false;
        return prev;
      });
    };

    const schedule = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(checkWidth);
    };

    // Initial pass after layout settles
    schedule();

    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(schedule);
      ro.observe(container);
    } else {
      window.addEventListener('resize', schedule);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', schedule);
    };
  }, []);

  // Helper to render avatars (doctors)
  const renderAvatars = (doctors) =>
    doctors.map((name, idx) => (
      <VuiBox key={name} sx={{ display: 'inline-flex', ml: idx === 0 ? 0 : '-12px' }}>
        <Tooltip title={name} placement="top" arrow>
          <VuiAvatar
            src={null}
            alt={name}
            size="sm"
            sx={{
              border: ({ borders: { borderWidth }, palette: { dark } }) =>
                `${borderWidth[2]} solid ${dark.focus}`,
              cursor: "pointer",
              position: "relative",
              "&:hover, &:focus": { zIndex: "10" },
            }}
          >{name[0]}</VuiAvatar>
        </Tooltip>
      </VuiBox>
    ));

  // Table columns
  const columns = useMemo(() => ([
    { name: "hospital", align: "left", label: "Hospitals" },
    { name: "doctor", align: "left", label: "Doctors" },
    { name: "bill", align: compact ? "center" : "center", label: "Bill" },
    { name: "completion", align: "center", label: "Completion" },
    { name: "actions", align: compact ? "left" : "center", label: "Actions" },
  ]), [compact]);

  // Table rows from context
  const rows = projects.map((project) => ({
    hospital: (
  compact ? (
        <Tooltip title={project.hospital} placement="top" arrow>
      <VuiAvatar
            alt={project.hospital}
    size="sm"
            sx={{
        width: 38,
        height: 38,
      fontSize: 12,
      backgroundColor: 'transparent',
      color: "#FFFFFF",
      border: `2px solid ${getHospitalColor(project.hospital)}`,
            }}
          >{getInitials(project.hospital)}</VuiAvatar>
        </Tooltip>
      ) : (
        <VuiTypography pl="8px" color="white" variant="button" fontWeight="medium" noWrap>
          {project.hospital}
        </VuiTypography>
      )
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
      compact ? (
        <VuiBox position="relative" width={50} height={50} display="flex" alignItems="center" justifyContent="center">
          <GradientCircularProgress value={project.completion} id={`hub-${project.id}`} />
          <VuiTypography
            variant="button"
            color="white"
            fontWeight="bold"
            sx={{ position: 'absolute', fontSize: 12 }}
          >
            {project.completion}%
          </VuiTypography>
        </VuiBox>
      ) : (
        <VuiBox width="8rem" textAlign="left">
          <VuiTypography color="white" variant="button" fontWeight="bold">
            {project.completion}%
          </VuiTypography>
          <VuiProgress
            value={project.completion}
            color="info"
            variant="gradient"
            label={false}
            sx={{
              background: "#2D2E5F",
              '& .MuiLinearProgress-bar': {
                backgroundImage: 'linear-gradient(90deg, #0A2E7B 0%, #3FA9F5 50%, #0A2E7B 100%) !important',
              },
            }}
          />
        </VuiBox>
      )
    ),
    actions: (
      <IconButton
        color="primary"
        onClick={() => {
          setMenuProjectId(project.id);
          setForm({
            hospital: project.hospital || "",
            doctors: Array.isArray(project.doctors) ? project.doctors.join(", ") : (project.doctors || ""),
            bill: project.bill || "",
            status: project.status || "Working",
            completion: Number(project.completion) || 0,
          });
          setDialogOpen(true);
        }}
        size="small"
        aria-label="Edit HUB"
      >
        <MoreVertIcon />
      </IconButton>
    ),
  }));

  // Dialog handlers
  const handleDialogClose = () => setDialogOpen(false);
  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSave = () => {
    if (!menuProjectId) return setDialogOpen(false);
    const payload = {
      hospital: form.hospital,
      doctors: form.doctors.split(",").map(d => d.trim()).filter(Boolean),
      bill: form.bill,
      status: form.status,
      completion: Number(form.completion) || 0,
    };
    updateProject(menuProjectId, payload);
    setDialogOpen(false);
  };

  return (
    <Card
      sx={{
        height: '100%',
        minHeight: { xs: 420, md: 520, lg: 600 }, // match calendar
        width: "100%",
        minWidth: 0,
        ml: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
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
      {/* Content area: make table region scroll and place horizontal scrollbar at the very bottom */}
  <VuiBox sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', transition: 'all 200ms ease' }}>
        <VuiBox
          ref={tableRegionRef}
          sx={{
            flex: 1,
            minHeight: 0,
            // Let the TableContainer own the scrollbar; stretch it to fill so bar is at card bottom
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            '& .MuiTableContainer-root': {
              flex: 1,
              minHeight: 0,
              overflowX: 'auto',
              overflowY: 'hidden',
              // smooth width changes while switching compact/normal
              transition: 'min-width 200ms ease, width 200ms ease',
            },
            '& .MuiTableContainer-root table': { minWidth: compact ? 420 : 720, transition: 'min-width 200ms ease' },
            '& table': { minWidth: compact ? 420 : 720, transition: 'min-width 200ms ease' },
            // Horizontal scrollbar styling
            '& .MuiTableContainer-root::-webkit-scrollbar': { height: 8, background: 'transparent' },
            '& .MuiTableContainer-root::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.13)', borderRadius: 6 },
            '& .MuiTableContainer-root::-webkit-scrollbar-track': { background: 'transparent' },
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.13) transparent',
            "& th": {
              borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                `${borderWidth[1]} solid ${grey[700]}`,
              transition: 'padding 150ms ease, width 150ms ease',
            },
            "& .MuiTableRow-root:not(:last-child)": {
              "& td": {
                borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                  `${borderWidth[1]} solid ${grey[700]}`,
                transition: 'padding 150ms ease, width 150ms ease',
              },
            },
            // visually tighten first column spacing when compact
            ...(compact && {
              '& td:first-of-type': { width: 52, minWidth: 52, paddingLeft: '10px' },
              '& th:first-of-type > div': { whiteSpace: 'nowrap' },
              // Tighten Doctor column right padding
              '& th:nth-of-type(2), & td:nth-of-type(2)': {
                paddingRight: '6px !important',
                minWidth: 96,
              },
              // Bill column: center and nudge slightly right with balanced padding
              '& th:nth-of-type(3), & td:nth-of-type(3)': {
                textAlign: 'center !important',
                paddingLeft: '10px !important',
                paddingRight: '6px !important',
                width: 40,
                minWidth: 40,
              },
              // Completion: room for the circular progress
              '& th:nth-of-type(4), & td:nth-of-type(4)': {
                textAlign: 'center !important',
                width: 72,
                minWidth: 72,
              },
              // Actions: move slightly left and keep narrow
              '& th:nth-of-type(5), & td:nth-of-type(5)': {
                textAlign: 'left !important',
                paddingLeft: '6px !important',
                width: 28,
                minWidth: 28,
              },
            })
          }}
        >
          <Table columns={columns} rows={rows} />
        </VuiBox>
      </VuiBox>
      {/* Edit HUB dialog (matches Caring Hub UI) */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="xs" fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(34, 40, 74, 0.65)',
            boxShadow: 24,
            borderRadius: 4,
            border: '1px solid rgba(111, 126, 201, 0.25)',
            color: 'white',
            backdropFilter: 'blur(10px)',
            p: 4,
            minWidth: 400,
            maxWidth: 600,
          }
        }}
      >
        <DialogTitle sx={{ color: 'white', fontWeight: 700, fontSize: 22, pb: 2, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Edit
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1, background: 'transparent', color: 'white', px: 2, minWidth: 400 }}>
          <VuiBox display="flex" flexDirection="column" gap={1}>
            <TextField label="Hospital" name="hospital" value={form.hospital} onChange={handleChange} fullWidth
              InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }}
              sx={{
                width: '100%', ml: 0, background: '#181a2f', borderRadius: 1.5,
                '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #23244a' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#2f3570' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6a6afc' },
                '& .MuiInputBase-input': { color: '#e7e9f3', fontSize: 14, py: 1, background: 'transparent' },
                mt: 2, mb: 0.5, minHeight: 48
              }}
            />
            <TextField label="Doctors (comma separated)" name="doctors" value={form.doctors} onChange={handleChange} fullWidth
              InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }}
              sx={{
                width: '100%', ml: 0, background: '#181a2f', borderRadius: 1.5,
                '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #23244a' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#2f3570' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6a6afc' },
                '& .MuiInputBase-input': { color: '#e7e9f3', fontSize: 14, py: 1, background: 'transparent' },
                mb: 0.5
              }}
            />
            <TextField label="Bill" name="bill" value={form.bill} onChange={handleChange} fullWidth
              InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }}
              sx={{
                width: '100%', ml: 0, background: '#181a2f', borderRadius: 1.5,
                '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #23244a' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#2f3570' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6a6afc' },
                '& .MuiInputBase-input': { color: '#e7e9f3', fontSize: 14, py: 1, background: 'transparent' },
                mb: 0.5
              }}
            />
            <TextField label="Status" name="status" value={form.status} onChange={handleChange} fullWidth
              InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }}
              sx={{
                width: '100%', ml: 0, background: '#181a2f', borderRadius: 1.5,
                '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #23244a' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#2f3570' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6a6afc' },
                '& .MuiInputBase-input': { color: '#e7e9f3', fontSize: 14, py: 1, background: 'transparent' },
                mb: 0.5
              }}
            />
            <TextField label="Completion" name="completion" value={form.completion} onChange={handleChange} fullWidth type="number"
              InputLabelProps={{ shrink: true, style: { color: '#bfc6e0' } }}
              sx={{
                width: '100%', ml: 0, background: '#181a2f', borderRadius: 1.5,
                '& .MuiOutlinedInput-notchedOutline': { border: '1px solid #23244a' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#2f3570' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6a6afc' },
                '& .MuiInputBase-input': { color: '#e7e9f3', fontSize: 14, py: 1, background: 'transparent' },
              }}
            />
          </VuiBox>
        </DialogContent>
        <DialogActions sx={{ px: 2, pt: 2, pb: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={() => { if (menuProjectId) removeProject(menuProjectId); setDialogOpen(false); }} color="error" sx={{ color: '#ff8080' }}>
            Delete
          </Button>
          <VuiBox>
            <Button onClick={handleDialogClose} sx={{ mr: 1, color: '#bfc6e0' }}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" color="primary" sx={{ background: 'rgba(44, 50, 90, 0.85)', boxShadow: 'none' }}>Save</Button>
          </VuiBox>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

export default Projects;
