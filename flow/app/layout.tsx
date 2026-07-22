import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenShift Service Mesh 3 — Multi-Cluster Request Flow",
  description:
    "Interactive diagram of OpenShift Service Mesh 3 multi-cluster architecture: shared trust, remote discovery, east-west gateways, and one Istio mesh ID.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
