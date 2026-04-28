"use client";

import { useSyncExternalStore } from "react";

const AUTH_EVENT = "auth-change";

function subscribe(callback: () => void) {
  const handleChange = () => callback();
  window.addEventListener("storage", handleChange);
  window.addEventListener(AUTH_EVENT, handleChange);
  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(AUTH_EVENT, handleChange);
  };
}

function getClientSnapshot() {
  return Boolean(window.localStorage.getItem("token"));
}

function getServerSnapshot() {
  return false;
}

export function useIsLoggedIn() {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}

export function notifyAuthChanged() {
  window.dispatchEvent(new Event(AUTH_EVENT));
}
