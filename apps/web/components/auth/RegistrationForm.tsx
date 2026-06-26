"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { 
  Building2, 
  HardHat, 
  User, 
  Check, 
  Loader2, 
  Eye, 
  EyeOff, 
  Shield, 
  Lock, 
  Mail, 
  Phone 
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function RegistrationForm() {
  const router = useRouter()
  const [step, setStep] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(false)

  // Form states
  const [role, setRole] = React.useState<"CONTRACTOR" | "SUPERVISOR" | "CLIENT" | "">("")
  const [firstName, setFirstName] = React.useState("")
  const [lastName, setLastName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [agreeTerms, setAgreeTerms] = React.useState(false)

  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

  // Password strength logic
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "None", color: "bg-slate-800" }
    let score = 0
    if (pass.length >= 8) score += 1
    if (/[A-Z]/.test(pass)) score += 1
    if (/[a-z]/.test(pass)) score += 1
    if (/[0-9]/.test(pass)) score += 1
    if (/[^A-Za-z0-9]/.test(pass)) score += 1

    if (score <= 2) return { score, label: "Weak", color: "bg-rose-500" }
    if (score <= 4) return { score, label: "Medium", color: "bg-amber-500" }
    return { score, label: "Strong", color: "bg-emerald-500" }
  }

  const pwdStrength = getPasswordStrength(password)

  const handleNextStep = () => {
    if (step === 1) {
      if (!role) {
        toast.error("Please select a role to continue.")
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (!firstName.trim() || !lastName.trim()) {
        toast.error("First name and Last name are required.")
        return
      }
      if (!email.trim()) {
        toast.error("Email address is required.")
        return
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address.")
        return
      }
      setStep(3)
    }
  }

  const handlePrevStep = () => {
    setStep((s) => Math.max(s - 1, 1))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password || password.length < 8) {
      toast.error("Password must be at least 8 characters long.")
      return
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.")
      return
    }
    if (!agreeTerms) {
      toast.error("You must agree to the Terms & Conditions.")
      return
    }

    setIsLoading(true)
    const isMockAuth = process.env.NEXT_PUBLIC_MOCK_AUTH === "true" ||
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")

    if (isMockAuth) {
      try {
        const { saveMockUser, authenticateMockUser } = await import("@/lib/auth/mockAuth")
        
        // Format phone number
        const cleanPhone = phone.trim() 
          ? (phone.startsWith("+") ? phone.trim() : `+91${phone.trim()}`) 
          : ""

        const mappedRole = role.toLowerCase() // "contractor" | "supervisor" | "client"

        await saveMockUser({
          email: email.trim(),
          phone: cleanPhone,
          password,
          name: `${firstName.trim()} ${lastName.trim()}`,
          role: mappedRole,
          designation: role === "CONTRACTOR" ? "Contractor" : role === "SUPERVISOR" ? "Supervisor" : "Client",
          company_name: "",
          gst: "",
          city: "",
          state: "",
          pincode: "",
          address: ""
        })

        await authenticateMockUser(email.trim(), password, mappedRole)
        
        toast.success("Account created successfully! Welcome to ConstWare.", {
          icon: <Shield className="h-4 w-4 text-emerald-500" />
        })

        if (mappedRole === "contractor") {
          router.push("/contractor/dashboard")
        } else if (mappedRole === "supervisor") {
          router.push("/supervisor/dashboard")
        } else {
          router.push("/client/demo-token")
        }
      } catch (err: any) {
        toast.error(err.message || "Registration failed")
      } finally {
        setIsLoading(false)
      }
      return
    }

    // Real Supabase Auth path
    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()

      const cleanPhone = phone.trim() 
        ? (phone.startsWith("+") ? phone.trim() : `+91${phone.trim()}`) 
        : ""

      const mappedRole = role.toLowerCase()

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: `${firstName.trim()} ${lastName.trim()}`,
            phone: cleanPhone,
            role: mappedRole,
            designation: role === "CONTRACTOR" ? "Contractor" : role === "SUPERVISOR" ? "Supervisor" : "Client",
            company_name: "",
            gst: "",
            city: "",
            state: "",
            pincode: "",
            address: "",
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        toast.error(error.message)
        setIsLoading(false)
        return
      }

      if (data.user && data.session === null) {
        toast.success("Registration successful! Please verify your account.", {
          duration: 10000,
          icon: <Mail className="h-4 w-4 text-primary" />
        })
        router.push("/login?message=check-auth")
      } else {
        toast.success("Account created successfully! Welcome to ConstWare.", {
          icon: <Shield className="h-4 w-4 text-emerald-500" />
        })
        router.push("/contractor/dashboard")
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full space-y-8 p-1 bg-[#0d0d0d] text-white">
      {/* Step Indicator */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <span>Register Flow</span>
          <span className="text-[#F97316]">Step {step} of 3</span>
        </div>
        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#F97316] transition-all duration-500" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-black uppercase tracking-tight italic">
          {step === 1 && "Who are you?"}
          {step === 2 && "Your Details"}
          {step === 3 && "Secure Your Account"}
        </h2>
        <p className="text-[10px] font-black uppercase tracking-widest text-[#F97316]">
          {step === 1 && "Select your core operational workflow"}
          {step === 2 && "Enter your primary identity and contact info"}
          {step === 3 && "Create a secure entry key to the node"}
        </p>
      </div>

      <div className="bg-[#121212] border border-slate-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Shield className="h-32 w-32 text-[#F97316]" />
        </div>

        <div className="relative z-10 min-h-[300px] flex flex-col justify-between">
          
          {/* STEP 1: ROLE SELECTION */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 gap-4">
                {[
                  { id: "CONTRACTOR", label: "Contractor", desc: "Manage sites, finances, and supervisors", icon: Building2 },
                  { id: "SUPERVISOR", label: "Supervisor", desc: "Track attendance, materials, and logs", icon: HardHat },
                  { id: "CLIENT", label: "Client", desc: "View progress and billing transparently", icon: User }
                ].map((item) => {
                  const Icon = item.icon
                  const isSelected = role === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRole(item.id as any)}
                      className={cn(
                        "flex items-center gap-6 p-6 rounded-2xl border text-left transition-all relative group",
                        isSelected 
                          ? "border-[#F97316] bg-[#F97316]/5 shadow-lg shadow-[#F97316]/10" 
                          : "border-slate-800 bg-[#0a0a0a] hover:border-slate-700"
                      )}
                    >
                      <div className={cn(
                        "h-14 w-14 rounded-xl flex items-center justify-center transition-all",
                        isSelected ? "bg-[#F97316] text-white" : "bg-slate-900 text-slate-400 group-hover:text-white"
                      )}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black uppercase tracking-wider text-sm">{item.label}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">{item.desc}</p>
                      </div>
                      {isSelected && (
                        <div className="h-6 w-6 rounded-full bg-[#F97316] flex items-center justify-center text-white border-2 border-[#121212] absolute -top-2 -right-2">
                          <Check className="h-3.5 w-3.5 stroke-[4px]" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 2: PERSONAL DETAILS */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="h-12 pl-11 bg-slate-950 border-slate-800 rounded-xl focus-visible:ring-1 focus-visible:ring-[#F97316]/50 focus:border-[#F97316] text-white font-bold text-xs" 
                      placeholder="First name" 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="h-12 pl-11 bg-slate-950 border-slate-800 rounded-xl focus-visible:ring-1 focus-visible:ring-[#F97316]/50 focus:border-[#F97316] text-white font-bold text-xs" 
                      placeholder="Last name" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 pl-11 bg-slate-950 border-slate-800 rounded-xl focus-visible:ring-1 focus-visible:ring-[#F97316]/50 focus:border-[#F97316] text-white font-bold text-xs" 
                    placeholder="john.doe@constware.co" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number (Optional)</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12 pl-11 bg-slate-950 border-slate-800 rounded-xl focus-visible:ring-1 focus-visible:ring-[#F97316]/50 focus:border-[#F97316] text-white font-bold text-xs" 
                    placeholder="9876543210" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SECURITY PASSWORD */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Create Password (Min 8 characters)</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pl-11 pr-11 bg-slate-950 border-slate-800 rounded-xl focus-visible:ring-1 focus-visible:ring-[#F97316]/50 focus:border-[#F97316] text-white font-bold text-xs"
                    placeholder="••••••••" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Password strength indicator */}
              {password && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-slate-400">
                    <span>Password Strength:</span>
                    <span className={cn(
                      pwdStrength.label === "Strong" ? "text-emerald-500" :
                      pwdStrength.label === "Medium" ? "text-amber-500" : "text-rose-500"
                    )}>{pwdStrength.label}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden flex gap-1">
                    {[1, 2, 3].map((barIndex) => {
                      let activeColor = "bg-slate-800"
                      if (pwdStrength.score >= barIndex * 1.5) {
                        activeColor = pwdStrength.color
                      }
                      return (
                        <div key={barIndex} className={cn("h-full flex-1 transition-colors", activeColor)} />
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 pl-11 pr-11 bg-slate-950 border-slate-800 rounded-xl focus-visible:ring-1 focus-visible:ring-[#F97316]/50 focus:border-[#F97316] text-white font-bold text-xs"
                    placeholder="••••••••" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3 mt-4">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 h-4.5 w-4.5 accent-[#F97316] rounded border-slate-800 bg-slate-950"
                />
                <label htmlFor="terms" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-relaxed cursor-pointer select-none">
                  I agree to the <span className="text-[#F97316] hover:underline">Terms of Service</span> and <span className="text-[#F97316] hover:underline">Privacy Protocol</span>.
                </label>
              </div>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-slate-900">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevStep}
                className="flex-1 h-12 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl font-black uppercase text-[10px] tracking-widest"
              >
                Back
              </Button>
            )}

            {step < 3 ? (
              <Button
                type="button"
                onClick={handleNextStep}
                disabled={step === 1 && !role}
                className={cn(
                  "flex-1 h-12 text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all",
                  (step === 1 && !role) 
                    ? "bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-950" 
                    : "bg-[#F97316] hover:bg-[#F97316]/95"
                )}
              >
                Continue
              </Button>
            ) : (
              <Button
                type="submit"
                onClick={handleRegister}
                disabled={isLoading || !agreeTerms || password.length < 8}
                className={cn(
                  "flex-1 h-12 text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all flex items-center justify-center gap-2",
                  (isLoading || !agreeTerms || password.length < 8)
                    ? "bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-950"
                    : "bg-[#F97316] hover:bg-[#F97316]/95"
                )}
              >
                {isLoading ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : "Create Account"}
              </Button>
            )}
          </div>

        </div>
      </div>

      <div className="text-center">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Already have an account?{" "}
          <Link href="/login" className="text-[#F97316] hover:underline font-black">
            Log In
          </Link>
        </p>
      </div>
    </div>
  )
}
