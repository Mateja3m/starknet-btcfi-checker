import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Starknet BTCFi Preflight Checker",
  description: "Read-only Starknet wallet readiness checker for strkBTC BTCFi flows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

