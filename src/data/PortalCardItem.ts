export interface PortalCard {
  id: number
  title: string
  description: string
  url: string
  category: string
  tag?: string
}

export interface PortalRegion {
  id: string
  name: string
  icon: string
  description: string
  gradient: string
  cards: PortalCard[]
}

export type AccentKey = 'blue' | 'violet' | 'emerald' | 'amber' | 'rose'

export const ACCENTS: { key: AccentKey; label: string; swatch: string }[] = [
  { key: 'blue',    label: '紫罗兰（默认）', swatch: 'linear-gradient(135deg,#A78BFA,#7C3AED)' },
  { key: 'violet',  label: '青蓝',         swatch: 'linear-gradient(135deg,#67E8F9,#06B6D4)' },
  { key: 'emerald', label: '薄荷绿',       swatch: 'linear-gradient(135deg,#34D399,#059669)' },
  { key: 'amber',   label: '暖橙',         swatch: 'linear-gradient(135deg,#FB923C,#EA580C)' },
  { key: 'rose',    label: '玫瑰红',       swatch: 'linear-gradient(135deg,#FB7185,#E11D48)' },
]

export const regions: PortalRegion[] = [
  {
    id: 'dev',
    name: '研发效能区',
    icon: '⚙️',
    description: '代码托管、CI/CD、项目协同、测试部署一站式研发工具链',
    gradient: 'from-sky-400 via-blue-400 to-sky-500',
    cards: [
      { id: 101, title: 'GitLab', description: '开源企业级 Git 代码托管，Code Review、CI/CD、Issue、Wiki 一体化 DevOps 平台，支持完全私有化部署', tag: '核心', category: 'dev', url: 'https://about.gitlab.com/install' },
      { id: 108, title: 'Bruno', description: 'Postman 开源替代，纯本地存储 + Git 同步，Markdown 文档、自动化测试、脚本断言，完全私有化', tag: '🔥火爆', category: 'dev', url: 'https://www.usebruno.com' },
      { id: 110, title: 'Jenkins', description: '开源老牌稳定 CI/CD 平台，支持多节点构建、流水线编排、插件生态 2000+，完全私有部署', category: 'dev', url: 'https://www.jenkins.io' },
      { id: 107, title: 'SonarQube', description: '开源静态代码分析平台，支持 30+ 语言质量扫描、安全漏洞检测、坏味道治理与质量门禁', category: 'dev', url: 'https://www.sonarsource.com/products/sonarqube/downloads' },
      { id: 109, title: 'Grafana k6', description: 'Go 编写开源负载测试工具，JavaScript 编写脚本，HTTP/gRPC/WebSocket 全协议，集成 CI/CD 私有部署', tag: '测试', category: 'dev', url: 'https://k6.io' },
      { id: 111, title: 'Nexus', description: '开源企业级制品仓库，Maven/npm/PyPI/Docker/Helm 多格式缓存代理，完全私有部署', category: 'dev', url: 'https://www.sonatype.com/products/sonatype-nexus-repository' },
      { id: 104, title: 'Sentry', description: '开源全栈实时错误监控与性能追踪，Java/Go/JS/Python/移动端全语言，Self-Hosted 私有部署', tag: 'SRE', category: 'dev', url: 'https://develop.sentry.dev/self-hosted' },
      { id: 112, title: 'Mattermost', description: 'Slack 开源替代，Go+React 实现，端到端加密，集成 Jenkins/GitLab/SVN，私有化内网部署', tag: '协作', category: 'dev', url: 'https://mattermost.com' },
    ],
  },
  {
    id: 'ops',
    name: '运维监控区',
    icon: '📊',
    description: '服务器监控、日志分析、告警通知、容器编排运维管理平台',
    gradient: 'from-emerald-400 via-teal-400 to-emerald-500',
    cards: [
      { id: 201, title: 'Grafana', description: '统一可观测性仪表盘，Loki/Tempo/Mimir/Prometheus 全栈接入可视化', tag: '核心', category: 'ops', url: 'https://grafana.com' },
      { id: 202, title: 'Kubernetes', description: '容器编排管理平台，Deployment、Service、Ingress 可视化编排', category: 'ops', url: 'https://kubernetes.io' },
      { id: 203, title: 'Grafana Beyla', description: 'Grafana 开源 eBPF 自动埋点，零代码侵入自动生成 HTTP/gRPC 服务 RED 指标与分布式追踪', tag: '🔥前沿', category: 'ops', url: 'https://grafana.com/oss/beyla' },
      { id: 204, title: 'OpenTelemetry', description: 'CNCF 毕业可观测性标准，统一 Tracing/Metrics/Logs 埋点 SDK，多语言支持', tag: '标准', category: 'ops', url: 'https://opentelemetry.io' },
      { id: 205, title: 'Jaeger', description: 'CNCF 毕业分布式追踪系统，OpenTracing 兼容，微服务调用链路可视化分析', tag: '追踪', category: 'ops', url: 'https://www.jaegertracing.io' },
      { id: 206, title: 'Grafana Tempo', description: 'Grafana 高性能分布式追踪后端，100% 兼容 OTel/Jaeger/Zipkin，对象存储低成本', tag: '追踪', category: 'ops', url: 'https://grafana.com/oss/tempo' },
      { id: 207, title: 'Grafana Mimir', description: 'Grafana 官方长期指标存储，100% Prometheus 兼容，支持亿级指标无限长期存储', tag: '指标', category: 'ops', url: 'https://grafana.com/oss/mimir' },
      { id: 208, title: 'Loki', description: 'Grafana 开源轻量日志系统，对象存储低成本，与 Tempo/Mimir 无缝三栈联动', category: 'ops', url: 'https://grafana.com/oss/loki' },
      { id: 209, title: 'Vector', description: 'Rust 编写下一代可观测性采集器，日志/指标/追踪全支持，比 Filebeat 快 10 倍', tag: '采集', category: 'ops', url: 'https://vector.dev' },
      { id: 210, title: 'Argo CD', description: 'Kubernetes 声明式 GitOps 持续部署，多集群、多租户、蓝绿金丝雀发布', category: 'ops', url: 'https://argoproj.github.io/cd' },
      { id: 211, title: 'Nacos', description: '阿里开源微服务注册配置中心，服务发现、配置管理、流量路由一体化', tag: '微服务', category: 'ops', url: 'https://nacos.io' },
      { id: 212, title: 'Vault', description: 'HashiCorp 企业级机密管理，API 密钥、证书、Token 动态加密与审计', category: 'ops', url: 'https://www.vaultproject.io' },
    ],
  },
  {
    id: 'data',
    name: '数据分析区',
    icon: '📈',
    description: '数据仓库、BI 报表、用户行为分析、数据中台等数据分析工具',
    gradient: 'from-cyan-400 via-sky-400 to-cyan-500',
    cards: [
      { id: 301, title: 'Metabase', description: '零代码自助式数据分析平台，拖拽式报表、仪表盘、数据钻取', tag: '热门', category: 'data', url: 'https://www.metabase.com' },
      { id: 302, title: 'Superset', description: 'Apache 顶级数据可视化项目，50+ 图表类型、SQL Lab、仪表盘', category: 'data', url: 'https://superset.apache.org' },
      { id: 303, title: 'DolphinScheduler', description: '分布式工作流任务调度系统，DAG 可视化、多租户、告警监控', category: 'data', url: 'https://dolphinscheduler.apache.org' },
      { id: 304, title: 'ClickHouse', description: '俄罗斯开源 OLAP 列式数据库，亿级数据毫秒级聚合查询，亚秒级响应', tag: '爆款', category: 'data', url: 'https://clickhouse.com' },
      { id: 305, title: 'Apache Doris', description: 'Apache 顶级开源 MP 分析数据库，亚秒级实时分析，支持 MySQL 协议，极速多维聚合与湖仓一体', tag: '🔥热门', category: 'data', url: 'https://doris.apache.org' },
      { id: 306, title: 'Flink', description: 'Apache Flink 流批一体计算平台，SQL 作业、Jar 任务、监控报警', category: 'data', url: 'https://flink.apache.org' },
      { id: 307, title: 'Apache Kylin', description: 'Apache 顶级 OLAP 引擎，预计算 + 立方体，千亿数据亚秒级查询', category: 'data', url: 'https://kylin.apache.org' },
      { id: 308, title: 'dbt', description: 'SQL-first 现代数据转换工具，模块化数据建模、版本化、测试一体化', tag: '流行', category: 'data', url: 'https://www.getdbt.com' },
      { id: 309, title: 'Airbyte', description: '开源数据集成平台，300+ 连接器，ELT 管道从源到仓库零代码配置', tag: '开源', category: 'data', url: 'https://airbyte.com' },
      { id: 310, title: 'Apache SeaTunnel', description: 'Apache 分布式海量数据集成平台，离线/实时/CDC 同步，400+ 数据源', tag: '新上线', category: 'data', url: 'https://seatunnel.apache.org' },
      { id: 311, title: 'DataX', description: '阿里开源异构数据源离线同步工具，支持 MySQL/Oracle/HDFS 等 20+ 数据源', category: 'data', url: 'https://github.com/alibaba/DataX' },
      { id: 312, title: 'Hue', description: 'Hadoop 生态 SQL 查询工作台，Hive、Spark、Impala 多引擎', category: 'data', url: 'https://gethue.com' },
    ],
  },
  {
    id: 'ai',
    name: 'AI 能力区',
    icon: '🤖',
    description: '大模型服务、AI 绘画、语音识别、向量数据库等 AI 工具平台',
    gradient: 'from-pink-500 via-rose-500 to-pink-600',
    cards: [
      { id: 401, title: '大模型推理网关', description: '统一 LLM 网关，接入 GPT-4o、Claude、Qwen、DeepSeek 等 100+ 模型，按量计费，统一 API 调用', tag: '推荐', category: 'ai', url: 'https://siliconflow.cn' },
      { id: 402, title: 'Midjourney', description: '企业级 AI 图像生成平台，文生图、图生图、风格迁移、高清放大', tag: '新上线', category: 'ai', url: 'https://www.midjourney.com' },
      { id: 403, title: 'Milvus', description: '分布式向量相似度检索引擎，支持亿级向量毫秒级召回', category: 'ai', url: 'https://milvus.io' },
      { id: 404, title: 'Ollama', description: '一键本地部署运行 Llama 3、Qwen 2、DeepSeek 等 200+ 开源大模型，跨平台支持', tag: '爆款', category: 'ai', url: 'https://ollama.com' },
      { id: 405, title: 'ComfyUI', description: 'Stable Diffusion 节点式绘画工作流，支持 SD 3、Flux、LoRA、ControlNet 极致定制', tag: '绘图', category: 'ai', url: 'https://github.com/comfyanonymous/ComfyUI' },
      { id: 406, title: 'LangChain', description: '全球最流行 LLM 应用开发框架，Agent、RAG、Tool Calling 全链路能力，Python/JS 双语', tag: '开发', category: 'ai', url: 'https://www.langchain.com' },
      { id: 407, title: 'Suno', description: '输入文字即可生成高质量完整歌曲，支持人声、伴奏、多风格，一键商用级出品', tag: '新上线', category: 'ai', url: 'https://suno.com' },
      { id: 408, title: 'Cursor', description: 'VS Code 内核 AI 编程助手，Tab 补全、代码问答、整库重构、Agent 自动编写，效率翻倍', tag: '程序员', category: 'ai', url: 'https://cursor.com' },
      { id: 409, title: 'Stable Diffusion WebUI', description: 'Automatic1111 版 AI 绘画 WebUI，文生图、图生图、Inpaint、ControlNet 扩展生态最全', tag: '开源', category: 'ai', url: 'https://github.com/AUTOMATIC1111/stable-diffusion-webui' },
      { id: 410, title: 'Tesseract', description: 'Apache 2.0 开源 OCR 引擎，支持 100+ 语种，含 PDF/HOCR/TSV 输出，可本地私有化部署', tag: '开源', category: 'ai', url: 'https://github.com/tesseract-ocr/tesseract' },
      { id: 411, title: 'Whisper', description: 'OpenAI 开源语音识别模型，支持 99 语种，含翻译/语种检测，可本地推理部署', tag: '开源', category: 'ai', url: 'https://github.com/openai/whisper' },
      { id: 412, title: 'Dify', description: 'LLM 应用可视化编排平台，RAG 知识库、Agent 工具调用一键发布', tag: '热门', category: 'ai', url: 'https://dify.ai' },
    ],
  },
  {
    id: 'cloud',
    name: '云服务区',
    icon: '☁️',
    description: '公有云、私有云、存储、CDN、域名、SSL 证书等基础设施服务',
    gradient: 'from-cyan-300 via-sky-400 to-cyan-500',
    cards: [
      { id: 601, title: '阿里云控制台', description: 'ECS、RDS、OSS、SLB 全栈云产品管理，费用账单、安全中心', tag: '核心', category: 'cloud', url: 'https://ecs.console.aliyun.com' },
      { id: 602, title: '腾讯云控制台', description: 'CVM、CDB、COS、CLB 云产品统一入口，资源、计费、监控管理', category: 'cloud', url: 'https://console.cloud.tencent.com' },
      { id: 603, title: '华为云控制台', description: '鲲鹏云原生平台，ECS、DWS、ModelArts AI 开发一站式管理', category: 'cloud', url: 'https://console.huaweicloud.com' },
      { id: 604, title: 'MinIO', description: '私有化 S3 兼容对象存储服务，图片、视频、备份文件统一管理', category: 'cloud', url: 'https://min.io' },
      { id: 605, title: 'Harbor', description: '企业级 Docker/OCI 镜像仓库，镜像扫描、复制策略、RBAC 权限', tag: '容器', category: 'cloud', url: 'https://goharbor.io' },
      { id: 606, title: 'DNS', description: '域名注册、智能 DNS 解析、DDoS 防护、SSL 证书申请、HTTPS 部署一站式服务', tag: '基础设施', category: 'cloud', url: 'https://www.dnspod.cn' },
    ],
  },
]

