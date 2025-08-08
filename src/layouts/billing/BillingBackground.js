import React from "react";
import bgAdmin from "assets/images/Background.jpeg";
import VuiBox from "components/VuiBox";
import { Link } from "react-router-dom";

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
      {/* Custom bottom bar for billing page */}
      <VuiBox
        sx={{
          position: "fixed",
          left: 0,
          bottom: 0,
          width: "100vw",
          bgcolor: "rgba(24,44,90,0.85)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 1.5,
          zIndex: 1200,
        }}
      >
        <VuiBox sx={{ display: "flex", gap: 2, mb: 0.5 }}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#fff",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#fff",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#fff",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
          </a>
        </VuiBox>
        <VuiBox sx={{ fontSize: 13, opacity: 0.8 }}>
        </VuiBox>
      </VuiBox>
    </>
  );
}
