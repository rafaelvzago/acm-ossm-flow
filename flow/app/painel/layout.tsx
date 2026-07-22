import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./painel.css";

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Painel · Arquitetura resiliente sob pressão | TDC Floripa 2026",
  description:
    "Roteiro de perguntas e timing para o painel Arquitetura resiliente sob pressão — Trilha Arquitetura Cloud, TDC Florianópolis 2026.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#181926",
};

export default function PainelLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div lang="pt-BR" className={`painel-root ${jetbrains.variable}`}>
      {children}
    </div>
  );
}
