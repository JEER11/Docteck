// @mui material components
import Grid from "@mui/material/Grid";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

// Vision UI Dashboard React components
import MasterCard from "examples/Cards/MasterCard";
// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Billing page components
import PaymentMethod from "layouts/billing/components/PaymentMethod";
import Invoices from "layouts/billing/components/Invoices";
import BillingInformation from "layouts/billing/components/BillingInformation";
import Transactions from "layouts/billing/components/Transactions";
import CreditBalance from "./components/CreditBalance";
import BillingBackground from "./BillingBackground";

function Billing() {
  return (
    <>
      <BillingBackground />
      <DashboardLayout>
        <DashboardNavbar />
        <VuiBox mt={4}>
          <VuiBox mb={1.5}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={7} xl={8}>
                <Grid container spacing={3}>
                  <Grid item xs={12} xl={6}>
                    <MasterCard number={7812213908237916} valid="05/24" cvv="09X" />
                  </Grid>
                  <Grid item xs={12} md={12} xl={6}>
                    <CreditBalance />
                  </Grid>
                  <Grid item xs={12}>
                    <PaymentMethod />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} lg={5} xl={4}>
                <Invoices />
              </Grid>
            </Grid>
          </VuiBox>
          <VuiBox my={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <BillingInformation />
              </Grid>
              <Grid item xs={12} md={5}>
                <Transactions />
              </Grid>
            </Grid>
          </VuiBox>
        </VuiBox>
        {/* Custom bottom bar for copyright and links */}
        <VuiBox
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            py: 2,
            px: { xs: 2, md: 6 },
            position: "relative",
            zIndex: 2,
            mt: 6,
          }}
        >
          <VuiTypography
            variant="button"
            color="white"
            sx={{ fontWeight: 400, textAlign: "center", mb: { xs: 2, md: 0 } }}
          >
            © 2025, DOCTECK
          </VuiTypography>
          <VuiBox display="flex" flexWrap="wrap" gap={4}>
            <VuiTypography
              component="a"
              variant="body2"
              color="white"
              sx={{ mx: 2 }}
            >
              
            </VuiTypography>
            <VuiTypography
              component="a"
              variant="body2"
              color="white"
              sx={{ mx: 2 }}
            >
              
            </VuiTypography>
            <VuiTypography
              component="a"
              variant="body2"
              color="white"
              sx={{ mx: 2 }}
            >
              License
            </VuiTypography>
          </VuiBox>
        </VuiBox>
      </DashboardLayout>
    </>
  );
}

export default Billing;
