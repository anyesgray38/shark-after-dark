import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://anyesgray38.github.io/shark-after-dark";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Shark After Dark | Private Grooming Studio",
    template: "%s | Shark After Dark",
  },
  description:
    "Shark After Dark is a private grooming studio in Thomaston, Georgia, offering precision men's haircuts, fades, beard grooming, and a considered appointment experience.",
  keywords: [
    "Shark After Dark",
    "barber Thomaston GA",
    "barber Thomaston Georgia",
    "men's haircut Thomaston GA",
    "fade haircut Thomaston GA",
    "men's grooming Thomaston GA",
    "beard trim Thomaston GA",
    "private barber",
    "grooming studio",
  ],
  applicationName: "Shark After Dark",
  authors: [{ name: "Shark After Dark" }],
  creator: "Shark After Dark",
  publisher: "Shark After Dark",
  category: "beauty",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Shark After Dark | Private Grooming Studio",
    description:
      "Precision cuts, beard grooming, and private appointments in Thomaston, Georgia.",
    url: siteUrl,
    siteName: "Shark After Dark",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Shark After Dark | Private Grooming Studio",
    description:
      "Precision cuts, beard grooming, and private appointments in Thomaston, Georgia.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
