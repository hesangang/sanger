import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages 子路径部署：
// - 通过环境变量 `VITE_BASE` 覆盖（workflow 会自动注入 "/<仓库名>/"）
// - 本地 run build 默认 "/" 根路径
// - 如果是 `<用户名>.github.io` 专属用户页仓库，无需设置
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  return {
    plugins: [react(), tailwindcss()],
    base: env.VITE_BASE ?? '/',
  }
})
