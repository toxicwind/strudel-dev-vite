import { initVoiceBridge } from '@toxicwind/strudel-voices'

const bridgeUrl =
  // Vite exposes environment variables prefixed with VITE_
  (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_VOICE_BRIDGE_URL ??
  'ws://localhost:9000'

initVoiceBridge(bridgeUrl)
console.log('Bridge initialized')