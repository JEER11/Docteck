// Global search action handler for opening dialogs/popups from search results

class SearchActionBus {
  constructor() {
    this.listeners = new Set();
  }

  // Register a listener for search actions
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Trigger a search action
  trigger(action) {
    this.listeners.forEach(callback => {
      try {
        callback(action);
      } catch (error) {
        console.error('Search action callback error:', error);
      }
    });
  }

  // Helper methods for common actions
  openRecordDialog(tab = 0) {
    this.trigger({ type: 'dialog', target: 'record', tab });
  }

  openCommunicationDialog(tab = 0) {
    this.trigger({ type: 'dialog', target: 'communication', tab });
  }
}

// Global instance
export const searchActionBus = new SearchActionBus();

// Helper function to handle search result navigation
export function handleSearchNavigation(result, history, routeLoadingBus) {
  // Start loading animation
  routeLoadingBus.start();
  
  // Navigate to the page first
  history.push(result.path);
  
  // If there's a special action, trigger it after navigation
  if (result.action) {
    // Small delay to ensure page has loaded
    setTimeout(() => {
      searchActionBus.trigger(result.action);
    }, 100);
  }
}