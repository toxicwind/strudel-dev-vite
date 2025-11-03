import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import * as musicMetadata from 'music-metadata';
import type { Plugin } from 'vite';
import type { NextHandleFunction } from 'connect';
import type { Server as HTTPServer } from 'http';

const AUDIO_EXTENSIONS = new Set(['.mp3', '.wav', '.ogg', '.flac', '.m4a', '.aiff']);
const DEFAULT_SAMPLE_ROOT = path.resolve(
  process.env.STRUDEL_SAMPLES ?? path.join(process.env.HOME ?? process.cwd(), 'strudel-dev', 'samples')
);

const DEFAULT_OPTIONS = {
  sampleRoot: DEFAULT_SAMPLE_ROOT,
  port: 5432,
  host: '0.0.0.0',
  cacheTTL: 3600000,
  cacheMaxSize: 500,
  enableHotReload: true,
  mountPath: '/strudel-samples',
};

const DASHBOARD_HTML = String.raw`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Strudel Sampler Dashboard</title>
    <style>
      :root {
        color-scheme: dark light;
        --bg: #0d1117;
        --panel: rgba(255, 255, 255, 0.05);
        --border: rgba(255, 255, 255, 0.08);
        --accent: #58a6ff;
        --text: #e6edf3;
        --muted: #8b949e;
        font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      body {
        margin: 0;
        padding: 1.5rem;
        background: var(--bg);
        color: var(--text);
      }
      header {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: flex-end;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      h1 {
        font-size: 1.8rem;
        margin: 0;
      }
      .status {
        font-size: 0.95rem;
        color: var(--muted);
      }
      .toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
      }
      .toolbar input[type="search"] {
        flex: 1 1 240px;
        padding: 0.65rem 0.8rem;
        border-radius: 0.6rem;
        border: 1px solid var(--border);
        background: rgba(255, 255, 255, 0.04);
        color: inherit;
        font-size: 0.95rem;
      }
      .toolbar button {
        padding: 0.65rem 1.1rem;
        border-radius: 0.6rem;
        border: 1px solid var(--border);
        background: rgba(88, 166, 255, 0.18);
        color: var(--text);
        font-weight: 600;
        cursor: pointer;
      }
      .toolbar button:hover {
        background: rgba(88, 166, 255, 0.3);
      }
      .panels {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      .panel {
        border: 1px solid var(--border);
        border-radius: 0.75rem;
        padding: 1rem;
        background: var(--panel);
      }
      .panel strong {
        display: block;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--muted);
      }
      .panel span {
        font-size: 1.4rem;
        font-weight: 600;
      }
      .list {
        display: grid;
        gap: 0.75rem;
      }
      .sample {
        border: 1px solid var(--border);
        border-radius: 0.75rem;
        padding: 1rem;
        background: var(--panel);
      }
      .sample-header {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        align-items: baseline;
        flex-wrap: wrap;
      }
      .sample h3 {
        margin: 0;
        font-size: 1.05rem;
      }
      .sample small {
        color: var(--muted);
        font-size: 0.8rem;
      }
      .sample-meta {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        margin: 0.75rem 0;
        font-size: 0.85rem;
        color: var(--muted);
      }
      .sample-actions {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
        align-items: center;
      }
      .sample-actions a {
        color: var(--accent);
        text-decoration: none;
        font-size: 0.88rem;
      }
      audio {
        width: 240px;
        max-width: 100%;
      }
      .empty {
        text-align: center;
        padding: 3rem 1rem;
        color: var(--muted);
        border: 1px dashed var(--border);
        border-radius: 0.75rem;
        background: rgba(255, 255, 255, 0.03);
      }
      @media (max-width: 640px) {
        body {
          padding: 1rem;
        }
        header {
          align-items: flex-start;
        }
      }
    </style>
  </head>
  <body>
    <header>
      <div>
        <h1>Strudel Sampler Dashboard</h1>
        <p class="status" data-role="status">Loading sample library…</p>
      </div>
    </header>

    <section class="toolbar">
      <input id="filter" type="search" placeholder="Filter by sample name or folder…" aria-label="Filter samples" />
      <button id="refresh" type="button">↻ Refresh</button>
    </section>

    <section class="panels" aria-live="polite">
      <div class="panel"><strong>Total Samples</strong><span data-role="stat-total">—</span></div>
      <div class="panel"><strong>Root</strong><span data-role="stat-root">—</span></div>
      <div class="panel"><strong>Last Refresh</strong><span data-role="stat-refreshed">—</span></div>
    </section>

    <section class="list" id="sample-list" aria-live="polite" aria-busy="true"></section>

    <template id="sample-row">
      <article class="sample">
        <div class="sample-header">
          <h3 data-field="name"></h3>
          <small data-field="relative"></small>
        </div>
        <div class="sample-meta" data-field="meta"></div>
        <div class="sample-actions">
          <audio controls preload="none" data-field="player"></audio>
          <a href="#" target="_blank" rel="noopener noreferrer" data-field="link">Open in new tab</a>
        </div>
      </article>
    </template>

    


<script type="module">
  const statusEl = document.querySelector('[data-role="status"]');
  const totalEl = document.querySelector('[data-role="stat-total"]');
  const rootEl = document.querySelector('[data-role="stat-root"]');
  const refreshedEl = document.querySelector('[data-role="stat-refreshed"]');
  const listEl = document.getElementById('sample-list');
  const template = document.getElementById('sample-row');
  const filterInput = document.getElementById('filter');
  const refreshButton = document.getElementById('refresh');

  const routerBase = (() => {
    const path = window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname + '/';
    if (path.endsWith('/dashboard/')) {
      return path.slice(0, -'dashboard/'.length);
    }
    return '/';
  })();

  let samples = [];
  let metadataById = new Map();

  function formatDuration(seconds) {
    if (typeof seconds !== 'number' || !Number.isFinite(seconds)) {
      return null;
    }
    const mins = Math.floor(seconds / 60);
    const secs = String(Math.round(seconds % 60)).padStart(2, '0');
    return mins + ':' + secs;
  }

  function render(filtered) {
    listEl.innerHTML = '';
    listEl.setAttribute('aria-busy', 'true');
    if (!filtered.length) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = 'No samples match this filter.';
      listEl.appendChild(empty);
      listEl.removeAttribute('aria-busy');
      return;
    }
    const fragment = document.createDocumentFragment();
    for (const sample of filtered) {
      const node = template.content.cloneNode(true);
      const nameEl = node.querySelector('[data-field="name"]');
      const relEl = node.querySelector('[data-field="relative"]');
      const metaEl = node.querySelector('[data-field="meta"]');
      const audioEl = node.querySelector('[data-field="player"]');
      const linkEl = node.querySelector('[data-field="link"]');

      nameEl.textContent = sample.displayName;
      relEl.textContent = sample.relativePath;

      const details = [];
      const meta = metadataById.get(sample.id);
      if (meta && meta.format) {
        details.push(meta.format.toUpperCase());
      }
      const duration = meta ? formatDuration(meta.duration ?? null) : null;
      if (duration) {
        details.push(duration);
      }
      if (sample.size > 0) {
        details.push((sample.size / 1024 / 1024).toFixed(1) + ' MB');
      }
      metaEl.textContent = details.join(' · ') || '—';

      audioEl.src = sample.href;
      audioEl.dataset.id = sample.id;

      linkEl.href = sample.href;
      linkEl.textContent = 'Open source';

      fragment.appendChild(node);
    }
    listEl.appendChild(fragment);
    listEl.removeAttribute('aria-busy');
  }

  function applyFilter() {
    const query = filterInput.value.trim().toLowerCase();
    if (!query) {
      render(samples);
      statusEl.textContent = 'Showing ' + samples.length + ' samples';
      return;
    }
    const filtered = samples.filter((item) => item.searchText.includes(query));
    render(filtered);
    statusEl.textContent = 'Showing ' + filtered.length + ' of ' + samples.length + ' samples';
  }

  async function fetchMetadata(basePath) {
    try {
      const response = await fetch(basePath + 'metadata');
      if (!response.ok) {
        throw new Error('metadata request failed');
      }
      const data = await response.json();
      metadataById = new Map(data.map((item) => [item.id, item]));
    } catch (error) {
      console.warn('Failed to load metadata', error);
      metadataById = new Map();
    }
  }

  async function refresh() {
    statusEl.textContent = 'Refreshing…';
    listEl.setAttribute('aria-busy', 'true');
    try {
      const [manifestResponse, statsResponse] = await Promise.all([
        fetch(routerBase + 'manifest'),
        fetch(routerBase + 'stats'),
      ]);

      if (!manifestResponse.ok) {
        throw new Error('Failed to load manifest');
      }
      if (!statsResponse.ok) {
        throw new Error('Failed to load stats');
      }

      const [manifest, stats] = await Promise.all([
        manifestResponse.json(),
        statsResponse.json(),
      ]);

      samples = manifest.entries.map((entry) => {
        const displayName = entry.relativePath.split('/').pop() || entry.id;
        return {
          ...entry,
          displayName,
          searchText: (entry.id + ' ' + entry.relativePath + ' ' + displayName).toLowerCase(),
        };
      });

      await fetchMetadata(routerBase);

      totalEl.textContent = stats.total.toLocaleString();
      rootEl.textContent = stats.root ?? '—';
      refreshedEl.textContent = new Date().toLocaleTimeString();

      statusEl.textContent = 'Showing ' + samples.length + ' samples';
      applyFilter();
    } catch (error) {
      console.error(error);
      statusEl.textContent = 'Failed to refresh (see console).';
      listEl.innerHTML = '<div class="empty">Failed to load dashboard data.</div>';
    } finally {
      listEl.removeAttribute('aria-busy');
    }
  }

  refreshButton.addEventListener('click', refresh);
  filterInput.addEventListener('input', applyFilter);
  refresh();
</script>
  </body>
</html>`;
export interface StrudelSamplerOptions {
  sampleRoot?: string;
  port?: number;
  host?: string;
  cacheTTL?: number;
  cacheMaxSize?: number;
  enableHotReload?: boolean;
  mountPath?: string;
}

