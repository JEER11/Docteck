// @mui material components
import Card from "@mui/material/Card";
// import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

// Billing page components
import Transaction from "layouts/billing/components/Transaction";
import "../Invoice/modernScrollbar.css";

// Billing context
import { useBilling } from "context/BillingContext";
import React from "react";

function Transactions() {
  const { payments } = useBilling();
  const [viewAllOpen, setViewAllOpen] = React.useState(false);
  // Sort by date descending
  const sortedPayments = [...payments].sort((a, b) => new Date(b.date) - new Date(a.date));
  // Assign color/icon based on type for UI
  const getColor = (type) => {
    switch (type) {
      case 'insurance': return 'info';
      case 'pharmacy': return 'primary';
      case 'prescription': return 'primary';
      case 'appointment': return 'success';
      default: return 'primary';
    }
  };
  const getIcon = (type) => {
    switch (type) {
      case 'insurance': return 'credit_card';
      case 'pharmacy': return 'local_pharmacy';
      case 'prescription': return 'medication';
      case 'appointment': return 'event_available';
      default: return 'credit_card';
    }
  };
  return (
    <Card sx={{ height: "100%" }}>
      <VuiBox
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb="18px"
        sx={({ breakpoints }) => ({
          [breakpoints.down("lg")]: {
            flexDirection: "column",
          },
        })}
      >
        <VuiTypography
          variant="lg"
          fontWeight="bold"
          textTransform="capitalize"
          color="white"
          sx={({ breakpoints }) => ({
            [breakpoints.only("sm")]: {
              mb: "6px",
            },
          })}
        >
          Recent Payments
        </VuiTypography>
        <VuiBox display="flex" alignItems="center" gap={1.25}>
          <VuiBox color="white" mr="6px" lineHeight={0}>
            <Icon color="inherit" fontSize="small">
              date_range
            </Icon>
          </VuiBox>
          <VuiTypography variant="button" color="text" fontWeight="regular">
            {sortedPayments.length > 0 ? new Date(sortedPayments[0].date).toLocaleDateString() : ''}
          </VuiTypography>
          <Tooltip title="View all payments">
            <IconButton
              size="small"
              onClick={() => setViewAllOpen(true)}
              sx={{
                color: '#e0e0e0',
                background: 'rgba(32,34,64,0.7)',
                borderRadius: 2,
                ml: 0.5,
                '&:hover': { background: 'rgba(32,34,64,0.9)' }
              }}
              aria-label="view all payments"
            >
              <Icon fontSize="small">open_in_new</Icon>
            </IconButton>
          </Tooltip>
        </VuiBox>
      </VuiBox>
      <VuiBox>
        <VuiBox mb={2}>
          <VuiTypography
            variant="caption"
            color="text"
            fontWeight="medium"
            textTransform="uppercase"
          >
            latest transactions
          </VuiTypography>
        </VuiBox>
        <VuiBox
          component="ul"
          display="flex"
          flexDirection="column"
          p={0}
          m={0}
          sx={{ listStyle: "none" }}
        >
          {sortedPayments.map((tx, idx) => (
            <Transaction
              key={tx.name + tx.date + idx}
              color={getColor(tx.type)}
              icon={getIcon(tx.type)}
              name={tx.name}
              description={`${tx.description} • ${new Date(tx.date).toLocaleString()}`}
              value={tx.value < 0 ? `- $${Math.abs(tx.value).toFixed(2)}` : `+ $${tx.value.toFixed(2)}`}
            />
          ))}
        </VuiBox>
      </VuiBox>

      {/* View All Dialog */}
  <Dialog
        open={viewAllOpen}
        onClose={() => setViewAllOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(34, 40, 74, 0.7)',
            boxShadow: 24,
            borderRadius: 4,
            color: 'white',
            backdropFilter: 'blur(14px)',
            p: 4,
            maxHeight: 680,
            width: { xs: '100%', sm: 680 },
          }
        }}
      >
        <DialogTitle sx={{ color: 'white', fontWeight: 700, fontSize: 22, pb: 1.5 }}>
          All Payments
        </DialogTitle>
        <DialogContent
          dividers
          className="modern-scrollbar"
          sx={{ borderColor: '#23244a', px: 1.5, maxHeight: 500, overflowY: 'auto' }}
        >
          <VuiBox component="ul" p={0} m={0} sx={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 0 }}>
            {sortedPayments.map((tx, idx) => (
              <Transaction
                key={'viewall-' + tx.name + tx.date + idx}
                color={getColor(tx.type)}
                icon={getIcon(tx.type)}
                name={tx.name}
                description={`${tx.description} • ${new Date(tx.date).toLocaleString()}`}
                value={tx.value < 0 ? `- $${Math.abs(tx.value).toFixed(2)}` : `+ $${tx.value.toFixed(2)}`}
                showConnector
                isLast={idx === sortedPayments.length - 1}
              />
            ))}
          </VuiBox>
        </DialogContent>
        <DialogActions sx={{ px: 2, py: 1.5 }}>
          <Button onClick={() => setViewAllOpen(false)} sx={{ color: '#bfc6e0' }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

export default Transactions;
