import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'
import stylelintPlugin from 'vite-plugin-stylelint'
import inject from '@rollup/plugin-inject'
import importToCDN, { autoComplete } from 'vite-plugin-cdn-import'

// yarn add --dev @esbuild-plugins/node-globals-polyfill
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
// yarn add --dev @esbuild-plugins/node-modules-polyfill
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
// You don't need to add this to deps, it's included by @esbuild-plugins/node-modules-polyfill
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    eslintPlugin(),
    stylelintPlugin({
      fix: true,
    }),
    importToCDN({
      modules: [
        {
          name: '@walletconnect/web3-provider',
          var: 'WalletConnectSDK',
          path: `https://www.unpkg.com/walletconnect@1.7.1/dist/umd/index.min.js`,
        },
        {
          name: 'walletconnect',
          var: 'WalletConnectSDK',
          path: `https://www.unpkg.com/walletconnect@1.7.1/dist/umd/index.min.js`,
        },
      ],
    }),
  ],

  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
          define: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      plugins: [
        // Enable rollup polyfills plugin
        // used during production bundling
        rollupNodePolyFill(),
        inject({ Buffer: ['buffer', 'Buffer'] }),
      ],
      // plugins: [
      //   inject({ Buffer: ['Buffer', 'Buffer'] }),
      //   inject({ Buffer: ['process', 'process'] }),
      // ],
      input: {
        main: path.resolve(__dirname, 'index.html'),
        portfolio: path.resolve(__dirname, 'portfolio/index.html'),
        staking: path.resolve(__dirname, 'staking/index.html'),
        stakingStake: path.resolve(__dirname, 'staking/stake/index.html'),
        stakingCurrentStake: path.resolve(
          __dirname,
          'staking/current-stake/index.html'
        ),
        buyNovo: path.resolve(__dirname, 'buy-novo/index.html'),
        buyNovoNovoPay: path.resolve(__dirname, 'buy-novo/novo-pay/index.html'),
      },
    },
  },

  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
    extensions: ['.ts', '.js'],
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use 'sass:map';
          @use 'sass:math';
          @import "~/assets/scss/helpers/index";
        `,
      },
    },
  },
})
