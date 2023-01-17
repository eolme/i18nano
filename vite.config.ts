import { promises } from 'fs';
import { dirname } from 'path';
import { defineConfig } from 'vite';
import { default as dts } from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      beforeWriteFile(filePath, content) {
        promises.mkdir(dirname(filePath), { recursive: true }).then(() => {
          promises.writeFile(
            filePath.replace('.d.ts', '.d.mts'),
            content.replaceAll('.js', '.mjs'),
            { encoding: 'utf8' }
          );
        });

        return {
          filePath,
          content
        };
      }
    })
  ],
  appType: 'custom',
  build: {
    minify: true,
    sourcemap: 'hidden',
    outDir: 'lib',
    emptyOutDir: true,
    lib: {
      entry: 'src/index.ts',
      name: 'i18nano',
      fileName: 'index',
      formats: ['es', 'cjs']
    },
    target: [
      'es6'
    ],
    rollupOptions: {
      external: ['react']
    }
  },
  esbuild: {
    charset: 'utf8'
  }
});
