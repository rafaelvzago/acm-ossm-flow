# OpenShift Service Mesh multi-cluster

**Language:** English | [Português (Brasil)](README.pt-BR.md)

Ansible to stand up OSSM 3 + ACM on three clusters: hub, spoke, and spoke-two. Covers the Kiali tutorial path — hub/spoke, multi-primary, Perses, Tempo, and health alerts.

Rafael Zago · Red Hat

## Prerequisites

`oc`, `ansible-core` (≥ 2.15), `openssl`, `jq`, and `istioctl` 1.30.1 on your PATH. You log into the three clusters outside Ansible. If `*.apps.*` is on a private network, use a VPN or bastion.

## Quick start

```bash
cp .env.example .env
# oc login on all three clusters; set the paths in .env
set -a; source .env; set +a

make galaxy   # ansible-galaxy collection install -r requirements.yml
make site     # Parts 1–4 + verify
```

Do not commit `.env`, kubeconfigs, certs, or passwords. The inventory only has placeholders (`api.*.example.com`).

## Docs

- [Wiki](https://github.com/rafaelvzago/acm-ossm-flow/wiki) — full how-to, variables, and known traps ([pt-BR](https://github.com/rafaelvzago/acm-ossm-flow/wiki/Home-pt-BR))
- [`docs/OSSM-ACM-FULL-DEPLOYMENT.md`](docs/OSSM-ACM-FULL-DEPLOYMENT.md) — what we ran by hand, command by command
- Kiali: [hub/spoke](https://kiali.io/docs/tutorials/ossm-multicluster/ossm-acm-hub-spoke/), [multi-primary](https://kiali.io/docs/tutorials/ossm-multicluster/ossm-acm-multi-primary/), [Perses + Tempo](https://kiali.io/docs/tutorials/ossm-multicluster/ossm-dashboards-tracing/), [health alerts](https://kiali.io/docs/tutorials/ossm-multicluster/ossm-health-status-alerts/)

## License

Apache 2.0
