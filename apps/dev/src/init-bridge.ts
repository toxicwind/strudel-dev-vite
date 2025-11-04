import { initSerumBridge } from '@custom/plugins'

type ImportMetaEnv = { env?: Record<string, string | undefined> }

export function startSerumBridge() {
  const bridgeUrl =
    (import.meta as unknown as ImportMetaEnv).env?.VITE_SERUM_BRIDGE_URL ?? 'ws://localhost:9000'
  const bridge = initSerumBridge(bridgeUrl)
  console.log('[Serum] Bridge bootstrap attempted:', bridgeUrl)
  return { bridge, bridgeUrl }
}
