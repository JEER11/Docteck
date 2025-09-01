import { useState, useEffect, useMemo, Suspense } from "react";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
import FullScreenLoader from "components/FullScreenLoader";
import RouteChangeLoader from "components/RouteChangeLoader";

// MUI theme
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

import routes from "routes";
import { useVisionUIController } from "context";
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

export default function App() {
  const [controller] = useVisionUIController();
  const { direction } = controller;
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  // Create RTL cache once
  useMemo(() => {
    const cacheRtl = createCache({ key: "rtl", stylisPlugins: [rtlPlugin] });
    setRtlCache(cacheRtl);
  }, []);

  // Update document direction and scroll to top on route change
  useEffect(() => {
    document.body.setAttribute("dir", direction || "ltr");
    if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
  }, [direction, pathname]);

  // Add/remove a special background on billing route only
  useEffect(() => {
    if (pathname.startsWith("/billing")) {
      document.body.classList.add("billing-bg");
    } else {
      document.body.classList.remove("billing-bg");
    }
    return () => document.body.classList.remove("billing-bg");
  }, [pathname]);

  // Helper to render routes
  const getRoutes = (allRoutes) =>
    allRoutes.flatMap((route) => {
      if (route.collapse) return getRoutes(route.collapse);
      if (route.route && route.component)
        return (
          <Route key={route.key || route.route} exact path={route.route} component={route.component} />
        );
      return [];
    });

  const AppContent = (
    <Suspense fallback={<FullScreenLoader />}> 
      <Switch>
        {getRoutes(routes)}
        <Route path="/calendar/oauth-success.html" />
        <Redirect from="*" to="/dashboard" />
      </Switch>
    </Suspense>
  );

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={themeRTL}>
        <CssBaseline />
        <RouteChangeLoader />
        <Sidenav routes={routes} brandName="Docteck" color={controller.sidenavColor || "info"} />
        <Configurator />
        {AppContent}
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouteChangeLoader />
      <Sidenav routes={routes} brandName="Docteck" color={controller.sidenavColor || "info"} />
      <Configurator />
      {AppContent}
    </ThemeProvider>
  );
}