interface ResolvedStrudelSamplerOptions {
  sampleRoot: string;
  port: number;
  host: string;
  cacheTTL: number;
  cacheMaxSize: number;
  enableHotReload: boolean;
  mountPath: string;
}

interface SampleEntry {
  id: string;
  relativePath: string;
  absolutePath: string;
  size: number;
}

interface SamplerRouterOptions {
  sampleRoot: string;
  cacheTTL: number;
  cacheMaxSize: number;
  enableHotReload: boolean;
  resolveBaseUrl: (req: Request) => string;
  port?: number;
}

interface TTLCache<T> {
  get: (factory: () => Promise<T> | T) => Promise<T>;
  clear: () => void;
}

type MetadataResult = {
  id: string;
  path: string;
  duration: number | null;
  format: string | null;
  sampleRate: number | null;
  channels: number | null;
  size: number;
};

function normalizeMountPath(mountPath: string): string {
  if (!mountPath) {
    return '/strudel-samples';
  }
  const withLeading = mountPath.startsWith('/') ? mountPath : `/${mountPath}`;
  if (withLeading.length > 1 && withLeading.endsWith('/')) {
    return withLeading.slice(0, -1);
  }
  return withLeading;
}

function resolveOptions(userOptions: StrudelSamplerOptions = {}): ResolvedStrudelSamplerOptions {
  const merged = { ...DEFAULT_OPTIONS, ...userOptions };
  return {
    sampleRoot: path.resolve(userOptions.sampleRoot ?? merged.sampleRoot),
    port: merged.port,
    host: merged.host,
    cacheTTL: merged.cacheTTL,
    cacheMaxSize: merged.cacheMaxSize,
    enableHotReload: merged.enableHotReload,
    mountPath: normalizeMountPath(merged.mountPath),
  };
}

