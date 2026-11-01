import * as plugins from '@toxicwind/strudel-voices'

const win = window as unknown as {
  __voicePlugins: typeof plugins
  __voicePluginKeys: string[]
}

if (typeof window !== 'undefined') {
  win.__voicePlugins = plugins
  win.__voicePluginKeys = Object.keys(plugins)
}

console.log('Strudel voices loaded:', Object.keys(plugins))
import('./init-bridge.js')