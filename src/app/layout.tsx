import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { StarknetProvider } from "./providers/StarknetProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Starky",
  description: "Join the fun and start winning Starky tokens today! 🎉",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StarknetProvider>{children}</StarknetProvider>
      </body>
    </html>
  );
}
