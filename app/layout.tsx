import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-playfair',
});

const lato = Lato({
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: '--font-lato',
});

export const metadata: Metadata = {
  title: "Monique Maakt Webshop",
  description: "Een moderne webshop met iDEAL betalingen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className={`${playfair.variable} ${lato.variable} font-sans bg-stone-50 text-stone-700`}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}