const CATEGORY_LABEL: Record<string, string> = {
  dev: '研发效能',
  ops: '运维监控',
  data: '数据分析',
  ai: 'AI 能力',
  cloud: '云服务',
}

export const categoryLabel = (c: string): string =>
  CATEGORY_LABEL[c] ?? '其他'

export const categoryColor = (c: string): { bg: string; fg: string } => {
  switch (c) {
    case 'dev':    return { bg: 'linear-gradient(135deg,#38BDF8,#0284C7)', fg: '#0C4A6E' }
    case 'ops':    return { bg: 'linear-gradient(135deg,#34D399,#047857)', fg: '#064E3B' }
    case 'data':   return { bg: 'linear-gradient(135deg,#22D3EE,#0891B2)', fg: '#164E63' }
    case 'ai':     return { bg: 'linear-gradient(135deg,#F472B6,#BE185D)', fg: '#831843' }
    case 'cloud':  return { bg: 'linear-gradient(135deg,#818CF8,#4338CA)', fg: '#312E81' }
    default:       return { bg: 'linear-gradient(135deg,#94A3B8,#475569)', fg: '#1E293B' }
  }
}

const palette = [
  'linear-gradient(135deg,#22C55E,#15803D)',
  'linear-gradient(135deg,#EF4444,#B91C1C)',
  'linear-gradient(135deg,#111827,#0B0F17)',
  'linear-gradient(135deg,#3B82F6,#1D4ED8)',
  'linear-gradient(135deg,#F59E0B,#B45309)',
  'linear-gradient(135deg,#8B5CF6,#6D28D9)',
  'linear-gradient(135deg,#EC4899,#BE185D)',
  'linear-gradient(135deg,#14B8A6,#0F766E)',
]

