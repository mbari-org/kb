import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"

import NavBar from "@/components/nav/NavBar"

import { useAuth } from "@/components/auth/AuthProvider"

const KnowledgeBase = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    navigate(`/kb/${user.panel}`)
  }, [])

  return (
    <>
      <NavBar />
      <Outlet />
    </>
  )
}

export default KnowledgeBase
