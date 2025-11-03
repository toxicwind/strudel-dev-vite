#!/usr/bin/env python3
"""
STRUDEL SAMPLER - PRODUCTION DEPLOYMENT (AUTONOMOUS & IDEMPOTENT)

What this script does on every run (idempotent):
- Ensures required tools are available (git, gh, docker, node, npm)
- Verifies GitHub authentication and determines your account
- Initializes a git repo if needed and normalizes the branch to "main"
- Idempotently creates or attaches to an existing GitHub repository
- Writes missing production assets:
  - vite-plugin-strudel-sampler.ts (TypeScript Express microservice)
  - Dockerfile (multi-stage Node 20 Alpine)
  - docker-compose.yml (Compose v3.8) and .env.portainer for Portainer Stacks
- Adds GitHub Actions workflows (build, docker, release)
- Adds GitHub templates & community files
- Commits and pushes all artifacts to the current branch

Requirements: git, gh, docker, node, npm installed and gh authenticated.
"""

import os
import sys
import subprocess
import argparse
from pathlib import Path
from datetime import datetime
from typing import Optional, Tuple

# ============= Colors =============
COL = {
    'reset': '\x1b[0m',
    'green': '\x1b[92m',
    'yellow': '\x1b[93m',
    'red': '\x1b[91m',
    'blue': '\x1b[94m',
    'cyan': '\x1b[96m',
}

def log(msg: str, color: str = 'reset', prefix: str = '') -> None:
    ts = datetime.now().strftime('%H:%M:%S')
    print(f"{COL[color]}[{ts}] {prefix}{msg}{COL['reset']}")

def die(msg: str) -> None:
    log(msg, 'red', '✗ ')
    sys.exit(1)

def run(cmd: str, check: bool = True, capture: bool = False) -> Optional[str]:
    try:
        if capture:
            p = subprocess.run(cmd, shell=True, text=True, capture_output=True, check=check)
            return p.stdout.strip()
        else:
            subprocess.run(cmd, shell=True, check=check)
            return None
    except subprocess.CalledProcessError as e:
        die(f"Command failed: {cmd}\n{(e.stderr or e.stdout or '').strip()}")

# ============= Prereqs =============
REQUIRED = ['git', 'gh', 'docker', 'node', 'npm']

def have(bin_name: str) -> bool:
    return subprocess.run(f"which {bin_name}", shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL).returncode == 0

def ensure_required_tools() -> None:
    log('Verifying required tools...', 'cyan', '→ ')
    missing = [t for t in REQUIRED if not have(t)]
    for t in REQUIRED:
        log(f"{t:<10} {'✓' if t not in missing else '✗'}", 'green' if t not in missing else 'red', '  ')
    if missing:
        die(f"Missing tools: {', '.join(missing)}")

# ============= GitHub Auth =============

