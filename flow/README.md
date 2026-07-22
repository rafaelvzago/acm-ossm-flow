# OpenShift Service Mesh — Multi-Cluster Flow

Interactive site for the OpenShift Service Mesh 3 multi-cluster request path, plus a moderator runbook for the TDC Florianópolis 2026 panel on resilient cloud architecture.

**Live:** [ossm.rafaelvzago.com](https://ossm.rafaelvzago.com)  
**Author:** [Rafael Zago](https://github.com/rafaelvzago) · Senior Software Automation Engineer · Red Hat

## Pages

| Path | What it is |
| --- | --- |
| [`/`](https://ossm.rafaelvzago.com/) | Animated OSSM 3 multi-cluster diagram: shared trust, remote discovery, east-west gateways, and one Istio mesh ID (`bookinfo-mesh`) |
| [`/painel/`](https://ossm.rafaelvzago.com/painel/) | Moderator runbook for the TDC panel *Arquitetura resiliente sob pressão* (timed blocks, questions, mark-as-used) |

### Home — multi-cluster request flow

Six chapters with GSAP timeline playback:

1. **Architecture** — two Sail-managed control planes
2. **Shared trust** — common root CA and per-cluster intermediates
3. **Discovery** — remote secrets for cross-cluster service discovery
4. **mTLS request** — east-west path on `:15443` with TLS passthrough
5. **Response** — encrypted return without breaking workload mTLS
6. **One mesh** — single logical Istio mesh across clusters

Keyboard: Space play/pause · ←/→ chapters · R replay. Reduced-motion mode shows the full architecture without animation.

### `/painel` — TDC Floripa 2026 panel

- **When:** 24/07/2026 · 14:10–15:10 · Trilha Arquitetura Cloud
- **Theme:** Catppuccin Macchiato (same tokens as [claude.rafaelvzago.com](https://claude.rafaelvzago.com))
- **Blocks:** Abertura → Aplicação → Kubernetes → Multi-cloud → Operação → Fechamento
- **Participants:**
  - Marcelo Kruger · Engenheiro de Cloud · Trillia B3
  - Flávio Pimenta · Staff Engineer · Select Soluções
  - [Amim K.](https://www.linkedin.com/in/amim/) · Principal Software Engineer · Broadcom

Question marks persist in `localStorage` on the device used for moderation.

## Stack

- Next.js (App Router) + React
- GSAP for the home timeline
- Static export for GitHub Pages (`GITHUB_PAGES=1`)
- Custom domain via `public/CNAME` → `ossm.rafaelvzago.com`

## Develop

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite (often `http://localhost:5173` or `5174`).

- Home: `/`
- Panel: `/painel/`

## Build for GitHub Pages

```bash
npm run build:pages
```

Output lands in `out/` (includes `CNAME` and `/painel/`).

Deploy is automatic on push to `main` via [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml).

## Repo layout

```
app/
  page.tsx              # multi-cluster flow diagram
  painel/               # TDC panel runbook
  layout.tsx
  globals.css
public/
  CNAME                 # ossm.rafaelvzago.com
  openshift-service-mesh.svg
.github/workflows/
  deploy-pages.yml
```

## License

See repository license.
