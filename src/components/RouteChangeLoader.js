import React, { useEffect, useRef, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import FullScreenLoader from "components/FullScreenLoader";
import { routeLoadingBus } from "components/routeLoadingBus";

// Shows the thin loader bar on every navigation. Uses history.listen so it starts
// immediately when navigation is triggered (before heavy renders mount).
export default function RouteChangeLoader({ minDuration = 800, maxDuration = 8000 }) {
  const history = useHistory();
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef(null);
  const hardStopTimer = useRef(null);
  const raf1Ref = useRef(0);
  const raf2Ref = useRef(0);

  useEffect(() => {
    const start = () => {
      // Start the loader immediately
      setVisible(true);
      clearTimeout(hideTimer.current);
      clearTimeout(hardStopTimer.current);
      // Safety max timeout
      hardStopTimer.current = setTimeout(() => setVisible(false), Math.max(maxDuration, minDuration + 500));
    };

    // Listen to history changes (push/replace/pop)
    const unlisten = history.listen(() => {
      start();
    });

  // Also respond to pre-navigation signals from clickable UI
  const unsubscribeBus = routeLoadingBus.subscribe(() => start());

    // Also run once on mount to catch programmatic redirects
    start();

    return () => {
      unlisten && unlisten();
      unsubscribeBus && unsubscribeBus();
      clearTimeout(hideTimer.current);
      clearTimeout(hardStopTimer.current);
    };
  }, [history, minDuration, maxDuration]);

  // After the location actually changes, allow at least minDuration of visibility
  // and hide shortly after the first paint.
  useEffect(() => {
    if (!visible) return;
    // Two RAFs to ensure the new route had a chance to paint once
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => setVisible(false), Math.max(minDuration, 200));
      });
      raf2Ref.current = raf2;
    });
    raf1Ref.current = raf1;
    return () => {
      if (raf1Ref.current) cancelAnimationFrame(raf1Ref.current);
      if (raf2Ref.current) cancelAnimationFrame(raf2Ref.current);
    };
  }, [pathname, visible, minDuration]);

  return visible ? <FullScreenLoader /> : null;
}
