/* eslint-disable no-console */

import { register } from "register-service-worker";
import alertify from "alertify.js";

const notifyUserAboutUpdate = worker => {
  alertify.confirm("An update is available!\nDo you want to update?", () => {
    worker.postMessage({ action: "skipWaiting" });
  });
};

if (process.env.NODE_ENV === "production") {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        "App is being served from cache by a service worker.\n" +
          "For more details, visit https://goo.gl/AFskqB"
      );
    },
    registered() {
      console.log("Service worker has been registered.");
    },
    cached() {
      console.log("Content has been cached for offline use.");
    },
    updatefound(registration) {
      console.log("New content is downloading.");
      const newWorker = registration.installing;

      newWorker.addEventListener("statechange", () => {
        console.log(`New service worker changed to ${newWorker.state}`);
      });
    },
    updated(registration) {
      console.log("New content is available; please refresh.");
      notifyUserAboutUpdate(registration.waiting);
    },
    offline() {
      console.log(
        "No internet connection found. App is running in offline mode."
      );
    },
    error(error) {
      console.error("Error during service worker registration:", error);
    }
  });
}

let refreshing;

navigator.serviceWorker.addEventListener("controllerChange", function() {
  console.log("Service worker has handed control over to new worker");
  if (refreshing) return;
  window.location.reload();
  refreshing = true;
});

// navigator.serviceWorker.addEventListener("fetch", function() {
//   if (refreshing) return;
//   window.location.reload();
//   refreshing = true;
// });
