/**
 * Generates a unique 12-character site code in the format:
 * 
 * CW - XX - XX - DD - XX - XX
 * |    |    |    |    |    |
 * |    |    |    |    |    └─ 2 letters of City name
 * |    |    |    |    └────── 2 letters of Contractor name
 * |    |    |    └─────────── 2 digits of Start date (day)
 * |    |    └──────────────── 2 letters of Site name
 * |    └───────────────────── 2 letters of Client name
 * └────────────────────────── CW (ConstWare)
 * 
 * Example: CWABGV01ASGG
 * Displayed as: CW-AB-GV-01-AS-GG
 */

function take2Letters(str: string): string {
  const words = str.trim().split(/\s+/)
  if (words.length >= 2) {
    // Take first letter of first two words
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  // Take first two letters of the single word
  return str.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase().padEnd(2, 'X')
}

function take2Digits(dateStr: string): string {
  // dateStr is ISO like "2025-10-01" — take the day
  const parts = dateStr.split('-')
  if (parts.length === 3) {
    return parts[2].padStart(2, '0')
  }
  return '00'
}

function extractCity(location: string): string {
  // location could be "Sector 45, GGN" or "Worli, Mumbai"
  const parts = location.split(',')
  const cityPart = (parts[parts.length - 1] || parts[0]).trim()
  return cityPart.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase().padEnd(2, 'X')
}

export function generateSiteCode({
  clientName,
  siteName,
  startDate,
  contractorName,
  city,
}: {
  clientName: string
  siteName: string
  startDate: string   // ISO date string e.g. "2025-10-01"
  contractorName: string
  city: string         // City name or location string
}): string {
  const prefix = 'CW'
  const clientCode = take2Letters(clientName)
  const siteCode = take2Letters(siteName)
  const dateCode = take2Digits(startDate)
  const contractorCode = take2Letters(contractorName)
  const cityCode = extractCity(city)

  return `${prefix}${clientCode}${siteCode}${dateCode}${contractorCode}${cityCode}`
}

/**
 * Formats a raw 12-char code into display format: CW-AB-GV-01-AS-GG
 */
export function formatSiteCode(raw: string): string {
  const clean = raw.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 12)
  if (clean.length < 12) return clean
  return `${clean.slice(0,2)}-${clean.slice(2,4)}-${clean.slice(4,6)}-${clean.slice(6,8)}-${clean.slice(8,10)}-${clean.slice(10,12)}`
}

/**
 * Parses a display-format code back into raw 12 chars
 */
export function parseSiteCode(displayCode: string): string {
  return displayCode.replace(/[^A-Z0-9]/gi, '').toUpperCase()
}
