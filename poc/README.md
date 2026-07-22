# OSSM Multi-Cluster POC

Ansible automation for deploying a multi-primary OpenShift Service Mesh 2.6 setup across two clusters.

Based on: [Multi-Primary Multi-Cluster Setup in OpenShift Service Mesh](https://developers.redhat.com/articles/2024/07/02/multi-primary-multi-cluster-setup-openshift-service-mesh)

## Prerequisites

- Two OpenShift clusters with the ServiceMesh operator installed
- `oc` CLI tool
- `ansible-core` >= 2.15
- `openssl`
- Python `kubernetes` package (`pip install kubernetes`)

## Quick start

```bash
# Install Ansible collections
cd poc
ansible-galaxy collection install -r requirements.yml

# Login to both clusters (each writes its own kubeconfig)
KUBECONFIG=~/.kube/west oc login --server=https://api.west.example.com:6443 --token=sha256~xxx
KUBECONFIG=~/.kube/east oc login --server=https://api.east.example.com:6443 --token=sha256~yyy

# Export for Ansible
export KUBECONFIG_WEST=~/.kube/west
export KUBECONFIG_EAST=~/.kube/east

# Run the full setup
ansible-playbook -i inventory/hosts.yml playbooks/site.yml
```

## Running individual phases

Each phase has a standalone playbook for debugging or demos:

```bash
ansible-playbook -i inventory/hosts.yml playbooks/01-certificates.yml
ansible-playbook -i inventory/hosts.yml playbooks/02-mesh-control-plane.yml
ansible-playbook -i inventory/hosts.yml playbooks/03-eastwest-gateway.yml
ansible-playbook -i inventory/hosts.yml playbooks/04-remote-secrets.yml
ansible-playbook -i inventory/hosts.yml playbooks/05-mesh-networks.yml
ansible-playbook -i inventory/hosts.yml playbooks/06-demo-apps.yml
ansible-playbook -i inventory/hosts.yml playbooks/07-verify.yml
```

## Teardown

```bash
ansible-playbook -i inventory/hosts.yml playbooks/teardown.yml
```

## Configuration

Edit `inventory/group_vars/all.yml` to customize:

| Variable | Default | Description |
|---|---|---|
| `cloud_provider` | `aws` | `aws` (hostname) or `generic` (IP) for LB address |
| `mesh_id` | `bookinfo-mesh` | Mesh identifier |
| `smcp_mode` | `ClusterWide` | ServiceMeshControlPlane mode |
| `cert_validity_days` | `3650` | Certificate validity period |
| `token_duration` | `48h` | istio-reader SA token duration |

## What it automates

1. Root CA and per-cluster intermediate CA generation
2. `istio-system` namespace creation with network labels
3. CA certificate secrets (`cacerts`)
4. ServiceMeshControlPlane deployment
5. East-west gateway (Service + Deployment + Gateway CR)
6. Cross-cluster authentication (reader kubeconfigs + remote secrets)
7. Mesh network configuration with real gateway addresses
8. Bookinfo + sleep demo application deployment
9. Cross-cluster connectivity verification
