import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig((configEnv) => {
  const env = loadEnv(configEnv.mode, process.cwd());
  return {
    base: env.VITE_BASE_PATH,

    plugins: [
      vue(),

      AutoImport({
        imports: ["vue", "vue-router"],
        resolvers: [
          ElementPlusResolver(),
        ],
      }),

      Components({
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            prefix: 'icon',
          }),
        ],
      }),

      Icons(),
    ],

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
