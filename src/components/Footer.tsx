export default function Footer() {
  return (
    <footer
      className="mt-6 sm:mt-8 border-t"
      style={{
        backgroundColor: 'var(--t-header)',
        borderColor: 'var(--t-border-sub)',
      }}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 text-xs" style={{ color: 'var(--t-text-mute)' }}>
          <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1 min-w-0">
            <div className="flex items-center gap-1.5 mr-0.5">
              <div
                className="w-5 h-5 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, var(--t-accent-400), var(--t-accent-600))' }}
              >
                <span className="text-white font-bold text-[11px] leading-none">S</span>
              </div>
              <span className="font-bold" style={{ color: 'var(--t-text-main)' }}>SanGer</span>
              <span className="px-1.5 py-px rounded-md text-[10px] font-medium" style={{ backgroundColor: 'var(--t-card)', color: 'var(--t-text-sub)' }}>v3.0.0</span>
            </div>
            <span className="hidden sm:inline opacity-50">·</span>
            <span>© {new Date().getFullYear()} SanGer 企业级应用集成平台</span>
            <span className="opacity-50">·</span>
            <span>京ICP备XXXXXXXX号-1</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 min-w-0">
            <a href="#" className="transition-colors hover:underline-offset-2" style={{ color: 'var(--t-text-mute)' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--t-accent-500)' }} onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--t-text-mute)' }}>隐私政策</a>
            <a href="#" className="transition-colors hover:underline-offset-2" style={{ color: 'var(--t-text-mute)' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--t-accent-500)' }} onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--t-text-mute)' }}>服务条款</a>
            <a href="#" className="transition-colors hover:underline-offset-2" style={{ color: 'var(--t-text-mute)' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--t-accent-500)' }} onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--t-text-mute)' }}>安全合规</a>
            <a href="#" className="transition-colors hover:underline-offset-2" style={{ color: 'var(--t-text-mute)' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--t-accent-500)' }} onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--t-text-mute)' }}>帮助中心</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
