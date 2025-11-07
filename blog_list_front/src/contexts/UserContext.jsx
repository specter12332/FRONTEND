import React, { createContext, useState, useEffect, useContext } from 'react'
import commentService from '../services/comments'

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser debe usarse dentro de un UserProvider')
  }
  return context
}

// Valor inicial para el contexto
const initialContext = {
  user: null,
  login: () => {},
  logout: () => {},
  setUser: () => {}
}

export const UserContext = createContext(initialContext)

export const UserProvider = ({ children }) => {
  // Initialize user from localStorage if available
  const [user, setUser] = useState(() => {
    const savedUser = window.localStorage.getItem('loggedUser')
    return savedUser ? JSON.parse(savedUser) : null
  })

  useEffect(() => {
    // Update localStorage and set token when user changes
    if (user) {
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      commentService.setToken(user.token)
    } else {
      window.localStorage.removeItem('loggedUser')
      commentService.setToken(null)
    }
  }, [user])

  const login = (userData) => {
    setUser(userData)
    window.localStorage.setItem('loggedUser', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedUser')
  }

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider