import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./painel.css";

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Painel · Arquitetura resiliente sob pressão | TDC Floripa 2026",
  description:
    "Roteiro de perguntas e timing para o painel Arquitetura resiliente sob pressão — Trilha Arquitetura Cloud, TDC Florianópolis 2026.",
};

export default function PainelLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const fontVars = {
    "--font-display": "var(--font-mono)",
    "--font-body": "var(--font-mono)",
  } as CSSProperties;

  return (
    <div
      lang="pt-BR"
      className={`painel-root ${jetbrains.variable}`}
      style={fontVars}
    >
      {children}
    </div>
  );
}
