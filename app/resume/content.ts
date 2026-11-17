/* ============================================================================
   /resume content. One ResumeContent object per language (en, zh); the page
   renders whichever it is handed.

   Sources: /about (PATH + bio), public/Sherry_Zhou_Resume.pdf, the case-study
   pages. Bullets follow "result, measured by, how" and open with a verb.

   `todo` on a bullet is a screen-only editing note (hidden in print): it marks
   a line still waiting on a number or a decision from Sherry.
============================================================================ */

export type Bullet = { text: string; todo?: string };

export type Job = {
  role: string;
  org: string;
  place?: string;
  dates: string;
  /** Flat list, or labelled groups when one job spans several workstreams. */
  groups: { label?: string; bullets: Bullet[] }[];
};

export type ResumeContent = {
  lang: string;
  name: string;
  nameAlt: string;
  title: string;
  contact: { label: string; value: string; href?: string }[];
  labels: {
    profile: string;
    experience: string;
    education: string;
    skills: string;
    languages: string;
    personal: string;
    back: string;
    export: string;
    exportHint: string;
    /** Prefix for the screen-only editing notes. */
    todo: string;
    /** Toolbar link to the other language. */
    switchLabel: string;
    switchHref: string;
  };
  profile: string;
  jobs: Job[];
  education: { degree: string; school: string; dates?: string }[];
  skills: string[];
  languages: string[];
  personal: string[];
};

const zh: ResumeContent = {
  lang: 'zh-Hans',
  name: '周雪怡',
  nameAlt: '',
  title: '产品设计师',
  contact: [
    { label: '所在地', value: '加拿大 多伦多' },
    { label: '作品集', value: 'xueyizhou.xyz', href: 'https://xueyizhou.xyz' },
    {
      label: '邮箱',
      value: 'sherrrryz@outlook.com',
      href: 'mailto:sherrrryz@outlook.com',
    },
  ],
  labels: {
    profile: '个人简介',
    experience: '工作经历',
    education: '教育背景',
    skills: '专业技能',
    languages: '语言',
    personal: '兴趣',
    back: '← 返回关于我',
    export: '导出 PDF',
    exportHint: '在打印对话框中选择“存储为 PDF”，纸张 A4。',
    todo: '待补：',
    switchLabel: 'English',
    switchHref: '/resume',
  },
  /* Written in Chinese on its own terms, not translated line by line from the
     English entry. The facts and figures match; the phrasing does not have to. */
  profile:
    '5 年以上产品设计经验，先后就职于华为、小米和 AppLovin。现任初创公司产品负责人，借助 AI 工具将工作从设计延伸到数据分析、实验设计和前端开发，并沉淀出一套从需求规格到发版上架的 AI 协作开发工作流。',
  jobs: [
    {
      role: '产品负责人',
      org: 'Karmaplot · JuVon Holdings Limited',
      dates: '2026.05 – 至今',
      groups: [
        {
          bullets: [
            {
              text: '负责小说阅读应用 Karmaplot 从 TikTok 投放到 App 下载、付费的完整链路，基于转化与变现数据设计实验，持续优化付费率。',
            },
            {
              text: '借助 AI 编程工具直接参与开发：向线上代码库提交前端 PR，并为每项实验搭建数据埋点和数据看板。',
            },
          ],
        },
      ],
    },
    {
      role: '产品设计师 II',
      org: 'AppLovin Array',
      place: '北京，后迁至多伦多',
      dates: '2023 – 2025',
      groups: [
        {
          bullets: [
            {
              text: '为三星、T-Mobile 等十余家手机厂商和运营商设计开机引导（OOBE）中的应用推荐流程，每季度覆盖数千万台新机，贡献百万美元级营收。',
            },
            {
              text: '围绕应用推荐设计并上线多轮增长实验，其中应用合集方案将应用安装量提升 10.6%。',
            },
          ],
        },
      ],
    },
    {
      role: '资深 UX 设计师',
      org: '小米',
      place: '北京',
      dates: '2021 – 2023',
      groups: [
        {
          label: '设计系统与规范',
          bullets: [
            {
              text: '主导面向 7 亿用户的 MIUI 设计系统 2.0，带领 7 人设计团队，协同 6 名 SDK 工程师重写并统一组件规范，引入 design token。',
            },
            {
              text: '协同国际化团队制定多语言设计规范，指导 20 多个业务团队完成本地化适配：以自适应布局解决文字截断，为配图、图标和色彩建立跨文化使用规则。',
            },
            {
              text: '制定折叠屏设计规范，推动全系统各业务团队完成适配。',
            },
          ],
        },
        {
          label: '锁屏与桌面',
          bullets: [
            {
              text: '负责 MIUI 锁屏编辑器的交互设计：用一套通用编辑框架和双轴画廊导航支撑 3 个模板系列，10 个月交付 40 多个界面。',
            },
            {
              text: '负责 MIUI 14 桌面交互设计，涵盖大图标、大文件夹，以及小组件的连续添加与编辑态规范，方案均通过可用性测试验证。',
            },
            {
              text: '策划并主持 40 人参与的跨部门桌面体验共创工作坊。',
            },
          ],
        },
        {
          label: 'HCI 研究',
          bullets: [
            {
              text: '全流程主导小米首个由设计团队发起的 HCI 研究：招募 40 名被试，测量 144 个触控区域，产出触控热力图、热区设计规范和一款设计走查应用。',
            },
          ],
        },
      ],
    },
    {
      role: 'UX 设计师，人因与 HCI 组',
      org: '华为',
      place: '北京',
      dates: '2020 – 2021',
      groups: [
        {
          bullets: [
            { text: '负责手机、平板、折叠屏三类设备的手势系统与跨设备交互设计。' },
            {
              text: '作为发明人参与跨设备交互方向的专利申请。',
            },
          ],
        },
      ],
    },
  ],
  education: [
    {
      degree: '信息艺术设计 硕士',
      school: '清华大学 未来实验室',
      dates: '2017 – 2020',
    },
    { degree: '信息艺术设计 学士', school: '清华大学', dates: '2013 – 2017' },
    {
      degree: '新闻与传播 学士（第二学位）',
      school: '清华大学',
      dates: '2013 – 2018',
    },
    { degree: '交换生', school: '丹麦科灵设计学院' },
  ],
  /* "类别：内容". The page bolds the part before the first colon. */
  skills: [
    '产品设计：移动端、Web 及系统级功能的交互与界面设计',
    '设计系统：组件规范、design token、本地化规范',
    '多设备适配：手机、平板、折叠屏，自适应布局，手势交互',
    '增长与数据：A/B 测试、实验设计、转化与变现分析',
    '用户研究：HCI 研究、可用性测试、共创工作坊',
    'AI 协作开发：前端开发、数据埋点与看板、AI 代理工作流与文档规范',
    '工具：Figma、Claude Code、Cursor、PostHog',
  ],
  languages: ['中文（母语）', '英语（流利）'],
  personal: ['滑雪（双板、单板）', '水肺潜水', '交互装置'],
};

