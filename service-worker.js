const CACHE_NAME = 'obfirmo-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/script.js',
    '/styles.css',
    '/favicon.ico',
    '/logo192.png',
    'https://cdnjs.cloudflare.com/ajax/libs/seedrandom/3.0.5/seedrandom.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jsSHA/3.2.0/sha.js',
    'https://kit.fontawesome.com/b6ddcc09af.js',
];

const splashScreens = [
    { width: 393, height: 852, ratio: 3, orientation: 'landscape', url: '/splash_screens/iPhone_15_Pro__iPhone_15__iPhone_14_Pro_landscape.png' },
    { width: 744, height: 1133, ratio: 2, orientation: 'portrait', url: '/splash_screens/8.3__iPad_Mini_portrait.png' },
    { width: 375, height: 667, ratio: 2, orientation: 'landscape', url: '/splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_landscape.png' },
    { width: 320, height: 568, ratio: 2, orientation: 'portrait', url: '/splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_portrait.png' },
    { width: 414, height: 736, ratio: 3, orientation: 'landscape', url: '/splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_landscape.png' },
    { width: 834, height: 1194, ratio: 2, orientation: 'landscape', url: '/splash_screens/11__iPad_Pro__10.5__iPad_Pro_landscape.png' },
    { width: 834, height: 1194, ratio: 2, orientation: 'portrait', url: '/splash_screens/11__iPad_Pro__10.5__iPad_Pro_portrait.png' },
    { width: 414, height: 736, ratio: 3, orientation: 'portrait', url: '/splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_portrait.png' },
    { width: 430, height: 932, ratio: 3, orientation: 'portrait', url: '/splash_screens/iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_portrait.png' },
    { width: 820, height: 1180, ratio: 2, orientation: 'portrait', url: '/splash_screens/10.9__iPad_Air_portrait.png' },
    { width: 375, height: 812, ratio: 3, orientation: 'landscape', url: '/splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_landscape.png' },
    { width: 834, height: 1112, ratio: 2, orientation: 'landscape', url: '/splash_screens/10.5__iPad_Air_landscape.png' },
    { width: 428, height: 926, ratio: 3, orientation: 'landscape', url: '/splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_landscape.png' },
    { width: 390, height: 844, ratio: 3, orientation: 'portrait', url: '/splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png' },
    { width: 375, height: 812, ratio: 3, orientation: 'portrait', url: '/splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_portrait.png' },
    { width: 414, height: 896, ratio: 3, orientation: 'portrait', url: '/splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_portrait.png' },
    { width: 1024, height: 1366, ratio: 2, orientation: 'portrait', url: '/splash_screens/12.9__iPad_Pro_portrait.png' },
    { width: 1024, height: 1366, ratio: 2, orientation: 'landscape', url: '/splash_screens/12.9__iPad_Pro_landscape.png' },
    { width: 414, height: 896, ratio: 2, orientation: 'portrait', url: '/splash_screens/iPhone_11__iPhone_XR_portrait.png' },
    { width: 320, height: 568, ratio: 2, orientation: 'landscape', url: '/splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_landscape.png' },
    { width: 375, height: 667, ratio: 2, orientation: 'portrait', url: '/splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait.png' },
    { width: 768, height: 1024, ratio: 2, orientation: 'landscape', url: '/splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_landscape.png' },
    { width: 428, height: 926, ratio: 3, orientation: 'portrait', url: '/splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait.png' },
    { width: 834, height: 1112, ratio: 2, orientation: 'portrait', url: '/splash_screens/10.5__iPad_Air_portrait.png' },
    { width: 810, height: 1080, ratio: 2, orientation: 'portrait', url: '/splash_screens/10.2__iPad_portrait.png' },
    { width: 768, height: 1024, ratio: 2, orientation: 'portrait', url: '/splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_portrait.png' },
    { width: 820, height: 1180, ratio: 2, orientation: 'landscape', url: '/splash_screens/10.9__iPad_Air_landscape.png' },
    { width: 414, height: 896, ratio: 3, orientation: 'landscape', url: '/splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_landscape.png' },
    { width: 414, height: 896, ratio: 2, orientation: 'landscape', url: '/splash_screens/iPhone_11__iPhone_XR_landscape.png' },
    { width: 390, height: 844, ratio: 3, orientation: 'landscape', url: '/splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_landscape.png' },
    { width: 744, height: 1133, ratio: 2, orientation: 'landscape', url: '/splash_screens/8.3__iPad_Mini_landscape.png' },
    { width: 393, height: 852, ratio: 3, orientation: 'portrait', url: '/splash_screens/iPhone_15_Pro__iPhone_15__iPhone_14_Pro_portrait.png' },
    { width: 810, height: 1080, ratio: 2, orientation: 'landscape', url: '/splash_screens/10.2__iPad_landscape.png' },
    { width: 430, height: 932, ratio: 3, orientation: 'landscape', url: '/splash_screens/iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_landscape.png' },
];

// Function to get the correct splash screen URL based on device characteristics
async function getSplashScreenURL() {
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const client = clients.length ? clients[0] : null;

    if (!client) {
        return null;
    }

    // Communicate with the client to get device info
    const messageChannel = new MessageChannel();
    client.postMessage({ type: 'GET_DEVICE_INFO' }, [messageChannel.port2]);

    return new Promise((resolve) => {
        messageChannel.port1.onmessage = (event) => {
            const { width, height, ratio, orientation } = event.data;
            const splashScreen = splashScreens.find(screen =>
                screen.width === width &&
                screen.height === height &&
                screen.ratio === ratio &&
                screen.orientation === orientation
            );
            resolve(splashScreen ? splashScreen.url : null);
        };
    });
}

// Install the service worker and cache all the necessary assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(async cache => {
                console.log('Opened cache');
                const splashScreenURL = await getSplashScreenURL();
                if (splashScreenURL) {
                    urlsToCache.push(splashScreenURL);
                }
                return cache.addAll(urlsToCache);
            })
    );
});

// Activate the service worker
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch assets from the cache first, falling back to the network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request).then(response => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    return response;
                });
            })
    );
});
