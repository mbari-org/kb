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
  { module: Concepts, name: 'Concepts' },
  { module: Templates, name: 'Templates' },
  { module: References, name: 'References' },
  { module: Embargoes, name: 'Embargoes' },
  { module: History, name: 'History' },
  { module: Notes, name: 'Notes' },
  { module: Import, name: 'Import' },
  { module: Export, name: 'Export' },
  { module: Users, name: 'Users' },
  { module: AboutHelp, name: 'About/Help' },
]

export default modules
