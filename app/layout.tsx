import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Footer from "@/components/common/Footer";
import { ClerkProvider } from "@clerk/nextjs";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agent Blogger",
  description:
    "it's an application where ai agent writes, research and do post blog as well.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${outfit.className} flex flex-col antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
