export type TabId = 'console' | 'apps' | 'board' | 'mine'

export interface TabDef {
  id: TabId
  label: string
  tbd?: boolean
}

export const BOTTOM_TABS: TabDef[] = [
  { id: 'console', label: '首页' },
  { id: 'apps',    label: '管理' },
  { id: 'board',   label: '看板', tbd: true },
  { id: 'mine',    label: '我的' },
]

export const SPOTLIGHT_LABELS = {
  bestSearch: '★ 最佳搜索',
  sgerSuggest: 'Sger 建议',
}

export const SEARCH_PLACEHOLDERS = {
  systemHome: '搜索管理功能（如 组织管理、用户管理…）',
  portalHome: '搜索系统应用（如 Jenkins、Grafana、GitLab…）',
  generic: '搜索系统、名称、功能…',
  capsule: '搜索',
}

export interface SearchContextStrings {
  placeholder: string
  hintFallback: string[]
}

export const getSearchPlaceholder = (isSystemHome: boolean) =>
  isSystemHome ? SEARCH_PLACEHOLDERS.systemHome : SEARCH_PLACEHOLDERS.portalHome

export const CAPSULE_WIDTH_VW = 50
export const SPOTLIGHT_COLS = 4
export const SPOTLIGHT_ROWS = 2
export const SPOTLIGHT_LIMIT = SPOTLIGHT_COLS * SPOTLIGHT_ROWS
export const SEARCH_HINT_LIMIT = 8
