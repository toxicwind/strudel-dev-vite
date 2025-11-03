import { test, expect } from '@playwright/test'

test.describe('Strudel dev UI', () => {
  test('exposes plugins without depending on Serum bridge connectivity', async ({ page }) => {
    const [pluginLog] = await Promise.all([
      page.waitForEvent('console', {
        predicate: (msg) => msg.type() === 'log' && msg.text().startsWith('Serum plugins loaded')
      }),
      page.goto('/')
    ])

    expect(pluginLog.text()).toContain('serum')

    const state = await page.evaluate(() => {
      const globalThisAny = globalThis as any
      const { __serumPluginKeys, __serumPlugins } = globalThisAny
      const steps: string[] = []
      const messages: string[] = []
      if (__serumPlugins?.serum) {
        const stubBridge = {
          readyState: globalThisAny.WebSocket?.OPEN ?? 1,
          sent: messages,
          send(payload: string) {
            this.sent.push(payload)
          }
        }
        globalThisAny.serumBridge = stubBridge

        const pattern: any = {
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
          onTrigger(fn: (payload: any) => void) {
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
        __serumPlugins.serum('bass-pluck')(pattern)
      }
      return {
        pluginKeys: __serumPluginKeys,
        hasSerum: Boolean(__serumPlugins?.serum),
        steps,
        messages
      }
    })

    expect(state.pluginKeys).toContain('serum')
    expect(state.hasSerum).toBe(true)
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