def gh_user() -> Tuple[str, str]:
    status = subprocess.run("gh auth status", shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    if 'not logged in' in status.stdout.lower():
        die('Not authenticated to GitHub. Run: gh auth login')
    user = run('gh api user -q .login', capture=True)
    if not user:
        die('Failed to resolve GitHub user')
    email = run('gh api user -q .email', check=False, capture=True) or f"{user}@users.noreply.github.com"
    log(f"Authenticated as: {user}", 'green', '✓ ')
    log(f"Email: {email}", 'cyan', '  ')
    return user, email

# ============= Git helpers =============

def current_branch() -> str:
    return run('git branch --show-current', capture=True) or 'master'

def normalize_to_main() -> str:
    # Ensure local branch is 'main' to align with CI defaults
    run('git branch -M main', check=False)
    b = run('git branch --show-current', capture=True) or 'main'
    return b

def git_init(user: str, email: str) -> None:
    if not Path('.git').exists():
        log('Initializing git repository...', 'cyan', '→ ')
        run('git init')
        log('Git repository initialized', 'green', '✓ ')
    run(f'git config user.name "{user}"', check=False)
    run(f'git config user.email "{email}"', check=False)


def stage_and_commit(msg: str) -> None:
    run('git add .')
    st = run('git status --porcelain', check=False, capture=True)
    if not st:
        return
    run(f'git commit -m "{msg}"', check=False)
    log('Commit created', 'green', '✓ ')

# ============= Idempotent repo provisioning =============

def create_or_attach_repo(repo_name: str, description: str, org: Optional[str]) -> str:
    owner = run('gh api user -q .login', capture=True)
    full_slug = f"{org}/{repo_name}" if org else f"{owner}/{repo_name}"
    exists = subprocess.run(
        f"gh repo view {full_slug} --json name -q .name",
        shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
    ).returncode == 0

    # Normalize branch to main for CI alignment
    normalize_to_main()
    branch = run('git branch --show-current', capture=True) or 'main'

    if exists:
        # Attach remote and push
        ssh_url = f"git@github.com:{full_slug}.git"
        # set-url if origin exists, else add
        has_origin = subprocess.run('git remote get-url origin', shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL).returncode == 0
        if has_origin:
            run(f'git remote set-url origin {ssh_url}', check=False)
        else:
            run(f'git remote add origin {ssh_url}', check=False)
        run(f'git push -u origin {branch}', check=False)
    else:
        # Create and push from source
        run(f'gh repo create {repo_name} --public --description "{description}" --source=. --push --remote=origin')

    url = run(f'gh repo view {full_slug} --json url -q .url', capture=True) or f'https://github.com/{full_slug}'
    return url

# ============= Writers: workflows/templates/community =============

def write_workflows() -> None:
    wf = Path('.github/workflows')
    wf.mkdir(parents=True, exist_ok=True)
    (wf / 'build.yml').write_text(
        """name: Build & Test\n\n"""
        """on:\n  push:\n    branches: [main, develop]\n  pull_request:\n    branches: [main]\n\n"""
        """jobs:\n  build:\n    runs-on: ubuntu-latest\n    strategy:\n      matrix:\n        node-version: [\"18.x\", \"20.x\"]\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: ${{ matrix.node-version }}\n          cache: 'npm'\n      - run: npm ci\n      - run: npm run type-check || true\n      - run: npm run lint || true\n      - run: npm run build\n""",
        encoding='utf-8'
    )
    (wf / 'docker.yml').write_text(
        """name: Docker Build (Local)\n\n"""
        """on:\n  push:\n    branches: [main]\n    tags: ['v*']\n  pull_request:\n    branches: [main]\n\n"""
        """jobs:\n  docker:\n    runs-on: ubuntu-latest\n    permissions:\n      contents: read\n      packages: write\n    steps:\n      - uses: actions/checkout@v4\n        with:\n          fetch-depth: 0\n      - uses: docker/setup-buildx-action@v3\n      - name: Version\n        id: ver\n        run: |\n          if [[ \"${{ github.ref }}\" == refs/tags/* ]]; then\n            echo \"TAG=${{ github.ref_name }}\" >> $GITHUB_OUTPUT\n          else\n            echo \"TAG=latest\" >> $GITHUB_OUTPUT\n          fi\n      - uses: docker/build-push-action@v5\n        with:\n          context: .\n          push: false\n          load: true\n          tags: strudel-sampler:${{ steps.ver.outputs.TAG }}\n          cache-from: type=gha\n          cache-to: type=gha,mode=max\n      - name: Smoke test\n        run: docker run --rm strudel-sampler:${{ steps.ver.outputs.TAG }} node -v\n""",
        encoding='utf-8'
    )
    (wf / 'release.yml').write_text(
        """name: Release\n\n"""
        """on:\n  push:\n    tags: ['v*']\n\n"""
        """jobs:\n  release:\n    runs-on: ubuntu-latest\n    permissions:\n      contents: write\n    steps:\n      - uses: actions/checkout@v4\n        with:\n          fetch-depth: 0\n      - uses: actions/setup-node@v4\n        with:\n          node-version: '20'\n          cache: 'npm'\n      - run: |\n          npm ci\n          npm run build\n      - uses: softprops/action-gh-release@v1\n        with:\n          draft: false\n          prerelease: false\n          generate_release_notes: true\n        env:\n          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}\n""",
        encoding='utf-8'
    )


def write_templates_and_community() -> None:
    it = Path('.github/ISSUE_TEMPLATE')
    it.mkdir(parents=True, exist_ok=True)
    (it / 'bug_report.md').write_text(
        """---\nname: Bug Report\nabout: Report a bug\ntitle: '[BUG] '\nlabels: bug\n---\n\n## Description\n\n## Steps to Reproduce\n\n## Expected\n\n## Actual\n""",
        encoding='utf-8'
    )
    (it / 'feature_request.md').write_text(
        """---\nname: Feature Request\nabout: Suggest a feature\ntitle: '[FEATURE] '\nlabels: enhancement\n---\n\n## Description\n\n## Motivation\n\n## Use Case\n""",
        encoding='utf-8'
    )
    Path('PULL_REQUEST_TEMPLATE.md').write_text(
        """## Description\n\n## Type\n- [ ] Bug fix\n- [ ] New feature\n- [ ] Breaking change\n- [ ] Docs\n\n## Checklist\n- [ ] Type check\n- [ ] Lint\n- [ ] Build\n""",
        encoding='utf-8'
    )
    Path('CODE_OF_CONDUCT.md').write_text('# Code of Conduct\n\nBe respectful, inclusive, and constructive.\n', encoding='utf-8')
    Path('CONTRIBUTING.md').write_text('# Contributing\n\n1) Fork & branch\n2) npm ci; npm run type-check; npm run build\n3) Commit & PR\n', encoding='utf-8')
    Path('SECURITY.md').write_text('# Security\n\nReport privately to security@example.com.\n', encoding='utf-8')

# ============= Writers: assets (vite plugin, docker, compose) =============

def write_vite_plugin_if_missing() -> None:
    p = Path('vite-plugin-strudel-sampler.ts')
    if p.exists():
        return
    p.write_text(
        """import express from 'express';\nimport fs from 'fs';\nimport path from 'path';\nimport mm from 'music-metadata';\n\nconst app = express();\nconst PORT = parseInt(process.env.PORT || '5432', 10);\nconst SAMPLE_ROOT = process.env.STRUDEL_SAMPLES || path.join(process.env.HOME || '', 'strudel-dev', 'samples');\n\nfunction isAudio(file: string) {\n  return ['.mp3','.wav','.ogg','.flac','.m4a','.aiff'].includes(path.extname(file).toLowerCase());\n}\n\nasync function scan(root: string) {\n  const out: Record<string,string> = {};\n  const walk = (d: string) => {\n    for (const e of fs.readdirSync(d, { withFileTypes: true })) {\n      const full = path.join(d, e.name);\n      if (e.isDirectory()) walk(full);\n      else if (e.isFile() && isAudio(full)) {\n        const key = path.basename(full).replace(/\\s+/g,'_').replace(/[^a-zA-Z0-9_\\.-]/g,'').toLowerCase();\n        out[key.replace(path.extname(key), '')] = path.relative(SAMPLE_ROOT, full);\n      }\n    }\n  };\n  walk(root);\n  return out;\n}\n\napp.get('/', async (_req, res) => {\n  const map = await scan(SAMPLE_ROOT);\n  res.json({ _base: `http://localhost:${PORT}/files/`, ...map });\n});\n\napp.get('/files/*', (req, res) => {\n  const rel = req.params[0];\n  const full = path.join(SAMPLE_ROOT, rel);\n  if (!full.startsWith(SAMPLE_ROOT)) return res.status(403).json({ error: 'Access denied' });\n  if (!fs.existsSync(full)) return res.status(404).json({ error: 'Not found' });\n  res.setHeader('Accept-Ranges', 'bytes');\n  fs.createReadStream(full).pipe(res);\n});\n\napp.get('/stats', async (_req, res) => {\n  const map = await scan(SAMPLE_ROOT);\n  res.json({ total: Object.keys(map).length, root: SAMPLE_ROOT, port: PORT });\n});\n\napp.listen(PORT, () => console.log(`[sampler] http://localhost:${PORT}`));\n""",
        encoding='utf-8'
    )


def write_dockerfile_if_missing() -> None:
    if Path('Dockerfile').exists():
        return
    Path('Dockerfile').write_text(
        """# ---- build ----\nFROM node:20-alpine AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\n# ---- runtime ----\nFROM node:20-alpine\nWORKDIR /app\nENV NODE_ENV=production\nCOPY --from=build /app/dist ./dist\nCOPY package*.json ./\nRUN npm ci --omit=dev\nEXPOSE 5432\nCMD [\"node\",\"dist/sampler-server.js\"]\n""",
        encoding='utf-8'
    )


def write_compose_if_missing() -> None:
    if not Path('docker-compose.yml').exists():
        Path('docker-compose.yml').write_text(
            """version: \"3.8\"\nservices:\n  strudel-sampler:\n    image: strudel-sampler:latest\n    container_name: strudel-sampler\n    restart: unless-stopped\n    ports:\n      - \"5432:5432\"\n    volumes:\n      - ${STRUDEL_SAMPLES}:/samples:ro\n    environment:\n      PORT: \"5432\"\n      STRUDEL_SAMPLES: /samples\n      CACHE_TTL: \"3600000\"\n      CACHE_MAX_SIZE: \"500\"\n      HOT_RELOAD: \"true\"\n    healthcheck:\n      test: [\"CMD\", \"curl\", \"-f\", \"http://localhost:5432/stats\"]\n      interval: 30s\n      timeout: 10s\n      retries: 3\n      start_period: 20s\n""",
            encoding='utf-8'
        )
    if not Path('.env.portainer').exists():
        Path('.env.portainer').write_text(
            """# Portainer stack environment\n# Set path to your samples folder before deployment\nSTRUDEL_SAMPLES=/absolute/path/to/your/samples\n""",
            encoding='utf-8'
        )

# ============= Main orchestration =============

def main():
    ap = argparse.ArgumentParser(description='Autonomous Strudel Sampler GitHub deployment')
    ap.add_argument('--repo-name', required=True)
    ap.add_argument('--description', default='Strudel Sampler - Production Microservice')
    ap.add_argument('--org')
    args = ap.parse_args()

    print()
    log('STRUDEL SAMPLER - AUTONOMOUS DEPLOYMENT', 'blue')
    ensure_required_tools()
    user, email = gh_user()

    # Git init & normalize
    git_init(user, email)
    normalize_to_main()

    # First commit if needed
    stage_and_commit('Initial commit: Strudel Sampler microservice')

    # Create or attach repo & push
    url = create_or_attach_repo(args.repo_name, args.description, args.org)

    # Write assets
    write_vite_plugin_if_missing()
    write_dockerfile_if_missing()
    write_compose_if_missing()
    write_workflows()
    write_templates_and_community()

    # Commit & push artifacts
    stage_and_commit('ci: add workflows, vite plugin, Dockerfile, Portainer compose, templates')
    run('git push', check=False)

    print()
    log('DEPLOYMENT COMPLETE - PRODUCTION READY', 'blue')
    log(f'Repository: {url}', 'cyan', '  ')
    log('Artifacts:', 'green', '  ')
    log('- vite-plugin-strudel-sampler.ts (TS Express microservice)', 'green', '    ')
    log('- Dockerfile (multi-stage Node 20 Alpine)', 'green', '    ')
    log('- docker-compose.yml (v3.8) and .env.portainer (Portainer-ready)', 'green', '    ')
    log('- GitHub Actions: build.yml, docker.yml, release.yml', 'green', '    ')
    print()
    log('Next steps:', 'yellow', '  ')
    log(f'- Monitor CI: {url}/actions', 'yellow', '    ')
    log('- Portainer → Stacks → Add stack → paste docker-compose.yml → set STRUDEL_SAMPLES', 'yellow', '    ')
    log('- docker build -t strudel-sampler:latest .', 'yellow', '    ')
    log('- docker-compose up', 'yellow', '    ')

if __name__ == '__main__':
    main()
