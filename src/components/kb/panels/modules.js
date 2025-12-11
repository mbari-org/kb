import CONFIG from '@/text'

// Direct imports - all panels loaded upfront but hidden when not active
import AboutHelp from '@/components/kb/panels/AboutHelp'
import Concepts from '@/components/kb/panels/Concepts'
import Embargoes from '@/components/kb/panels/Embargoes'
import Export from '@/components/kb/panels/Export'
import History from '@/components/kb/panels/History'
import Import from '@/components/kb/panels/Import'
import Notes from '@/components/kb/panels/Notes'
import References from '@/components/kb/panels/References'
import Templates from '@/components/kb/panels/Templates'
import Users from '@/components/kb/panels/Users'

const modules = [
  { module: Concepts, name: CONFIG.PANELS.CONCEPTS.PANEL.NAME },
  { module: Templates, name: CONFIG.PANELS.TEMPLATES.PANEL.NAME },
  { module: References, name: CONFIG.PANELS.REFERENCES.PANEL.NAME },
  { module: Embargoes, name: CONFIG.PANELS.EMBARGOES.PANEL.NAME },
  { module: History, name: CONFIG.PANELS.HISTORY.PANEL.NAME },
  { module: Notes, name: CONFIG.PANELS.NOTES.PANEL.NAME },
  { module: Import, name: CONFIG.PANELS.IMPORT.PANEL.NAME },
  { module: Export, name: CONFIG.PANELS.EXPORT.PANEL.NAME },
  { module: Users, name: CONFIG.PANELS.USERS.PANEL.NAME },
  { module: AboutHelp, name: CONFIG.PANELS.ABOUT_HELP.PANEL.NAME },
]

export default modules
