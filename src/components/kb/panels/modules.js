import CONFIG from '@/text'

// Direct imports - all panels loaded upfront but hidden when not active
import AboutHelp from '@/components/kb/panels/AboutHelp'
import Concepts from '@/components/kb/panels/Concepts'
import Embargoes from '@/components/kb/panels/Embargoes'
import History from '@/components/kb/panels/History'
import Notes from '@/components/kb/panels/Notes'
import Realizations from '@/components/kb/panels/Realizations'
import References from '@/components/kb/panels/References'
import Templates from '@/components/kb/panels/Templates'
import Users from '@/components/kb/panels/Users'

const {
  PANELS: { CONCEPTS, TEMPLATES, REALIZATIONS, REFERENCES, EMBARGOES, HISTORY, NOTES, USERS, ABOUT_HELP },
} = CONFIG

const name = panel => panel.PANEL.NAME

const modules = [
  { module: Concepts, name: name(CONCEPTS) },
  { module: Templates, name: name(TEMPLATES) },
  { module: Realizations, name: name(REALIZATIONS) },
  { module: References, name: name(REFERENCES) },
  { module: Embargoes, name: name(EMBARGOES) },
  { module: History, name: name(HISTORY) },
  { module: Notes, name: name(NOTES) },
  { module: Users, name: name(USERS) },
  { module: AboutHelp, name: name(ABOUT_HELP) },
]

export default modules
