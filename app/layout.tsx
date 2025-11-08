import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Prepify",
    template: "%s | Prepify",
  },
  description: "Prepify is an AI-powered platform for mock interview preparation.",
  applicationName: "Prepify",
  keywords: [
    "interview prep",
    "mock interviews",
    "AI interview coach",
    "technical interviews",
    "behavioral interviews",
  ],
  openGraph: {
    title: "Prepify",
    description: "AI-powered mock interview practice and feedback.",
    url: "https://prepify.app",
    siteName: "Prepify",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prepify",
    description: "AI-powered mock interview practice and feedback.",
    creator: "@prepify",
  },
  icons: {
    icon: [
      { url: "/svg/Logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/svg/Logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${monaSans.className} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
