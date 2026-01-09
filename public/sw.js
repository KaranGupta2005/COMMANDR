// sw.js

self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker activated');
});

// web push
self.addEventListener('push', event => {
  const data = event.data?.json() || {
    title: 'Notification',
    message: 'New message',
    icon: '/logo.png',
  };

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.message,
      icon: data.icon,
    })
  );
});
