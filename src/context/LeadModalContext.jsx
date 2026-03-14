import { createContext, useContext, useState, useCallback, useMemo } from 'react'

const LeadModalStateContext   = createContext(false)
const LeadModalActionsContext = createContext(null)

export function LeadModalProvider({ children }) {
  const [show, setShow] = useState(false)

  const openLeadModal  = useCallback(() => setShow(true),  [])
  const closeLeadModal = useCallback(() => setShow(false), [])

  const actions = useMemo(() => ({ openLeadModal, closeLeadModal }), [openLeadModal, closeLeadModal])

  return (
    <LeadModalActionsContext.Provider value={actions}>
      <LeadModalStateContext.Provider value={show}>
        {children}
      </LeadModalStateContext.Provider>
    </LeadModalActionsContext.Provider>
  )
}

export function useLeadModal() {
  const { openLeadModal, closeLeadModal } = useContext(LeadModalActionsContext)
  const show = useContext(LeadModalStateContext)
  return { show, openLeadModal, closeLeadModal }
}

export function useLeadModalActions() {
  return useContext(LeadModalActionsContext)
}

export function useLeadModalShow() {
  return useContext(LeadModalStateContext)
}
