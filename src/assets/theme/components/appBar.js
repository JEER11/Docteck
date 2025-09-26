export default {
  // Removed explicit default color to avoid MUI production error (#9 with arg "transparent")
  // Some newer MUI versions can complain if a custom palette key is used as a color prop
  // for AppBar in production builds. We'll rely on the default color and just clear shadow.
  styleOverrides: {
    root: {
      boxShadow: "none",
      backgroundColor: 'transparent', // keep appearance without forcing palette color prop
    },
  },
};

// MIT: Portions © 2021 Creative Tim & Simmmple (Vision UI Free React). See LICENSE.md.