const cardIdGradient = (_id: number) => palette[_id % palette.length]

const iconTextOverrides: { match: RegExp; t: string; bg: string }[] = [
  { match: /Rancher/i, t: 'Rn', bg: categoryColor('cloud').bg },
  { match: /ELK|Kibana/i, t: 'Kb', bg: 'linear-gradient(135deg,#F59E0B,#B45309)' },
  { match: /团队沟通/i, t: 'Mm', bg: 'linear-gradient(135deg,#0058CC,#002D6E)' },
  { match: /埋点/i, t: 'OT', bg: 'linear-gradient(135deg,#000000,#1F2937)' },
  { match: /采集/i, t: 'Vc', bg: 'linear-gradient(135deg,#F59E0B,#78350F)' },
  { match: /GitLab/i, t: 'GL', bg: categoryColor('dev').bg },
  { match: /Bruno/i, t: 'Br', bg: 'linear-gradient(135deg,#1E1B4B,#0F172A)' },
  { match: /Jenkins/i, t: 'Jk', bg: 'linear-gradient(135deg,#F59E0B,#B45309)' },
  { match: /Sonar/i, t: 'Sq', bg: 'linear-gradient(135deg,#34D399,#047857)' },
  { match: /Nexus/i, t: 'Nx', bg: 'linear-gradient(135deg,#60A5FA,#1D4ED8)' },
  { match: /Sentry/i, t: 'Se', bg: 'linear-gradient(135deg,#9C27B0,#360D3B)' },
  { match: /Mattermost/i, t: 'Mm', bg: 'linear-gradient(135deg,#0058CC,#002D6E)' },
  { match: /Grafana[\s-]*k6/i, t: 'k6', bg: 'linear-gradient(135deg,#7B217F,#3C0D3D)' },
  { match: /Grafana[\s-]*Beyla|Beyla/i, t: 'Gb', bg: 'linear-gradient(135deg,#10B981,#064E3B)' },
  { match: /Grafana[\s-]*Tempo|Tempo/i, t: 'Gt', bg: 'linear-gradient(135deg,#F97316,#7C2D12)' },
  { match: /Grafana[\s-]*Mimir|Mimir/i, t: 'Gm', bg: 'linear-gradient(135deg,#16A34A,#064E3B)' },
  { match: /^Grafana\b/i, t: 'Gf', bg: categoryColor('ops').bg },
  { match: /Kubernetes|Kuber/i, t: 'K8', bg: 'linear-gradient(135deg,#60A5FA,#2563EB)' },
  { match: /OpenTelemetry|OTel/i, t: 'OT', bg: 'linear-gradient(135deg,#000000,#1F2937)' },
  { match: /Jaeger/i, t: 'Jg', bg: 'linear-gradient(135deg,#6366F1,#312E81)' },
  { match: /^Loki\b/i, t: 'Lk', bg: 'linear-gradient(135deg,#F59E0B,#7C2D12)' },
  { match: /^Argo/i, t: 'Ar', bg: 'linear-gradient(135deg,#6366F1,#4338CA)' },
  { match: /Nacos/i, t: 'Na', bg: 'linear-gradient(135deg,#10B981,#065F46)' },
  { match: /Vault/i, t: 'Va', bg: 'linear-gradient(135deg,#111827,#000000)' },
  { match: /Metabase/i, t: 'Mb', bg: categoryColor('data').bg },
  { match: /Superset/i, t: 'Ss', bg: 'linear-gradient(135deg,#14B8A6,#0F766E)' },
  { match: /DolphinScheduler|Dolphin/i, t: 'Ds', bg: 'linear-gradient(135deg,#F59E0B,#B45309)' },
  { match: /ClickHouse|\bClick\b/i, t: 'CH', bg: 'linear-gradient(135deg,#FFCC00,#B45309)' },
  { match: /Apache Doris|Doris/i, t: 'Dr', bg: 'linear-gradient(135deg,#1E40AF,#002075)' },
  { match: /^Flink\b/i, t: 'Fk', bg: 'linear-gradient(135deg,#F59E0B,#B45309)' },
  { match: /Kylin/i, t: 'Ky', bg: 'linear-gradient(135deg,#3B82F6,#1D4ED8)' },
  { match: /^dbt\b/i, t: 'dt', bg: 'linear-gradient(135deg,#FF6B6B,#B91C1C)' },
  { match: /Airbyte/i, t: 'Ab', bg: 'linear-gradient(135deg,#615EFC,#4338CA)' },
  { match: /SeaTunnel|Tunnel/i, t: 'ST', bg: categoryColor('data').bg },
  { match: /DataX/i, t: 'DX', bg: 'linear-gradient(135deg,#FF6A00,#B45309)' },
  { match: /^Hue\b/i, t: 'Hu', bg: categoryColor('data').bg },
  { match: /大模型|LLM|推理/i, t: 'AI', bg: categoryColor('ai').bg },
  { match: /Midjourney|Midjour/i, t: 'Mj', bg: categoryColor('ai').bg },
  { match: /Milvus/i, t: 'Mv', bg: 'linear-gradient(135deg,#8B5CF6,#6D28D9)' },
  { match: /Ollama/i, t: 'Ol', bg: 'linear-gradient(135deg,#000000,#1F2937)' },
  { match: /ComfyUI/i, t: 'Cf', bg: 'linear-gradient(135deg,#F59E0B,#7C2D12)' },
  { match: /LangChain|Lang/i, t: 'Lc', bg: 'linear-gradient(135deg,#1C3F39,#000000)' },
  { match: /^Suno\b/i, t: 'Sn', bg: 'linear-gradient(135deg,#000000,#7C2D12)' },
  { match: /^Cursor\b/i, t: 'Cr', bg: 'linear-gradient(135deg,#1E293B,#000000)' },
  { match: /Stable[\s-]*Diffusion|WebUI/i, t: 'SD', bg: 'linear-gradient(135deg,#A855F7,#4C1D95)' },
  { match: /Tesseract|OCR/i, t: 'OR', bg: 'linear-gradient(135deg,#22D3EE,#0891B2)' },
  { match: /Whisper|ASR/i, t: 'SR', bg: 'linear-gradient(135deg,#8B5CF6,#6D28D9)' },
  { match: /^Dify\b/i, t: 'Df', bg: categoryColor('ai').bg },
  { match: /阿里/i, t: '阿', bg: 'linear-gradient(135deg,#FB923C,#C2410C)' },
  { match: /腾讯/i, t: '腾', bg: 'linear-gradient(135deg,#3B82F6,#1D4ED8)' },
  { match: /华为/i, t: '华', bg: 'linear-gradient(135deg,#EF4444,#991B1B)' },
  { match: /MinIO/i, t: 'M', bg: 'linear-gradient(135deg,#EF4444,#B91C1C)' },
  { match: /Harbor/i, t: 'H', bg: categoryColor('cloud').bg },
  { match: /DNS|域名/i, t: 'NS', bg: 'linear-gradient(135deg,#10B981,#047857)' },
]

