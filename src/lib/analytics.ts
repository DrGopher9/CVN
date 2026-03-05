type EventPayload = Record<string, string | number | boolean>;

export function trackEvent(eventName: string, payload: EventPayload): void {
  if (typeof window === 'undefined') {
    return;
  }

  const entry = {
    eventName,
    payload,
    at: new Date().toISOString()
  };

  // Stub logger for MVP. Swap with a provider later.
  console.info('[analytics]', entry);
}
