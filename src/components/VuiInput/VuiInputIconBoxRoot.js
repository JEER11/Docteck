import { styled } from "@mui/material/styles";

export default styled("div")(({ theme, ownerState }) => {
  const { palette, functions } = theme;
  const { size, iconDirection } = ownerState;

  const { dark } = palette;
  const { pxToRem } = functions;

  return {
    lineHeight: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  // Give the icon a bit more breathing room so it isn't clipped by the rounded border
  padding: size === "small" ? `${pxToRem(2)} ${pxToRem(6)}` : `${pxToRem(4)} ${pxToRem(6)}`,
  // Avoid a fixed narrow width which caused slight clipping; use a min width instead
  // 32–36px fits MUI IconButton size="small" comfortably
  minWidth: pxToRem(36),
    height: "100%",
    color: dark.main,
    background: 'transparent',
    // Keep centered vertically; no negative offsets so it won't be cut at the bottom
    position: 'relative',
    top: 0,
    // Create more breathing room from the rounded border so the icon is fully visible
  // Pull slightly away from the extreme edge, so the right side isn’t cut by the outer radius
  marginRight: iconDirection === 'right' ? pxToRem(18) : undefined,
    marginLeft: iconDirection === 'left' ? pxToRem(16) : undefined,
    // Slightly smaller icon to avoid any clipping by the rounded corners
    '& .MuiSvgIcon-root, & .MuiIcon-root': {
      fontSize: pxToRem(18),
      lineHeight: 1,
    },
  };
});

// MIT: Portions © 2021 Creative Tim & Simmmple (Vision UI Free React). See LICENSE.md.
