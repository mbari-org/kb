import AboutHelp from '@/components/kb/panels/AboutHelp'
import Concepts from '@/components/kb/panels/Concepts'
import Embargoes from '@/components/kb/panels/Embargoes'
import History from '@/components/kb/panels/History'
import ImportExport from '@/components/kb/panels/ImportExport'
import Notes from '@/components/kb/panels/Notes'
import References from '@/components/kb/panels/References'
import Templates from '@/components/kb/panels/Templates'

const panels = [
  { mod: Concepts, name: 'Concepts' },
  { mod: Templates, name: 'Templates' },
  { mod: References, name: 'References' },
  { mod: Embargoes, name: 'Embargoes' },
  { mod: History, name: 'History' },
  { mod: Notes, name: 'Notes' },
  { mod: ImportExport, name: 'Import/Export' },
  { mod: AboutHelp, name: 'About/Help' },
]

export default panels
