import type { Metadata } from "next";
import "../src/app/globals.css";

export const metadata: Metadata = {
  title: "ScoutBet - AI-Powered Sports Analytics",
  description: "Análise inteligente de apostas esportivas com IA e dados em tempo real",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