function ensureSampleRoot(root: string): void {
  if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true });
  }
}

function createTTLCache<T>(ttl: number): TTLCache<T> {
  let cache: { value: T; expires: number } | null = null;
  return {
    async get(factory: () => Promise<T> | T): Promise<T> {
      if (ttl > 0 && cache && cache.expires > Date.now()) {
        return cache.value;
      }
      const value = await factory();
      if (ttl > 0) {
        cache = { value, expires: Date.now() + ttl };
      } else {
        cache = null;
      }
      return value;
    },
    clear() {
      cache = null;
    },
  };
}

function isAudio(filePath: string): boolean {
  return AUDIO_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

function toRelativePosix(root: string, fullPath: string): string {
  const relative = path.relative(root, fullPath);
  return relative.split(path.sep).join('/');
}

function createSampleId(fullPath: string): string {
  const base = path.basename(fullPath);
  return base
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_.-]/g, '')
    .toLowerCase()
    .replace(/\.[^.]+$/, '');
}

async function collectSampleEntries(root: string): Promise<SampleEntry[]> {
  ensureSampleRoot(root);
  const entries: SampleEntry[] = [];
  const stack = [root];

  while (stack.length) {
    const current = stack.pop();
    if (!current) {
      continue;
    }
    const dirents = await fs.promises.readdir(current, { withFileTypes: true });
    for (const dirent of dirents) {
      const fullPath = path.join(current, dirent.name);
      if (dirent.isDirectory()) {
        stack.push(fullPath);
      } else if (dirent.isFile() && isAudio(fullPath)) {
        let size = 0;
        try {
          const stat = await fs.promises.stat(fullPath);
          size = stat.size;
        } catch (_error) {
          size = 0;
        }
        entries.push({
          id: createSampleId(fullPath),
          relativePath: toRelativePosix(root, fullPath),
          absolutePath: fullPath,
          size,
        });
      }
    }
  }

  return entries;
}

