import type { BrandInfo } from './Header'
import { BRAND } from './Header'

export interface FooterLink {
  label: string
  href: string
}

export { BRAND }
export type { BrandInfo }

export const ICP_LABEL = '京ICP备XXXXXXXX号-1'

export const COPYRIGHT_OWNER = 'SanGer 企业级应用集成平台'

export const FOOTER_LINKS: FooterLink[] = [
  { label: '隐私政策', href: '#' },
  { label: '服务条款', href: '#' },
  { label: '安全合规', href: '#' },
  { label: '帮助中心', href: '#' },
]
