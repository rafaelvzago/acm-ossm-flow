# OpenShift Service Mesh multi-cluster

Ansible pra montar OSSM 3 + ACM em três clusters: hub, spoke e spoke-two. Cobre o caminho dos tutoriais Kiali até Perses, Tempo e alertas de health.

Rafael Zago · Red Hat

## Como rodar

```bash
cd poc
ansible-galaxy collection install -r requirements.yml

# Faça oc login e exporte KUBECONFIG_HUB, KUBECONFIG_SPOKE, KUBECONFIG_SPOKE_TWO
# Detalhes e placeholders: poc/.env.example

ansible-playbook playbooks/site.yml
```

Uso completo (pt-BR): [`poc/README.md`](poc/README.md)

O que foi aplicado no lab de referência, comando a comando: [`docs/OSSM-ACM-FULL-DEPLOYMENT.md`](docs/OSSM-ACM-FULL-DEPLOYMENT.md)

## Licença

Apache 2.0
