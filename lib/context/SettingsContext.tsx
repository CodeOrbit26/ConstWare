"use client"

import * as React from "react"

export interface UserSettings {
  firstName: string
  lastName: string
  email: string
  phone: string
  designation: string
  companyName: string
  gstin: string
  officeAddress: string
}

const defaultSettings: UserSettings = {
  firstName: "Abhay",
  lastName: "Sharma",
  email: "abhay@constware.com",
  phone: "+91 98765 43210",
  designation: "Regional Director - Northern Sector",
  companyName: "Sharma & Associates Constructions",
  gstin: "27AAAAA0000A1Z5",
  officeAddress: "402, Business Hub, BKC, Mumbai, Maharashtra",
}

interface SettingsContextType {
  settings: UserSettings
  updateSettings: (patch: Partial<UserSettings>) => void
  saveSettings: () => void
  isDirty: boolean
}

const SettingsContext = React.createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  saveSettings: () => {},
  isDirty: false,
})

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState<UserSettings>(defaultSettings)
  const [savedSettings, setSavedSettings] = React.useState<UserSettings>(defaultSettings)
  const [hydrated, setHydrated] = React.useState(false)

  // Load from localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("constware_user_settings")
      if (stored) {
        const parsed = JSON.parse(stored) as UserSettings
        setSettings(parsed)
        setSavedSettings(parsed)
      }
    } catch { /* ignore */ }
    setHydrated(true)
  }, [])

  const isDirty = hydrated && JSON.stringify(settings) !== JSON.stringify(savedSettings)

  const updateSettings = React.useCallback((patch: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...patch }))
  }, [])

  const saveSettings = React.useCallback(() => {
    localStorage.setItem("constware_user_settings", JSON.stringify(settings))
    setSavedSettings(settings)
  }, [settings])

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, saveSettings, isDirty }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return React.useContext(SettingsContext)
}
