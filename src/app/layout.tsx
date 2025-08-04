import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScoutBet - AI-Powered Sports Analytics",
  description: "Análise inteligente de apostas esportivas com IA e dados em tempo real",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="antialiased bg-gray-50 dark:bg-gray-900 container mx-auto px-4 md:px-6 lg:px-8 max-w-screen-xl" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
