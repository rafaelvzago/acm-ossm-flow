# OpenShift Service Mesh multi-cluster

Ansible pra montar OSSM 3 + ACM em três clusters: hub, spoke e spoke-two. Cobre o que os tutoriais Kiali descrevem — hub/spoke, multi-primary, Perses, Tempo e alertas de health.

Rafael Zago · Red Hat

## Pré-requisitos

`oc`, `ansible-core` (≥ 2.15), `openssl`, `jq` e `istioctl` 1.30.1 no PATH. O login nos três clusters é fora do Ansible. Se `*.apps.*` for rede privada, VPN ou bastion.

## Como rodar

```bash
cp .env.example .env
# oc login nos três clusters; ajuste os caminhos no .env
set -a; source .env; set +a

make galaxy   # ansible-galaxy collection install -r requirements.yml
make site     # Parts 1–4 + verify
```

Não commite `.env`, kubeconfig, cert nem senha. No inventário só tem placeholder (`api.*.example.com`).

## Docs

- [Wiki](https://github.com/rafaelvzago/acm-ossm-flow/wiki) — uso completo, variáveis e armadilhas
- [`docs/OSSM-ACM-FULL-DEPLOYMENT.md`](docs/OSSM-ACM-FULL-DEPLOYMENT.md) — o que rodamos na mão, comando a comando
- Kiali: [hub/spoke](https://kiali.io/docs/tutorials/ossm-multicluster/ossm-acm-hub-spoke/), [multi-primary](https://kiali.io/docs/tutorials/ossm-multicluster/ossm-acm-multi-primary/), [Perses + Tempo](https://kiali.io/docs/tutorials/ossm-multicluster/ossm-dashboards-tracing/), [health alerts](https://kiali.io/docs/tutorials/ossm-multicluster/ossm-health-status-alerts/)

## Licença

Apache 2.0
