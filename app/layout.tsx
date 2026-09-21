import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shark After Dark",
  description: "Premium after-hours mobile barbering.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}