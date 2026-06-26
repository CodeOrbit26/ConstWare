"use client"

import * as React from "react"
import { checkIsMockAuth } from "@/lib/auth/mockAuth"

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
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  designation: "",
  companyName: "",
  gstin: "",
  officeAddress: "",
}

interface SettingsContextType {
  settings: UserSettings
  updateSettings: (patch: Partial<UserSettings>) => void
  saveSettings: () => void
  resetSettings: () => void
  isDirty: boolean
}

const SettingsContext = React.createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  saveSettings: () => {},
  resetSettings: () => {},
  isDirty: false,
})

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState<UserSettings>(defaultSettings)
  const [savedSettings, setSavedSettings] = React.useState<UserSettings>(defaultSettings)
  const [hydrated, setHydrated] = React.useState(false)

  // Load from localStorage on mount, then sync with active session (mock or Supabase)
  React.useEffect(() => {
    setHydrated(true)

    const isMock = checkIsMockAuth()

    const loadSession = async () => {
      let activeUser: any = null

      if (isMock) {
        try {
          const session = localStorage.getItem("constware_mock_session")
          if (session) {
            activeUser = JSON.parse(session)
          }
        } catch (e) {
          console.error(e)
        }
      } else {
        try {
          const { createClient } = await import("@/lib/supabase/client")
          const supabase = createClient()
          const { data: { user } } = await supabase.auth.getUser()
          activeUser = user
        } catch (e) {
          console.error(e)
        }
      }

      if (activeUser) {
        // For mock auth, data is stored at top-level. For Supabase, it's in user_metadata.
        const metadata = activeUser.user_metadata || activeUser
        const fullName = metadata.name || ""
        const parts = fullName.trim().split(/\s+/)
        const firstName = parts[0] || ""
        const lastName = parts.slice(1).join(" ") || ""
        
        const companyName = metadata.company_name || metadata.companyName || ""
        const gstin = metadata.gst || metadata.gstin || ""
        const officeAddress = (metadata.city && metadata.state) 
          ? `${metadata.city}, ${metadata.state}`
          : (metadata.officeAddress || "")

        const syncedSettings: UserSettings = {
          firstName,
          lastName,
          email: activeUser.email || metadata.email || "",
          phone: metadata.phone || "",
          designation: metadata.designation || (metadata.role ? `${metadata.role.charAt(0).toUpperCase() + metadata.role.slice(1)}` : ""),
          companyName,
          gstin,
          officeAddress
        }

        // Check if cached settings belong to a different user — if so, discard cache
        try {
          const stored = localStorage.getItem("constware_user_settings")
          if (stored) {
            const cached = JSON.parse(stored) as UserSettings
            // If the cached email matches, use cached (user may have edited fields)
            if (cached.email === syncedSettings.email && cached.email !== "") {
              setSettings(cached)
              setSavedSettings(cached)
              return
            }
          }
        } catch { /* ignore */ }

        setSettings(syncedSettings)
        setSavedSettings(syncedSettings)
      } else {
        // No active session — try loading cached settings
        try {
          const stored = localStorage.getItem("constware_user_settings")
          if (stored) {
            const parsed = JSON.parse(stored) as UserSettings
            setSettings(parsed)
            setSavedSettings(parsed)
          }
        } catch { /* ignore */ }
      }
    }

    loadSession()
  }, [])

  const isDirty = hydrated && JSON.stringify(settings) !== JSON.stringify(savedSettings)

  const updateSettings = React.useCallback((patch: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...patch }))
  }, [])

  const saveSettings = React.useCallback(async () => {
    localStorage.setItem("constware_user_settings", JSON.stringify(settings))
    setSavedSettings(settings)

    const isMock = typeof window !== 'undefined' 
      ? (process.env.NEXT_PUBLIC_MOCK_AUTH === "true" || !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder"))
      : true

    if (isMock) {
      try {
        const sessionStr = localStorage.getItem("constware_mock_session")
        if (sessionStr) {
          const sessionUser = JSON.parse(sessionStr)
          
          sessionUser.name = `${settings.firstName} ${settings.lastName}`
          sessionUser.company_name = settings.companyName
          sessionUser.gst = settings.gstin
          sessionUser.phone = settings.phone
          const addrParts = settings.officeAddress.split(',')
          sessionUser.city = addrParts[0]?.trim() || ""
          sessionUser.state = addrParts[1]?.trim() || ""
          
          localStorage.setItem("constware_mock_session", JSON.stringify(sessionUser))

          const usersStr = localStorage.getItem("constware_mock_users")
          if (usersStr) {
            const users = JSON.parse(usersStr)
            const matchedIndex = users.findIndex((u: any) => u.email.toLowerCase() === sessionUser.email.toLowerCase())
            if (matchedIndex > -1) {
              users[matchedIndex] = {
                ...users[matchedIndex],
                name: sessionUser.name,
                company_name: sessionUser.company_name,
                gst: sessionUser.gst,
                phone: sessionUser.phone,
                city: sessionUser.city,
                state: sessionUser.state
              }
              localStorage.setItem("constware_mock_users", JSON.stringify(users))
            }
          }
        }
      } catch (e) {
        console.error("Failed to save mock user profile changes:", e)
      }
    } else {
      try {
        const { createClient } = await import("@/lib/supabase/client")
        const supabase = createClient()
        
        const addrParts = settings.officeAddress.split(',')
        const city = addrParts[0]?.trim() || ""
        const state = addrParts[1]?.trim() || ""

        const { error } = await supabase.auth.updateUser({
          data: {
            name: `${settings.firstName} ${settings.lastName}`,
            company_name: settings.companyName,
            gst: settings.gstin,
            phone: settings.phone,
            city,
            state
          }
        })
        if (error) throw error
      } catch (e) {
        console.error("Failed to sync Supabase profile update:", e)
      }
    }
  }, [settings])

  const resetSettings = React.useCallback(() => {
    setSettings(savedSettings)
  }, [savedSettings])

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, saveSettings, resetSettings, isDirty }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return React.useContext(SettingsContext)
}
