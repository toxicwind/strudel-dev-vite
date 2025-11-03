import { initSerumBridge } from '@custom/plugins'

const bridgeUrl =
  // Vite exposes environment variables prefixed with VITE_
  (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_SERUM_BRIDGE_URL ??
  'ws://localhost:9000'

initSerumBridge(bridgeUrl)
console.log('Bridge initialized')
