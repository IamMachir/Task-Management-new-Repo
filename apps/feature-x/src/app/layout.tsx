import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TeamFlow — Team Task Management",
  description: "A Kanban-style team task management dashboard built with the CBSD monorepo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        {children}
      </body>
    </html>
  );
}
