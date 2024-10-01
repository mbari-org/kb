import AboutHelp from "@/components/nav/panels/AboutHelp"
import Concepts from "@/components/nav/panels/Concepts"
import Embargoes from "@/components/nav/panels/Embargoes"
import History from "@/components/nav/panels/History"
import ImportExport from "@/components/nav/panels/ImportExport"
import Notes from "@/components/nav/panels/Notes"
import References from "@/components/nav/panels/References"
import Templates from "@/components/nav/panels/Templates"

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
