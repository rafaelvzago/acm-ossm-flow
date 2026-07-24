# OSSM ACM multi-cluster (Ansible)

Playbooks que recriam o lab dos tutoriais Kiali de OSSM + ACM: hub/spoke, multi-primary, Perses/Tempo e alertas de health.

O passo a passo que rodamos na mão está em [`docs/OSSM-ACM-FULL-DEPLOYMENT.md`](../docs/OSSM-ACM-FULL-DEPLOYMENT.md). Os tutoriais oficiais mudam de URL às vezes; o runbook é o que de fato foi aplicado.

| Parte | Tutorial |
|-------|----------|
| Hub/spoke | https://kiali.io/docs/tutorials/ossm-multicluster/ossm-acm-hub-spoke/ |
| Multi-primary | https://kiali.io/docs/tutorials/ossm-multicluster/ossm-acm-multi-primary/ |
| Perses + Tempo | https://kiali.io/docs/tutorials/ossm-multicluster/ossm-dashboards-tracing/ |
| Health alerts | https://kiali.io/docs/tutorials/ossm-multicluster/ossm-health-status-alerts/ |

## O que não vai pro git

Sem senha de kubeadmin, sem token, sem kubeconfig. Sem API/LB/Route de lab real no inventário.

Os endereços East-West e o host da Route do OTEL saem do cluster em runtime. MinIO usa `minio` / `minio123` só como object storage in-cluster (demo ACM/Tempo), não como admin do OpenShift.

## Antes de rodar

Você precisa de `oc`, `ansible-core` (≥ 2.15), `openssl`, `jq` e `istioctl` 1.30.1 no PATH. Login nos três clusters é fora do Ansible. Se os `*.apps.*` apontam pra rede privada, use VPN ou bastion.

```bash
# Troque pelos seus APIs. Não commite os reais.
KUBECONFIG=~/.kube/hub oc login --server=https://api.hub.example.com:6443 \
  -u=kubeadmin -p='<SENHA>' --insecure-skip-tls-verify

KUBECONFIG=~/.kube/spoke oc login --server=https://api.spoke.example.com:6443 \
  -u=kubeadmin -p='<SENHA>' --insecure-skip-tls-verify

KUBECONFIG=~/.kube/spoke-two oc login --server=https://api.spoke-two.example.com:6443 \
  -u=kubeadmin -p='<SENHA>' --insecure-skip-tls-verify

export KUBECONFIG_HUB=~/.kube/hub
export KUBECONFIG_SPOKE=~/.kube/spoke
export KUBECONFIG_SPOKE_TWO=~/.kube/spoke-two
export PATH="$HOME/.local/bin:$PATH"
```

Atalho: copie `.env.example` para `.env` e rode `set -a; source .env; set +a`.

## Setup e deploy

```bash
cd poc
make galaxy   # ansible-galaxy collection install -r requirements.yml

make site     # Parts 1–4 + verify
```

Ou por fase, se preferir ir aos poucos:

```bash
make hub-spoke
make multi-primary
make perses-tempo
make health-alerts
make verify
```

Pra apagar (pede confirmação de propósito):

```bash
ansible-playbook playbooks/teardown.yml -e confirm_teardown=true
```

## Variáveis que costumam mudar

Em [`inventory/group_vars/all.yml`](inventory/group_vars/all.yml):

| Variável | Default | Pra quê |
|----------|---------|---------|
| `clusters.*.name` | `spoke` / `spoke-two` | Nome no ACM e no Istio |
| `clusters.*.network` | `network1` / `network2` | Rede do mesh |
| `istio_version` | `1.30.1` | Versão Sail/Istio |
| `mesh_id` | `mesh1` | ID do mesh (também é o tenant do Tempo) |
| `acm_channel` | vazio | Vazio = canal mais recente do packagemanifest |
| `cloud_provider` | `generic` | LB por IP; use `aws` se preferir hostname |
| `minio_access_key` / `minio_secret_key` | `minio` / `minio123` | Só in-cluster |
| `tempo_namespace` / `tempo_stack_name` | `tempo` / `istio` | TempoStack |

## Como fica no final

```
Hub (ACM + Thanos/MinIO)
  ├── spoke
  └── spoke-two

spoke (network1) ←→ East-West ←→ spoke-two (network2)
  Istio, Kiali, Perses, Tempo          Istio, OTEL forwarder
```

## Bateria rápida depois do deploy

```bash
oc --kubeconfig=$KUBECONFIG_HUB get managedclusters
oc --kubeconfig=$KUBECONFIG_SPOKE get istio,ztunnel
oc --kubeconfig=$KUBECONFIG_SPOKE_TWO get istio,ztunnel
oc --kubeconfig=$KUBECONFIG_SPOKE get gateway -n istio-system
oc --kubeconfig=$KUBECONFIG_SPOKE get tempostack -n tempo
oc --kubeconfig=$KUBECONFIG_SPOKE get persesdashboard -n perses
oc --kubeconfig=$KUBECONFIG_SPOKE get prometheusrule -n istio-system | grep kiali
```

## Armadilhas que já quebraram o lab

O código tenta não repetir esses erros:

1. `istioctl create-remote-secret` precisa de `-n istio-system` (senão procura SA no `default`).
2. ServiceMonitor do Kiali: CA pelo ConfigMap `kiali-cabundle-openshift`, não `caFile` (UWM barra acesso a arquivo).
3. Patch de Perses/Tempo no Kiali é merge-safe com `jq`. Não reescreva o CR inteiro ou some o Prometheus/OAuth.
4. No Bookinfo, espere Deployment Available. `oc wait --all pods` costuma dar timeout enquanto pod antigo termina.

## Layout

```
poc/
  playbooks/     # 00–04, site, verify, teardown
  roles/         # acm_*, certificates, ossm3, kiali, eastwest, …
  inventory/     # hosts + group_vars (sem endereços reais)
  files/certs/   # gerado na máquina, gitignored
```
