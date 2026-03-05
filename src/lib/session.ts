export function createAnonymousSessionId(): string {
  const randomChunk = Math.random().toString(36).slice(2, 10);
  const timestamp = Date.now().toString(36);
  return `anon-${timestamp}-${randomChunk}`;
}
