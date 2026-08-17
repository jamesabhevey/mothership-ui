import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  // addon-docs is what renders the autodocs pages enabled in preview.ts.
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  // Serves public/fonts, which holds the four Inter weights the manager chrome
  // needs. The preview iframe gets Inter through preview.ts instead.
  staticDirs: ['../public'],
  // Storybook reuses the project's vite.config.ts, so the Tailwind v4 plugin
  // that compiles the @theme token block runs here too.
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
}

export default config
