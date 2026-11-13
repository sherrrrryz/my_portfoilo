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
  nameAlt: 'Xueyi (Sherry) Zhou',
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
  /* Kept in step with the English entry below, sentence for sentence. */
  profile:
    '产品设计师，5 年以上经验，先后任职于华为、小米和 AppLovin，作品覆盖 7 亿人使用的操作系统和每季度数千万台新手机。主导过 7+ 团队共用的设计系统，也做过让应用分发提升 10.6% 的增长实验。现兼任一家小说阅读应用初创公司的产品负责人，借助 AI 工具把工作范围从设计拓展到数据分析、实验和线上前端代码。',
  jobs: [
    {
      role: '产品负责人（兼职）',
      org: 'Karmaplot · JuVon Holdings Limited',
      dates: '2026.05 – 至今',
      groups: [
        {
          bullets: [
            {
              text: '负责初创公司小说阅读应用 Karmaplot 的产品，把视频流量转化为读者和收入。',
              todo: '补一个结果数字：转化率、收入或流量规模',
            },
            {
              text: '基于视频到 app 的转化与变现数据设计并推进产品实验，用实验结果决定后续迭代。',
              todo: '补实验数量或其中一个实验的提升幅度',
            },
            {
              text: '借助 AI 编程工具把工作延伸到设计之外：提交线上前端代码 PR，并搭建每个实验所需的埋点和数据看板。',
            },
          ],
        },
      ],
    },
    {
      role: '产品设计师 II',
      org: 'AppLovin',
      place: '北京，后迁至多伦多',
      dates: '2023 – 2025',
      groups: [
        {
          bullets: [
            {
              text: '通过 4 条实验线，在 1000 万+ 新设备上把应用分发提升 10.6%，人均净安装量从 0.37 提升到 0.47，最优合集方案的点击率达 75%。',
            },
            {
              text: '为三星、T-Mobile 等十余家 OEM 设计 OOBE 应用发现流程，每季度触达数千万台新手机，带来七位数营收。',
            },
          ],
        },
      ],
    },
    {
      role: 'UX 设计师，晋升为资深 UX 设计师',
      org: '小米',
      place: '北京',
      dates: '2021 – 2023',
      groups: [
        {
          label: '设计系统与规范',
          bullets: [
            {
              text: '主导 MIUI 设计系统 2.0，服务 7 亿人使用的操作系统；推动 7+ 产品团队和 6 名 SDK 工程师统一组件规则，并引入 design token。',
            },
            {
              text: '把规范小组从 2 人扩充到 7 人，同时重写全套组件规范。',
            },
            {
              text: '制定多语言规范并指导 20+ 业务团队完成本地化：用自适应布局避免文字截断，为图像、图标和色彩建立跨文化规则。',
            },
            {
              text: '制定折叠屏设计规范，全系统各业务团队统一采用。',
            },
          ],
        },
        {
          label: '锁屏与桌面',
          bullets: [
            {
              text: '作为唯一的 UX 设计师，10 个月内交付 40+ 个锁屏编辑器界面，覆盖经典、杂志、菱形 3 个模板系列，随 Xiaomi HyperOS 1 发布。',
            },
            {
              text: '完成 MIUI 14 桌面交互设计，包括大图标与大文件夹、连续添加小组件和小组件编辑态规范，并通过可用性测试验证。',
            },
            {
              text: '设计并主持 40 人参与的跨部门桌面体验共创工作坊。',
            },
          ],
        },
        {
          label: 'HCI 研究',
          bullets: [
            {
              text: '端到端完成小米首个由设计团队发起的 HCI 研究：40 名参与者、144 个触控区域，产出热力图、热区设计规范和一款走查应用。',
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
            { text: '为手机、平板、折叠屏 3 类设备设计手势系统与跨设备交互。' },
            {
              text: '撰写跨设备交互功能专利，并完成一份 34 页的光标用户研究报告。',
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
    { degree: '交换项目', school: '丹麦科灵设计学院' },
  ],
  /* "类别：内容". The page bolds the part before the first colon. */
  skills: [
    '产品设计：交互设计，移动应用、Web 和系统级功能的 UX/UI',
    '设计系统：组件规范、design token、本地化规则',
    '多设备：手机、平板、折叠屏，自适应布局，手势',
    '增长与数据：A/B 测试、实验设计、转化与变现分析',
    '用户研究：HCI 研究、可用性测试、共创工作坊',
    'AI 辅助开发：线上前端代码 PR、埋点、数据看板',
    '工具：Figma、Claude Code、Cursor、PostHog',
  ],
  languages: ['中文（母语）', '英语（流利）'],
  personal: ['双板与单板滑雪', '水肺潜水', '交互装置'],
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
    'Product designer with 5+ years at Huawei, Xiaomi and AppLovin, shipping to an OS used by 700 million people and to tens of millions of new phones each quarter. Led a design system adopted by 7+ teams and growth experiments that lifted app distribution 10.6%. Now part-time Head of Product at a reading-app startup, using AI tools to extend the role from design into data analysis, experimentation and production front-end code.',
  jobs: [
    {
      role: 'Head of Product (part-time)',
      org: 'Karmaplot · JuVon Holdings Limited',
      dates: 'May 2026 – Present',
      groups: [
        {
          bullets: [
            {
              text: 'Lead product for Karmaplot, a novel reading app at an early-stage startup, converting video traffic into app readers and revenue.',
              todo: 'one result number: conversion rate, revenue or traffic scale',
            },
            {
              text: 'Design and run product experiments from video-to-app conversion and monetization data, using the results to set what ships next.',
              todo: 'number of experiments, or the lift from one of them',
            },
            {
              text: 'Use AI coding tools to work beyond design: ship production front-end pull requests and build the event tracking and analytics dashboards behind each experiment.',
            },
          ],
        },
      ],
    },
    {
      role: 'Product Designer II',
      org: 'AppLovin',
      place: 'Beijing, then Toronto',
      dates: '2023 – 2025',
      groups: [
        {
          bullets: [
            {
              text: 'Lifted app distribution 10.6% and net installs per user from 0.37 to 0.47 across 10M+ new devices by shipping 4 experiment tracks, with 75% click-through on the winning bundle.',
            },
            {
              text: 'Designed OOBE app discovery flows for Samsung, T-Mobile and a dozen other OEMs, reaching tens of millions of new phones a quarter and seven-figure revenue.',
            },
          ],
        },
      ],
    },
    {
      role: 'UX Designer, promoted to Senior UX Designer',
      org: 'Xiaomi',
      place: 'Beijing',
      dates: '2021 – 2023',
      groups: [
        {
          label: 'Design system & guidelines',
          bullets: [
            {
              text: 'Led MIUI Design System 2.0 for an OS used by 700 million people, aligning 7+ product teams and 6 SDK engineers on shared component rules and introducing design tokens.',
            },
            {
              text: 'Grew the guideline team from 2 to 7 people while rebuilding the full set of component guidelines.',
            },
            {
              text: 'Guided 20+ business teams through localization with multilingual guidelines: adaptive layouts that prevent text truncation, and cross-cultural rules for imagery, icons and color.',
            },
            {
              text: 'Set the foldable-screen design guidelines adopted by every business team across the OS.',
            },
          ],
        },
        {
          label: 'Lock screen & desktop',
          bullets: [
            {
              text: 'Shipped 40+ lock screen editor screens in 10 months as the sole UX designer, covering 3 template families (Classic, Magazine, Rhombus) for the Xiaomi HyperOS 1 launch.',
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
              text: 'Authored patents for cross-device interaction features and a 34-page user research report on cursor behavior.',
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
    'Product design: interaction design, UX/UI for mobile apps, web and OS-level features',
    'Design systems: component guidelines, design tokens, localization rules',
    'Multi-device: phone, tablet, foldable; adaptive layout, gestures',
    'Growth and data: A/B testing, experiment design, conversion and monetization analysis',
    'Research: HCI studies, usability testing, co-creation workshops',
    'AI-assisted development: production front-end PRs, event tracking, analytics dashboards',
    'Tools: Figma, Claude Code, Cursor, PostHog',
  ],
  languages: ['Chinese (native)', 'English (fluent)'],
  personal: ['Skiing and snowboarding', 'Scuba diving', 'Interactive installations'],
};

export const RESUME = { en, zh } as const;
