import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * The build that produces the published package.
 *
 * Separate from vite.config.ts, which stays as it was for the dev app. That one
 * builds an application with an HTML entry; this one builds a library with a
 * JavaScript entry, and the two cannot be expressed in one config.
 *
 * No Tailwind plugin here. The package stylesheet is compiled separately from
 * src/styles/library.css, which scans only the components — see
 * `npm run build:css`. Running Tailwind in this build as well would emit a
 * second, wider stylesheet nobody imports.
 */
export default defineConfig({
  plugins: [react()],
  // public/ belongs to the app and to Storybook: the fonts, the logo, the
  // manager stylesheet, the demo illustration. Vite copies it into outDir by
  // default, which would have shipped 200KB of things no consumer imports.
  publicDir: false,
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      // React is the consumer's, not ours. Bundling it would give an app two
      // copies of React, which breaks hooks in ways that are miserable to
      // diagnose. lucide-react is external for the same reason a consumer may
      // already have it, and so tree-shaking can reach inside it.
      external: ['react', 'react-dom', 'react/jsx-runtime', 'lucide-react'],
    },
    sourcemap: true,
    // Never wipe a directory the declaration build may have already written to.
    emptyOutDir: false,
  },
})
