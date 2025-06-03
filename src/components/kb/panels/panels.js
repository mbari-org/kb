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

const panels = [
  { mod: Concepts, name: 'Concepts' },
  { mod: Templates, name: 'Templates' },
  { mod: References, name: 'References' },
  { mod: Embargoes, name: 'Embargoes' },
  { mod: History, name: 'History' },
  { mod: Notes, name: 'Notes' },
  { mod: Import, name: 'Import' },
  { mod: Export, name: 'Export' },
  { mod: Users, name: 'Users' },
  { mod: AboutHelp, name: 'About/Help' },
]

export default panels
