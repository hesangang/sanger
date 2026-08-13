export default function Footer() {
  const groups = [
    { title: '快速链接', links: ['服务目录', '控制台', '计费中心', '工单系统', '资源申请'] },
    { title: '开发者', links: ['API 文档', 'SDK 下载', '开发规范', '错误码手册', '系统接入'] },
    { title: '运维支持', links: ['状态监控', '告警平台', '值班安排', '故障报告', '变更管理'] },
    { title: '关于平台', links: ['平台介绍', '团队信息', '反馈建议', '更新日志', '联系我们'] },
  ]

  return (
    <footer
      className="mt-6 border-t"
      style={{
        backgroundColor: 'var(--t-card)',
        borderColor: 'var(--t-border-sub)',
      }}
    >
      <div className="max-w-[1600px] mx-auto px-3 lg:px-5 py-4">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
          <div className="col-span-2">
            <div className="flex items-center gap-1.5 mb-2">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center shadow-sm"
                style={{
                  backgroundImage: 'linear-gradient(135deg, var(--t-accent-500), var(--t-accent-700))',
                }}
              >
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-bold leading-none" style={{ color: 'var(--t-text-main)' }}>企业统一门户</div>
                <div className="text-[9px] mt-0.5" style={{ color: 'var(--t-text-mute)' }}>Unified Portal Platform</div>
              </div>
            </div>
            <p
              className="text-[11px] leading-relaxed mb-3 max-w-sm"
              style={{ color: 'var(--t-text-sub)' }}
            >
              企业级统一访问入口，研发、运维、数据、AI、办公、云服务全链路能力一站直达
            </p>
            <div className="flex items-center gap-1.5">
              {['G', 'G', '微', '邮', '钉'].map((s, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-semibold transition-all border"
                  style={{
                    backgroundColor: 'var(--t-border-sub)',
                    borderColor: 'var(--t-border-sub)',
                    color: 'var(--t-text-sub)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--t-accent-50)';
                    e.currentTarget.style.color = 'var(--t-accent-600)';
                    e.currentTarget.style.borderColor = 'var(--t-accent-200)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--t-border-sub)';
                    e.currentTarget.style.color = 'var(--t-text-sub)';
                    e.currentTarget.style.borderColor = 'var(--t-border-sub)';
                  }}
                  aria-label={`入口 ${s}`}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
          {groups.map(g => (
            <div key={g.title}>
              <h4
                className="text-[11px] font-bold mb-2"
                style={{ color: 'var(--t-text-main)' }}
              >
                {g.title}
              </h4>
              <ul className="space-y-1.5">
                {g.links.map(link => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[11px] transition-colors block"
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
          className="pt-3 border-t flex flex-col md:flex-row items-center justify-between gap-2"
          style={{ borderColor: 'var(--t-border-sub)' }}
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px]" style={{ color: 'var(--t-text-mute)' }}>
            <span>© {new Date().getFullYear()} 企业统一门户</span>
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
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px]" style={{ color: 'var(--t-text-mute)' }}>
            <span>v2.5.1</span>
            <span>京ICP备XXXXXXXX号-1</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
