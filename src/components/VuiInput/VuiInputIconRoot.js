import Icon from "@mui/material/Icon";
import { styled } from "@mui/material/styles";

export default styled(Icon)(({ theme, ownerState }) => {
  const { typography } = theme;
  const { size } = ownerState;

  const { fontWeightBold, size: fontSize } = typography;

  return {
    fontWeight: fontWeightBold,
    fontSize: size === "small" && `${fontSize.md} !important`,
  };
});

// MIT: Portions © 2021 Creative Tim & Simmmple (Vision UI Free React). See LICENSE.md.
