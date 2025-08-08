// @mui material components
import Card from "@mui/material/Card";
// import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

// Billing page components
import Transaction from "layouts/billing/components/Transaction";

// Billing context
import { useBilling } from "context/BillingContext";

function Transactions() {
  const { payments } = useBilling();
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
        <VuiBox display="flex" alignItems="flex-start">
          <VuiBox color="white" mr="6px" lineHeight={0}>
            <Icon color="inherit" fontSize="small">
              date_range
            </Icon>
          </VuiBox>
          <VuiTypography variant="button" color="text" fontWeight="regular">
            {sortedPayments.length > 0 ? new Date(sortedPayments[0].date).toLocaleDateString() : ''}
          </VuiTypography>
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
    </Card>
  );
}

export default Transactions;
