import { styled } from "@mui/material/styles";

export default styled("div")(({ theme, ownerState }) => {
  const { palette, functions, borders } = theme;
  const { error, success, disabled, iconDirection } = ownerState;

  const { inputColors, grey, white } = palette;
  const { pxToRem } = functions;
  const { borderRadius, borderWidth } = borders;

  // border color value
  let borderColorValue = inputColors.borderColor.main;

  if (error) {
    borderColorValue = inputColors.error;
  } else if (success) {
    borderColorValue = inputColors.success;
  }

  const rightIcon = iconDirection === "right";
  const leftIcon = iconDirection === "left";

  return {
    display: "flex",
    alignItems: "center",
    backgroundColor: disabled ? grey[600] : inputColors.backgroundColor,
    border: `${borderWidth[1]} solid`,
    borderRadius: borderRadius.lg,
    borderColor: borderColorValue,
  // Add a touch of internal padding so the edge icon doesn't touch the rounded border
  paddingRight: rightIcon ? pxToRem(6) : undefined,
  paddingLeft: leftIcon ? pxToRem(6) : undefined,
    "& .MuiIcon-root": {
      color: grey[500],
    },

    "& .MuiInputBase-input": {
      color: white.main,
      height: "100%",
      paddingX: pxToRem(20),
      backgroundColor: disabled ? grey[600] : inputColors.backgroundColor,
    },
    // Whole control turns to focus color; input itself stays flat
    "&:focus-within": {
      borderColor: inputColors.borderColor.focus,
      boxShadow: `0 0 0 2px ${inputColors.boxShadow}`,
    },

    "& .MuiInputBase-root": {
      border: `unset`,
      borderRadius: borderRadius.lg,
      // Keep the same rounded shape as fields without icons
      borderTopLeftRadius: borderRadius.lg,
      borderBottomLeftRadius: borderRadius.lg,
      borderTopRightRadius: borderRadius.lg,
      borderBottomRightRadius: borderRadius.lg,
      backgroundColor: `${disabled ? grey[600] : inputColors.backgroundColor} !important`,
  // Add more padding on the side where the icon sits so the icon doesn't touch the rounded border
  paddingRight: rightIcon ? pxToRem(68) : undefined,
  paddingLeft: leftIcon ? pxToRem(68) : undefined,
      "& ::placeholder": {
        color: `${white.main} !important`,
      },
    },
  };
});

// MIT: Portions © 2021 Creative Tim & Simmmple (Vision UI Free React). See LICENSE.md.
