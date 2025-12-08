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

import aboutHelpPanel from '@/config/text/panels/abouthelp/panel.json'
import conceptsPanel from '@/config/text/panels/concepts/panel.json'
import embargoesPanel from '@/config/text/panels/embargoes/panel.json'
import exportPanel from '@/config/text/panels/export/panel.json'
import historyPanel from '@/config/text/panels/history/panel.json'
import importPanel from '@/config/text/panels/import/panel.json'
import notesPanel from '@/config/text/panels/notes/panel.json'
import referencesPanel from '@/config/text/panels/references/panel.json'
import templatesPanel from '@/config/text/panels/templates/panel.json'
import usersPanel from '@/config/text/panels/users/panel.json'

const modules = [
  { module: Concepts, name: conceptsPanel.NAME },
  { module: Templates, name: templatesPanel.NAME },
  { module: References, name: referencesPanel.NAME },
  { module: Embargoes, name: embargoesPanel.NAME },
  { module: History, name: historyPanel.NAME },
  { module: Notes, name: notesPanel.NAME },
  { module: Import, name: importPanel.NAME },
  { module: Export, name: exportPanel.NAME },
  { module: Users, name: usersPanel.NAME },
  { module: AboutHelp, name: aboutHelpPanel.NAME },
]

export default modules
