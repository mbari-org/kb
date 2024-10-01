import { useEffect, useState } from "react"

import UserContext from "./UserContext"

import userStore from "@/lib/store/user"

const defaultUserState = {
  concept: "object",
  panel: "Concepts",
}

const UserProvider = ({ children }) => {
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
    const initialUser = userStore.get() || defaultUserState
    userStore.set(initialUser)
    setUser(initialUser)
  }, [])

  return <UserContext value={{ user, updateUser }}>{children}</UserContext>
}

export default UserProvider
