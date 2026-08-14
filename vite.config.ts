import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// 本仓库 = 普通项目仓库：https://github.com/hesangang/sanger
// GitHub Pages 访问地址 = https://hesangang.github.io/sanger/
// 所以 base 必须是 "/sanger/"，所有静态资源（assets、sanger.svg）自动加此前缀
// 本地 dev 不影响（仍可 http://localhost:5173/ 直接访问）
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  return {
    plugins: [react(), tailwindcss()],
    base: env.VITE_BASE ?? '/sanger/',
  }
})
