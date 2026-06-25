"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { ArrowLeft, ArrowRight, Building2, User, MapPin, HardHat } from "lucide-react"
import Link from "next/link"

export function RegistrationForm() {
  const router = useRouter()
  const [step, setStep] = React.useState(1)
  const totalSteps = 3
  const progress = (step / totalSteps) * 100

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps))
  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  const handleComplete = () => {
    toast.success("Account created successfully!")
    router.push("/contractor/dashboard")
  }

  return (
    <Card className="w-full max-w-xl mx-auto border-none shadow-lg mt-8">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <Link href="/login" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to Login
          </Link>
          <span className="text-sm font-medium text-muted-foreground">Step {step} of {totalSteps}</span>
        </div>
        <Progress value={progress} className="h-2 mb-6" />
        <CardTitle className="text-2xl">
          {step === 1 && "Create your personal account"}
          {step === 2 && "Tell us about your company"}
          {step === 3 && "Setup your first project site"}
        </CardTitle>
        <CardDescription>
          {step === 1 && "Start your journey with ConstWare enterprise."}
          {step === 2 && "This helps us tailor the platform for your business."}
          {step === 3 && "You can always add more sites later or skip this for now."}
        </CardDescription>
      </CardHeader>

      <CardContent className="min-h-[300px]">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="firstName" className="pl-10" placeholder="John Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <div className="flex items-center justify-center px-3 border rounded-md bg-muted text-muted-foreground text-sm font-medium">+91</div>
                <Input id="phone" placeholder="9876543210" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Create Password</Label>
              <Input id="password" type="password" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="companyName" className="pl-10" placeholder="Acme Construction Ltd." />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gst">GST Number (Optional)</Label>
              <Input id="gst" placeholder="22AAAAA0000A1Z5" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="Mumbai" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" placeholder="Maharashtra" />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <div className="relative">
                <HardHat className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="siteName" className="pl-10" placeholder="Green Valley Residency" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteLocation">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="siteLocation" className="pl-10" placeholder="Sector 45, Gurgaon" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Estimated Budget (₹)</Label>
              <Input id="budget" type="number" placeholder="50,00,000" />
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t p-6">
        {step > 1 ? (
          <Button variant="outline" onClick={prevStep}>
            Previous
          </Button>
        ) : (
          <div />
        )}
        
        <div className="flex gap-2">
          {step === 3 && (
            <Button variant="ghost" onClick={handleComplete}>
              Skip for now
            </Button>
          )}
          <Button 
            className="bg-primary hover:bg-primary/90" 
            onClick={step === totalSteps ? handleComplete : nextStep}
          >
            {step === totalSteps ? "Complete Registration" : "Continue"}
            {step < totalSteps && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
