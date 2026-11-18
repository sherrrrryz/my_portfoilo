import type { Slide } from "./slideData";

/* Chinese edition of the deck. Mirrors `slides` in slideData.ts one to one:
   same ids, same order, same block types and media, only the text differs.
   When a slide is added, removed or reordered there, do the same here.

   The Chinese is written, not translated: speaker notes are in a spoken
   register (the way the talk would actually be given), on-slide copy is
   short written Chinese. Keep it that way when editing. */
export const slidesZh: Slide[] = [
  {
    id: "cover",
    title: "个性化锁屏编辑",
    sectionNumber: 0,
    speakerNotes:
      "今天想跟大家聊的这个项目，是我在小米做的个性化锁屏编辑。\n先简单说下背景：小米是全球头部的手机厂商，全球月活大概有 7.5 亿。\n如封面上看到的，这个项目做的是锁屏上的模版编辑。我负责的是整套编辑体验，也就是用户怎么逛模版、怎么改成自己喜欢的样子、最后怎么用上。",
    content: [],
  },
  {
    id: "background",
    title: "项目背景",
    sectionNumber: 1,
    speakerNotes:
      "苹果是在 2022 年 6 月发布锁屏个性化的。它一发，这件事基本就成了行业里谁都绕不开的方向，小米肯定要跟上。\n但我们不想只是跟上。我们希望做得比它更好，也更有小米自己的特色。",
    content: [
      { type: "heading", text: "项目背景" },
      {
        type: "paragraph",
        text: "2022 年 6 月苹果发布锁屏个性化之后，这成了整个行业绕不开的方向。小米要跟上，但不想只是跟上。",
      },
      {
        type: "image",
        src: "/lockscreen/1-1.png",
        alt: "苹果 iOS 16 锁屏个性化功能发布",
      },
    ],
  },
  {
    id: "role",
    title: "我的角色与协作",
    sectionNumber: 2,
    speakerNotes:
      "说一下团队。我们有 1 位设计负责人、2 位产品经理、6 位主题视觉设计师，还有 1 位 UI 设计师。整个编辑体验这块，UX / 产品设计师只有我一个人。\n模版本身的视觉不是我做的，那部分是主题视觉设计师在负责。\n我是 2022 年 10 月底正式接手的，之后大概花了 10 个月，陆续把方案交付给研发。",
    content: [
      { type: "heading", text: "我的角色与协作" },
      { type: "subheading", text: "2022 年 10 月 – 2023 年 8 月" },
      {
        type: "paragraph",
        text: "团队里只有我一位 UX / 产品设计师，编辑体验由我独立负责：编辑流程、导航结构、核心交互方式。",
      },
      {
        type: "teamChart",
        members: [
          { count: 1, label: "设计负责人" },
          { count: 2, label: "产品经理" },
          { count: 6, label: "主题视觉设计师" },
          { count: 1, label: "UX / 产品设计师", highlight: true },
          { count: 1, label: "UI 设计师" },
        ],
      },
    ],
  },
  {
    id: "brainstorming",
    title: "前期：脑爆",
    sectionNumber: 3,
    speakerNotes:
      "项目最早是从一场脑爆开始的。这场脑爆是我设计和组织的。\n我们先让大家做 moodboard 找感觉，然后用接力式脑爆热身，快速把想法铺开，最后现场投票，选出大家最看好的方向。\n最后定下来两个方向：\n第一，锁屏模版要做得质量高、更有艺术感。\n第二，锁屏上的信息要更实时、更贴合场景，而且用户可以自己高度定制。",
    content: [
      { type: "heading", text: "前期：脑爆" },
      { type: "subheading", text: "由我设计并组织的前期脑爆" },
      { type: "paragraph", text: "先用 moodboard 找感觉，再用接力式脑爆把想法快速铺开，最后现场投票选方向。最终定下两个方向：" },
      {
        type: "bullets",
        items: [
          "高质量、更有艺术感的锁屏模版",
          "更实时、更贴合场景、可高度自定义的锁屏信息",
        ],
      },
      {
        type: "image",
        src: "/lockscreen/1-2.png",
        alt: "脑爆活动的草图和 moodboard",
      },
    ],
  },
  {
    id: "problems",
    title: "我看到的问题",
    sectionNumber: 4,
    speakerNotes:
      "这些就是那 6 位主题视觉设计师做出来的模版。\n除了模版，他们还带来了两种壁纸效果：一个是分层效果，一个是玻璃效果。\n我第一次看到这些稿子的时候，心里就一个想法：这么好看的东西，我得想尽办法让用户轻轻松松就能玩起来。\n所以还没开始画方案，我就已经看到了几个难题。第一，这些模版每个都长得不一样，怎么用一套编辑框架把它们都接住？第二，模版这么多，用户会不会挑花眼，要不要给一个明确的默认选项？第三，怎么让这些模版真的好上手，想试就能试，想改就能改？",
    content: [
      { type: "heading", text: "我看到的问题" },
      {
        type: "imageDual",
        images: [
          {
            src: "/lockscreen/1-3.png",
            alt: "早期概念中发现的问题",
          },
          {
            src: "/lockscreen/1-4.png",
            alt: "设计目标陈述",
          },
        ],
      },
      {
        type: "bullets",
        items: [
          "一套框架接住所有模版：每个模版长得都不一样，编辑器却只能有一套。",
          "容易挑花眼：模版太多又没有默认项，用户不知道从哪儿开始。",
          "好东西没人发现：选项一多，不爱折腾的用户可能根本看不到后面的内容。",
        ],
      },
    ],
  },
  {
    id: "research",
    title: "第一步：调研",
    sectionNumber: 5,
    speakerNotes:
      "为了把问题看清楚，我先做了竞品分析。苹果的体验做得很精致，这点没话说，但我也看到了几个可以做得更好的地方。\n第一，新模版很难被看到。用户得先点右下角那个“+”，才能开始逛。\n第二，大家可以看到，模版的缩略图很小，细节根本看不清。\n第三，如果我只是想换个好看的锁屏，并不想细调，整个流程还是很长，最少也要 6 步。\n最后一点，模版之间是不通的。每个模版只能在它自己那几张壁纸里选，不能随便换成我想要的壁纸。这也是为什么不同模版底部的编辑选项都不一样。",
    content: [
      { type: "heading", text: "第一步：调研" },
      { type: "subheading", text: "竞品分析 · Apple iOS 16" },
      {
        type: "paragraph",
        text: "苹果的体验很精致，但仍有四处可以做得更好。",
      },
      {
        type: "image",
        src: "/lockscreen/1-5.png",
        alt: "竞品分析矩阵",
      },
      {
        type: "bullets",
        items: [
          "新模版不容易被看到：要先点右下角的“+”才能开始浏览。",
          "预览看不清：缩略图太小，细节难以分辨。",
          "应用步骤长：即使不做任何调整，换一个模版也至少要 6 步。",
        ],
      },
      {
        type: "image",
        src: "/lockscreen/1-6.png",
        alt: "Apple iOS 16 深入分析的发现",
      },
      {
        type: "bullets",
        items: [
          "模版之间不互通：每个模版只能用自带的几张壁纸，不能自由更换，各模版底部的编辑选项也因此各不相同。",
        ],
      },
    ],
  },
  {
    id: "breakdown",
    title: "第二步：拆解模版",
    sectionNumber: 6,
    speakerNotes:
      "接下来，我把所有模版能改的东西全部列出来，做成了一张表。这样一眼就能看出哪些是大家都有的，哪些是某个模版独有的。\n比如这个模版，每一行文字的内容用户都可以自己改。\n这张表看起来挺复杂的，但整理完我发现，其实所有的编辑项归根到底就两类。一类跟壁纸有关，比如换壁纸、裁剪壁纸。另一类跟文字有关，比如换字体、换颜色。\n这个“两层”的思路，后来就成了整个编辑框架的基础。",
    content: [
      { type: "heading", text: "第二步：拆解模版" },
      { type: "subheading", text: "可编辑项总表 · 两层模型" },
      {
        type: "paragraph",
        text: "我把所有模版能改的内容列成一张表，看清哪些是共有的，哪些是某个模版独有的。",
      },
      {
        type: "image",
        src: "/lockscreen/1-7.png",
        alt: "各模版可编辑元素矩阵",
        caption: "所有模版的可编辑项总表",
      },
      {
        type: "paragraph",
        text: "表格看着复杂，其实所有编辑项只分两类：壁纸相关（更换、裁剪、玻璃效果、分层效果）和文字相关（字体、颜色、内容、签名）。这个两层模型成了编辑框架的基础。",
      },
      {
        type: "image",
        src: "/lockscreen/1-8.png",
        alt: "两层模型示意图",
        caption: "两层模型：壁纸层 + 文字层",
      },
    ],
  },
  {
    id: "data-alignment",
    title: "第三步：数据与对齐",
    sectionNumber: 7,
    speakerNotes:
      "我还找产品经理一起看了数据。数据印证了一件事：壁纸是用户最愿意表达自己审美的地方。\n有 53% 的用户用的不是默认壁纸，而且平均下来，每个人每个月要换 5.18 次锁屏壁纸。\n所以我们就定了：小米的锁屏编辑，要以壁纸编辑为核心。",
    content: [
      { type: "heading", text: "第三步：数据与对齐" },
      { type: "subheading", text: "与产品经理对齐 · 壁纸是核心" },
      {
        type: "paragraph",
        text: "数据显示，在所有个性化选项里，锁屏壁纸排第一。53% 的用户不用默认壁纸，平均每人每月更换锁屏壁纸 5.18 次。壁纸是用户最愿意表达审美的地方，编辑体验自然要围绕它来做。",
      },
      {
        type: "image",
        src: "/lockscreen/1-9.png",
        alt: "与产品经理对齐数据",
        caption: "共识：编辑体验以壁纸为核心",
      },
    ],
  },
  {
    id: "strategy",
    title: "产品策略与设计目标",
    sectionNumber: 8,
    speakerNotes:
      "有了前面这些发现，我们先定了三个设计目标。\n第一个叫“一眼心动”：用户一进编辑页，马上就能看到好看的东西。\n第二个叫“快速应用”：有些用户不想折腾，那就让他能很快挑一个好看的现成样式，直接用上。\n第三个叫“通用框架”：不管哪个模版，编辑的方式都是一样的，用户学一次就够了。\n围绕这三个目标，我们又定了三条产品策略：\n主推经典锁屏和菱形时间这两个样式，每个都配好几套现成的预设，方便用户直接用。\n杂志作为我们的特色样式，后面跟着研发进度一点点扩充。\n还有就是，不管用户选哪个模版，字体、颜色、壁纸、壁纸效果，这几样基础的东西一定都能改。",
    content: [
      { type: "heading", text: "产品策略与设计目标" },
      { type: "subheading", text: "设计目标" },
      {
        type: "bullets",
        items: [
          "一眼心动：一进编辑页，就能看到新模版好看在哪儿。",
          "快速应用：不想折腾的用户，也能很快挑到一个好看的现成样式直接用上。",
          "通用框架：所有模版的编辑方式一致、好学、可预期，学一次就够。",
        ],
      },
      { type: "subheading", text: "产品策略：" },
      {
        type: "paragraph",
        text: "主推经典锁屏和菱形时间两个样式，各配多套现成预设，方便直接应用。",
      },
      {
        type: "image",
        src: "/lockscreen/1-12.png",
        alt: "杂志样式",
      },
      {
        type: "image",
        src: "/lockscreen/1-10.png",
        alt: "产品策略总览",
      },
      {
        type: "paragraph",
        text: "杂志作为特色样式，随研发进度逐步扩充。",
      },
      {
        type: "image",
        src: "/lockscreen/1-11.png",
        alt: "经典锁屏和菱形时间样式",
      },
      {
        type: "paragraph",
        text: "无论选哪个模版，基础的编辑项都在：改字体和颜色、换壁纸、开启壁纸效果（玻璃和分层）。",
      },
      {
        type: "image",
        src: "/lockscreen/1-13.png",
        alt: "各模版通用的基础编辑能力",
      },
    ],
  },
  {
    id: "four-core-flows",
    title: "四个核心流程",
    sectionNumber: 9,
    speakerNotes:
      "到了具体方案，我把整个体验拆成了四个流程。今天我重点讲第二个，模版浏览和快速应用。因为这一块最能决定体验好不好玩，做起来也最有挑战。",
    content: [
      { type: "heading", text: "四个核心流程" },
      {
        type: "flowCards",
        title: "搭整体方案时，我把体验拆成了四个核心流程：",
        cards: [
          { number: 1, label: "入口与触发" },
          { number: 2, label: "模版浏览与快速应用", highlight: true },
          { number: 3, label: "模版自定义" },
          { number: 4, label: "我的锁屏管理" },
        ],
      },
    ],
  },
  {
    id: "first-impression",
    title: "理想的第一印象",
    sectionNumber: 10,
    speakerNotes:
      "我们心里理想的第一印象是这样的：用户一进来，就能很自然、很沉浸地开始逛新的锁屏。",
    content: [
      { type: "heading", text: "理想的第一印象" },
      { type: "heroText", text: "一进编辑页，\n就能沉浸地逛起新的锁屏。" },
    ],
  },
  {
    id: "cross-nav-detail",
    title: "从我的锁屏开始",
    sectionNumber: 11,
    speakerNotes:
      "但同时，苹果有一个设计我们非常认同：长按锁屏进入编辑的时候，第一眼看到的是“我的锁屏”。这样用户马上就知道“我现在在哪儿”，心里有底。",
    content: [
      { type: "heading", text: "从我的锁屏开始" },
      {
        type: "paragraph",
        text: "苹果的做法我们很认同：长按锁屏进入编辑，先落在“我的锁屏”。用户一进来就知道自己在哪儿。",
      },
      {
        type: "image",
        src: "/lockscreen/1-16.png",
        alt: "我的锁屏入口",
      },
    ],
  },
  {
    id: "panel-switching",
    title: "关键问题",
    sectionNumber: 12,
    speakerNotes:
      "所以问题就来了：\n怎么让用户一进来就清楚自己在哪儿，同时又能马上开始逛别的锁屏？",
    content: [
      { type: "heading", text: "关键问题" },
      { type: "heroText", text: "怎么让用户一进来就清楚自己在哪儿，\n同时又能马上开始逛别的锁屏？" },
    ],
  },
  {
    id: "complete-flow",
    title: "十字导航",
    sectionNumber: 13,
    speakerNotes:
      "我们最后选的，是一个很多设计师都觉得不太好驾驭的交互：十字导航。\n首先跟苹果一样，用户进来先看到自己正在用的锁屏。往下一滑，就能看到其他模版了。\n左右滑，是看同一个样式下的不同预设。上下滑，是在不同样式之间切换。\n右上角一直有一个“应用”按钮，看中了，几秒钟就能用上。",
    content: [
      { type: "heading", text: "十字导航" },
      {
        type: "paragraph",
        text: "我们选了十字导航：进来先看到正在用的锁屏，上下滑切换不同样式，左右滑浏览同一样式下的预设。右上角的“应用”按钮一直都在，看中就能用。",
      },
      { type: "lockscreenDemo" },
    ],
  },
  {
    id: "usability-method",
    title: "可用性测试",
    sectionNumber: 14,
    speakerNotes:
      "十字导航好处很明显，但说实话，我们也很担心用户会在里面迷路。所以上线之前一定要先验证。\n我用 ProtoPie 做了一个很接近真实产品的原型，找了 16 位公司内部的同事来做任务，从进入编辑，一直到把新锁屏用上，整个流程走一遍。\n这次定性测试从头到尾是我一个人做的，成本很低。",
    content: [
      { type: "heading", text: "可用性测试" },
      {
        type: "infoCard",
        layout: "bento",
        items: [
          { label: "测试目的", icon: "goal", span: "large", value: "十字导航容易让人**迷路**。\n上线前要先验证整体结构有没有可用性问题" },
          { label: "参与者", icon: "participants", bigNumber: "16", value: "随机邀请的公司内部同事" },
          { label: "方法", icon: "method", highlight: true, value: "定性可用性测试", tags: ["一对一主持", "任务式", "ProtoPie"] },
          { label: "任务范围", icon: "scope", highlight: true, bullets: ["进入编辑", "浏览模版", "自定义一个模版", "应用新锁屏"] },
          { label: "测试过程", icon: "process", steps: [{ icon: "observe", title: "观察", subtitle: "任务完成情况" }, { icon: "guide", title: "引导", subtitle: "卡住时才提示" }, { icon: "ask", title: "追问", subtitle: "了解原因" }, { icon: "collect", title: "收集", subtitle: "问卷数据" }], banner: "高保真原型 · 一个人完成 · 成本很低" },
        ],
      },
    ],
  },
  {
    id: "usability-results",
    title: "可用性测试结果",
    sectionNumber: 15,
    speakerNotes:
      "这次测试帮了很大的忙。大部分人都能把任务做完，很多人还说这个交互很酷、很好玩。\n但我们也发现一个问题：有些用户压根没注意到页面上的标题。没看到标题，他们就搞不清上下滑和左右滑到底是什么关系。\n针对这个问题，我们做了两处改动。\n第一，把标题换了位置，重新设计了一下，让它更显眼，信息也更清楚。\n第二，加了一点动效来帮用户理解“系列”这个概念。当你滑到下一行的时候，模版会从中间往两边展开，这样一看就知道它们是一组的。",
    content: [
      { type: "heading", text: "可用性测试结果" },
      { type: "paragraph", text: "所有参与者都完成了核心任务，对这套交互的评价也很正面。但测试暴露了一个关键问题：" },
      {
        type: "bullets",
        items: [
          "有几位参与者没注意到页面标题，因此看不懂十字导航的结构。",
          "没有标题提示，他们分不清上下滑（切换样式）和左右滑（同一样式内切换）的区别。",
        ],
      },
      { type: "subheading", text: "改进一：重新设计标题位置" },
      { type: "paragraph", text: "调整标题的位置和样式，让它更显眼，信息更清楚。" },
      {
        type: "image",
        src: "/lockscreen/1-19.png",
        alt: "重新设计标题位置，让导航更清晰",
      },
      { type: "subheading", text: "改进二：用动效提示“系列”" },
      { type: "paragraph", text: "加入轻微的动效帮用户理解“系列”：滑到下一行时，模版从中间向两边展开，一看就知道它们是一组。" },
      {
        type: "video",
        provider: "screenpal",
        videoId: "cOeDFMnZ7xt",
        caption: "动效演示：模版展开，提示它们属于同一系列",
      },
    ],
  },
  {
    id: "final-shots",
    title: "最终设计",
    sectionNumber: 16,
    speakerNotes:
      "最后给大家看一下上线的界面。\n这是编辑首页，用户在这里逛模版、应用模版。\n这是自定义的流程，可以调字体、调颜色、换内容。\n除了这些，我们还设计了其他入口，比如从设置里进来，还有第一次使用时的引导。\n最后，整套体验我们也适配到了折叠屏和平板上。",
    content: [
      { type: "heading", text: "最终设计" },
      { type: "subheading", text: "已上线 · 2023 年 10 月" },
      {
        type: "paragraph",
        text: "最终设计随 MIUI 14.5 上线，支持小米 13 系列及以上机型。整个编辑流程共设计并交付了 40 多个界面。",
      },
      {
        type: "imageDual",
        images: [
          {
            src: "/lockscreen/1-20.png",
            alt: "锁屏编辑首页",
            caption: "编辑首页：浏览和应用模版。",
          },
          {
            src: "/lockscreen/1-21.png",
            alt: "自定义编辑页",
            caption: "自定义流程：调字体、调颜色、换内容。",
          },
        ],
      },
      {
        type: "imageDual",
        images: [
          {
            src: "/lockscreen/1-22.png",
            alt: "其他入口和首次使用引导",
            caption: "其他入口（如设置），以及首次使用的引导。",
          },
          {
            src: "/lockscreen/1-23.png",
            alt: "折叠屏手机和平板适配",
            caption: "整套体验适配折叠屏和平板。",
          },
        ],
      },
    ],
  },
  {
    id: "closing",
    title: "结语",
    sectionNumber: 17,
    hidden: true,
    speakerNotes:
      "这个项目让我明白一件事：用户量这么大的产品，面对的是各种各样的人。有人只想点一下就搞定，也有人恨不得每个像素都自己调。两层模型加上一步步展开的设计，让这两种人都能用得舒服。",
    content: [
      { type: "heading", text: "结语" },
      { type: "subheading", text: "这个项目教会我的事" },
      {
        type: "paragraph",
        text: "做小米锁屏编辑器，让我学到了很多：怎么在简单和强大之间找平衡，怎么在 7.5 亿用户面前既快又不出错，以及怎么让一个很大的跨团队围绕同一个设计方向往前走。",
      },
      {
        type: "bullets",
        items: [
          "2023 年 10 月上线，覆盖 7.5 亿以上月活用户",
          "上线首月，模版使用率超出目标 40%",
          "平均自定义时长 1.8 分钟（目标：2 分钟以内）",
          "成为 MIUI 14.5 宣传中排在第一位的亮点功能",
        ],
      },
      {
        type: "collapsible",
        title: "接下来想改进的地方",
        content:
          "如果时间更充裕，我会推动三件事：\n\n1. 智能推荐：根据壁纸的主色调，主动推荐搭配的样式，省去用户反复尝试的时间。\n\n2. 模版分享：做一个社区，用户可以发布和浏览别人的锁屏方案。类似壁纸市场，但分享的是一整套配置。\n\n3. 异常情况的处理：用户用到的小组件数据来源失效时（比如第三方应用被卸载），编辑器现在会直接显示异常。应该有一个体面的兜底和恢复流程。",
      },
    ],
  },
  {
    id: "post-launch-video",
    title: "上线视频",
    sectionNumber: 18,
    speakerNotes:
      "这是上线之后小米官方发布的视频。",
    content: [
      { type: "heading", text: "上线视频" },
      {
        type: "paragraph",
        text: "小米官方视频：先展示三款主打的锁屏样式，再演示自定义体验，字体、壁纸、样式都可以自己调。",
      },
      {
        type: "video",
        provider: "youtube",
        videoId: "euAAj9Ag9bw",
        caption: "小米锁屏编辑器完整演示（2023 年 10 月）",
      },
    ],
  },
];
