// Vision UI Dashboard React Base Styles
import colors from "assets/theme/base/colors";
import bgAdmin from "assets/images/body-background.png";

const { info, dark } = colors;
export default {
  html: {
    scrollBehavior: "smooth",
    background: dark.body,
    // Global page scrollbar (Firefox)
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(255,255,255,0.18) transparent",
  },
  body: {
    background: `url(${bgAdmin})`,
    backgroundSize: "cover",
    // Ensure body also carries global scrollbar styling on Chromium/WebKit
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(255,255,255,0.18) transparent",
  },
  "*, *::before, *::after": {
    margin: 0,
    padding: 0,
  },
  // Global page scrollbar (Chromium/WebKit)
  "html::-webkit-scrollbar, body::-webkit-scrollbar": {
    width: "8px",
    background: "transparent !important",
  },
  "html::-webkit-scrollbar-thumb, body::-webkit-scrollbar-thumb": {
    background: "rgba(255,255,255,0.18)",
    borderRadius: "8px",
    border: "2px solid transparent",
    minHeight: "40px",
  },
  "html::-webkit-scrollbar-track, body::-webkit-scrollbar-track": {
    background: "transparent !important",
  },
  "html::-webkit-scrollbar-track-piece, body::-webkit-scrollbar-track-piece": {
    background: "transparent !important",
  },
  "html::-webkit-scrollbar-button, body::-webkit-scrollbar-button": {
    display: "block",
    height: "16px",
    background: "transparent !important",
  },
  "html::-webkit-scrollbar-corner, body::-webkit-scrollbar-corner": {
    background: "transparent",
  },
  "a, a:link, a:visited": {
    textDecoration: "none !important",
  },
  "a.link, .link, a.link:link, .link:link, a.link:visited, .link:visited": {
    color: `${dark.main} !important`,
    transition: "color 150ms ease-in !important",
  },
  "a.link:hover, .link:hover, a.link:focus, .link:focus": {
    color: `${info.main} !important`,
  },
};

// MIT: Portions © 2021 Creative Tim & Simmmple (Vision UI Free React). See LICENSE.md.
