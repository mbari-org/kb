import { Outlet } from "react-router-dom"
import NavBar from "@/components/nav/NavBar"

const KnowledgeBase = () => (
  <>
    <NavBar />
    <Outlet />
  </>
)

export default KnowledgeBase
