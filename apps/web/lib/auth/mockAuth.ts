// Mock Auth Helper for Local Development / Mock Mode
// Properly hashes passwords using SubtleCrypto and manages mock sessions in localStorage.

const USERS_KEY = "constware_mock_users"
const SESSION_KEY = "constware_mock_session"

// Simple SHA-256 helper for browser environments
export async function hashPassword(password: string): Promise<string> {
  if (typeof window === "undefined" || !window.crypto || !window.crypto.subtle) {
    return password; // Fallback for SSR
  }
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export function getMockUsers(): any[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(USERS_KEY)
  return data ? JSON.parse(data) : []
}

export async function saveMockUser(user: any): Promise<boolean> {
  if (typeof window === "undefined") return false
  const users = getMockUsers()
  
  // Check duplicates
  const userEmail = user.email ? user.email.toLowerCase().trim() : ""
  const userPhone = user.phone ? user.phone.replace(/\D/g, "") : ""

  if (userEmail && users.some((u: any) => u.email && u.email.toLowerCase() === userEmail)) {
    throw new Error("An account with this email already exists.")
  }

  if (userPhone && users.some((u: any) => u.phone && u.phone.replace(/\D/g, "") === userPhone)) {
    throw new Error("An account with this phone number already exists.")
  }

  const hashedPassword = await hashPassword(user.password)
  const newUser = {
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
    email: userEmail,
    passwordHash: hashedPassword,
    name: user.name,
    phone: user.phone || "",
    role: user.role || "contractor",
    designation: user.designation || "Contractor",
    company_name: user.company_name,
    gst: user.gst || "",
    city: user.city || "",
    state: user.state || "",
    pincode: user.pincode || "",
    address: user.address || "",
    created_at: new Date().toISOString()
  }

  users.push(newUser)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  return true
}

export async function authenticateMockUser(emailOrPhone: string, password: string, role: string): Promise<any> {
  if (typeof window === "undefined") return null
  const users = getMockUsers()
  const searchKey = emailOrPhone.trim().toLowerCase()
  const searchPhone = emailOrPhone.replace(/\D/g, "")

  const matchedUser = users.find((u: any) => {
    const dbEmail = u.email ? u.email.toLowerCase().trim() : ""
    const dbPhone = u.phone ? u.phone.replace(/\D/g, "") : ""
    return (dbEmail && dbEmail === searchKey) || (dbPhone && searchPhone && dbPhone === searchPhone)
  })

  if (!matchedUser) {
    throw new Error("Invalid email/phone or password. Please check your credentials.")
  }

  const inputHash = await hashPassword(password)
  if (matchedUser.passwordHash !== inputHash) {
    throw new Error("Invalid email/phone or password. Please check your credentials.")
  }

  if (matchedUser.role !== role) {
    throw new Error(`This account is registered as a ${matchedUser.role}. Please use the correct tab to login.`)
  }

  // Create session
  const sessionUser = { ...matchedUser }
  delete sessionUser.passwordHash
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser))

  // Trigger Zustand rehydration for new user
  try {
    const { useFinanceStore } = require("@/lib/store/useStore")
    useFinanceStore.persist.rehydrate()
  } catch (e) {
    console.error(e)
  }

  return sessionUser
}

export function getMockSession(): any | null {
  if (typeof window === "undefined") return null
  const session = localStorage.getItem(SESSION_KEY)
  return session ? JSON.parse(session) : null
}

export function clearMockSession(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(SESSION_KEY)

  // Trigger Zustand rehydration to fallback to global/anonymous state
  try {
    const { useFinanceStore } = require("@/lib/store/useStore")
    useFinanceStore.persist.rehydrate()
  } catch (e) {
    console.error(e)
  }
}

export async function getCurrentUserId(): Promise<string> {
  if (typeof window === "undefined") return "anonymous"
  
  const isMock = process.env.NEXT_PUBLIC_MOCK_AUTH === "true" || 
    !process.env.NEXT_PUBLIC_SUPABASE_URL || 
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")

  if (isMock) {
    const session = localStorage.getItem(SESSION_KEY)
    if (session) {
      try {
        const user = JSON.parse(session)
        return user.id || user.email || "anonymous"
      } catch (e) {
        console.error(e)
      }
    }
  } else {
    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        return user.id
      }
    } catch (e) {
      console.error(e)
    }
  }
  return "anonymous"
}
