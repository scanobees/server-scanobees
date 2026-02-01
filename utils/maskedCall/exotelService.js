
export function getConnectUrl(callSessionId) {
  return `${process.env.BASE_URL}/api/exotel/connect?callSessionId=${callSessionId}`;
}