const en: ResumeContent = {
  lang: 'en',
  name: 'Xueyi (Sherry) Zhou',
  nameAlt: '',
  title: 'Product Designer',
  contact: [
    { label: 'Location', value: 'Toronto, Canada' },
    { label: 'Portfolio', value: 'xueyizhou.xyz', href: 'https://xueyizhou.xyz' },
    {
      label: 'Email',
      value: 'sherrrryz@outlook.com',
      href: 'mailto:sherrrryz@outlook.com',
    },
  ],
  labels: {
    profile: 'Summary',
    experience: 'Work Experience',
    education: 'Education',
    skills: 'Skills',
    languages: 'Languages',
    personal: 'Interests',
    back: '← Back to About',
    export: 'Export PDF',
    exportHint: 'Choose "Save as PDF" in the print dialog, paper size A4.',
    todo: 'To add: ',
    switchLabel: '中文',
    switchHref: '/resume?lang=zh',
  },
  /* Identity + years, then proof of scale, then what sets her apart. */
  profile:
    'Product designer with 5+ years at Huawei, Xiaomi and AppLovin, shipping to an OS used by 700 million people and to tens of millions of new phones each quarter. Led a team of 7 to rebuild the MIUI component guidelines and ran growth experiments that lifted app installs by up to 10.6%. Now Head of Product at a reading-app startup, using AI tools to extend the role from design into data analysis, experimentation and production front-end code, and building an AI-assisted development workflow that runs from spec to store release.',
  jobs: [
    {
      role: 'Head of Product',
      org: 'Karmaplot · JuVon Holdings Limited',
      dates: 'May 2026 – Present',
      groups: [
        {
          bullets: [
            {
              text: 'Own the funnel for Karmaplot, a novel reading app, from TikTok ads through app install to payment, designing experiments on conversion and monetization data to raise the paid conversion rate.',
            },
            {
              text: 'Work directly in the codebase with AI coding tools: ship production front-end pull requests and build the event tracking and analytics dashboards behind each experiment.',
            },
          ],
        },
      ],
    },
    {
      role: 'Product Designer II',
      org: 'AppLovin Array',
      place: 'Beijing, then Toronto',
      dates: '2023 – 2025',
      groups: [
        {
          bullets: [
            {
              text: 'Designed OOBE app discovery flows for Samsung, T-Mobile and a dozen other OEM and carrier partners, reaching tens of millions of new phones a quarter and seven-figure USD revenue.',
            },
            {
              text: 'Shipped multiple rounds of growth experiments on app recommendations. The app bundle variant lifted app installs 10.6%.',
            },
          ],
        },
      ],
    },
    {
      role: 'Senior UX Designer',
      org: 'Xiaomi',
      place: 'Beijing',
      dates: '2021 – 2023',
      groups: [
        {
          label: 'Design system & guidelines',
          bullets: [
            {
              text: 'Led MIUI Design System 2.0 for 700 million users, heading a design team of 7 and working with 6 SDK engineers to rewrite and unify the component guidelines and introduce design tokens.',
            },
            {
              text: 'Wrote multilingual design guidelines with the internationalization team and guided 20+ business teams through localization: adaptive layouts that prevent text truncation, and cross-cultural rules for imagery, icons and color.',
            },
            {
              text: 'Set the foldable-screen design guidelines and drove their adoption by business teams across the OS.',
            },
          ],
        },
        {
          label: 'Lock screen & desktop',
          bullets: [
            {
              text: 'Designed the interaction for the MIUI lock screen editor: one editing framework and a two-axis gallery for 3 template families, 40+ screens in 10 months.',
            },
            {
              text: 'Delivered desktop interaction design for MIUI 14, including large icons and folders, continuous widget adding and widget edit-mode specs, validated through usability tests.',
            },
            {
              text: 'Designed and facilitated a 40-person co-creation workshop across departments on the desktop experience.',
            },
          ],
        },
        {
          label: 'HCI research',
          bullets: [
            {
              text: 'Ran Xiaomi’s first design-led HCI study end to end, mapping 144 touch zones with 40 participants into heatmaps, hot zone guidelines and an audit app.',
            },
          ],
        },
      ],
    },
    {
      role: 'UX Designer, Human Factors and HCI Group',
      org: 'Huawei',
      place: 'Beijing',
      dates: '2020 – 2021',
      groups: [
        {
          bullets: [
            {
              text: 'Designed gesture systems and cross-device interaction for 3 form factors: phones, tablets and foldables.',
            },
            {
              text: 'Named inventor on patent applications for cross-device interaction.',
            },
          ],
        },
      ],
    },
  ],
  education: [
    {
      degree: 'MA, Information Art and Design',
      school: 'Tsinghua University, The Future Laboratory',
      dates: '2017 – 2020',
    },
    {
      degree: 'BA, Information Art and Design',
      school: 'Tsinghua University',
      dates: '2013 – 2017',
    },
    {
      degree: 'BA, Journalism and Communication (dual degree)',
      school: 'Tsinghua University',
      dates: '2013 – 2018',
    },
    { degree: 'Exchange Program', school: 'Design School Kolding, Denmark' },
  ],
  /* "Category: items". The page bolds the part before the first ": ".
     Each item traces to a bullet above: nothing is listed that the
     experience section does not show her doing. */
  skills: [
    'Product design: UX/UI for mobile apps, web and OS-level features',
    'Design systems: component guidelines, design tokens, localization rules',
    'Multi-device: phone, tablet, foldable; adaptive layout, gestures',
    'Growth and data: A/B testing, experiment design, conversion and monetization analysis',
    'Research: HCI studies, usability testing, co-creation workshops',
    'AI-assisted development: front-end development, event tracking and dashboards, AI agent workflows and documentation standards',
    'Tools: Figma, Claude Code, Cursor, PostHog',
  ],
  languages: ['Chinese (native)', 'English (fluent)'],
  personal: ['Skiing and snowboarding', 'Scuba diving', 'Interactive installations'],
};

export const RESUME = { en, zh } as const;
