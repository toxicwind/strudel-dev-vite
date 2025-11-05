import { test, expect } from '@playwright/test'

test.describe('Strudel REPL smoke', () => {
  test('loads the web component and serves vendor assets', async ({ page, request }) => {
    await page.goto('/')

    await page.waitForFunction(() => typeof window !== 'undefined' && typeof window.customElements?.get === 'function')
    await page.waitForFunction(() => Boolean(window.customElements?.get('strudel-editor')))

    const vendorLoaded = await page.evaluate(() =>
      performance
        .getEntriesByType('resource')
        .some((entry) => entry.name.includes('/vendor/strudel/repl/index.js')),
    )
    expect(vendorLoaded).toBe(true)

    const docResponse = await request.get('/vendor/strudel/doc.json')
    expect(docResponse.ok()).toBeTruthy()

    const replHandle = await page.waitForSelector('strudel-editor', { state: 'attached' })
    await page.waitForFunction(
      (el) => typeof (el as any).editor?.evaluate === 'function',
      replHandle,
      { timeout: 30_000 },
    )

    const played = await page.evaluate(async () => {
      const repl = document.querySelector('strudel-editor') as any
      if (!repl?.editor) return false
      await repl.editor.evaluate('note("c4")')
      await new Promise((resolve) => setTimeout(resolve, 50))
      repl.editor.hush?.()
      return typeof repl.editor.evaluate === 'function'
    })
    expect(played).toBe(true)

    const uiHost = await page.waitForSelector('strudel-editor + div', { state: 'visible' })
    const bbox = await uiHost.boundingBox()
    expect(bbox?.height ?? 0).toBeGreaterThan(200)
    expect(bbox?.width ?? 0).toBeGreaterThan(400)
  })
})
