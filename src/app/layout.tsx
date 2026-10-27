import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI BUILDER | AI Career Platform",
  description: "AI-powered career platform helping engineering graduates get jobs in 90 days.",
  manifest: "/manifest.json",
};

import SessionWrapper from "@/components/SessionWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
