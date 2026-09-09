import CONFIG from '@/lib/config'

const {
  PANELS: { CONCEPTS, TEMPLATES, REALIZATIONS, REFERENCES, EMBARGOES, HISTORY, NOTES, USERS, ABOUT_HELP },
} = CONFIG

const name = panel => panel.PANEL.NAME

const modules = [
  { load: () => import('@/components/kb/panels/Concepts'), name: name(CONCEPTS) },
  { load: () => import('@/components/kb/panels/Templates'), name: name(TEMPLATES) },
  { load: () => import('@/components/kb/panels/Realizations'), name: name(REALIZATIONS) },
  { load: () => import('@/components/kb/panels/References'), name: name(REFERENCES) },
  { load: () => import('@/components/kb/panels/Embargoes'), name: name(EMBARGOES) },
  { load: () => import('@/components/kb/panels/History'), name: name(HISTORY) },
  { load: () => import('@/components/kb/panels/Notes'), name: name(NOTES) },
  { load: () => import('@/components/kb/panels/Users'), name: name(USERS) },
  { load: () => import('@/components/kb/panels/AboutHelp'), name: name(ABOUT_HELP) },
]

export default modules
