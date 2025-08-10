// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import { Card, LinearProgress, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiProgress from "components/VuiProgress";
import VuiButton from "components/VuiButton";

// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import linearGradient from "assets/theme/functions/linearGradient";

// Vision UI Dashboard React base styles
import typography from "assets/theme/base/typography";
import colors from "assets/theme/base/colors";

// Dashboard layout components
import WelcomeMark from "layouts/dashboard/components/WelcomeMark";
import Projects from "layouts/dashboard/components/Projects";
import OrderOverview from "layouts/dashboard/components/OrderOverview";
import SatisfactionRate from "layouts/dashboard/components/SatisfactionRate";
import ReferralTracking from "./components/ReferralTracking";
import WeatherBox from "./components/WeatherBox";
import MiniDayCalendar from "./components/MiniDayCalendar";

// React icons
import { IoIosRocket } from "react-icons/io";
import { IoGlobe } from "react-icons/io5";
import { IoBuild } from "react-icons/io5";
import { IoWallet } from "react-icons/io5";
import { IoDocumentText } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";
import { FaPlus } from 'react-icons/fa';
import { FaFileInvoiceDollar, FaMoneyCheckAlt, FaCalendarCheck, FaClipboardList } from "react-icons/fa";

// Data
import LineChart from "examples/Charts/LineCharts/LineChart";
import BarChart from "examples/Charts/BarCharts/BarChart";
import { lineChartDataDashboard } from "layouts/dashboard/data/lineChartData";
import { lineChartOptionsDashboard } from "layouts/dashboard/data/lineChartOptions";
import { barChartDataDashboard } from "layouts/dashboard/data/barChartData";
import { barChartOptionsDashboard } from "layouts/dashboard/data/barChartOptions";

// Doctor Assistant component
import DoctorAssistant from "components/DoctorAssistant";
import AppointmentCalendar from "components/AppointmentCalendar";

// Appointment Context
import { useAppointments } from "../../context/AppointmentContext";
import { useTodos } from "context/TodoContext";
import { useBilling } from "context/BillingContext";
import WellBeingDialog from './components/WellBeingDialog';
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
} from 'chart.js';
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler);

