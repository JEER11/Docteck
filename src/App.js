import { useState, useEffect, useMemo, Suspense } from "react";
import { markAppReady } from './index';
// Runtime diagnostics (temporary) to troubleshoot Firestore 400 errors / missing config
import { hasFirebaseConfig, auth, db } from 'lib/firebase';
import { __diagnoseTodosWrite } from 'lib/todoData';
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
import FullScreenLoader from "components/FullScreenLoader";
import RouteChangeLoader from "components/RouteChangeLoader";
import AppErrorBoundary from "components/AppErrorBoundary";

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

  // Expose routes at runtime for global search indexing (avoids require loops)
  useEffect(() => {
    try { window.__APP_ROUTES__ = routes; } catch (_) {}
  }, []);

  // Add/remove a special background on billing route only
  useEffect(() => {
    if (pathname.startsWith("/billing")) {
      document.body.classList.add("billing-bg");
    } else {
      document.body.classList.remove("billing-bg");
    }
    return () => document.body.classList.remove("billing-bg");
  }, [pathname]);

  // One-time diagnostics (dev only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    try {
      const cfg = (window && window.__FIREBASE_CONFIG__) || {};
      if (!window.__FIREBASE_DIAG_LOGGED__) {
        window.__FIREBASE_DIAG_LOGGED__ = true;
        console.group('[FirebaseDiag]');
        console.log('hasFirebaseConfig flag:', hasFirebaseConfig);
        console.log('Injected window.__FIREBASE_CONFIG__ keys:', Object.keys(cfg));
        console.log('Missing critical keys?', {
          apiKey: !cfg.apiKey,
          projectId: !cfg.projectId,
          appId: !cfg.appId,
        });
        console.log('Auth currentUser UID:', auth?.currentUser?.uid || null);
        console.log('Firestore instance present:', Boolean(db));
        console.groupEnd();
      }
    } catch (_) { /* ignore */ }
  }, []);

  // Attempt a single self-test write once a user is present (dev only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    let t;
    function attempt() {
      if (auth?.currentUser?.uid && !window.__FIREBASE_TODO_TEST__) {
        window.__FIREBASE_TODO_TEST__ = true;
        setTimeout(() => { try { __diagnoseTodosWrite(); } catch(_) {} }, 400);
        return;
      }
      t = setTimeout(attempt, 600);
    }
    attempt();
    return () => { if (t) clearTimeout(t); };
  }, []);

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
    <AppErrorBoundary>
      <Suspense fallback={<FullScreenLoader />}> 
        <Switch>
          {getRoutes(routes)}
          <Route path="/calendar/oauth-success.html" />
          <Redirect from="*" to="/dashboard" />
        </Switch>
      </Suspense>
    </AppErrorBoundary>
  );

  // Check if current route is an authentication page
  const isAuthPage = pathname.startsWith("/authentication");

  // Mark readiness once first paint effects run
  useEffect(() => {
    // Allow next tick so initial Suspense fallback also counts as mounted
    const t = setTimeout(() => { markAppReady(); }, 0);
    return () => clearTimeout(t);
  }, []);

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={themeRTL}>
        <CssBaseline />
        <RouteChangeLoader />
        {!isAuthPage && <Sidenav routes={routes} brandName="Docteck" color={controller.sidenavColor || "info"} />}
        {!isAuthPage && <Configurator />}
        {AppContent}
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouteChangeLoader />
      {!isAuthPage && <Sidenav routes={routes} brandName="Docteck" color={controller.sidenavColor || "info"} />}
      {!isAuthPage && <Configurator />}
      {AppContent}
    </ThemeProvider>
  );
}
