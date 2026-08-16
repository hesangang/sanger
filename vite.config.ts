import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// ✅ 使用相对路径 base: './'
//    → 同时兼容两种部署目标，无需在不同平台分别改配置：
//      • Netlify / CF Pages / Vercel 等部署在域名根路径：          https://xxx.netlify.app/        → ./assets/xxx = /assets/xxx        ✅
//      • GitHub Pages 普通项目仓库部署在子路径 /sanger/：        https://user.github.io/sanger/   → ./assets/xxx = /sanger/assets/xxx ✅
//    本地 dev 预览与 build preview 也始终正常。
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
})
