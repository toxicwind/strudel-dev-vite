import { defineConfig } from 'vite';
import strudelSamplerPlugin from './vite-plugin-strudel-sampler';

export default defineConfig({
  plugins: [
    strudelSamplerPlugin({
      sampleRoot: `${process.env.HOME}/strudel-dev/samples`,
      port: 5432,
      enableHotReload: true,
    }),
  ],
  server: {
    port: 5173,
  },
});
