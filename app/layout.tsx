import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import { fetchCategories, fetchCompanySettings } from "@/lib/data";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: {
    default: "Sabari Krishna Consumables India Private Limited",
    template: "%s | Sabari Krishna Consumables",
  },
  description: "Premium Indian consumables, authentic ghee, cold-pressed oils, and high-quality grocery items.",
  openGraph: {
    title: "Sabari Krishna Consumables",
    description: "Premium Indian FMCG — ghee, oils, and groceries delivered across India.",
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
  // Fetch data-driven variables on the server side
  const categories = await fetchCategories();
  const settings = await fetchCompanySettings();

  return (
    <html lang="en">
      <body
        className={`${publicSans.variable} font-sans bg-background text-on-surface antialiased min-h-screen flex flex-col`}
      >
        <CartProvider>
          <WishlistProvider>
            <Header categories={categories} />

            <main className="flex-1 bg-surface">
              {children}
            </main>

            <Footer categories={categories} companySettings={settings} />

            <ChatbotWidget />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
