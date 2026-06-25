import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import QueryProvider from "@/components/providers/QueryProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthGuard } from "@/components/providers/AuthGuard";
import { Toaster as Toast } from "@/components/ui/sonner";
import { SettingsProvider } from "@/lib/context/SettingsContext";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "ConstWare | Enterprise Construction Platform",
  description: "Advanced Enterprise Construction Operations & Management Platform",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ConstWare",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F172A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans selection:bg-orange-100 selection:text-orange-900", jakarta.variable, jetbrains.variable)}>
      <body className="antialiased font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <SettingsProvider>
              <AuthGuard>
                {children}
              </AuthGuard>
            </SettingsProvider>
            <Toast position="top-right" expand={false} richColors />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
