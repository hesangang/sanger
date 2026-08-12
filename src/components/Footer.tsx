export default function Footer() {
  const groups = [
    { title: '快速链接', links: ['服务目录', '控制台', '计费中心', '工单系统', '资源申请'] },
    { title: '开发者', links: ['API 文档', 'SDK 下载', '开发规范', '错误码手册', '系统接入'] },
    { title: '运维支持', links: ['状态监控', '告警平台', '值班安排', '故障报告', '变更管理'] },
    { title: '关于平台', links: ['平台介绍', '团队信息', '反馈建议', '更新日志', '联系我们'] },
  ]

  return (
    <footer
      className="mt-14 border-t"
      style={{
        backgroundColor: 'var(--t-card)',
        borderColor: 'var(--t-border-sub)',
      }}
    >
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 mb-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
                style={{
                  backgroundImage: 'linear-gradient(135deg, var(--t-accent-500), var(--t-accent-700))',
                }}
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: 'var(--t-text-main)' }}>企业统一门户</div>
                <div className="text-[10px]" style={{ color: 'var(--t-text-mute)' }}>Unified Portal Platform</div>
              </div>
            </div>
            <p
              className="text-xs leading-relaxed mb-4 max-w-xs"
              style={{ color: 'var(--t-text-sub)' }}
            >
              企业级统一访问入口，打通研发、运维、数据、AI、办公、云服务全链路能力，
              赋能团队高效协作与数字化运营
            </p>
            <div className="flex items-center gap-2">
              {['G', 'G', '微', '邮', '钉'].map((s, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-semibold transition-all border"
                  style={{
                    backgroundColor: 'var(--t-border-sub)',
                    borderColor: 'var(--t-border-sub)',
                    color: 'var(--t-text-sub)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--t-accent-50)';
                    e.currentTarget.style.color = 'var(--t-accent-600)';
                    e.currentTarget.style.borderColor = 'var(--t-accent-300)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--t-border-sub)';
                    e.currentTarget.style.color = 'var(--t-text-sub)';
                    e.currentTarget.style.borderColor = 'var(--t-border-sub)';
                  }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
          {groups.map(g => (
            <div key={g.title}>
              <h4
                className="text-xs font-bold mb-3"
                style={{ color: 'var(--t-text-main)' }}
              >
                {g.title}
              </h4>
              <ul className="space-y-2">
                {g.links.map(link => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-xs transition-colors"
                      style={{ color: 'var(--t-text-sub)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--t-accent-600)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--t-text-sub)' }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="pt-5 border-t flex flex-col md:flex-row items-center justify-between gap-3"
          style={{ borderColor: 'var(--t-border-sub)' }}
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]" style={{ color: 'var(--t-text-mute)' }}>
            <span>© {new Date().getFullYear()} 企业统一门户平台. All rights reserved.</span>
            <a
              href="#"
              className="transition-colors"
              style={{ color: 'var(--t-text-mute)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--t-accent-600)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--t-text-mute)' }}
            >
              隐私政策
            </a>
            <a
              href="#"
              className="transition-colors"
              style={{ color: 'var(--t-text-mute)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--t-accent-600)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--t-text-mute)' }}
            >
              服务条款
            </a>
            <a
              href="#"
              className="transition-colors"
              style={{ color: 'var(--t-text-mute)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--t-accent-600)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--t-text-mute)' }}
            >
              安全规范
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]" style={{ color: 'var(--t-text-mute)' }}>
            <span>版本 v2.5.1</span>
            <span>京ICP备XXXXXXXX号-1</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
