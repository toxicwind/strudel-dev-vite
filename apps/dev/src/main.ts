import './style.css'
import * as plugins from '@custom/plugins'
import { startSerumBridge } from './init-bridge.js'

type ImportMetaEnv = { env?: Record<string, string | undefined> }

declare global {
  interface Window {
    __serumPlugins?: typeof plugins
    __serumPluginKeys?: string[]
    serumBridge?: WebSocket | { readyState?: number }
  }
}

const pluginKeys = Object.keys(plugins)

if (typeof window !== 'undefined') {
  window.__serumPlugins = plugins
  window.__serumPluginKeys = pluginKeys
}

console.log('Serum plugins loaded:', pluginKeys)

const bridgeStatusRef = { text: 'connecting…' }

function initialiseBridge() {
  const { bridge, bridgeUrl } = startSerumBridge()
  const statusEl = document.querySelector<HTMLElement>('[data-role="bridge-status"]')
  const updateStatus = (state: string) => {
    bridgeStatusRef.text = state
    if (statusEl) statusEl.textContent = state
  }

  if (!bridge) {
    updateStatus(`Bridge disabled (target ${bridgeUrl})`)
    return
  }

  const describe = (ws: WebSocket) => {
    switch (ws.readyState) {
      case WebSocket.OPEN:
        return `Bridge connected (${bridgeUrl})`
      case WebSocket.CONNECTING:
        return `Bridge connecting (${bridgeUrl})`
      case WebSocket.CLOSING:
        return `Bridge closing (${bridgeUrl})`
      case WebSocket.CLOSED:
        return `Bridge closed (${bridgeUrl})`
      default:
        return `Bridge state ${ws.readyState} (${bridgeUrl})`
    }
  }

  updateStatus(describe(bridge))
  bridge.addEventListener('open', () => updateStatus(describe(bridge)))
  bridge.addEventListener('close', () => updateStatus(describe(bridge)))
  bridge.addEventListener('error', () => updateStatus(`Bridge error (${bridgeUrl})`))
}

function createPatternProbe(logs: string[]) {
  return {
    s(value: unknown) {
      logs.push(`s:${String(value)}`)
      return this
    },
    lpf(value: unknown) {
      logs.push(`lpf:${String(value)}`)
      return this
    },
    attack(value: unknown) {
      logs.push(`attack:${String(value)}`)
      return this
    },
    release(value: unknown) {
      logs.push(`release:${String(value)}`)
      return this
    },
    gain(value: unknown) {
      logs.push(`gain:${String(value)}`)
      return this
    },
    onTrigger(fn: (payload: any) => void) {
      logs.push('onTrigger')
      fn({ value: 64 })
      return this
    },
    mult(value: unknown) {
      logs.push(`mult:${String(value)}`)
      return this
    },
    add(value: unknown) {
      logs.push(`add:${String(value)}`)
      return this
    },
    reso(value: unknown) {
      logs.push(`reso:${String(value)}`)
      return this
    }
  }
}

function formatBytes(count: number) {
  if (!Number.isFinite(count)) return '—'
  const units = ['B', 'KB', 'MB', 'GB']
  let value = count
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }
  return `${value.toFixed(1)} ${units[unitIndex]}`
}

function computeCategories(manifest: { entries: { relativePath: string; size: number }[] }) {
  const categories = new Map<string, { count: number; size: number }>()
  for (const entry of manifest.entries) {
    const [topLevel] = entry.relativePath.split('/')
    const key = topLevel || 'uncategorised'
    const current = categories.get(key) ?? { count: 0, size: 0 }
    current.count += 1
    current.size += entry.size ?? 0
    categories.set(key, current)
  }
  return Array.from(categories.entries()).sort((a, b) => b[1].count - a[1].count)
}

