// update-checker.js

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', function() {
        // This fires when the service worker controlling this page changes
        window.location.reload();
    });

    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
        // Check for updates on page load
        registration.update();

        // Listen for updates
        registration.onupdatefound = function() {
            const installingWorker = registration.installing;
            installingWorker.onstatechange = function() {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New update available, reload the page
                    window.location.reload();
                }
            };
        };
    }).catch(function(error) {
        console.log('Service Worker registration failed:', error);
    });
}
