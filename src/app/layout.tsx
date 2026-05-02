import type { Metadata, Viewport } from "next";
import { Sidebar } from "@/components/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "IELTS Vocabulary Drill",
  description: "Practice 896 IELTS Listening vocabulary words with typing and listen-and-type drills.",
  applicationName: "IELTS Vocab",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "IELTS Vocab",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2563eb",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1">
            <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-6 pt-16 sm:py-12">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

