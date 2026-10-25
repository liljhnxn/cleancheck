import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";

export const metadata: Metadata = {
  title: "CleanCheck — Simple Web3 Cleanliness Tracker",
  description:
    "A simple blockchain-based cleanliness checklist for hospitals, clinics, schools, and offices on Botchain Testnet.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-mainText min-h-screen flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