function createMetadataBuilder(cache: TTLCache<MetadataResult[]>, options: { sampleRoot: string; cacheMaxSize: number; loadEntries: () => Promise<SampleEntry[]> }): () => Promise<MetadataResult[]> {
  const { sampleRoot, cacheMaxSize, loadEntries } = options;
  return async () =>
    cache.get(async () => {
      const entries = await loadEntries();
      const results: MetadataResult[] = [];
      for (const entry of entries) {
        const fallbackFormat = () => {
          const ext = path.extname(entry.absolutePath).slice(1);
          return ext.length ? ext : null;
        };
        try {
          const metadata = await (musicMetadata as any).parseFile(entry.absolutePath, { duration: true });
          results.push({
            id: entry.id,
            path: entry.relativePath,
            duration: typeof metadata.format.duration === 'number' ? metadata.format.duration : null,
            format: metadata.format.container ?? fallbackFormat(),
            sampleRate: metadata.format.sampleRate ?? null,
            channels: metadata.format.numberOfChannels ?? null,
            size: entry.size,
          });
        } catch (_error) {
          results.push({
            id: entry.id,
            path: entry.relativePath,
            duration: null,
            format: fallbackFormat(),
            sampleRate: null,
            channels: null,
            size: entry.size,
          });
        }
      }
      if (cacheMaxSize > 0 && results.length > cacheMaxSize) {
        cache.clear();
      }
      return results;
    });
}

function createSamplerRouter(options: SamplerRouterOptions): { router: express.Router; invalidateCaches: () => void; dispose: () => void } {
  const { sampleRoot, cacheTTL, cacheMaxSize, enableHotReload, resolveBaseUrl, port } = options;
  const normalizedRoot = path.resolve(sampleRoot);
  ensureSampleRoot(normalizedRoot);

  const samplesCache = createTTLCache<SampleEntry[]>(cacheTTL);
  const metadataCache = createTTLCache<MetadataResult[]>(cacheTTL);
  const watchers: fs.FSWatcher[] = [];

  const loadEntries = async () => {
    const entries = await samplesCache.get(() => collectSampleEntries(normalizedRoot));
    if (cacheMaxSize > 0 && entries.length > cacheMaxSize) {
      samplesCache.clear();
    }
    return entries;
  };

  const loadMetadata = createMetadataBuilder(metadataCache, {
    sampleRoot: normalizedRoot,
    cacheMaxSize,
    loadEntries,
  });

  const invalidateCaches = () => {
    samplesCache.clear();
    metadataCache.clear();
  };

  const router = express.Router();
  const rootPrefix = normalizedRoot.endsWith(path.sep) ? normalizedRoot : `${normalizedRoot}${path.sep}`;

  router.get('/', async (req: Request, res: Response) => {
    try {
      const entries = await loadEntries();
      const base = resolveBaseUrl(req);
      const payload: Record<string, string> = { _base: base } as Record<string, string>;
      for (const entry of entries) {
        payload[entry.id] = entry.relativePath;
      }
      res.json(payload);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to scan samples' });
    }
  });

  router.get('/stats', async (_req: Request, res: Response) => {
    try {
      const entries = await loadEntries();
      res.json({
        total: entries.length,
        root: normalizedRoot,
        port: port ?? null,
      });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to resolve stats' });
    }
  });

  router.get('/manifest', async (req: Request, res: Response) => {
    try {
      const entries = await loadEntries();
      const base = resolveBaseUrl(req);
      res.json({
        base,
        entries: entries.map((entry) => ({
          id: entry.id,
          relativePath: entry.relativePath,
          href: `${base}${entry.relativePath}`,
          size: entry.size,
        })),
      });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to build manifest' });
    }
  });

  router.get('/metadata', async (_req: Request, res: Response) => {
    try {
      const metadata = await loadMetadata();
      res.json(metadata);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to read metadata' });
    }
  });

  router.get('/dashboard', (_req: Request, res: Response) => {
    res.type('html').send(DASHBOARD_HTML);
  });

  router.get('/files/*', (req: Request, res: Response) => {
    const relative = req.params[0] ?? '';
    const resolved = path.resolve(normalizedRoot, relative);
    if (resolved !== normalizedRoot && !resolved.startsWith(rootPrefix)) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.setHeader('Accept-Ranges', 'bytes');
    const stream = fs.createReadStream(resolved);
    stream.on('error', () => {
      res.status(500).json({ error: 'Failed to stream file' });
    });
    stream.pipe(res);
  });

  if (enableHotReload) {
    try {
      const watcher = fs.watch(normalizedRoot, { recursive: true }, () => invalidateCaches());
      watcher.on('error', () => watcher.close());
      watchers.push(watcher);
    } catch (_error) {
      const watcher = fs.watch(normalizedRoot, () => invalidateCaches());
      watcher.on('error', () => watcher.close());
      watchers.push(watcher);
    }
  }

  const dispose = () => {
    for (const watcher of watchers) {
      try {
        watcher.close();
      } catch (_error) {
        // ignore
      }
    }
    watchers.length = 0;
  };

  return { router, invalidateCaches, dispose };
}

