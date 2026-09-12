import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

export const dynamic = 'force-dynamic';

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: {
    default: "Sabari Krishna Consumables India Private Limited",
    template: "%s | Sabari Krishna Consumables India Private Limited",
  },
  description: "Official corporate portal for Sabari Krishna Consumables India Private Limited — featuring Sabari GKS pure ghee & cold-pressed oils, GKS Mart (gksmart.in) retail network, and B2B institutional supply.",
  openGraph: {
    title: "Sabari Krishna Consumables India Private Limited",
    description: "Official corporate portal for Sabari Krishna Consumables India Private Limited — featuring Sabari GKS pure ghee & cold-pressed oils, GKS Mart (gksmart.in) retail network, and B2B institutional supply.",
    type: "website",
    locale: "en_IN",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${publicSans.variable} font-sans bg-background text-on-surface antialiased min-h-screen flex flex-col`}
      >
        <CartProvider>
          <WishlistProvider>
            <Header />

            <main className="flex-1 bg-surface">
              {children}
            </main>

            <Footer />

            <ChatbotWidget />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