function Dashboard() {
  const { gradients } = colors;
  const { cardContent } = gradients;

  const { getNextAppointment } = useAppointments();
  const nextAppointment = getNextAppointment();

  // Use todos from context
  const { todos } = useTodos();
  // Find the todo with the closest date in the future
  const now = new Date();
  const todosWithDate = todos.filter(t => t.date);
  const closestTodo = todosWithDate.length > 0 ? todosWithDate.reduce((a, b) => (new Date(a.date) < new Date(b.date) ? a : b)) : null;
  const nextTodo = closestTodo ? closestTodo.label.split(' ')[0] : "No tasks available";
  const daysUntil = closestTodo ? Math.ceil((new Date(closestTodo.date) - now) / (1000 * 60 * 60 * 24)) : null;

  // Format date for display
  const formatAppointmentDate = (date) => {
    if (!date) return "No upcoming appointments";
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const { payments } = useBilling();
  // Find the latest insurance payment (or use logic as needed)
  const latestInsurance = payments.filter(p => p.type === 'insurance').sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  const insuranceBill = latestInsurance ? `$${Math.abs(latestInsurance.value).toLocaleString()}` : "$0";

  // Calculate days until next insurance bill (assuming monthly cycle from last payment)
  let insuranceDays = null;
  if (latestInsurance) {
    const lastDate = new Date(latestInsurance.date);
    const nextBillDate = new Date(lastDate);
    nextBillDate.setMonth(nextBillDate.getMonth() + 1);
    const now = new Date();
    insuranceDays = Math.max(0, Math.ceil((nextBillDate - now) / (1000 * 60 * 60 * 24)));
  }
  const insuranceDaysText = insuranceDays !== null ? `${insuranceDays} days` : "-";

  // Find the latest payment (any type)
  const latestPayment = payments.length > 0 ? payments.slice().sort((a, b) => new Date(b.date) - new Date(a.date))[0] : null;
  const dueBill = latestPayment ? `$${Math.abs(latestPayment.value).toLocaleString()}` : "$0";
  const dueBillDate = latestPayment ? new Date(latestPayment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "-";

  const [wellBeingOpen, setWellBeingOpen] = React.useState(false);
  const [wellBeingTab, setWellBeingTab] = useState('mentally');
  const [wellBeingData, setWellBeingData] = useState({
    mentally: [], // array of { value: number, date: Date }
    physically: [] // array of { value: number, date: Date }
  });

  const handleWellBeingSubmit = (data) => {
    // Accepts { emotion, note, intensity }
    setWellBeingData(prev => ({
      ...prev,
      [wellBeingTab]: [
        ...prev[wellBeingTab],
        { value: data.intensity, date: new Date(), emotion: data.emotion, note: data.note }
      ]
    }));
    setWellBeingOpen(false);
  };

  // Calculate average and level
  const currentData = wellBeingData[wellBeingTab];
  const average = currentData.length > 0 ? (currentData.reduce((sum, d) => sum + d.value, 0) / currentData.length) : 0;
  // Adjusted level thresholds
  let level = 'Minimal';
  if (average >= 8.5) level = 'Severe';
  else if (average >= 7) level = 'High';
  else if (average >= 5.5) level = 'Moderate';
  else if (average >= 4) level = 'Mild';
  else if (average >= 2.5) level = 'Okay';
  else if (average > 0) level = 'Minimal';

  // Helper to get chart data for the current tab
  const getChartData = (dataArr) => {
    // Show up to 14 most recent entries, oldest to newest
    const sorted = [...dataArr].sort((a, b) => new Date(a.date) - new Date(b.date));
    return {
      labels: sorted.slice(-14).map(() => ''), // Hide x-axis labels
      datasets: [
        {
          label: wellBeingTab === 'mentally' ? 'Mental Score' : 'Physical Score',
          data: sorted.slice(-14).map(entry => entry.value),
          fill: true,
          backgroundColor: 'rgba(33,150,243,0.10)',
          borderColor: '#6C63FF',
          pointBackgroundColor: '#fff',
          pointBorderColor: '#6C63FF',
          pointRadius: 5,
          tension: 0.4,
        },
      ],
    };
  };

  const chartDataObj = getChartData(currentData);
  const chartOptionsObj = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            // Show emotion and value if available
            const idx = context.dataIndex;
            const emotion = currentData[idx]?.emotion || (wellBeingTab === 'mentally' ? 'Mental' : 'Physical');
            return `${emotion}: ${context.parsed.y}/10`;
          }
        }
      }
    },
    elements: {
      line: { borderWidth: 3 },
      point: { radius: 5, hoverRadius: 7 }
    },
    scales: {
      y: {
        min: 0,
        max: 10,
        ticks: { color: '#bfc6e0', stepSize: 1 },
        grid: { color: 'rgba(108,99,255,0.08)' }
      },
      x: {
        ticks: { color: '#bfc6e0', display: false }, // Hide x-axis ticks
        grid: { display: false }
      }
    }
  };

  // --- CALENDAR INTEGRATION ---
  const { appointments, addAppointment } = useAppointments();
  useEffect(() => {
    // Fetch Google Calendar events
    fetch('/api/calendar/google')
      .then(res => res.json())
      .then(events => {
        if (Array.isArray(events)) {
          events.forEach(ev => {
            // Only add if not already present (by id or start time)
            if (!appointments.some(a => a.id === ev.id || (a.start && ev.start && new Date(a.start).toISOString() === ev.start.dateTime))) {
              addAppointment({
                id: ev.id,
                title: ev.summary || 'Google Event',
                start: ev.start?.dateTime ? new Date(ev.start.dateTime) : new Date(ev.start.date),
                end: ev.end?.dateTime ? new Date(ev.end.dateTime) : new Date(ev.end.date),
                allDay: !!ev.start?.date,
                source: 'google',
              });
            }
          });
        }
      })
      .catch(() => {/* ignore network errors on dashboard */});
    // Fetch iCal events
    fetch('/api/calendar/ical')
      .then(res => res.json())
      .then(events => {
        if (Array.isArray(events)) {
          events.forEach(ev => {
            // Only add if not already present (by uid or start time)
            if (!appointments.some(a => a.id === ev.uid || (a.start && ev.start && new Date(a.start).toISOString() === ev.start))) {
              addAppointment({
                id: ev.uid,
                title: ev.summary || 'iCal Event',
                start: new Date(ev.start),
                end: new Date(ev.end),
                allDay: !!ev.datetype,
                source: 'ical',
              });
            }
          });
        }
      })
      .catch(() => {/* ignore network errors on dashboard */});
  }, []); // Only run once on mount

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <VuiBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Insurance Monthly Bill", fontWeight: "regular" }}
                count={insuranceBill}
                percentage={{ color: "success", text: insuranceDaysText }}
                icon={{ color: "info", component: <FaFileInvoiceDollar size="22px" color="rgba(33,150,243,0.5)" /> }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Due Bill" }}
                count={dueBill}
                percentage={{ color: "success", text: dueBillDate }}
                icon={{ color: "info", component: <FaMoneyCheckAlt size="22px" color="rgba(33,150,243,0.5)" /> }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Next Appointment" }}
                count={nextAppointment ? formatAppointmentDate(nextAppointment.start) : "-"}
                percentage={
                  nextAppointment
                    ? {
                        color: "success",
                        text: nextAppointment.title
                      }
                    : { color: "secondary", text: "No Upcoming Appt." }
                }
                icon={{ color: "info", component: <FaCalendarCheck size="22px" color="rgba(33,150,243,0.5)" /> }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Next Todo" }}
                count={nextTodo}
                percentage={daysUntil !== null ? { color: "success", text: `${daysUntil} days` } : { color: "secondary", text: "-" }}
                icon={{ color: "info", component: <FaClipboardList size="20px" color="rgba(33,150,243,0.5)" /> }}
              />
            </Grid>
          </Grid>
        </VuiBox>
        <VuiBox mb={3}>
          <Grid container spacing="18px">
            <Grid item xs={12} lg={12} xl={5}>
              <WelcomeMark />
            </Grid>
            <Grid item xs={12} lg={6} xl={3}>
              <WeatherBox />
            </Grid>
            <Grid item xs={12} lg={6} xl={4}>
              <ReferralTracking />
            </Grid>
          </Grid>
        </VuiBox>
        <VuiBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={6} xl={7}>
              <DoctorAssistant />
            </Grid>
            <Grid item xs={12} lg={6} xl={5}>
              <Card>
                <VuiBox>
                  {/* Tabs for Mentally/Physically */}
                  <VuiBox display="flex" justifyContent="center" alignItems="center" mt={2} mb={2}>
                    <Box
                      sx={{
                        display: 'flex',
                        borderRadius: '30px',
                        border: '2px solid #bfc6e0',
                        overflow: 'hidden',
                        width: 320,
                        background: 'rgba(44, 50, 90, 0.25)'
                      }}
                    >
                      <Button
                        variant={wellBeingTab === 'mentally' ? 'contained' : 'text'}
                        color={wellBeingTab === 'mentally' ? 'primary' : 'inherit'}
                        sx={{
                          flex: 1,
                          borderRadius: 0,
                          fontWeight: 700,
                          fontSize: 16,
                          background: wellBeingTab === 'mentally' ? 'rgba(33, 150, 243, 0.15)' : 'transparent',
                          color: wellBeingTab === 'mentally' ? '#fff' : '#bfc6e0',
                          boxShadow: 'none',
                          py: 1.2,
                          '&:hover': {
                            background: wellBeingTab === 'mentally' ? 'rgba(33, 150, 243, 0.25)' : 'rgba(44, 50, 90, 0.15)'
                          }
                        }}
                        onClick={() => setWellBeingTab('mentally')}
                      >
                        MENTALLY
                      </Button>
                      <Button
                        variant={wellBeingTab === 'physically' ? 'contained' : 'text'}
                        color={wellBeingTab === 'physically' ? 'primary' : 'inherit'}
                        sx={{
                          flex: 1,
                          borderRadius: 0,
                          fontWeight: 700,
                          fontSize: 16,
                          background: wellBeingTab === 'physically' ? 'rgba(33, 150, 243, 0.15)' : 'transparent',
                          color: wellBeingTab === 'physically' ? '#fff' : '#bfc6e0',
                          boxShadow: 'none',
                          py: 1.2,
                          '&:hover': {
                            background: wellBeingTab === 'physically' ? 'rgba(33, 150, 243, 0.25)' : 'rgba(44, 50, 90, 0.15)'
                          }
                        }}
                        onClick={() => setWellBeingTab('physically')}
                      >
                        PHYSICALLY
                      </Button>
                    </Box>
                  </VuiBox>
                  {/* Goal text */}
                  <VuiTypography variant="body2" color="#bfc6e0" fontWeight={400} textAlign="center" mb={2}>
                 
                  </VuiTypography>
                  {/* Level and Score */}
                  <VuiBox display="flex" justifyContent="space-between" alignItems="center" px={3} mb={1}>
                    <Box>
                      <VuiTypography variant="caption" color="#bfc6e0" fontWeight={600} letterSpacing={1} textTransform="uppercase">
                        {wellBeingTab === 'mentally' ? 'Mental Level' : 'Physical Level'}
                      </VuiTypography>
                      <VuiTypography variant="h6" color="info" fontWeight={700} mt={0.5}>
                        {level}
                      </VuiTypography>
                    </Box>
                    <Box textAlign="right">
                      <VuiTypography variant="caption" color="#bfc6e0" fontWeight={600} letterSpacing={1} textTransform="uppercase">
                        Score
                      </VuiTypography>
                      <VuiTypography variant="h4" color="white" fontWeight={700}>
                        {average ? average.toFixed(1) : 0} <span style={{ fontSize: 18, color: '#bfc6e0', fontWeight: 500 }}>/10</span>
                      </VuiTypography>
                    </Box>
                  </VuiBox>
                  {/* Graph and Target Zone */}
                  <VuiBox mb="24px" height="220px" sx={{
                    background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
                    borderRadius: "20px",
                    position: "relative",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    overflow: 'hidden',
                    px: 2,
                    pt: 2
                  }}>
                    <Line data={chartDataObj} options={chartOptionsObj} style={{ maxHeight: 180 }} />
                    {/* Add Severe/Minimal scale at the bottom */}
                    <Box sx={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 8,
                      px: 3,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      pointerEvents: 'none'
                    }}>
                      <VuiTypography variant="caption" color="#bfc6e0" fontWeight={500}>Severe</VuiTypography>
                      <VuiTypography variant="caption" color="#bfc6e0" fontWeight={500}>Minimal</VuiTypography>
                    </Box>
                  </VuiBox>
                  <VuiBox display="flex" alignItems="center" justifyContent="space-between" mt={2} px={2}>
                    <VuiTypography variant="h6" color="white" fontWeight="bold">
                      Well being
                    </VuiTypography>
                    <VuiButton 
                      color="primary" 
                      size="small" 
                      circular 
                      iconOnly 
                      onClick={() => setWellBeingOpen(true)}
                      sx={{ 
                        background: 'rgba(33, 150, 243, 0.10)', // more transparent blue
                        color: 'rgba(33, 150, 243, 0.60)', // softer blue text
                        boxShadow: 'none',
                        '&:hover': { background: 'rgba(33, 150, 243, 0.4)' }
                      }}
                    >
                      <FaPlus />
                    </VuiButton>
                  </VuiBox>
                  <WellBeingDialog open={wellBeingOpen} onClose={() => setWellBeingOpen(false)} onSubmit={handleWellBeingSubmit} />
                </VuiBox>
              </Card>
            </Grid>
          </Grid>
        </VuiBox>
        <Grid container spacing={3} direction="row" justifyContent="center" alignItems="stretch">
          <Grid item xs={12} md={6} lg={4} xl={4}>
            <Projects />
          </Grid>
          <Grid item xs={12} md={6} lg={8} xl={8}>
            <AppointmentCalendar />
          </Grid>
        </Grid>
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
