import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { TaskProvider } from "@/context/task-context";
import { DayProvider } from "@/context/day-context";
import { AnimationProvider } from "@/context/animation-context";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DayGrid - Daily Time & Task Management",
  description: "Robust daily time and task management system with priority scheduling",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AnimationProvider>
          <AuthProvider>
            <TaskProvider>
              <DayProvider>
                {children}
                <Toaster />
              </DayProvider>
            </TaskProvider>
          </AuthProvider>
        </AnimationProvider>
      </body>
    </html>
  );
}
