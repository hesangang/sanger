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
      { id: 101, title: 'GitLab 代码仓库', description: '企业级 Git 代码托管平台，支持 Code Review、分支管理、WebHook 集成', tag: '常用', category: 'dev', url: 'https://gitlab.example.com',
        cover: IMG('GitLab dashboard repository code merge request CI pipeline dark blue UI modern clean') },
      { id: 102, title: 'Jenkins 流水线', description: '持续集成与持续部署平台，支持多节点构建、流水线编排、制品管理', category: 'dev', url: 'https://jenkins.example.com',
        cover: IMG('Jenkins CI CD pipeline build status green blue dashboard stage monitor minimal') },
      { id: 103, title: 'Jira 项目管理', description: '敏捷项目管理与缺陷跟踪，看板、甘特图、迭代计划全方位管理', tag: '敏捷', category: 'dev', url: 'https://jira.example.com',
        cover: IMG('Jira scrum board kanban tickets agile project management blue dashboard minimal UI') },
      { id: 104, title: 'Confluence 文档', description: '企业知识库与协作文档平台，产品文档、技术方案、团队空间统一管理', category: 'dev', url: 'https://confluence.example.com',
        cover: IMG('Confluence wiki knowledge base documentation team space white blue clean modern') },
      { id: 105, title: 'SonarQube 代码质量', description: '静态代码分析平台，支持 20+ 语言质量扫描、安全漏洞检测、坏味道治理', category: 'dev', url: 'https://sonar.example.com',
        cover: IMG('SonarQube code quality dashboard bugs vulnerabilities green metrics clean UI') },
      { id: 106, title: 'Nexus 制品库', description: '企业级制品仓库管理，Maven、npm、Docker 多格式支持，缓存与代理', category: 'dev', url: 'https://nexus.example.com',
        cover: IMG('Nexus artifact repository packages docker maven npm dark blue clean UI') },
    ],
  },
  {
    id: 'ops',
    name: '运维监控区',
    icon: '📊',
    description: '服务器监控、日志分析、告警通知、容器编排运维管理平台',
    gradient: 'from-emerald-400 via-teal-400 to-emerald-500',
    cards: [
      { id: 201, title: 'Grafana 可视化监控', description: '统一可观测性仪表盘，支持 Prometheus、MySQL 等多数据源接入', tag: '核心', category: 'ops', url: 'https://grafana.example.com',
        cover: IMG('Grafana monitoring dashboard metrics graphs panels dark theme colorful charts') },
      { id: 202, title: 'Kubernetes 控制台', description: '容器编排管理平台，Deployment、Service、Ingress 可视化编排', category: 'ops', url: 'https://k8s.example.com',
        cover: IMG('Kubernetes dashboard pods nodes cluster container orchestration blue purple UI') },
      { id: 203, title: 'ELK 日志中心', description: 'Elasticsearch + Logstash + Kibana 分布式日志检索与分析平台', tag: '日志', category: 'ops', url: 'https://kibana.example.com',
        cover: IMG('Kibana log analytics dashboard search interface orange blue dark UI') },
      { id: 204, title: 'Prometheus 指标平台', description: '时序数据库与指标采集系统，告警规则、Recording Rules 统一管理', category: 'ops', url: 'https://prometheus.example.com',
        cover: IMG('Prometheus metrics graphs alerts dashboard orange clean modern UI') },
      { id: 205, title: 'AlertManager 告警', description: '告警分组、抑制、静默路由管理，邮件/钉钉/企微多通道通知', category: 'ops', url: 'https://alert.example.com',
        cover: IMG('Alertmanager incident alerts status red green notification center UI') },
      { id: 206, title: 'Rancher 集群管理', description: '多 Kubernetes 集群统一管理平台，用户权限、项目配额、Catalog', category: 'ops', url: 'https://rancher.example.com',
        cover: IMG('Rancher multi cluster kubernetes management dashboard blue minimal') },
    ],
  },
  {
    id: 'data',
    name: '数据分析区',
    icon: '📈',
    description: '数据仓库、BI 报表、用户行为分析、数据中台等数据分析工具',
    gradient: 'from-cyan-400 via-sky-400 to-cyan-500',
    cards: [
      { id: 301, title: 'Metabase BI 报表', description: '零代码自助式数据分析平台，拖拽式报表、仪表盘、数据钻取', tag: '热门', category: 'data', url: 'https://metabase.example.com',
        cover: IMG('Metabase BI analytics dashboard charts white clean minimal modern UI') },
      { id: 302, title: 'Superset 数据可视化', description: 'Apache 顶级数据可视化项目，50+ 图表类型、SQL Lab、仪表盘', category: 'data', url: 'https://superset.example.com',
        cover: IMG('Apache Superset data visualization colorful charts dashboard clean UI') },
      { id: 303, title: 'DolphinScheduler 调度', description: '分布式工作流任务调度系统，DAG 可视化、多租户、告警监控', category: 'data', url: 'https://ds.example.com',
        cover: IMG('Apache DolphinScheduler workflow DAG orchestration blue UI minimal') },
      { id: 304, title: 'Hue 大数据查询', description: 'Hadoop 生态 SQL 查询工作台，Hive、Spark、Impala 多引擎', category: 'data', url: 'https://hue.example.com',
        cover: IMG('Hue Hadoop SQL query editor browser interface dark blue yellow') },
      { id: 305, title: 'Tableau 高级分析', description: '企业级专业 BI 工具，复杂计算、地理分析、预测建模能力', tag: '专业', category: 'data', url: 'https://tableau.example.com',
        cover: IMG('Tableau advanced analytics dashboard maps charts professional blue clean') },
      { id: 306, title: 'Flink 实时计算', description: 'Apache Flink 流批一体计算平台，SQL 作业、Jar 任务、监控报警', category: 'data', url: 'https://flink.example.com',
        cover: IMG('Apache Flink streaming jobs monitoring dashboard blue orange UI') },
    ],
  },
  {
    id: 'ai',
    name: 'AI 能力区',
    icon: '🤖',
    description: '大模型服务、AI 绘画、语音识别、向量数据库等 AI 工具平台',
    gradient: 'from-pink-500 via-rose-500 to-pink-600',
    cards: [
      { id: 401, title: '大模型推理网关', description: '统一 LLM 网关，接入 GPT-4o、Claude、Qwen 等 10+ 模型，按量计费', tag: '推荐', category: 'ai', url: 'https://llm.example.com',
        cover: IMG('LLM AI chatbot interface conversation purple gradient futuristic clean UI') },
      { id: 402, title: 'Midjourney AI 绘画', description: '企业级 AI 图像生成平台，文生图、图生图、风格迁移、高清放大', tag: '新上线', category: 'ai', url: 'https://ai-art.example.com',
        cover: IMG('AI art generation gallery colorful creative images purple pink futuristic UI') },
      { id: 403, title: 'Milvus 向量数据库', description: '分布式向量相似度检索引擎，支持亿级向量毫秒级召回', category: 'ai', url: 'https://milvus.example.com',
        cover: IMG('Milvus vector database embeddings similarity search blue green 3D UI') },
      { id: 404, title: 'OCR 文字识别', description: '通用 OCR、证件识别、发票识别、表格结构化提取服务平台', category: 'ai', url: 'https://ocr.example.com',
        cover: IMG('OCR text recognition document scanner data extraction green clean UI') },
      { id: 405, title: 'ASR 语音识别', description: '实时语音转文字，中英日韩 8K 采样率，支持长语音、方言识别', category: 'ai', url: 'https://asr.example.com',
        cover: IMG('ASR speech voice to text waveform visualization blue purple clean UI') },
      { id: 406, title: 'Dify 工作流编排', description: 'LLM 应用可视化编排平台，RAG 知识库、Agent 工具调用一键发布', tag: '热门', category: 'ai', url: 'https://dify.example.com',
        cover: IMG('Dify LLM workflow builder drag drop nodes connections modern blue UI') },
    ],
  },
  {
    id: 'office',
    name: '办公协作区',
    icon: '📇',
    description: '即时通讯、OA 审批、文档协同、视频会议等日常办公工具',
    gradient: 'from-orange-500 via-amber-500 to-orange-600',
    cards: [
      { id: 501, title: '企业微信', description: '企业级即时通讯与办公平台，审批、打卡、汇报、会议一体化', tag: '常用', category: 'office', url: 'https://work.weixin.qq.com',
        cover: IMG('WeChat Work enterprise messaging app chat blue green clean white UI') },
      { id: 502, title: '飞书文档', description: '新一代企业协作与知识管理平台，多维表格、文档、日历、OKR', category: 'office', url: 'https://feishu.cn',
        cover: IMG('Feishu Lark collaboration docs workspace blue purple modern clean UI') },
      { id: 503, title: '钉钉 OA', description: '数字化办公操作系统，考勤、审批、日志、CRM 百宝箱应用', category: 'office', url: 'https://dingtalk.com',
        cover: IMG('DingTalk OA approval workflow office automation blue white app UI') },
      { id: 504, title: 'WPS 云文档', description: '在线协作文档、表格、演示，多人实时编辑，版本历史追溯', category: 'office', url: 'https://kdocs.cn',
        cover: IMG('WPS online document editor spreadsheet presentation red blue clean UI') },
      { id: 505, title: '腾讯会议', description: '高清视频会议与屏幕共享，支持万人大会、虚拟背景、会议录制', tag: '会议', category: 'office', url: 'https://meeting.tencent.com',
        cover: IMG('Tencent Meeting video conference call participants grid blue clean UI') },
      { id: 506, title: 'Notion 知识库', description: '现代化全能工作空间，笔记、数据库、看板、日历多合一', category: 'office', url: 'https://notion.so',
        cover: IMG('Notion workspace knowledge base notes database minimal white black UI') },
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
      { id: 604, title: 'MinIO 对象存储', description: '私有化 S3 兼容对象存储服务，图片、视频、备份文件统一管理', category: 'cloud', url: 'https://minio.example.com',
        cover: IMG('MinIO S3 object storage browser buckets files red white clean modern UI') },
      { id: 605, title: 'Harbor 镜像仓库', description: '企业级 Docker/OCI 镜像仓库，镜像扫描、复制策略、RBAC 权限', tag: '容器', category: 'cloud', url: 'https://harbor.example.com',
        cover: IMG('Harbor docker container image registry repository blue white clean UI') },
      { id: 606, title: 'DNS 域名管理', description: '域名注册、DNS 解析、SSL 证书申请、HTTPS 部署一站式服务', category: 'cloud', url: 'https://dns.example.com',
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
