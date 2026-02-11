import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import "./globals.css";
import SystemThemeSync from "@/components/SystemThemeSync";

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Resume Analyzer",
  description: "Resume analysis, ATS scoring, and AI resume generation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${manrope.variable} bg-fog text-ink antialiased`}>
        <SystemThemeSync />
        {children}
      </body>
    </html>
  );
}
