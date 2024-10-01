import AboutHelp from "@/components/panels/AboutHelp"
import Concepts from "@/components/panels/Concepts"
import Embargoes from "@/components/panels/Embargoes"
import History from "@/components/panels/History"
import ImportExport from "@/components/panels/ImportExport"
import Notes from "@/components/panels/Notes"
import References from "@/components/panels/References"
import Templates from "@/components/panels/Templates"

const panels = [
  { mod: Concepts, title: "Concepts" },
  { mod: Templates, title: "Templates" },
  { mod: References, title: "References" },
  { mod: Embargoes, title: "Embargoes" },
  { mod: History, title: "History" },
  { mod: Notes, title: "Notes" },
  { mod: ImportExport, title: "Import/Export" },
  { mod: AboutHelp, title: "About/Help" },
]

export default panels
