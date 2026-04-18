'use client';

import {
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import {
  Reveal,
  type RevealEffect,
  type RevealMode,
  type RevealTrigger,
} from '../../_story/lib/Reveal';

type Config = {
  mode: RevealMode;
  effect: RevealEffect;
  trigger: RevealTrigger;
  duration: number;
  stagger: number;
  start: string;
  end: string;
  ease: string;
  initialY: number;
  initialBlur: number;
  initialOpacity: number;
  markers: boolean;
  text: string;
};

const DEFAULT_TEXT =
  'It means making something personal at a scale where nothing feels personal.';

const DEFAULTS: Config = {
  mode: 'words',
  effect: 'blur',
  trigger: 'once',
  duration: 0.8,
  stagger: 0.05,
  start: 'top 80%',
  end: 'bottom 60%',
  ease: 'power2.out',
  initialY: 40,
  initialBlur: 8,
  initialOpacity: 0,
  markers: true,
  text: DEFAULT_TEXT,
};

const PRESETS: Record<string, Partial<Config>> = {
  'Apple hero fade': {
    mode: 'element',
    effect: 'fade',
    trigger: 'once',
    duration: 1.2,
    stagger: 0,
    initialOpacity: 0,
    ease: 'power3.out',
  },
  'Word-by-word blur': {
    mode: 'words',
    effect: 'blur',
    trigger: 'once',
    duration: 1.0,
    stagger: 0.06,
    initialBlur: 10,
    initialOpacity: 0,
    ease: 'power2.out',
    start: 'top 80%',
  },
  'Cinematic scrub': {
    mode: 'words',
    effect: 'blur',
    trigger: 'scrub',
    duration: 1,
    stagger: 0.03,
    initialBlur: 6,
    initialY: 20,
    initialOpacity: 0,
    start: 'top bottom',
    end: 'center center',
  },
  'Snappy chars': {
    mode: 'chars',
    effect: 'float',
    trigger: 'once',
    duration: 0.5,
    stagger: 0.015,
    initialY: 20,
    initialOpacity: 0,
    ease: 'back.out(1.7)',
  },
  'Toggle in/out': {
    mode: 'words',
    effect: 'slide',
    trigger: 'toggle',
    duration: 0.6,
    stagger: 0.04,
    initialY: 40,
    initialOpacity: 0,
    start: 'top 75%',
    end: 'bottom 25%',
  },
};

const EASES = [
  'linear',
  'power1.out',
  'power2.out',
  'power3.out',
  'expo.out',
  'back.out(1.7)',
  'circ.out',
];

const STARTS = ['top 90%', 'top 80%', 'top 60%', 'top bottom', 'center center'];
const ENDS = ['bottom 60%', 'bottom 40%', 'bottom top', 'center center', '+=400'];

export default function RevealLab() {
  const [cfg, setCfg] = useState<Config>(DEFAULTS);
  const [replayKey, setReplayKey] = useState(0);

  const update = <K extends keyof Config>(k: K, v: Config[K]) => {
    setCfg((prev) => ({ ...prev, [k]: v }));
    setReplayKey((c) => c + 1);
  };

  const applyPreset = (name: string) => {
    setCfg((prev) => ({ ...prev, ...PRESETS[name] }));
    setReplayKey((c) => c + 1);
  };

  const replay = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.setTimeout(() => setReplayKey((c) => c + 1), 500);
  };

  const resetDefaults = () => {
    setCfg(DEFAULTS);
    setReplayKey((c) => c + 1);
  };

  const code = useMemo(() => buildJsx(cfg), [cfg]);

  return (
    <>
      <div style={layout}>
        <aside style={panel}>
          <div style={{ marginBottom: 16 }}>
            <h1 style={h1Style}>Reveal Lab</h1>
            <p style={helpText}>
              改参数 → 往下滚看右边触发 → 再改再滚。`markers` 保持开着是学 ScrollTrigger
              最快的方式。
            </p>
          </div>

          <Section title="Preset (一键风格)">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {Object.keys(PRESETS).map((name) => (
                <button
                  key={name}
                  onClick={() => applyPreset(name)}
                  style={btnStyle}
                >
                  {name}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Core — Phase 1 三开关">
            <Select
              label="mode"
              value={cfg.mode}
              onChange={(v) => update('mode', v as RevealMode)}
              options={['chars', 'words', 'lines', 'element']}
              hint="把文字切多细：单字 / 单词 / 行 / 整块"
            />
            <Select
              label="effect"
              value={cfg.effect}
              onChange={(v) => update('effect', v as RevealEffect)}
              options={['float', 'blur', 'slide', 'fade']}
              hint="出场方式。float/slide 用 y 位移；blur 用 filter；fade 只动透明度"
            />
            <Select
              label="trigger"
              value={cfg.trigger}
              onChange={(v) => update('trigger', v as RevealTrigger)}
              options={['once', 'scrub', 'toggle']}
              hint="once=到位置播一次；scrub=边滚边播可倒；toggle=进视口播/离开反向"
            />
          </Section>

          <Section title="Timing">
            <Slider
              label="duration (s)"
              value={cfg.duration}
              min={0.1}
              max={2}
              step={0.05}
              onChange={(v) => update('duration', v)}
              hint="动画放多慢。<0.3 锐利 / >1 优雅。scrub 模式里 duration 其实被 end 覆盖"
            />
            <Slider
              label="stagger (s)"
              value={cfg.stagger}
              min={0}
              max={0.3}
              step={0.005}
              onChange={(v) => update('stagger', v)}
              hint="相邻块的间隔。0 = 齐步走；0.1 = 有节奏；0.3 = 慢慢一个个出"
            />
            <Select
              label="ease"
              value={cfg.ease}
              onChange={(v) => update('ease', v)}
              options={EASES}
              hint="速度曲线。linear 匀速；power2.out 常用；back.out 会超一下再回来；expo.out 最后一段很慢"
            />
          </Section>

          <Section title="ScrollTrigger 位置">
            <Select
              label="start"
              value={cfg.start}
              onChange={(v) => update('start', v)}
              options={STARTS}
              hint="元素位置 + 视口位置。'top 80%' = 元素顶部到达视口 80% 高度时触发"
            />
            <Select
              label="end (只 scrub/toggle 用)"
              value={cfg.end}
              onChange={(v) => update('end', v)}
              options={ENDS}
              hint="scrub 结束位置。'+=400' = 从 start 再往下滚 400px"
            />
            <Checkbox
              label="markers (触发线)"
              checked={cfg.markers}
              onChange={(v) => update('markers', v)}
              hint="GSAP 画出的彩色横线标出 start/end 实际位置。学 ScrollTrigger 必开"
            />
          </Section>

          <Section title="初始状态">
            <Slider
              label="initialY (px)"
              value={cfg.initialY}
              min={0}
              max={120}
              step={4}
              onChange={(v) => update('initialY', v)}
              hint="float/slide 的起点偏移量（正值=从下方飞上来）"
            />
            <Slider
              label="initialBlur (px)"
              value={cfg.initialBlur}
              min={0}
              max={20}
              step={1}
              onChange={(v) => update('initialBlur', v)}
              hint="blur effect 的初始模糊度。>12 很梦幻，<4 只是微微"
            />
            <Slider
              label="initialOpacity"
              value={cfg.initialOpacity}
              min={0}
              max={1}
              step={0.05}
              onChange={(v) => update('initialOpacity', v)}
              hint="起始透明度。0 完全不可见；0.2 隐约可见"
            />
          </Section>

          <Section title="Text">
            <textarea
              value={cfg.text}
              onChange={(e) => update('text', e.target.value)}
              rows={3}
              style={textareaStyle}
            />
          </Section>

          <Section title="Actions">
            <button onClick={replay} style={{ ...btnPrimary }}>
              ▶ Replay (滚到顶重播)
            </button>
            <button
              onClick={resetDefaults}
              style={{ ...btnStyle, width: '100%', marginTop: 6 }}
            >
              ↺ Reset defaults
            </button>
          </Section>

          <Section title="Code (可复制)">
            <pre style={codeStyle}>{code}</pre>
          </Section>

          <p style={{ ...helpText, marginTop: 24, fontSize: 11 }}>
            注：任何参数变化都会重建 Reveal 实例（模拟新挂载）。在真实页面里，改参数后
            通常不会立刻重播 —— 要看新效果得重新触发滚动。
          </p>
        </aside>

        <main style={main}>
          <header style={heroStyle}>
            <div style={{ fontSize: 12, opacity: 0.4, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>
              Scroll Down
            </div>
            <div style={{ fontSize: 48, fontWeight: 200, opacity: 0.35 }}>↓</div>
            <div style={{ marginTop: 24, fontSize: 13, opacity: 0.5, maxWidth: 440, textAlign: 'center', lineHeight: 1.6 }}>
              下面的文字会用你配的参数触发。markers 开着时，橙/绿/红色横线标记 start / end
              的位置 —— 滚动到线穿过视口边缘就会触发。
            </div>
          </header>

          <section style={previewSection}>
            <Reveal
              key={replayKey}
              mode={cfg.mode}
              effect={cfg.effect}
              trigger={cfg.trigger}
              duration={cfg.duration}
              stagger={cfg.stagger}
              start={cfg.start}
              end={cfg.end}
              ease={cfg.ease}
              initialY={cfg.initialY}
              initialBlur={cfg.initialBlur}
              initialOpacity={cfg.initialOpacity}
              markers={cfg.markers}
              style={revealTextStyle}
            >
              {cfg.text}
            </Reveal>
          </section>

          <footer style={footerStyle}>
            <div>滚到顶改参数，再滚下来看新效果。</div>
            <div style={{ marginTop: 8, opacity: 0.6 }}>或点左下 ▶ Replay 自动回顶。</div>
          </footer>
        </main>
      </div>
    </>
  );
}

function buildJsx(cfg: Config): string {
  const props: string[] = [];
  const push = (s: string) => props.push(s);
  if (cfg.mode !== DEFAULTS.mode) push(`mode="${cfg.mode}"`);
  if (cfg.effect !== DEFAULTS.effect) push(`effect="${cfg.effect}"`);
  if (cfg.trigger !== DEFAULTS.trigger) push(`trigger="${cfg.trigger}"`);
  if (cfg.duration !== DEFAULTS.duration) push(`duration={${cfg.duration}}`);
  if (cfg.stagger !== DEFAULTS.stagger) push(`stagger={${cfg.stagger}}`);
  if (cfg.start !== DEFAULTS.start) push(`start="${cfg.start}"`);
  if (cfg.trigger !== 'once' && cfg.end !== DEFAULTS.end) push(`end="${cfg.end}"`);
  if (cfg.ease !== DEFAULTS.ease) push(`ease="${cfg.ease}"`);
  if (cfg.initialY !== DEFAULTS.initialY) push(`initialY={${cfg.initialY}}`);
  if (cfg.initialBlur !== DEFAULTS.initialBlur) push(`initialBlur={${cfg.initialBlur}}`);
  if (cfg.initialOpacity !== DEFAULTS.initialOpacity) push(`initialOpacity={${cfg.initialOpacity}}`);
  const propsStr = props.length ? '\n  ' + props.join('\n  ') + '\n' : '';
  return `<Reveal${propsStr}>\n  ${cfg.text}\n</Reveal>`;
}

// ============ UI primitives ============

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={sectionTitle}>{title}</div>
      {children}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  hint?: string;
}) {
  return (
    <div style={fieldWrap}>
      <label style={fieldLabel}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={selectStyle}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {hint && <div style={hintStyle}>{hint}</div>}
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <div style={fieldWrap}>
      <label style={fieldLabel}>
        <span>{label}</span>
        <span style={valueBadge}>{value.toFixed(step < 0.01 ? 3 : step < 0.1 ? 2 : step < 1 ? 2 : 0)}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={rangeStyle}
      />
      {hint && <div style={hintStyle}>{hint}</div>}
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <div style={fieldWrap}>
      <label style={{ ...fieldLabel, cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          style={{ marginRight: 8 }}
        />
        <span>{label}</span>
      </label>
      {hint && <div style={hintStyle}>{hint}</div>}
    </div>
  );
}

// ============ styles ============

const layout: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '380px 1fr',
  minHeight: '100vh',
  background: '#0a0a0b',
  color: '#e7e7e7',
  fontFamily:
    "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
};

const panel: CSSProperties = {
  position: 'sticky',
  top: 0,
  height: '100vh',
  overflowY: 'auto',
  padding: '20px 18px 40px',
  borderRight: '1px solid #1e1e22',
  fontSize: 12.5,
  background: '#0d0d10',
};

const main: CSSProperties = {
  minWidth: 0,
};

const h1Style: CSSProperties = {
  fontSize: 16,
  fontWeight: 600,
  margin: 0,
  letterSpacing: '-0.01em',
};

const helpText: CSSProperties = {
  fontSize: 11.5,
  color: 'rgba(255,255,255,0.45)',
  margin: '6px 0 0',
  lineHeight: 1.5,
};

const sectionTitle: CSSProperties = {
  fontSize: 10.5,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.4)',
  marginBottom: 10,
  fontWeight: 600,
};

const fieldWrap: CSSProperties = {
  marginBottom: 10,
};

const fieldLabel: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: 12,
  color: 'rgba(255,255,255,0.82)',
  marginBottom: 4,
};

const valueBadge: CSSProperties = {
  fontFamily: 'ui-monospace, SFMono-Regular, monospace',
  fontSize: 11,
  color: 'rgba(255,255,255,0.55)',
  background: 'rgba(255,255,255,0.06)',
  padding: '1px 6px',
  borderRadius: 4,
};

const hintStyle: CSSProperties = {
  fontSize: 10.5,
  color: 'rgba(255,255,255,0.4)',
  marginTop: 3,
  lineHeight: 1.4,
};

const selectStyle: CSSProperties = {
  width: '100%',
  padding: '6px 8px',
  background: '#18181c',
  border: '1px solid #26262c',
  borderRadius: 6,
  color: '#e7e7e7',
  fontFamily: 'inherit',
  fontSize: 12,
  cursor: 'pointer',
};

const rangeStyle: CSSProperties = {
  width: '100%',
  accentColor: '#ffb347',
  cursor: 'pointer',
};

const textareaStyle: CSSProperties = {
  width: '100%',
  padding: 8,
  background: '#18181c',
  border: '1px solid #26262c',
  borderRadius: 6,
  color: '#e7e7e7',
  fontFamily: 'inherit',
  fontSize: 12,
  resize: 'vertical',
  lineHeight: 1.5,
};

const btnStyle: CSSProperties = {
  padding: '5px 10px',
  background: '#1a1a20',
  border: '1px solid #2a2a32',
  borderRadius: 6,
  color: '#e7e7e7',
  fontFamily: 'inherit',
  fontSize: 11.5,
  cursor: 'pointer',
};

const btnPrimary: CSSProperties = {
  ...btnStyle,
  width: '100%',
  padding: '8px 10px',
  fontSize: 12.5,
  background: '#ffb347',
  color: '#1a1a1a',
  border: 'none',
  fontWeight: 600,
};

const codeStyle: CSSProperties = {
  margin: 0,
  padding: 10,
  background: '#0a0a0b',
  border: '1px solid #1e1e22',
  borderRadius: 6,
  fontFamily: 'ui-monospace, SFMono-Regular, monospace',
  fontSize: 10.5,
  color: '#c8d2da',
  lineHeight: 1.5,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
};

const heroStyle: CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 40px',
};

const previewSection: CSSProperties = {
  minHeight: '120vh',
  padding: '30vh 8vw',
  background: '#0a0a0a',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
};

const revealTextStyle: CSSProperties = {
  fontSize: 44,
  lineHeight: 1.3,
  fontWeight: 500,
  maxWidth: 900,
  letterSpacing: '-0.01em',
};

const footerStyle: CSSProperties = {
  minHeight: '80vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 13,
  color: 'rgba(255,255,255,0.45)',
};
