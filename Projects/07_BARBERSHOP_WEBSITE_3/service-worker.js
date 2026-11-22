const CACHE_NAME = "noorslot-provider-v1";
const OFFLINE_PAGE = "/offline.html";

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll([
    OFFLINE_PAGE,
    "/provider.webmanifest",
    "/assets/img/pwa-192.png",
    "/assets/img/pwa-512.png"
  ])).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith("noorslot-") && key !== CACHE_NAME).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(async () =>
      (await caches.match(OFFLINE_PAGE)) || Response.error()
    ));
  }
});

self.addEventListener("push", event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; }
  catch { data = { body: event.data?.text() || "You have a new update." }; }

  event.waitUntil(self.registration.showNotification(data.title || "NOORSLOT booking update", {
    body: data.body || "A new booking request is waiting for you.",
    icon: "/assets/img/pwa-192.png",
    badge: "/assets/img/pwa-192.png",
    tag: data.tag || "noorslot-booking",
    data: { url: data.url || "/provider-dashboard.html#bookings" },
    vibrate: [150, 80, 150]
  }));
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || "/provider-dashboard.html#bookings", self.location.origin).href;
  event.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then(windowClients => {
    const existing = windowClients.find(client => new URL(client.url).origin === self.location.origin);
    if (existing) {
      existing.navigate(targetUrl);
      return existing.focus();
    }
    return clients.openWindow(targetUrl);
  }));
});