async function refreshSampler() {
  const samplerBase =
    (import.meta as unknown as ImportMetaEnv).env?.VITE_SAMPLER_BASE_URL ?? 'http://localhost:5432'
  const samplerRoot = samplerBase.replace(/\/$/, '')
  const statusEl = document.querySelector<HTMLElement>('[data-role="sampler-status"]')
  const totalsEl = document.querySelector<HTMLElement>('[data-role="sampler-totals"]')
  const categoriesEl = document.querySelector<HTMLUListElement>('[data-role="sampler-categories"]')

  if (statusEl) statusEl.textContent = 'Fetching sampler manifest…'
  if (categoriesEl) categoriesEl.innerHTML = ''

  try {
    const [statsResp, manifestResp] = await Promise.all([
      fetch(`${samplerRoot}/stats`),
      fetch(`${samplerRoot}/manifest`)
    ])

    if (!statsResp.ok || !manifestResp.ok) {
      throw new Error(
        `Sampler responded with ${statsResp.status}/${manifestResp.status} while loading metadata`
      )
    }

    const stats = await statsResp.json()
    const manifest = await manifestResp.json()

    const categories = computeCategories(manifest)
    if (statusEl) {
      statusEl.textContent = `Serving ${manifest.entries.length.toLocaleString()} files from ${stats.root}`
    }

    if (totalsEl) {
      totalsEl.innerHTML = `
        <li><strong>Total samples:</strong> ${stats.total?.toLocaleString() ?? manifest.entries.length.toLocaleString()}</li>
        <li><strong>Root:</strong> ${stats.root}</li>
        <li><strong>Sampler URL:</strong> ${samplerRoot}</li>
      `
    }

    if (categoriesEl) {
      categoriesEl.innerHTML = categories
        .slice(0, 12)
        .map(
          ([category, data]) =>
            `<li><span>${category}</span><span>${data.count.toLocaleString()} files • ${formatBytes(
              data.size
            )}</span></li>`
        )
        .join('')
    }
  } catch (error) {
    console.error('[Sampler] Failed to load manifest:', error)
    if (statusEl) statusEl.textContent = 'Failed to load sampler metadata. Check the sampler service.'
    if (totalsEl) totalsEl.innerHTML = ''
    if (categoriesEl) categoriesEl.innerHTML =
      '<li class="muted">Sampler unavailable. Start it with `npm run sampler`.</li>'
  }
}

function registerEventHandlers() {
  const demoBtn = document.querySelector<HTMLButtonElement>('[data-role="demo-pattern"]')
  const logEl = document.querySelector<HTMLElement>('[data-role="pattern-log"]')
  const payloadEl = document.querySelector<HTMLElement>('[data-role="pattern-payload"]')
  const refreshBtn = document.querySelector<HTMLButtonElement>('[data-role="refresh-sampler"]')

  demoBtn?.addEventListener('click', () => {
    const steps: string[] = []
    const messages: string[] = []
const pattern = createPatternProbe(steps)
    const originalBridge = window.serumBridge
    window.serumBridge = {
      readyState: typeof WebSocket !== 'undefined' ? WebSocket.OPEN : 1,
      send(payload: string) {
        messages.push(payload)
      }
    } as unknown as WebSocket
    if (plugins.serum) {
      plugins.serum('bass-pluck')(pattern as any)
    }
    window.serumBridge = originalBridge
    if (logEl) {
      logEl.textContent = steps.join(' → ')
    }
    if (payloadEl) {
      payloadEl.textContent = messages.length ? messages[0] : '(no payload sent)'
    }
  })

  refreshBtn?.addEventListener('click', () => {
    refreshSampler()
  })
}

function renderApp() {
  const app = document.getElementById('app')
  if (!app) {
    console.error('App container missing')
    return
  }

  app.innerHTML = `
    <div class="app">
      <header>
        <h1>Strudel Dev Workspace</h1>
        <p>Local playground for Serum plugins and sampler microservice.</p>
      </header>

      <section class="card">
        <h2>Bridge status</h2>
        <p data-role="bridge-status">${bridgeStatusRef.text}</p>
      </section>

      <section class="card">
        <div class="card-header">
          <h2>Serum plugin bundle</h2>
          <button type="button" data-role="demo-pattern">Send demo pattern</button>
        </div>
        <p class="muted">Available exports:</p>
        <ul class="pill-list">
          ${pluginKeys.map((key) => `<li>${key}</li>`).join('')}
        </ul>
        <div class="panel">
          <strong>Operator chain</strong>
          <p data-role="pattern-log" class="mono small">Tap “Send demo pattern”</p>
          <strong>Last payload</strong>
          <pre data-role="pattern-payload" class="mono small">(none)</pre>
        </div>
      </section>

      <section class="card">
        <div class="card-header">
          <h2>Sampler overview</h2>
          <button type="button" data-role="refresh-sampler">Refresh</button>
        </div>
        <p data-role="sampler-status" class="muted">Waiting for sampler…</p>
        <ul data-role="sampler-totals" class="kv"></ul>
        <h3>Top categories</h3>
        <ul data-role="sampler-categories" class="stack">
          <li class="muted">No data yet.</li>
        </ul>
      </section>
    </div>
  `
}

function bootstrap() {
  renderApp()
  initialiseBridge()
  registerEventHandlers()
  refreshSampler()
}

bootstrap()
