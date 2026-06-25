"use client"

import * as React from "react"
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Building2, 
  Settings2, 
  ShieldCheck, 
  BellRing, 
  CreditCard,
  UserCircle2,
  Mail,
  Camera,
  Activity,
  Smartphone,
  ChevronRight,
  Search,
  ArrowLeft,
  X,
  Bookmark,
  Archive,
  Clock,
  Layout,
  Lock,
  Users
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { useSettings } from "@/lib/context/SettingsContext"

export default function SettingsPage() {
  const { settings, updateSettings, saveSettings, isDirty } = useSettings()
  const [activeView, setActiveView] = React.useState<"main" | "accounts_center" | "profile" | "security" | "organization" | "notifications">("main")
  const [searchQuery, setSearchQuery] = React.useState("")

  const handleSave = () => {
    saveSettings()
    toast.success("Enterprise settings saved & synced.")
  }

  const initials = (settings.firstName[0] || "A") + (settings.lastName[0] || "S")

  // --- Sub-view Components ---

  const AccountsCenterView = () => (
    <div className="animate-in slide-in-from-bottom-8 duration-500 space-y-6">
      {/* Header Area */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => setActiveView("main")} className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800">
          <X className="h-6 w-6 text-slate-900 dark:text-white" />
        </button>
        <div className="flex items-center gap-1.5 opacity-60">
          <div className="h-5 w-5 bg-primary rounded-full" />
          <span className="text-sm font-black tracking-tighter text-slate-900 dark:text-white">Constware</span>
        </div>
      </div>

      <div className="text-center space-y-3 mb-8">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Accounts Center</h2>
        <p className="text-xs font-medium text-slate-500 leading-relaxed px-6">
          Manage your connected nodes and account settings across Constware technologies. <span className="text-primary cursor-pointer hover:underline font-bold">Learn more</span>
        </p>
      </div>

      {/* Profiles Card */}
      <button 
        onClick={() => setActiveView("profile")}
        className="w-full flex items-center gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50 rounded-3xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group text-left"
      >
        <div className="relative h-12 w-12">
          <div className="absolute top-0 right-0 h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-950 flex items-center justify-center text-xs font-black">KG</div>
          <div className="absolute bottom-0 left-0 h-8 w-8 rounded-full bg-primary/20 border-2 border-white dark:border-slate-950 flex items-center justify-center text-[8px] font-black">CW</div>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Profiles and personal details</h4>
          <p className="text-[10px] text-slate-500 font-medium tracking-tight">1 active profile</p>
        </div>
        <ChevronRight className="h-5 w-5 text-slate-300" />
      </button>

      {/* Settings List Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50 rounded-3xl overflow-hidden divide-y divide-slate-50 dark:divide-slate-800/50">
        <MenuItem icon={ShieldCheck} label="Password and security" onClick={() => setActiveView("security")} />
        <MenuItem icon={Activity} label="Connected nodes" />
        <MenuItem icon={Smartphone} label="Your info and permissions" />
        <MenuItem icon={BellRing} label="System preferences" />
        <MenuItem icon={CreditCard} label="Constware Pay" />
        <MenuItem icon={Clock} label="Subscriptions" />
      </div>

      {/* Manage accounts */}
      <button className="w-full flex items-center gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50 rounded-3xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group text-left">
        <UserCircle2 className="h-6 w-6 text-slate-400" />
        <span className="flex-1 text-sm font-bold text-slate-700 dark:text-slate-200">Manage accounts</span>
        <ChevronRight className="h-4 w-4 text-slate-300" />
      </button>

      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">More from Constware</p>
    </div>
  )

  const ProfileView = () => (
    <div className="animate-in slide-in-from-right-4 duration-300 space-y-6">
      <div className="flex flex-col items-center text-center p-6 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800">
        <div className="relative group cursor-pointer mb-4">
          <div className="h-24 w-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl font-black text-slate-400 border-4 border-white dark:border-slate-950">
            {initials}
          </div>
          <div className="absolute inset-0 bg-slate-900/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-6 w-6 text-white" />
          </div>
        </div>
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{settings.firstName} {settings.lastName}</h3>
        <p className="text-[10px] font-black text-primary uppercase tracking-widest">{settings.designation}</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5 px-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">First Name</label>
          <Input value={settings.firstName} onChange={e => updateSettings({ firstName: e.target.value })} className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800" />
        </div>
        <div className="space-y-1.5 px-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Last Name</label>
          <Input value={settings.lastName} onChange={e => updateSettings({ lastName: e.target.value })} className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800" />
        </div>
        <div className="space-y-1.5 px-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Email Address</label>
          <Input value={settings.email} onChange={e => updateSettings({ email: e.target.value })} type="email" className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800" />
        </div>
      </div>
      
      <Button onClick={handleSave} className="w-full h-12 rounded-xl bg-primary text-white font-black uppercase tracking-widest mt-4">
        Save Changes
      </Button>
    </div>
  )

  const SecurityView = () => (
    <div className="animate-in slide-in-from-right-4 duration-300 space-y-6">
      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
        <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-4">Update Password</h4>
        <div className="space-y-4">
          <Input type="password" placeholder="Current Password" className="h-12 rounded-xl" />
          <Input type="password" placeholder="New Password" className="h-12 rounded-xl" />
          <Button className="w-full h-12 rounded-xl bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white font-black uppercase tracking-widest">Update</Button>
        </div>
      </div>

      <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">Two-Factor Auth</h4>
            <p className="text-[10px] text-slate-500 font-medium">Extra security for your node.</p>
          </div>
          <Button variant="outline" className="rounded-lg text-[10px] h-8 font-black uppercase tracking-widest border-warning/30 text-warning">Enable</Button>
        </div>
      </div>
    </div>
  )

  const OrganizationView = () => (
    <div className="animate-in slide-in-from-right-4 duration-300 space-y-6">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Legal Name</label>
          <Input value={settings.companyName} onChange={e => updateSettings({ companyName: e.target.value })} className="h-12 rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">GSTIN / Tax ID</label>
          <Input value={settings.gstin} onChange={e => updateSettings({ gstin: e.target.value })} className="h-12 rounded-xl uppercase" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Office Address</label>
          <Input value={settings.officeAddress} onChange={e => updateSettings({ officeAddress: e.target.value })} className="h-12 rounded-xl" />
        </div>
      </div>

      <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Node Usage</h4>
          <span className="text-[10px] font-black text-slate-500">8 / 15 Nodes</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-primary w-[53%]" />
        </div>
      </div>

      <Button onClick={handleSave} className="w-full h-12 rounded-xl bg-primary text-white font-black uppercase tracking-widest">
        Update Organization
      </Button>
    </div>
  )

  const AlertsView = () => (
    <div className="animate-in slide-in-from-right-4 duration-300 space-y-4">
      {[
        { t: "Critical Site Hazards", d: "Safety violations detected by AI." },
        { t: "DPR Submission Delays", d: "Missed daily report window." },
        { t: "Budget Thresholds", d: "Expenditure exceeds 90%." }
      ].map((pref, i) => (
        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
           <div className="space-y-0.5">
              <p className="text-xs font-bold text-slate-900 dark:text-white">{pref.t}</p>
              <p className="text-[10px] text-slate-500">{pref.d}</p>
           </div>
           <div className="flex gap-2">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-primary accent-primary" />
           </div>
        </div>
      ))}
    </div>
  )

  // --- Main List Component ---

  const MainView = () => (
    <div className="animate-in fade-in slide-in-from-left-4 duration-300 space-y-8 pb-20">
      {/* Your Account Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Personal Account</h3>
          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
            <Smartphone className="h-3 w-3" /> Node v4.2
          </span>
        </div>
        <button 
          onClick={() => setActiveView("accounts_center")}
          className="w-full flex items-center gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50 rounded-2xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
        >
          <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-black text-slate-500 border border-slate-200 dark:border-slate-700">
            {initials}
          </div>
          <div className="flex-1 text-left">
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Accounts Center</h4>
            <p className="text-[10px] text-slate-500 font-medium leading-tight tracking-tight">Password, security, personal details, device sessions</p>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-primary transition-colors" />
        </button>
      </div>

      {/* Operations Section */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Operational Parameters</h3>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50 rounded-2xl overflow-hidden divide-y divide-slate-50 dark:divide-slate-800/50">
          <MenuItem icon={Archive} label="Project Archive" />
          <MenuItem icon={Activity} label="System Activity Logs" />
          <MenuItem icon={BellRing} label="Notification Routing" onClick={() => setActiveView("notifications")} />
          <MenuItem icon={Clock} label="Shift & Time Schedules" />
          <MenuItem icon={Layout} label="Dashboard Layout" />
        </div>
      </div>

      {/* Enterprise Section */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Enterprise Configuration</h3>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50 rounded-2xl overflow-hidden divide-y divide-slate-50 dark:divide-slate-800/50">
          <MenuItem icon={Building2} label="Organization Profile" onClick={() => setActiveView("organization")} />
          <MenuItem icon={Users} label="Stakeholders & Teams" value="12 Active" />
          <MenuItem icon={Lock} label="Data Privacy & Permissions" value="Enterprise" />
          <MenuItem icon={CreditCard} label="Subscription & Billing" value="Pro" />
        </div>
      </div>

      {/* Compliance & Support */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Compliance & Support</h3>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50 rounded-2xl overflow-hidden divide-y divide-slate-50 dark:divide-slate-800/50">
          <MenuItem icon={ShieldCheck} label="Safety & Compliance" />
          <MenuItem icon={Smartphone} label="Help & Support Center" />
        </div>
      </div>
    </div>
  )

  const MenuItem = ({ icon: Icon, label, value, onClick }: any) => (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all group"
    >
      <Icon className="h-5 w-5 text-slate-400 group-hover:text-primary transition-colors" />
      <span className="flex-1 text-left text-sm font-bold text-slate-700 dark:text-slate-200">{label}</span>
      {value && <span className="text-[10px] font-black text-slate-400 uppercase mr-1">{value}</span>}
      <ChevronRight className="h-4 w-4 text-slate-300" />
    </button>
  )

  return (
    <DashboardLayout title={activeView === "main" ? "Settings" : ""}>
      <div className="max-w-xl mx-auto pt-2 md:pt-4 px-4 pb-20">
        
        {/* Header - App Style (Hidden in Accounts Center to use its custom header) */}
        {activeView !== "accounts_center" && (
          <div className="flex items-center gap-4 mb-6">
            {activeView !== "main" && (
              <button 
                onClick={() => setActiveView("main")}
                className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="h-6 w-6 text-slate-900 dark:text-white" />
              </button>
            )}
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">
              {activeView === "main" ? "Settings and activity" : activeView.replace('_', ' ').charAt(0).toUpperCase() + activeView.replace('_', ' ').slice(1)}
            </h1>
          </div>
        )}

        {activeView === "main" && (
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="h-12 w-full pl-11 pr-4 rounded-xl bg-slate-100 dark:bg-slate-900 border-none placeholder:text-slate-500 font-bold"
            />
          </div>
        )}

        {/* Content Area */}
        <div className="min-h-[60vh]">
          {activeView === "main" && <MainView />}
          {activeView === "accounts_center" && <AccountsCenterView />}
          {activeView === "profile" && <ProfileView />}
          {activeView === "security" && <SecurityView />}
          {activeView === "organization" && <OrganizationView />}
          {activeView === "notifications" && <AlertsView />}
        </div>

      </div>
    </DashboardLayout>
  )
}
