import React from "react";

// @mui components
import { Card, Stack } from "@mui/material";

// Vision UI Dashboard assets
import balance from "assets/images/billing-background-balance.png";
import Jelly1 from "assets/images/Jelly1.jpg";

// Vision UI Dashboard components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

// React icons
import { FaEllipsisH } from "react-icons/fa";
import { MdOutlineDomain } from "react-icons/md";

import { useBilling } from "context/BillingContext";

const CreditBalance = () => {
  const { payments } = useBilling();

  // Calculate total balance for the month (sum of all negative values)
  const totalBalance = payments.reduce((sum, tx) => sum + (tx.value < 0 ? Math.abs(tx.value) : 0), 0);

  // Get the newest (latest) payment
  const newest = payments.length > 0 ? payments[0] : null;

  return (
    <Card sx={{ padding: "30px" }}>
      <VuiBox display="flex" flexDirection="column">
        <VuiBox
          mb="32px"
          p="20px"
          display="flex"
          flexDirection="column"
          sx={{ backgroundImage: `url(${balance})`, backgroundSize: "cover", borderRadius: "18px", backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
        >
          <VuiBox display="flex" justifyContent="space-beetween" alignItems="center" sx={{ position: 'relative', zIndex: 2 }}>
            <VuiTypography variant="caption" color="white" fontWeight="medium" mr="auto">
              Monthly Bill
            </VuiTypography>
            <FaEllipsisH color="white" size="18px" sx={{ cursor: "pointer" }} />
          </VuiBox>
          <VuiBox display="flex" justifyContent="space-beetween" alignItems="center" sx={{ position: 'relative', zIndex: 2 }}>
            <VuiTypography variant="h2" color="white" fontWeight="bold" mr="auto">
              ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </VuiTypography>
          </VuiBox>
        </VuiBox>
        <VuiTypography color="text" variant="xxs" fontWeight="medium" mb="8px">
          LATEST TRANSACTION
        </VuiTypography>
        <VuiBox display="flex" justifyContent="space-beetween" alignItems="center">
          <Stack direction="row" spacing="10px" mr="auto">
            <VuiBox
              display="flex"
              mr="10px"
              justifyContent="center"
              alignItems="center"
              sx={{
                background: "rgba(34, 41, 78, 0.7)",
                borderRadius: "50%",
                width: "42px",
                height: "42px",
              }}
            >
              <MdOutlineDomain color="#4CAF50" size="20px" />
            </VuiBox>
            <VuiBox display="flex" flexDirection="column">
              <VuiTypography color="white" variant="button" fontWeight="medium">
                {newest ? newest.name : ''}
              </VuiTypography>
              <VuiTypography color="text" variant="button" fontWeight="medium">
                {newest ? new Date(newest.date).toLocaleString() : ''}
              </VuiTypography>
            </VuiBox>
          </Stack>
          <VuiTypography variant="button" color="white" fontWeight="bold">
            {newest ? `-$${Math.abs(newest.value).toFixed(2)}` : ''}
          </VuiTypography>
        </VuiBox>
      </VuiBox>
    </Card>
  );
};

export default CreditBalance;
