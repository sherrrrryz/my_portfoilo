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
  profile:
    '产品设计师，5 年以上经验，先后任职于华为、小米和 AppLovin，现兼任小说阅读应用 Karmaplot 的产品负责人。在 7 亿人使用的操作系统上主导过设计系统和锁屏编辑器，也在以营收为标准的 A/B 实验中做过增长设计，最优方案带来 10.6% 的分发提升。能从数据分析、实验设计一路做到 UI/UX 和前端上线。',
  jobs: [
    {
      role: '产品负责人（兼职）',
      org: 'Karmaplot · JuVon Holdings Limited',
      dates: '2026.05 – 至今',
      groups: [
        {
          bullets: [
            {
              text: '帮助初创团队把视频流量转化为小说阅读 app 的读者并实现变现，一人承担数据分析、实验设计、产品 UI/UX 设计和前端开发。',
              todo: '补一个结果数字：转化率、收入或流量规模',
            },
            {
              text: '分析视频到 app 的转化与变现数据，据此设计并推进产品实验，用结果决定下一步做什么。',
              todo: '补实验数量或其中一个实验的提升幅度',
            },
            {
              text: '独立完成产品 UI/UX 设计并参与前端开发，把方案直接做到上线。',
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
              text: '设计随三星、T-Mobile 等十余家 OEM 出厂的 OOBE 应用发现流程，每季度触达数千万台新开箱手机，贡献七位数营收。',
            },
            {
              text: '推进 4 条实验线，其中最优方案在 1000 万+ 新设备上带来 10.6% 的分发提升和 75% 的合集点击率，人均净安装量从 0.37 提升到 0.47。',
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
              text: '主导 MIUI 设计系统 2.0，覆盖 7+ 团队，服务 7 亿人使用的操作系统；把规范小组从 2 人扩充到 7 人，与 6 名 SDK 工程师对齐组件规则，重写组件规范并引入 design token。',
            },
            {
              text: '联合国际化与研发团队制定多语言规范：用自适应布局解决文字截断和裁切，为图像、图标和色彩建立跨文化规则，指导 20+ 业务完成本地化。',
            },
            {
              text: '制定折叠屏设计规范与原则，指导全系统各业务团队的折叠屏方案。',
            },
          ],
        },
        {
          label: '锁屏与桌面',
          bullets: [
            {
              text: '作为唯一的 UX 设计师端到端负责 MIUI 锁屏编辑器，10 个月内随 Xiaomi HyperOS 1 交付 40+ 界面，覆盖经典、杂志、菱形三个模板系列。',
            },
            {
              text: '承担桌面团队的日常交互设计与研究：MIUI 14 大图标与大文件夹、连续添加小组件、小组件编辑态规范、可用性测试，以及 3D 小组件个性化探索。',
            },
            {
              text: '设计并组织 40 人参与的跨部门桌面体验共创工作坊。',
            },
          ],
        },
        {
          label: 'HCI 研究',
          bullets: [
            {
              text: '端到端主导小米首个由设计团队发起的 HCI 研究：招募 40 名参与者，测绘 144 个触控区域，产出热力图、热区设计规范和一款走查应用。',
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
            { text: '设计手机、平板和折叠屏上的手势系统与跨设备交互。' },
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
  skills: [
    'AI 辅助开发：独立上线网站、应用、数据可视化和原型',
    '产品设计与 UX/UI 设计',
    '设计系统与 design token',
    '手机、平板、折叠屏、桌面端的自适应与响应式设计',
    '数据指标定义',
    'A/B 测试与实验设计',
    '用户访谈、可用性测试与 HCI 研究',
    '工作坊设计与引导',
    '前端开发：Next.js、React',
    'Figma、ProtoPie、POP',
  ],
  languages: ['中文 / 母语', '英语 / 流利'],
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
    'Product designer with 5+ years at Huawei, Xiaomi and AppLovin, shipping to an OS used by 700 million people and to tens of millions of new phones each quarter. Led a design system adopted by 7+ teams and growth experiments that lifted app distribution 10.6%. Now part-time Head of Product at a reading-app startup, working from data and experiments through UI/UX to shipped front-end code.',
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
              text: 'Cover 4 functions end to end for the founding team: data analysis, experiment design, UI/UX design and front-end development.',
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
  /* "Category: items". The page bolds the part before the first ": ". */
  skills: [
    'Design: product design, UX/UI, interaction design, design systems, design tokens',
    'Platforms: mobile, tablet, foldable, desktop; adaptive and responsive layout',
    'Research: user interviews, usability testing, HCI studies, workshop facilitation',
    'Data: metric definition, A/B testing, experiment design',
    'Build: front-end development (Next.js, React), AI-assisted prototyping',
    'Tools: Figma, ProtoPie, POP',
  ],
  languages: ['Chinese (native)', 'English (fluent)'],
  personal: ['Skiing and snowboarding', 'Scuba diving', 'Interactive installations'],
};

export const RESUME = { en, zh } as const;
