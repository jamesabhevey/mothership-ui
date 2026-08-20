import { create } from 'storybook/theming/create'

/**
 * Storybook's own chrome, themed with the Mothership tokens.
 *
 * The manager is a separate React app from the preview iframe, so it cannot
 * read the `@theme` block in styles/index.css — the values have to be handed
 * over as literals. They are copied from the Figma Semantic collection and
 * kept in the same order as the token file, so a drift is easy to spot.
 *
 *   colour            token
 *   #8429cc           color/action/primary/default
 *   #631f99           color/action/primary/hover
 *   #1f2429           color/text/primary
 *   #4a5259           color/text/secondary
 *   #666f78           color/text/muted
 *   #f5f6f7           color/bg/subtle
 *   #ffffff           color/surface/default
 *   #d3d7db           color/border/default
 *   #e8eaec           color/border/subtle
 */
export const mothershipTheme = create({
  base: 'light',

  brandTitle: 'Mothership UI',
  brandUrl: 'https://github.com/jamesabhevey/mothership-ui',
  brandTarget: '_blank',

  // Brand
  colorPrimary: '#8429cc',
  colorSecondary: '#8429cc',

  // App frame. The sidebar sits on appBg; white rather than the sunken grey,
  // with appBorderColor carrying the separation from the canvas.
  appBg: '#ffffff',
  appContentBg: '#ffffff',
  appPreviewBg: '#ffffff',
  appBorderColor: '#e8eaec',
  appBorderRadius: 8,

  // Type. Inter is loaded for the manager by manager-head.html; the preview
  // gets it through the @fontsource imports in preview.ts.
  fontBase: 'Inter, ui-sans-serif, system-ui, -apple-system, sans-serif',
  fontCode: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',

  // Text
  textColor: '#1f2429',
  textInverseColor: '#ffffff',
  textMutedColor: '#666f78',

  // Toolbar and sidebar
  barTextColor: '#4a5259',
  barHoverColor: '#631f99',
  barSelectedColor: '#8429cc',
  barBg: '#ffffff',

  // Buttons
  buttonBg: '#ffffff',
  buttonBorder: '#d3d7db',
  booleanBg: '#f5f6f7',
  booleanSelectedBg: '#ffffff',

  // Form controls in the addons panel
  inputBg: '#ffffff',
  inputBorder: '#d3d7db',
  inputTextColor: '#1f2429',
  inputBorderRadius: 8,
})
