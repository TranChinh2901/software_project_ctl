

import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "../globals.css";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300','400','600','700']
})

const robotoMono = Roboto_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})  

export const metadata: Metadata = {
  title: "ND Style - Clothers Store",
  description: "Cửa hàng thời trang ND Style",
};

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${inter.variable} ${robotoMono.variable}`}>
      <Header />
      <main style={{ minHeight: '50vh', padding: '7px 0' }}>{children}</main>
      <Footer />
    </div>
  );
}