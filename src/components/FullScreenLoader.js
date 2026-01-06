import React from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

// Sliding animation for the loader dot
const slide = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(184px); }
`;

// Transparent overlay to render only the loader on top of the current page
const Overlay = styled("div")`
  position: fixed;
  inset: 0;
  z-index: 3000; /* ensure above all page elements */
  pointer-events: none; /* don't block the page */
`;

// Position the loader near the top center of the viewport
const BarContainer = styled("div")`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
`;

const Track = styled("div")`
  position: relative;
  width: 200px;
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  box-shadow: 0 2px 10px rgba(0,0,0,0.2) inset, 0 4px 10px rgba(0,0,0,0.15);
  overflow: hidden;
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);
`;

const Dot = styled("div")`
  position: absolute;
  top: 50%;
  left: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, #64b5f6 0%, #7c4dff 100%);
  box-shadow: 0 0 0 2px rgba(255,255,255,0.3), 0 6px 12px rgba(98, 0, 238, 0.5);
  animation: ${slide} 1.1s ease-in-out 0s infinite alternate;
`;

const Trail = styled("div")`
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(124,77,255,0.25), rgba(100,181,246,0.25));
  filter: blur(8px);
  opacity: 0.8;
`;

// Visually hidden text for screen readers
const SrOnly = styled("span")`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export default function FullScreenLoader() {
  return (
    <Overlay role="status" aria-live="polite">
      <BarContainer>
        <Track>
          <Trail />
          <Dot />
        </Track>
      </BarContainer>
      <SrOnly>Loading</SrOnly>
    </Overlay>
  );
}
