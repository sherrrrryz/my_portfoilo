export interface MaskConfig {
  radius: number;
  // 3-zone flashlight: hotspot (bright center) -> spill (dimmer ring) -> edge (dark)
  hotspot: number;
  falloff: number;
  spillOpacity: number;
  glowColor: string;
  glowIntensity: number;
  glowRadius: number;
  textColor: string;
  bgColor: string;
}

export const DEFAULT_CONFIG: MaskConfig = {
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
