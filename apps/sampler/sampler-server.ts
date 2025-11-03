#!/usr/bin/env node

/**
 * STRUDEL SAMPLER - Standalone Server Entry Point
 * Production-ready microservice
 * Usage: node sampler-server.ts
 * Or with tsx: tsx sampler-server.ts
 */

import 'dotenv/config';

import { createStandaloneServer } from './vite-plugin-strudel-sampler';
import path from 'path';

const config = {
  sampleRoot: process.env.STRUDEL_SAMPLES || path.join(process.env.HOME || '', 'strudel-dev', 'samples'),
  port: parseInt(process.env.PORT || '5432'),
  cacheTTL: parseInt(process.env.CACHE_TTL || '3600000'),
  cacheMaxSize: parseInt(process.env.CACHE_MAX_SIZE || '500'),
  enableHotReload: process.env.HOT_RELOAD !== 'false',
};

console.log('[config]', JSON.stringify({
  sampleRoot: config.sampleRoot,
  port: config.port,
  cacheTTL: config.cacheTTL,
  cacheMaxSize: config.cacheMaxSize,
  enableHotReload: config.enableHotReload,
}));

createStandaloneServer(config).catch((error) => {
  console.error('✗ Failed to start server:', error.message);
  process.exit(1);
});
