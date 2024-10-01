import { use, useEffect, useState } from "react"

import TaxonomyContext from "@/contexts/taxonomy/TaxonomyContext"
import UserContext from "./UserContext"

import userStore from "@/lib/store/user"

const UserProvider = ({ children }) => {
  const { taxonomy } = use(TaxonomyContext)

  const [user, setUser] = useState(null)

  const updateUser = update => {
    if (user === null) {
      setUser(update)
    } else if (JSON.stringify(update) !== JSON.stringify(user)) {
      const updated = { ...user, ...update }
      userStore.set(updated)
      setUser(updated)
    }
  }

  useEffect(() => {
    if (!!taxonomy) {
      const storedUser = userStore.get()
      if (storedUser) {
        setUser(storedUser)
      } else {
        setUser({
          concept: taxonomy._root,
          panel: "Concepts",
        })
      }
    }
  }, [taxonomy])

  return <UserContext value={{ user, updateUser }}>{children}</UserContext>
}

export default UserProvider
