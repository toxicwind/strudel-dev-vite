import fs from 'fs'
import path from 'path'

const root = new URL('..', import.meta.url).pathname
const packagesDir = path.join(root, 'vendor', 'strudel', 'packages')

const sections = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']

for (const entry of await fs.promises.readdir(packagesDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue
  const pkgPath = path.join(packagesDir, entry.name, 'package.json')
  if (!fs.existsSync(pkgPath)) continue
  const raw = await fs.promises.readFile(pkgPath, 'utf8')
  const json = JSON.parse(raw)
  let mutated = false
  for (const section of sections) {
    const block = json[section]
    if (!block) continue
    for (const [dep, value] of Object.entries(block)) {
      if (typeof value === 'string' && value.startsWith('workspace:')) {
        const targetDir = dep.startsWith('@') ? dep.split('/')[1] : dep
        block[dep] = `file:../${targetDir}`
        mutated = true
      }
    }
  }
  if (mutated) {
    await fs.promises.writeFile(pkgPath, JSON.stringify(json, null, 2) + '\n')
    console.log(`Rewrote workspace ranges in ${pkgPath}`)
  }
}
