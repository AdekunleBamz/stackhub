import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import { ContextProvider } from "./providers";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StackHub | Premium DeFi on Stacks",
  description: "The all-in-one platform for NFTs, Tokens, Staking, and Services on the Stacks blockchain.",
  icons: {
    icon: "/logo.png",
  },
};
/**
 * Root Layout Component.
 * Wraps the entire application with global providers and standard structure.
 */export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const cookies = headersList.get("cookie");

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <ContextProvider cookies={cookies}>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
        </ContextProvider>
      </body>
    </html>
  );
}
