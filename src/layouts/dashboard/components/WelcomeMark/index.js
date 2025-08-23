import React, { useState, useEffect, useRef } from "react";

import { Card, Icon } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import Jelly2 from "assets/images/Jelly2.jpg";
// Note: large video asset removed from repo; keep video optional to avoid build errors
const jellyVideo = null;

const WelcomeMark = () => {
  const handleClick = () => {
    window.location.href = '/assistance';
  };
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (hovered) setMounted(true);
  }, [hovered]);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (hovered) {
      // try to play when hovered
      const p = v.play();
      if (p && p.catch) p.catch(() => {
        // autoplay might be blocked; keep muted to increase chance
        v.muted = true;
        v.play().catch(() => {});
      });
    } else {
      v.pause();
      try { v.currentTime = 0; } catch (e) {}
    }
  }, [hovered, mounted]);
  return (
    <Card
      sx={{
        height: "340px",
        backgroundImage: `url(${Jelly2})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        overflow: 'hidden',
        // Add a dark overlay for readability
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(24,28,58,0.55)',
          zIndex: 1,
        },
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <VuiBox height="100%" display="flex" flexDirection="column" justifyContent="space-between" sx={{ position: 'relative', zIndex: 2 }}>
  {/* 3D hover overlay: lazy-load and fade */}
  {mounted && jellyVideo && (
          <VuiBox
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 3,
              transition: 'opacity 300ms ease',
              opacity: hovered ? 1 : 0,
              pointerEvents: hovered ? 'auto' : 'none',
              display: 'flex'
            }}
          >
            <video
              ref={videoRef}
              src={jellyVideo}
              muted
              loop
              playsInline
              preload="metadata"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              aria-hidden
            />
          </VuiBox>
        )}
        <VuiBox>
          <VuiTypography color="text" variant="button" fontWeight="regular" mb="12px">
            Welcome back,
          </VuiTypography>
          <VuiTypography color="white" variant="h3" fontWeight="bold" mb="18px">
            
          </VuiTypography>
          <VuiTypography color="text" variant="h6" fontWeight="regular" mb="auto">
            Happy to see you again!
            <br /> Ask me anything.
          </VuiTypography>
        </VuiBox>
  <VuiTypography
          variant="button"
          color="white"
          fontWeight="regular"
          sx={{
            mr: "5px",
            display: "inline-flex",
            alignItems: "center",
            cursor: "pointer",
            textDecoration: 'none',
            userSelect: 'none',
            "& .material-icons-round": {
              fontSize: "1.125rem",
              transform: `translate(2px, -0.5px)`,
              transition: "transform 0.2s cubic-bezier(0.34,1.61,0.7,1.3)",
            },
            "&:hover .material-icons-round, &:focus  .material-icons-round": {
              transform: `translate(6px, -0.5px)`,
            },
          }}
          onClick={handleClick}
        >
        
          <Icon sx={{ fontWeight: "bold", ml: "5px" }}>arrow_backward</Icon>
        </VuiTypography>
      </VuiBox>
    </Card>
  );
};

export default WelcomeMark;
