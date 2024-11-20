const DISCOVERY_NODES_ENDPOINT = 'https://api.audius.co';

let cachedHost: string | null = null;
let pendingResolve: Promise<string> | null = null;

async function pickDiscoveryNode(): Promise<string> {
  const response = await fetch(DISCOVERY_NODES_ENDPOINT);
  const json = (await response.json()) as {data: string[]};
  const hosts = json.data;
  if (hosts.length === 0) {
    throw new Error('No Audius discovery nodes available');
  }
  return hosts[Math.floor(Math.random() * hosts.length)];
}

export async function getAudiusHost(): Promise<string> {
  if (cachedHost) {
    return cachedHost;
  }
  if (!pendingResolve) {
    pendingResolve = pickDiscoveryNode()
      .then(host => {
        cachedHost = host;
        return host;
      })
      .finally(() => {
        pendingResolve = null;
      });
  }
  return pendingResolve;
}

// call when a stream/request against the current host fails mid-session
export async function reresolveAudiusHost(): Promise<string> {
  cachedHost = null;
  return getAudiusHost();
}