export function createSamplerApp(options: StrudelSamplerOptions = {}): express.Express {
  const resolved = resolveOptions(options);
  const { router } = createSamplerRouter({
    sampleRoot: resolved.sampleRoot,
    cacheTTL: resolved.cacheTTL,
    cacheMaxSize: resolved.cacheMaxSize,
    enableHotReload: false,
    resolveBaseUrl: () => `http://localhost:${resolved.port}/files/`,
    port: resolved.port,
  });
  const app = express();
  app.use('/', router);
  return app;
}

export async function createStandaloneServer(options: StrudelSamplerOptions = {}): Promise<HTTPServer> {
  const resolved = resolveOptions(options);
  const result = createSamplerRouter({
    sampleRoot: resolved.sampleRoot,
    cacheTTL: resolved.cacheTTL,
    cacheMaxSize: resolved.cacheMaxSize,
    enableHotReload: resolved.enableHotReload,
    resolveBaseUrl: () => `http://localhost:${resolved.port}/files/`,
    port: resolved.port,
  });
  const app = express();
  app.use('/', result.router);

  return new Promise((resolve, reject) => {
    const server = app.listen(resolved.port, resolved.host, () => {
      console.log(`[sampler] http://localhost:${resolved.port}`);
      resolve(server);
    });
    server.on('error', (error) => {
      reject(error);
    });
    server.on('close', () => {
      result.invalidateCaches();
      result.dispose();
    });
  });
}

const strudelSamplerPlugin = (options: StrudelSamplerOptions = {}): Plugin => {
  const resolved = resolveOptions(options);
  return {
    name: 'vite-plugin-strudel-sampler',
    configureServer(server) {
      const fallbackPort =
        typeof server.config.server === 'object' && server.config.server && 'port' in server.config.server && typeof server.config.server.port === 'number'
          ? server.config.server.port
          : 5173;
      const routerResult = createSamplerRouter({
        sampleRoot: resolved.sampleRoot,
        cacheTTL: resolved.cacheTTL,
        cacheMaxSize: resolved.cacheMaxSize,
        enableHotReload: false,
        resolveBaseUrl: (req) => {
          const protocol = req.protocol || 'http';
          const host = req.headers.host || `localhost:${fallbackPort}`;
          return `${protocol}://${host}${resolved.mountPath}/files/`;
        },
      });

      const middleware = routerResult.router as unknown as NextHandleFunction;
      server.middlewares.use(resolved.mountPath, middleware);

      if (resolved.enableHotReload) {
        server.watcher.add(resolved.sampleRoot);
        const notify = (file?: string) => {
          routerResult.invalidateCaches();
          server.ws.send({
            type: 'custom',
            event: 'strudel-sampler:update',
            data: file ? { file } : undefined,
          });
        };
        server.watcher.on('add', (file) => {
          if (file.startsWith(resolved.sampleRoot)) {
            notify(file);
          }
        });
        server.watcher.on('unlink', (file) => {
          if (file.startsWith(resolved.sampleRoot)) {
            notify(file);
          }
        });
        server.watcher.on('change', (file) => {
          if (file.startsWith(resolved.sampleRoot)) {
            notify(file);
          }
        });
      }
      server.httpServer?.once('close', () => routerResult.dispose());
    },
  };
};

export default strudelSamplerPlugin;
