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
  // Keep wrapper padding fixed (slightly tighter on the left)
  paddingRight: rightIcon ? pxToRem(6) : pxToRem(6),
  paddingLeft: leftIcon ? pxToRem(4) : pxToRem(4),
    "& .MuiIcon-root": {
      color: grey[500],
    },

    "& .MuiInputBase-input": {
      color: white.main,
      height: "100%",
      // Much tighter internal padding to bring placeholder closer to the left
      paddingLeft: pxToRem(8),
      paddingRight: pxToRem(10),
      backgroundColor: disabled ? grey[600] : inputColors.backgroundColor,
    },
    // Whole control turns to focus color; input itself stays flat
    "&:focus-within": {
      borderColor: inputColors.borderColor.focus,
      // Avoid extra shadow expansion that can visually shift layout
      boxShadow: "none",
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
  // Keep internal padding constant and significantly reduced on the left
  paddingRight: rightIcon ? pxToRem(48) : pxToRem(10),
  paddingLeft: leftIcon ? pxToRem(12) : pxToRem(10),
      "& ::placeholder": {
        color: `${white.main} !important`,
      },
    },
  };
});

// MIT: Portions © 2021 Creative Tim & Simmmple (Vision UI Free React). See LICENSE.md.
