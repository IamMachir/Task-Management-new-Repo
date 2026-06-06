import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PersonalFocus — Personal Productivity",
  description: "A personal daily planner and productivity tracker built with the CBSD monorepo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-purple-50">
        {children}
      </body>
    </html>
  );
}
