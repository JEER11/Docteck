import { styled } from "@mui/material/styles";

export default styled("div")(({ theme, ownerState }) => {
  const { palette, functions } = theme;
  const { size } = ownerState;

  const { dark } = palette;
  const { pxToRem } = functions;

  return {
    lineHeight: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: size === "small" ? `${pxToRem(4)} ${pxToRem(10)}` : `${pxToRem(8)} ${pxToRem(10)}`,
    width: pxToRem(44),
    height: "100%",
    color: dark.main,
  };
});

// MIT: Portions © 2021 Creative Tim & Simmmple (Vision UI Free React). See LICENSE.md.
