export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('SW not supported');
    return;
  }

  const register = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      registration.update();
      console.log('SW registered successfully:', registration);
      return registration;
    } catch (error) {
      console.error('SW registration failed:', error);
    }
  };

  // Register immediately if document is ready, otherwise wait for load
  if (document.readyState === 'loading') {
    window.addEventListener('load', register);
  } else {
    register();
  }
}

export function unregisterServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
