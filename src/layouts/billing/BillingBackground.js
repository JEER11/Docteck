import React from "react";
import bgAdmin from "assets/images/Background.jpeg";
import VuiBox from "components/VuiBox";

export default function BillingBackground() {
  return (
    <>
      <VuiBox
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
          background: `url(${bgAdmin}) center center / cover no-repeat fixed`,
          pointerEvents: "none",
        }}
      >
        <VuiBox
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(24,44,90,0.45)",
          }}
        />
      </VuiBox>
    </>
  );
}
