import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import { fetchCategories, fetchCompanySettings } from "@/lib/data";
import { CartProvider } from "@/context/CartContext";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Sabari Krishna Consumables India Private Limited",
  description: "Premium Indian consumables, authentic ghee, cold-pressed oils, and high-quality grocery items.",
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
          <Header categories={categories} />
          
          {/* Main content expands to fill space between header & footer */}
          <main className="flex-1 bg-surface">
            {children}
          </main>
          
          <Footer categories={categories} companySettings={settings} />
          
          {/* Floating Chatbot overlay */}
          <ChatbotWidget />
        </CartProvider>
      </body>
    </html>
  );
}
