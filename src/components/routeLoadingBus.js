// Tiny event bus to signal the start of a route transition BEFORE the URL changes
const listeners = new Set();

export const routeLoadingBus = {
  subscribe(cb) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  start() {
    listeners.forEach((cb) => {
      try { cb(); } catch (_) {}
    });
  },
};

// Optional helper for imperative navigation triggers
export const startRouteLoading = () => routeLoadingBus.start();

export default routeLoadingBus;
