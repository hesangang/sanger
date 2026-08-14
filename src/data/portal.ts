export interface PortalCard {
  id: number
  title: string
  description: string
  cover: string
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

const IMG = (p: string) =>
  `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(p)}&image_size=landscape_16_9`

export const regions: PortalRegion[] = [
  {
    id: 'dev',
    name: '研发效能区',
    icon: '⚙️',
    description: '代码托管、CI/CD、项目协同、测试部署一站式研发工具链',
    gradient: 'from-sky-400 via-blue-400 to-sky-500',
    cards: [
      { id: 101, title: 'GitLab', description: '开源企业级 Git 代码托管，Code Review、CI/CD、Issue、Wiki 一体化 DevOps 平台，支持完全私有化部署', tag: '核心', category: 'dev', url: 'https://about.gitlab.com/install',
        cover: IMG('GitLab dashboard repository code merge request CI pipeline dark blue UI modern clean') },
      { id: 108, title: 'Bruno', description: 'Postman 开源替代，纯本地存储 + Git 同步，Markdown 文档、自动化测试、脚本断言，完全私有化', tag: '🔥火爆', category: 'dev', url: 'https://www.usebruno.com',
        cover: IMG('Bruno API client open source dark blue orange interface testing collection modern UI') },
      { id: 110, title: 'Jenkins', description: '开源老牌稳定 CI/CD 平台，支持多节点构建、流水线编排、插件生态 2000+，完全私有部署', category: 'dev', url: 'https://www.jenkins.io',
        cover: IMG('Jenkins CI CD pipeline build status green blue dashboard stage monitor minimal') },
      { id: 107, title: 'SonarQube', description: '开源静态代码分析平台，支持 30+ 语言质量扫描、安全漏洞检测、坏味道治理与质量门禁', category: 'dev', url: 'https://www.sonarsource.com/products/sonarqube/downloads',
        cover: IMG('SonarQube code quality dashboard bugs vulnerabilities green metrics clean UI') },
      { id: 109, title: 'Grafana k6', description: 'Go 编写开源负载测试工具，JavaScript 编写脚本，HTTP/gRPC/WebSocket 全协议，集成 CI/CD 私有部署', tag: '测试', category: 'dev', url: 'https://k6.io',
        cover: IMG('Grafana k6 performance load testing dashboard metrics dark green white UI') },
      { id: 111, title: 'Nexus', description: '开源企业级制品仓库，Maven/npm/PyPI/Docker/Helm 多格式缓存代理，完全私有部署', category: 'dev', url: 'https://www.sonatype.com/products/sonatype-nexus-repository',
        cover: IMG('Nexus artifact repository packages docker maven npm dark blue clean UI') },
      { id: 104, title: 'Sentry', description: '开源全栈实时错误监控与性能追踪，Java/Go/JS/Python/移动端全语言，Self-Hosted 私有部署', tag: 'SRE', category: 'dev', url: 'https://develop.sentry.dev/self-hosted',
        cover: IMG('Sentry error monitoring performance dashboard dark purple red modern UI') },
      { id: 112, title: 'Mattermost', description: 'Slack 开源替代，Go+React 实现，端到端加密，集成 Jenkins/GitLab/SVN，私有化内网部署', tag: '协作', category: 'dev', url: 'https://mattermost.com',
        cover: IMG('Mattermost team chat messaging app dark blue purple clean modern UI') },
    ],
  },
  {
    id: 'ops',
    name: '运维监控区',
    icon: '📊',
    description: '服务器监控、日志分析、告警通知、容器编排运维管理平台',
    gradient: 'from-emerald-400 via-teal-400 to-emerald-500',
    cards: [
      { id: 201, title: 'Grafana', description: '统一可观测性仪表盘，Loki/Tempo/Mimir/Prometheus 全栈接入可视化', tag: '核心', category: 'ops', url: 'https://grafana.com',
        cover: IMG('Grafana monitoring dashboard metrics graphs panels dark theme colorful charts') },
      { id: 202, title: 'Kubernetes', description: '容器编排管理平台，Deployment、Service、Ingress 可视化编排', category: 'ops', url: 'https://kubernetes.io',
        cover: IMG('Kubernetes dashboard pods nodes cluster container orchestration blue purple UI') },
      { id: 203, title: 'Grafana Beyla', description: 'Grafana 开源 eBPF 自动埋点，零代码侵入自动生成 HTTP/gRPC 服务 RED 指标与分布式追踪', tag: '🔥前沿', category: 'ops', url: 'https://grafana.com/oss/beyla',
        cover: IMG('Grafana Beyla eBPF auto instrumentation zero code observability dark modern UI') },
      { id: 204, title: 'OpenTelemetry', description: 'CNCF 毕业可观测性标准，统一 Tracing/Metrics/Logs 埋点 SDK，多语言支持', tag: '标准', category: 'ops', url: 'https://opentelemetry.io',
        cover: IMG('OpenTelemetry CNCF observability tracing metrics logs dashboard dark modern UI') },
      { id: 205, title: 'Jaeger', description: 'CNCF 毕业分布式追踪系统，OpenTracing 兼容，微服务调用链路可视化分析', tag: '追踪', category: 'ops', url: 'https://www.jaegertracing.io',
        cover: IMG('Jaeger distributed tracing service graph call chain dashboard dark UI') },
      { id: 206, title: 'Grafana Tempo', description: 'Grafana 高性能分布式追踪后端，100% 兼容 OTel/Jaeger/Zipkin，对象存储低成本', tag: '追踪', category: 'ops', url: 'https://grafana.com/oss/tempo',
        cover: IMG('Grafana Tempo distributed tracing backend dashboard orange dark clean UI') },
      { id: 207, title: 'Grafana Mimir', description: 'Grafana 官方长期指标存储，100% Prometheus 兼容，支持亿级指标无限长期存储', tag: '指标', category: 'ops', url: 'https://grafana.com/oss/mimir',
        cover: IMG('Grafana Mimir long term metrics storage dashboard dark clean UI') },
      { id: 208, title: 'Loki', description: 'Grafana 开源轻量日志系统，对象存储低成本，与 Tempo/Mimir 无缝三栈联动', category: 'ops', url: 'https://grafana.com/oss/loki',
        cover: IMG('Grafana Loki log aggregation browser dashboard orange dark clean UI') },
      { id: 209, title: 'Vector', description: 'Rust 编写下一代可观测性采集器，日志/指标/追踪全支持，比 Filebeat 快 10 倍', tag: '采集', category: 'ops', url: 'https://vector.dev',
        cover: IMG('Vector Rust observability data pipeline collector dashboard dark modern UI') },
      { id: 210, title: 'Argo CD', description: 'Kubernetes 声明式 GitOps 持续部署，多集群、多租户、蓝绿金丝雀发布', category: 'ops', url: 'https://argoproj.github.io/cd',
        cover: IMG('Argo CD GitOps kubernetes deployment dashboard dark UI') },
      { id: 211, title: 'Nacos', description: '阿里开源微服务注册配置中心，服务发现、配置管理、流量路由一体化', tag: '微服务', category: 'ops', url: 'https://nacos.io',
        cover: IMG('Nacos service discovery config center dashboard green blue clean UI') },
      { id: 212, title: 'Vault', description: 'HashiCorp 企业级机密管理，API 密钥、证书、Token 动态加密与审计', category: 'ops', url: 'https://www.vaultproject.io',
        cover: IMG('HashiCorp Vault secret management dashboard security dark UI') },
    ],
  },
  {
    id: 'data',
    name: '数据分析区',
    icon: '📈',
    description: '数据仓库、BI 报表、用户行为分析、数据中台等数据分析工具',
    gradient: 'from-cyan-400 via-sky-400 to-cyan-500',
    cards: [
      { id: 301, title: 'Metabase', description: '零代码自助式数据分析平台，拖拽式报表、仪表盘、数据钻取', tag: '热门', category: 'data', url: 'https://www.metabase.com',
        cover: IMG('Metabase BI analytics dashboard charts white clean minimal modern UI') },
      { id: 302, title: 'Superset', description: 'Apache 顶级数据可视化项目，50+ 图表类型、SQL Lab、仪表盘', category: 'data', url: 'https://superset.apache.org',
        cover: IMG('Apache Superset data visualization colorful charts dashboard clean UI') },
      { id: 303, title: 'DolphinScheduler', description: '分布式工作流任务调度系统，DAG 可视化、多租户、告警监控', category: 'data', url: 'https://dolphinscheduler.apache.org',
        cover: IMG('Apache DolphinScheduler workflow DAG orchestration blue UI minimal') },
      { id: 304, title: 'ClickHouse', description: '俄罗斯开源 OLAP 列式数据库，亿级数据毫秒级聚合查询，亚秒级响应', tag: '爆款', category: 'data', url: 'https://clickhouse.com',
        cover: IMG('ClickHouse OLAP database query analytics dashboard yellow black modern UI') },
      { id: 305, title: 'Apache Doris', description: 'Apache 顶级开源 MP 分析数据库，亚秒级实时分析，支持 MySQL 协议，极速多维聚合与湖仓一体', tag: '🔥热门', category: 'data', url: 'https://doris.apache.org',
        cover: IMG('Apache Doris real time data warehouse analytics dashboard query result dark blue UI') },
      { id: 306, title: 'Flink', description: 'Apache Flink 流批一体计算平台，SQL 作业、Jar 任务、监控报警', category: 'data', url: 'https://flink.apache.org',
        cover: IMG('Apache Flink streaming jobs monitoring dashboard blue orange UI') },
      { id: 307, title: 'Apache Kylin', description: 'Apache 顶级 OLAP 引擎，预计算 + 立方体，千亿数据亚秒级查询', category: 'data', url: 'https://kylin.apache.org',
        cover: IMG('Apache Kylin OLAP cube multi dimensional analytics dashboard blue clean UI') },
      { id: 308, title: 'dbt', description: 'SQL-first 现代数据转换工具，模块化数据建模、版本化、测试一体化', tag: '流行', category: 'data', url: 'https://www.getdbt.com',
        cover: IMG('dbt data build tool SQL transformation pipeline orange white modern UI') },
      { id: 309, title: 'Airbyte', description: '开源数据集成平台，300+ 连接器，ELT 管道从源到仓库零代码配置', tag: '开源', category: 'data', url: 'https://airbyte.com',
        cover: IMG('Airbyte data integration ELT pipeline connectors dashboard blue green UI') },
      { id: 310, title: 'Apache SeaTunnel', description: 'Apache 分布式海量数据集成平台，离线/实时/CDC 同步，400+ 数据源', tag: '新上线', category: 'data', url: 'https://seatunnel.apache.org',
        cover: IMG('Apache SeaTunnel data pipeline CDC synchronization dashboard blue clean UI') },
      { id: 311, title: 'DataX', description: '阿里开源异构数据源离线同步工具，支持 MySQL/Oracle/HDFS 等 20+ 数据源', category: 'data', url: 'https://github.com/alibaba/DataX',
        cover: IMG('DataX data sync ETL pipeline alibaba open source dashboard blue orange UI') },
      { id: 312, title: 'Hue', description: 'Hadoop 生态 SQL 查询工作台，Hive、Spark、Impala 多引擎', category: 'data', url: 'https://gethue.com',
        cover: IMG('Hue Hadoop SQL query editor browser interface dark blue yellow') },
    ],
  },
  {
    id: 'ai',
    name: 'AI 能力区',
    icon: '🤖',
    description: '大模型服务、AI 绘画、语音识别、向量数据库等 AI 工具平台',
    gradient: 'from-pink-500 via-rose-500 to-pink-600',
    cards: [
      { id: 401, title: '大模型推理网关', description: '统一 LLM 网关，接入 GPT-4o、Claude、Qwen、DeepSeek 等 100+ 模型，按量计费，统一 API 调用', tag: '推荐', category: 'ai', url: 'https://siliconflow.cn',
        cover: IMG('LLM AI chatbot interface conversation purple gradient futuristic clean UI') },
      { id: 402, title: 'Midjourney', description: '企业级 AI 图像生成平台，文生图、图生图、风格迁移、高清放大', tag: '新上线', category: 'ai', url: 'https://www.midjourney.com',
        cover: IMG('AI art generation gallery colorful creative images purple pink futuristic UI') },
      { id: 403, title: 'Milvus', description: '分布式向量相似度检索引擎，支持亿级向量毫秒级召回', category: 'ai', url: 'https://milvus.io',
        cover: IMG('Milvus vector database embeddings similarity search blue green 3D UI') },
      { id: 404, title: 'Ollama', description: '一键本地部署运行 Llama 3、Qwen 2、DeepSeek 等 200+ 开源大模型，跨平台支持', tag: '爆款', category: 'ai', url: 'https://ollama.com',
        cover: IMG('Ollama local LLM llama qwen running terminal dark purple UI minimalist') },
      { id: 405, title: 'ComfyUI', description: 'Stable Diffusion 节点式绘画工作流，支持 SD 3、Flux、LoRA、ControlNet 极致定制', tag: '绘图', category: 'ai', url: 'https://github.com/comfyanonymous/ComfyUI',
        cover: IMG('ComfyUI Stable Diffusion nodes workflow AI art generation orange purple UI') },
      { id: 406, title: 'LangChain', description: '全球最流行 LLM 应用开发框架，Agent、RAG、Tool Calling 全链路能力，Python/JS 双语', tag: '开发', category: 'ai', url: 'https://www.langchain.com',
        cover: IMG('LangChain LLM framework agent RAG pipeline blue green developer dashboard UI') },
      { id: 407, title: 'Suno', description: '输入文字即可生成高质量完整歌曲，支持人声、伴奏、多风格，一键商用级出品', tag: '新上线', category: 'ai', url: 'https://suno.com',
        cover: IMG('Suno AI music generation song waveform player purple pink modern UI') },
      { id: 408, title: 'Cursor', description: 'VS Code 内核 AI 编程助手，Tab 补全、代码问答、整库重构、Agent 自动编写，效率翻倍', tag: '程序员', category: 'ai', url: 'https://cursor.com',
        cover: IMG('Cursor AI code editor VS Code syntax highlighting dark blue green futuristic UI') },
      { id: 409, title: 'Stable Diffusion WebUI', description: 'Automatic1111 版 AI 绘画 WebUI，文生图、图生图、Inpaint、ControlNet 扩展生态最全', tag: '开源', category: 'ai', url: 'https://github.com/AUTOMATIC1111/stable-diffusion-webui',
        cover: IMG('Stable Diffusion WebUI AUTOMATIC1111 AI image generation dark orange UI') },
      { id: 410, title: 'Tesseract', description: 'Apache 2.0 开源 OCR 引擎，支持 100+ 语种，含 PDF/HOCR/TSV 输出，可本地私有化部署', tag: '开源', category: 'ai', url: 'https://github.com/tesseract-ocr/tesseract',
        cover: IMG('OCR text recognition document scanner data extraction green clean UI') },
      { id: 411, title: 'Whisper', description: 'OpenAI 开源语音识别模型，支持 99 语种，含翻译/语种检测，可本地推理部署', tag: '开源', category: 'ai', url: 'https://github.com/openai/whisper',
        cover: IMG('ASR speech voice to text waveform visualization blue purple clean UI') },
      { id: 412, title: 'Dify', description: 'LLM 应用可视化编排平台，RAG 知识库、Agent 工具调用一键发布', tag: '热门', category: 'ai', url: 'https://dify.ai',
        cover: IMG('Dify LLM workflow builder drag drop nodes connections modern blue UI') },
    ],
  },
  {
    id: 'cloud',
    name: '云服务区',
    icon: '☁️',
    description: '公有云、私有云、存储、CDN、域名、SSL 证书等基础设施服务',
    gradient: 'from-cyan-300 via-sky-400 to-cyan-500',
    cards: [
      { id: 601, title: '阿里云控制台', description: 'ECS、RDS、OSS、SLB 全栈云产品管理，费用账单、安全中心', tag: '核心', category: 'cloud', url: 'https://ecs.console.aliyun.com',
        cover: IMG('Alibaba Cloud Alicloud console dashboard ECS RDS orange modern clean UI') },
      { id: 602, title: '腾讯云控制台', description: 'CVM、CDB、COS、CLB 云产品统一入口，资源、计费、监控管理', category: 'cloud', url: 'https://console.cloud.tencent.com',
        cover: IMG('Tencent Cloud QCloud console dashboard CVM blue white modern clean UI') },
      { id: 603, title: '华为云控制台', description: '鲲鹏云原生平台，ECS、DWS、ModelArts AI 开发一站式管理', category: 'cloud', url: 'https://console.huaweicloud.com',
        cover: IMG('Huawei Cloud console dashboard ECS enterprise red gray modern clean UI') },
      { id: 604, title: 'MinIO', description: '私有化 S3 兼容对象存储服务，图片、视频、备份文件统一管理', category: 'cloud', url: 'https://min.io',
        cover: IMG('MinIO S3 object storage browser buckets files red white clean modern UI') },
      { id: 605, title: 'Harbor', description: '企业级 Docker/OCI 镜像仓库，镜像扫描、复制策略、RBAC 权限', tag: '容器', category: 'cloud', url: 'https://goharbor.io',
        cover: IMG('Harbor docker container image registry repository blue white clean UI') },
      { id: 606, title: 'DNS', description: '域名注册、智能 DNS 解析、DDoS 防护、SSL 证书申请、HTTPS 部署一站式服务', tag: '基础设施', category: 'cloud', url: 'https://www.dnspod.cn',
        cover: IMG('DNS domain SSL certificate management dashboard green lock blue clean UI') },
    ],
  },
]

export const navLinks = [
  { label: '首页', href: '#', icon: '🏠' },
  { label: '我的收藏', href: '#', icon: '⭐' },
  { label: '最近访问', href: '#', icon: '🕒' },
  { label: '服务目录', href: '#', icon: '📋' },
  { label: '帮助中心', href: '#', icon: '❓' },
]
