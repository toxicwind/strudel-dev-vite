import { test, expect } from '@playwright/test'

test.describe('Strudel dev UI', () => {
  test('exposes plugins without depending on bridge connectivity', async ({ page }) => {
    const [pluginLog] = await Promise.all([
      page.waitForEvent('console', {
        predicate: (msg) => msg.type() === 'log' && msg.text().startsWith('Strudel voices loaded')
      }),
      page.goto('/')
    ])

    expect(pluginLog.text()).toContain('voice')

    const state = await page.evaluate(() => {
      const globalThisAny = globalThis as {
        __voicePluginKeys: string[]
        __voicePlugins: Record<string, (...args: unknown[]) => unknown>
        voiceBridge?: WebSocket | unknown
      }
      const { __voicePluginKeys, __voicePlugins } = globalThisAny
      const steps: string[] = []
      const messages: string[] = []
      if (__voicePlugins?.voice) {
        const stubBridge = {
          readyState: (globalThis as unknown as { WebSocket?: { OPEN: number } }).WebSocket?.OPEN ?? 1,
          sent: messages,
          send(payload: string) {
            this.sent.push(payload)
          } as (payload: string) => void
        }
        globalThisAny.voiceBridge = stubBridge

        const pattern = {
          s(value: unknown) {
            steps.push(`s:${String(value)}`)
            return this
          },
          lpf(value: unknown) {
            steps.push(`lpf:${String(value)}`)
            return this
          },
          attack(value: unknown) {
            steps.push(`attack:${String(value)}`)
            return this
          },
          release(value: unknown) {
            steps.push(`release:${String(value)}`)
            return this
          },
          gain(value: unknown) {
            steps.push(`gain:${String(value)}`)
            return this
          },
          onTrigger(fn: (payload: { value: number }) => void) {
            steps.push('onTrigger')
            fn({ value: 64 })
            return this
          },
          mult(value: unknown) {
            steps.push(`mult:${String(value)}`)
            return this
          },
          add(value: unknown) {
            steps.push(`add:${String(value)}`)
            return this
          },
          reso(value: unknown) {
            steps.push(`reso:${String(value)}`)
            return this
          }
        }
        const voice = __voicePlugins.voice as (name: string) => (pat: typeof pattern) => void
        voice('bass-pluck')(pattern)
      }
      return {
        pluginKeys: __voicePluginKeys,
        hasVoice: Boolean(__voicePlugins?.voice),
        steps,
        messages
      }
    })

    expect(state.pluginKeys).toContain('voice')
    expect(state.hasVoice).toBe(true)
    expect(state.steps).toEqual([
      's:triangle',
      'lpf:800',
      'attack:0.001',
      'release:0.1',
      'gain:0.7',
      'onTrigger'
    ])
    expect(state.messages).toHaveLength(1)
    expect(JSON.parse(state.messages[0])).toMatchObject({ voice: 'bass-pluck', type: 'noteOn' })
  })
})