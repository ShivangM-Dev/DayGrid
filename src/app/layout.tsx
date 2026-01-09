import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TaskProvider } from "@/context/task-context";
import { DayProvider } from "@/context/day-context";
import { AnimationProvider } from "@/context/animation-context";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/shared/ui/sonner";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AnimationProvider>
            <TaskProvider>
              <DayProvider>
                {children}
                <Toaster />
              </DayProvider>
            </TaskProvider>
          </AnimationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
