import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/NavBarComponent";
import TituloHeader from "@/components/TitleHeader";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "700"]
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "700"]
})

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Transparencia politica",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const links = [
    {label: "Incio", href: "/"},
    {label: "Partidos Politicos", href: "/Partidos"},
    {label: "Candidatos", href: "/Candidatos"},
  ]
  return (
    <html lang="en" className = {`${montserrat.variable} ${inter.variable}`}>
      <body className="font-montserrat antialiased">
        <div>
          <TituloHeader title="Transparencia Politica" subtitle="Al alcanze de todos..."/>
          <Navbar links={links}/>
        </div>
        <h1></h1>
        
        <main className="mx-auto max-w-xl">
          <div className="px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
