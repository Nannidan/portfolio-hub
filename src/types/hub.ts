export type ThemeId = 'slate' | 'emerald' | 'indigo'
export type BrightnessMode = 'dark' | 'light'
export type VisualStyle = 'modern' | 'retro'
export type ProjectIconId = 'synth' | 'forge' | 'orbit' | 'ledger' | 'spectrum'

export interface Project {
  id: string
  code: string
  title: string
  tagline: string
  description: string
  liveUrl: string
  repoUrl: string
  tags: string[]
  icon: ProjectIconId
}

export interface ThemeMeta {
  label: string
  swatch: string
  badge: string
  headline: string
  sub: string
}
