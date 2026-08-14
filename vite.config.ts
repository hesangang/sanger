import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// ⚠️ 强制硬编码 base：本仓库 = hesangang/sanger 普通项目仓库
//    访问地址：https://hesangang.github.io/sanger/
//    100% 绕开任何 CI env / loadEnv 的变量注入失效问题，
//    确保任何地方构建都会正确产出 /sanger/assets 前缀的引用。
// 若要本地部署到根路径，手动改为 '/' 即可。
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/sanger/',
})
