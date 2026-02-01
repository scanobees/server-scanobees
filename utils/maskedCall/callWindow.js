
export function ensureCallWindow(validUntil) {
  if (Date.now() > new Date(validUntil).getTime()) {
    throw new Error("CALL_WINDOW_EXPIRED");
  }
}
