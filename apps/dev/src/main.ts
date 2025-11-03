import * as plugins from '@custom/plugins'

if (typeof window !== 'undefined') {
  ;(window as any).__serumPlugins = plugins
  ;(window as any).__serumPluginKeys = Object.keys(plugins)
}

console.log('Serum plugins loaded:', Object.keys(plugins))
import('./init-bridge.js')
