import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// 本仓库部署在 hesangang.github.io（用户专属主页仓库），
// Pages 根路径是 "/"，不需要 "<用户名>.github.io/<仓库名>/" 子路径。
// 因此默认 base="/"，不依赖任何环境变量，避免 workflow 判断错误导致 404。
// 如果之后迁移到普通项目仓库（如 github.com/hesangang/sanger），
//   再改为 base: env.VITE_BASE ?? '/sanger/'
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  return {
    plugins: [react(), tailwindcss()],
    base: env.VITE_BASE ?? '/',
  }
})
