import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LOIVO - YOUR EVERYDAY MARKETPLACE",
  description: "Shop the best Home Decor and Kitchen Appliances from trusted vendors on LOIVO.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Global Wrapper for BuyNix Platform */}
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}