// Seen service worker — handles Web Push notifications.
//
// Registered from src/components/practice/PushSubscribePrompt.tsx when a
// Phase 2 user opts in. Listens for push events and shows a notification;
// clicking the notification opens the targeted URL (typically the guided
// exercise that's about to start).

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}

  const title = data.title || 'Seen'
  const options = {
    body: data.body || 'Your exercise is coming up.',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: data.tag || 'seen-exercise',
    renotify: true,
    data: {
      url: data.url || '/home',
    },
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const path = event.notification.data?.url || '/home'
  const fullUrl = new URL(path, self.location.origin).href

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Focus existing tab/PWA window if open
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i]
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          return client.navigate(fullUrl).then(() => client.focus())
        }
      }
      // Otherwise open new window/tab
      return self.clients.openWindow(fullUrl)
    })
  )
})
