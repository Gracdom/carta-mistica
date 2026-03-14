import { createContext, useContext, useState } from 'react'

const LeadModalContext = createContext(null)

export function LeadModalProvider({ children }) {
  const [show, setShow] = useState(false)
  return (
    <LeadModalContext.Provider value={{ show, openLeadModal: () => setShow(true), closeLeadModal: () => setShow(false) }}>
      {children}
    </LeadModalContext.Provider>
  )
}

export function useLeadModal() {
  return useContext(LeadModalContext)
}
