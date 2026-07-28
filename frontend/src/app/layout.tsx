"use client";

import { ConfigProvider } from "antd";
import { AuthProvider } from "@/providers/AuthProvider";
import QueryProvider from "@/providers/QueryProvider";
import "@/styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Disaster Management System</title>
        <meta name="description" content="Crisis management, volunteer coordination, and donation tracking" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body>
        <QueryProvider>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#1677ff",
                borderRadius: 6,
              },
            }}
          >
            <AuthProvider>{children}</AuthProvider>
          </ConfigProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