const titleSimplifyRules: [RegExp, string][] = [
  [/^GitLab\b/i, 'GitLab'], [/^Bruno\b/i, 'Bruno'], [/^Jenkins\b/i, 'Jenkins'],
  [/SonarQube/i, 'SonarQube'], [/k6/i, 'k6'], [/Nexus/i, 'Nexus'],
  [/Sentry/i, 'Sentry'], [/Mattermost/i, 'Mattermost'], [/Grafana\s*Beyla/i, 'Beyla'],
  [/Grafana\s*Tempo/i, 'Tempo'], [/Grafana\s*Mimir/i, 'Mimir'], [/^Grafana\b/i, 'Grafana'],
  [/Kubernetes/i, 'K8s'], [/OpenTelemetry/i, 'OpenTel'], [/Jaeger/i, 'Jaeger'],
  [/^Loki\b/i, 'Loki'], [/^Vector\b/i, 'Vector'], [/Argo\s*CD/i, 'Argo CD'],
  [/Nacos/i, 'Nacos'], [/Vault/i, 'Vault'], [/Metabase/i, 'Metabase'],
  [/Superset/i, 'Superset'], [/DolphinScheduler/i, 'Dolphin'], [/ClickHouse/i, 'ClickHouse'],
  [/Doris/i, 'Doris'], [/^Flink\b/i, 'Flink'], [/Kylin/i, 'Kylin'], [/^dbt\b/i, 'dbt'],
  [/Airbyte/i, 'Airbyte'], [/SeaTunnel/i, 'SeaTunnel'], [/DataX/i, 'DataX'], [/^Hue\b/i, 'Hue'],
  [/Midjourney/i, 'Midjourney'], [/Milvus/i, 'Milvus'], [/Ollama/i, 'Ollama'],
  [/ComfyUI/i, 'ComfyUI'], [/LangChain/i, 'LangChain'], [/^Suno\b/i, 'Suno'],
  [/^Cursor\b/i, 'Cursor'], [/Stable\s*Diffusion/i, 'SD WebUI'], [/Tesseract/i, 'Tesseract'],
  [/Whisper/i, 'Whisper'], [/^Dify\b/i, 'Dify'], [/MinIO/i, 'MinIO'], [/Harbor/i, 'Harbor'],
  [/^DNS\b/i, 'DNS'], [/大模型推理网关/i, 'LLM 网关'], [/阿里云控制台/i, '阿里云'],
  [/腾讯云控制台/i, '腾讯云'], [/华为云控制台/i, '华为云'],
]

