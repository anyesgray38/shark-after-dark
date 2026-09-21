import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shark After Dark | Private Grooming Studio",
  description: "Private grooming, precision cuts, and considered service in Thomaston, Georgia.",
  keywords: ["barber", "grooming", "Thomaston Georgia", "Shark After Dark", "haircut"],
  openGraph: {
    title: "Shark After Dark | Private Grooming Studio",
    description: "Sharp cuts. Quiet luxury.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}