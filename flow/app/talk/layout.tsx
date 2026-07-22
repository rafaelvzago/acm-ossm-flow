import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TDC Florianópolis 2026 — OpenShift Service Mesh Multi-Cluster",
  description:
    "TDC Florianópolis 2026 talk: OpenShift Service Mesh multi-cluster fundamentals, configuration, and interactive request flow.",
};

export default function TalkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
