import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  addons: ['@storybook/addon-docs'],
  stories: ['../src/**/*.stories.tsx'],
  staticDirs: [
    { from: '../../web/public/images', to: '/images' },
    { from: '../../web/public/licenses', to: '/licenses' },
  ],
  typescript: { reactDocgen: false },
  async viteFinal(config) {
    return { ...config, base: './', publicDir: false, esbuild: { jsx: 'automatic' } }
  },
}

export default config
