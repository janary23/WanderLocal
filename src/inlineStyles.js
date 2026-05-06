export const tokens = {
  colorPrimary: '#1A5F7A',
  colorPrimaryDark: '#124458',
  colorPrimaryPale: '#E8F4F8',
  colorSecondary: '#5A8BA8',
  colorSecondaryAlt: '#EDF4F8',
  colorAccent: '#D36135',
  colorAccentPale: '#FFF3F0',
  colorInk: '#0B1621',
  colorStone: '#6B7B8C',
  colorStoneLight: '#A0B0C0',
  colorSand: '#F4F2EC',
  colorSurface: 'rgba(255, 255, 255, 0.85)',
  colorBorder: '#E2E4E8',
  glassBg: 'rgba(255, 255, 255, 0.65)',
  glassBlur: 'blur(24px)',
  glassBorder: '1px solid rgba(255, 255, 255, 0.5)',
  radiusSm: '12px',
  radiusMd: '20px',
  radiusLg: '32px',
  radiusPill: '9999px',
  shadowXs: '0 2px 4px rgba(11, 22, 33, 0.03)',
  shadowSm: '0 4px 12px rgba(11, 22, 33, 0.05)',
  shadowMd: '0 8px 24px rgba(11, 22, 33, 0.06), 0 2px 8px rgba(11, 22, 33, 0.04)',
  shadowFloat: '0 20px 40px rgba(26, 95, 122, 0.08), 0 1px 3px rgba(0,0,0,0.05)',
  fontDisplay: '"Manrope", sans-serif',
  fontBody: '"Inter", sans-serif',
};

export const glassCardStyle = {
  background: tokens.glassBg,
  backdropFilter: tokens.glassBlur,
  WebkitBackdropFilter: tokens.glassBlur,
  border: tokens.glassBorder,
  borderRadius: tokens.radiusLg,
  boxShadow: tokens.shadowSm,
  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
};

export const glassCardHover = {
  boxShadow: tokens.shadowFloat,
  transform: 'translateY(-4px)',
  borderColor: 'rgba(255,255,255,1)',
};

export const btnPrimaryStyle = {
  background: tokens.colorPrimary,
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.1)',
  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2), 0 4px 12px rgba(26,95,122,0.3)',
  padding: '0.85rem 1.75rem',
  borderRadius: tokens.radiusPill,
  fontWeight: 700,
  fontFamily: tokens.fontBody,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
};

export const btnPrimaryHover = {
  transform: 'translateY(-2px)',
  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2), 0 8px 24px rgba(26,95,122,0.4)',
  background: tokens.colorPrimaryDark,
};

export const btnSecondaryStyle = {
  background: tokens.colorSurface,
  color: tokens.colorInk,
  border: tokens.glassBorder,
  boxShadow: tokens.shadowSm,
  backdropFilter: tokens.glassBlur,
  padding: '0.85rem 1.75rem',
  borderRadius: tokens.radiusPill,
  fontWeight: 700,
  fontFamily: tokens.fontBody,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
};

export const btnSecondaryHover = {
  transform: 'translateY(-2px)',
  boxShadow: tokens.shadowMd,
  borderColor: 'rgba(255,255,255,1)',
};

export const btnGhostStyle = {
  background: 'transparent',
  color: tokens.colorStone,
  border: `1px solid ${tokens.colorBorder}`,
  padding: '0.85rem 1.75rem',
  borderRadius: tokens.radiusPill,
  fontWeight: 600,
  fontFamily: tokens.fontBody,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
};

export const btnGhostHover = {
  background: tokens.colorSand,
  color: tokens.colorPrimary,
  borderColor: tokens.colorStoneLight,
};

export const applyHover = (e, hoverStyle, baseStyle) => {
  for (const key in hoverStyle) {
    e.currentTarget.style[key] = hoverStyle[key];
  }
};

export const removeHover = (e, baseStyle) => {
  for (const key in baseStyle) {
    e.currentTarget.style[key] = baseStyle[key];
  }
};