export const defaultSearchKeywords: string[] = [
  'Jenkins 流水线', 'Grafana 监控', 'Kubernetes 集群', 'ClickHouse 分析', 'GitLab 仓库',
]

export interface IconTextResult { t: string; bg: string }

export const iconText = (title: string, _category: string): IconTextResult => {
  for (const rule of iconTextOverrides) {
    if (rule.match.test(title)) return { t: rule.t, bg: rule.bg }
  }
  const t = title
    .slice(0, 2)
    .toUpperCase()
    .replace(/[^A-Z0-9\u4e00-\u9fa5]/g, '')
    .slice(0, 2) || '◆'
  const bg = cardIdGradient(Number(title.length + title.charCodeAt(0)))
  return { t, bg }
}

export const simplifyTitle = (t: string): string => {
  for (const [re, val] of titleSimplifyRules) if (re.test(t)) return val
  const m = t.match(/^[A-Za-z][A-Za-z0-9.\-+_ ]{0,12}[A-Za-z0-9]?/)
  return m ? m[0].trim() : t
}

export const pickSpotlightCards = (
  allCards: PortalCard[],
  favorites: PortalCard[],
  recents: PortalCard[],
  viewSource: PortalCard[],
  limit = 8
): PortalCard[] => {
  const result: PortalCard[] = []
  const ids = new Set<number>()
  const push = (c: PortalCard | undefined) => {
    if (!c || ids.has(c.id)) return
    ids.add(c.id); result.push(c)
  }
  favorites.forEach(push)
  recents.forEach(push)
  for (const c of viewSource) push(c)
  for (const c of allCards) push(c)
  return result.slice(0, limit)
}

export const pickSearchHints = (cards: PortalCard[], limit = 8): string[] => {
  const names: string[] = []
  const seen = new Set<string>()
  for (const c of cards) {
    const t = c.title.trim()
    if (seen.has(t)) continue
    seen.add(t); names.push(t)
    if (names.length >= limit) break
  }
  return names
}
