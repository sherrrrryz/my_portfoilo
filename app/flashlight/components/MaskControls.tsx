'use client';

import { useState } from 'react';

export interface MaskConfig {
  radius: number;
  // 3-zone flashlight: hotspot (bright center) -> spill (dimmer ring) -> edge (dark)
  hotspot: number;       // % of radius: inner fully-bright zone (0-80)
  falloff: number;       // % of radius: where spill starts fading to dark (hotspot-100)
  spillOpacity: number;  // 0-100: how bright the spill zone is (100 = same as center, 0 = fully dark)
  glowColor: string;
  glowIntensity: number;
  glowRadius: number;
  textColor: string;
  bgColor: string;
}

export const NIGHT_CONFIG: MaskConfig = {
  radius: 920,
  hotspot: 38,
  falloff: 42,
  spillOpacity: 50,
  glowColor: '#ffffff',
  glowIntensity: 18,
  glowRadius: 300,
  textColor: '#1a1a1a',
  bgColor: '#0a0a0a',
};

export const DEFAULT_CONFIG = NIGHT_CONFIG;

interface MaskControlsProps {
  config: MaskConfig;
  onChange: (config: MaskConfig) => void;
}

export default function MaskControls({ config, onChange }: MaskControlsProps) {
  const [collapsed, setCollapsed] = useState(false);

  const update = (partial: Partial<MaskConfig>) => {
    onChange({ ...config, ...partial });
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 200,
      }}
    >
      {collapsed ? (
        <button
          onClick={() => setCollapsed(false)}
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '2px solid rgba(255,255,255,0.2)',
            borderRadius: 0,
            color: 'rgba(255,255,255,0.5)',
            padding: '8px 14px',
            fontSize: 8,
            cursor: 'pointer',
          }}
        >
          [SETTINGS]
        </button>
      ) : (
        <div
          style={{
            background: 'rgba(10,10,10,0.95)',
            border: '2px solid rgba(255,255,255,0.2)',
            borderRadius: 0,
            padding: 14,
            width: 260,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 14,
            }}
          >
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 8 }}>
              {'>'} SETTINGS
            </span>
            <button
              onClick={() => setCollapsed(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.35)',
                cursor: 'pointer',
                fontSize: 16,
                padding: '0 4px',
                lineHeight: 1,
              }}
            >
              x
            </button>
          </div>

          {/* Radius */}
          <ControlRow label="Radius" value={`${config.radius}px`}>
            <input
              type="range"
              min={80}
              max={1500}
              value={config.radius}
              onChange={(e) => update({ radius: Number(e.target.value) })}
            />
          </ControlRow>

          {/* 3-zone gradient preview */}
          <GradientPreview hotspot={config.hotspot} falloff={config.falloff} spillOpacity={config.spillOpacity} />

          {/* 3-zone: Hotspot */}
          <ControlRow label="Hotspot" value={`${config.hotspot}%`}>
            <input
              type="range"
              min={0}
              max={95}
              value={config.hotspot}
              onChange={(e) => update({ hotspot: Number(e.target.value) })}
            />
          </ControlRow>

          {/* 3-zone: Falloff */}
          <ControlRow label="Falloff" value={`${config.falloff}%`}>
            <input
              type="range"
              min={5}
              max={100}
              value={config.falloff}
              onChange={(e) => update({ falloff: Number(e.target.value) })}
            />
          </ControlRow>

          {/* 3-zone: Spill Brightness */}
          <ControlRow label="Spill Brightness" value={`${config.spillOpacity}%`}>
            <input
              type="range"
              min={0}
              max={100}
              value={config.spillOpacity}
              onChange={(e) => update({ spillOpacity: Number(e.target.value) })}
            />
          </ControlRow>

          {/* Glow Color */}
          <ControlRow label="Glow Color" value={config.glowColor}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input
                type="color"
                value={config.glowColor}
                onChange={(e) => update({ glowColor: e.target.value })}
                style={{
                  width: 28,
                  height: 20,
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 0,
                  background: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              />
              {/* Presets */}
              {['#ffdc96', '#ffffff', '#96c8ff', '#ff9696', '#96ffb4'].map((c) => (
                <button
                  key={c}
                  onClick={() => update({ glowColor: c })}
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 0,
                    background: c,
                    border: config.glowColor === c ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    padding: 0,
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
          </ControlRow>

          {/* Glow Intensity */}
          <ControlRow label="Glow Intensity" value={`${config.glowIntensity}%`}>
            <input
              type="range"
              min={0}
              max={50}
              value={config.glowIntensity}
              onChange={(e) => update({ glowIntensity: Number(e.target.value) })}
            />
          </ControlRow>

          {/* Glow Radius */}
          <ControlRow label="Glow Spread" value={`${config.glowRadius}px`}>
            <input
              type="range"
              min={100}
              max={800}
              value={config.glowRadius}
              onChange={(e) => update({ glowRadius: Number(e.target.value) })}
            />
          </ControlRow>

          {/* Text Color */}
          <ControlRow label="Text Color" value={config.textColor}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input
                type="color"
                value={config.textColor}
                onChange={(e) => update({ textColor: e.target.value })}
                style={{
                  width: 28,
                  height: 20,
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 0,
                  background: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              />
              {['#1a1a1a', '#333333', '#666666', '#e8d5b0'].map((c) => (
                <button
                  key={c}
                  onClick={() => update({ textColor: c })}
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 0,
                    background: c,
                    border: config.textColor === c ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    padding: 0,
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
          </ControlRow>

          {/* Background Color */}
          <ControlRow label="Background" value={config.bgColor}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input
                type="color"
                value={config.bgColor}
                onChange={(e) => update({ bgColor: e.target.value })}
                style={{
                  width: 28,
                  height: 20,
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 0,
                  background: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              />
              {['#0a0a0a', '#1a1a2e', '#0a1a0a', '#1a0a0a'].map((c) => (
                <button
                  key={c}
                  onClick={() => update({ bgColor: c })}
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 0,
                    background: c,
                    border: config.bgColor === c ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    padding: 0,
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
          </ControlRow>

          {/* Reset */}
          <button
            onClick={() => onChange(DEFAULT_CONFIG)}
            style={{
              width: '100%',
              marginTop: 10,
              padding: '6px 0',
              background: 'rgba(255,255,255,0.06)',
              border: '2px solid rgba(255,255,255,0.15)',
              borderRadius: 0,
              color: 'rgba(255,255,255,0.4)',
              fontSize: 7,
              cursor: 'pointer',
            }}
          >
            [RESET]
          </button>
        </div>
      )}
    </div>
  );
}

function GradientPreview({
  hotspot,
  falloff,
  spillOpacity,
}: {
  hotspot: number;
  falloff: number;
  spillOpacity: number;
}) {
  // Ensure hotspot <= falloff for display
  const h = Math.min(hotspot, falloff);
  const f = Math.max(hotspot, falloff);
  const spillDark = 1 - spillOpacity / 100;

  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 4,
        }}
      >
        <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 7 }}>Light Profile</span>
        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 6 }}>
          center {'>'} edge
        </span>
      </div>
      {/* Gradient bar */}
      <div
        style={{
          height: 24,
          borderRadius: 0,
          border: '2px solid rgba(255,255,255,0.15)',
          background: `linear-gradient(to right, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.9) ${h}%, rgba(255,255,255,${0.9 * (1 - spillDark)}) ${(h + f) / 2}%, rgba(255,255,255,${0.15 * (1 - spillDark)}) ${f}%, rgba(255,255,255,0) 100%)`,
        }}
      />
      {/* Zone labels */}
      <div style={{ display: 'flex', marginTop: 3, fontSize: 6, color: 'rgba(255,255,255,0.25)' }}>
        <span style={{ width: `${h}%`, textAlign: 'center', flexShrink: 0 }}>
          {h > 15 ? 'hotspot' : ''}
        </span>
        <span style={{ width: `${f - h}%`, textAlign: 'center', flexShrink: 0 }}>
          {f - h > 15 ? 'spill' : ''}
        </span>
        <span style={{ flex: 1, textAlign: 'center' }}>
          {100 - f > 15 ? 'edge' : ''}
        </span>
      </div>
    </div>
  );
}

function ControlRow({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 4,
        }}
      >
        <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 7 }}>{label}</span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 7 }}>
          {value}
        </span>
      </div>
      {children}
    </div>
  );
}
