# Handoff: OSSM ACM multi-cluster (full tutorial series)

> **Full step-by-step runbook (every command/YAML):** [docs/OSSM-ACM-FULL-DEPLOYMENT.md](docs/OSSM-ACM-FULL-DEPLOYMENT.md) — also at `~/.local/share/ossm-acm/OSSM-ACM-FULL-DEPLOYMENT.md`.

**Written:** 2026-07-23 (~21:55 -03)  
**Purpose:** Resume this work at home / in a fresh agent session.  
**Machine paths assume:** `<HOME>` on this Fedora host.

**Security:** No kubeadmin passwords or tokens are stored here. Re-login if kubeconfig expires. Passwords were only in chat history.

---

## Suggested skills (next agent)

- Follow process from https://raw.githubusercontent.com/rafaelvzago/talks/main/docs/agents/sdlc.md only if building repo artifacts; this session was **ops-only** (no git / no issues by user choice).
- Tutorials (source of truth for what was applied):
  - Hub/spoke: https://kiali.io/docs/tutorials/ossm-multicluster/ossm-acm-hub-spoke/
  - Multi-primary: https://deploy-preview-995--kiali.netlify.app/docs/tutorials/ossm-multicluster/ossm-acm-multi-primary/
  - Dashboards + tracing: https://deploy-preview-995--kiali.netlify.app/docs/tutorials/ossm-multicluster/ossm-dashboards-tracing/
  - Health status alerts: https://deploy-preview-995--kiali.netlify.app/docs/tutorials/ossm-multicluster/ossm-health-status-alerts/
- Plans (Cursor):
  - `~/.cursor/plans/ossm_acm_hub-spoke_deploy_1e9a0f63.plan.md`
  - `~/.cursor/plans/ossm_acm_multi-primary_6046a0af.plan.md`
  - `~/.cursor/plans/ossm_dashboards_tracing_e3edff60.plan.md`
  - `~/.cursor/plans/ossm_health_alerts_1a2376b4.plan.md`

---

## Workspace / git (context only)

- Repo: `<REPO_ROOT>` → remote `rafaelvzago/acm-ossm-flow`
- Branch at session start: `poc` with **working tree deletions** of `flow/` and old OSSM 2.6 `poc/` Ansible (intentional clean slate; **do not restore unless asked**).
- User chose: **no git commits**, **no GitHub issues**, one-shot live `oc` deploy.

---

## Locked decisions (grill)

1. Outcome: run Kiali tutorials live (not rebuild Ansible).
2. Tracker: waived (no PRD/tickets).
3. Working tree wipe: intentional for ACM/OSSM3 path.
4. Repo artifacts: none (ops-only; HANDOFF is local context only).
5. Clusters: greenfield at start of hub-spoke.
6. Auth: `oc login` with kubeadmin; contexts renamed to tutorial names.
7. Execution: end-to-end; pause only on hard failures.
8. Done criteria: all four tutorials verified (hub-spoke → multi-primary → Perses/Tempo → health alerts).

---

## Local tooling & files

| Item | Path / value |
|------|----------------|
| Kubeconfig | `~/.kube/ossm-acm-hub-spoke` |
| `istioctl` | `~/.local/bin/istioctl` **1.30.1** |
| Durable Istio root CA | `~/.local/share/ossm-acm/istio-certs/root-{cert,key}.pem` |
| Spoke-two intermediate CA | `~/.local/share/ossm-acm/istio-certs/spoke-two/` |
| OTEL mTLS certs (ephemeral) | `/tmp/otel-mtls/` (regenerate if needed) |
| Tutorial working copy of Istio certs | `/tmp/istio-certs/` (prefer durable path if `/tmp` cleared) |
| This handoff | `~/.local/share/ossm-acm/HANDOFF.md` |
| Workspace copy | `<REPO_ROOT>/HANDOFF.md` |

```bash
export KUBECONFIG=~/.kube/ossm-acm-hub-spoke
export PATH="$HOME/.local/bin:$PATH"
```

If `/tmp/istio-certs` is gone:

```bash
mkdir -p /tmp/istio-certs
cp -a ~/.local/share/ossm-acm/istio-certs/root-*.pem /tmp/istio-certs/
cp -a ~/.local/share/ossm-acm/istio-certs/spoke-two /tmp/istio-certs/
```

---

## Clusters & contexts

| Context | Role | API |
|---------|------|-----|
| `ossm-kiali-hub` | ACM hub + Thanos/Observatorium (no OSSM) | `https://api.hub.example.com:6443` |
| `ossm-kiali-spoke` | Istio primary 1 + Kiali UI + Perses + Tempo | `https://api.spoke.example.com:6443` |
| `ossm-kiali-spoke-two` | Istio primary 2 + OTEL forwarder | `https://api.spoke-two.example.com:6443` |

Note: confirm each cluster API hostname carefully; they may not share a common prefix.

All three were OpenShift **4.22.5** at deploy time. ACM ManagedClusters: `local-cluster`, `spoke`, `spoke-two` (Joined/Available).

### Re-login template (if kubeconfig expires)

```bash
export KUBECONFIG=~/.kube/ossm-acm-hub-spoke
oc login <API> -u=kubeadmin -p='<from password manager / chat>' --insecure-skip-tls-verify
# then rename context to ossm-kiali-hub | ossm-kiali-spoke | ossm-kiali-spoke-two
```

---

## Env vars used (must stay consistent)

```bash
export SPOKE_CLUSTER_NAME="spoke"
export SPOKE_TWO_CLUSTER_NAME="spoke-two"
export ISTIO_VERSION="1.30.1"
export MESH_ID="mesh1"
export SPOKE_NETWORK="network1"
export SPOKE_TWO_NETWORK="network2"
export TEMPO_NAMESPACE="tempo"
export TEMPO_STACK_NAME="istio"
export TEMPO_TENANT="mesh1"          # matches MESH_ID
export MINIO_ACCESS_KEY="minio"
export MINIO_SECRET_KEY="minio123"   # in-cluster MinIO only (hub ACM + spoke Tempo)
export KIALI_CR_NS=istio-system
export KIALI_NS=istio-system
```

---

## Architecture (current)

```
Hub (ACM + MCO/Thanos/MinIO)
  ├── managed: spoke
  ├── managed: spoke-two
  ├── allowlist: Istio metrics + kiali_health_status
  └── Thanos Ruler: KialiHub* health alerts

spoke  (network1)  ←→ East-West (HBONE :15008 + sidecar mTLS :15443) ←→  spoke-two (network2)
  Istio + ZTunnel + Kiali (UI)                                              Istio + ZTunnel
  Perses (COO) → hub Thanos                                                 OTEL forwarder → spoke mTLS Route
  TempoStack + MinIO + OTEL local/remote                                    Telemetry → local OTEL
  UWM scrapes kiali_health_status
  ambient-demo + bookinfo                                                   ambient-demo + ratings-v2
  kiali-multi-cluster-secret → spoke-two API
```

- Shared Istio root CA; each spoke has its own intermediate.
- Metrics: spoke UWM → ACM collector → hub Thanos; Kiali on spoke queries Observatorium with mTLS certs from hub.
- Traces: both clusters → OTEL → Tempo on spoke (tenant `mesh1`); Kiali links to OCP Observe > Traces.
- Graph/metrics lag via ACM: ~5–15 minutes collection interval.

---

## What was deployed (completed)

### Phase A — Hub/spoke tutorial (done, verified)

1. ACM `release-2.17` + MultiClusterHub Running  
2. MinIO + MultiClusterObservability Ready + Istio metrics allowlist  
3. Imported `spoke`  
4. Spoke: UWM, OSSM3, Istio/CNI/ZTunnel `v1.30.1`, Kiali + OSSMConsole  
5. Demos: `ambient-demo` (helloworld + waypoint + traffic-gen), `bookinfo` (full + traffic-gen)  
6. Verified: mesh healthy, traffic, Istio metrics in hub Thanos, Kiali up  

### Phase B — Multi-primary tutorial (done, verified)

1. Spoke-two intermediate CA from same root  
2. ACM import `spoke-two`  
3. OSSM3 on spoke-two with `clusterName=spoke-two`, `network=network2`, `AMBIENT_ENABLE_MULTI_NETWORK`  
4. Patched spoke1 Istio/ZTunnel/Kiali for `spoke` / `network1`; restarted bookinfo  
5. EW gateways both sides + `meshNetworks` (IPs recorded below)  
6. `istioctl create-remote-secret` both ways (**needed `-n istio-system`**; tutorial omitted it)  
7. Kiali remote-only CR on spoke-two + `kiali-multi-cluster-secret` on spoke1  
8. Spoke-two demos: ambient helloworld + waypoint; Bookinfo `ratings-v2`; `istio.io/global=true` on helloworld + ratings  
9. Verified cross-cluster helloworld (traffic-gen logs showed pods from both clusters)  

**Kiali UX fixes kept:** `kubernetes_config.cluster_name: spoke`, `auth.openshift.insecure_skip_verify_tls: true` (RHQE self-signed OAuth).

### East-West LB addresses (at deploy)

| Cluster | HBONE (15008) | Sidecar (15443) |
|---------|---------------|-----------------|
| spoke | `<SPOKE_HBONE_LB>` | `<SPOKE_SIDECAR_LB>` |
| spoke-two | `<SPOKE_TWO_HBONE_LB>` | `<SPOKE_TWO_SIDECAR_LB>` |

Services: `istio-eastwestgateway`, `istio-eastwestgateway-sidecar-istio` in `istio-system`.

### Phase C — Perses + Tempo (done, verified)

**Perses (spoke only):**

1. Cluster Observability Operator + `UIPlugin` `monitoring` (`perses.enabled: true`)  
2. Namespace `perses`: datasource `acm-thanos` → hub Observatorium (mTLS, same pattern as Kiali)  
3. Dashboards: `istio-mesh-overview`, `istio-workload-dashboard`, `istio-ztunnel-dashboard`  
4. Kiali `external_services.perses` with `url_format: openshift` (no `internal_url`)  

**Tempo (spoke + spoke-two):**

1. Tempo Operator on spoke; OpenTelemetry Operator on both spokes  
2. NS `tempo`: MinIO + `TempoStack` `istio`, tenant `mesh1`  
3. RBAC write/read for Tempo gateway  
4. Local OTEL `otel` on spoke → Tempo; remote receiver `otel-remote-spoke-two` + passthrough Route + openssl mTLS  
5. Spoke-two OTEL forwarder → spoke Route (client bundle secret)  
6. Both Istio CRs: `enableTracing` + `extensionProviders` `otel-tracing`; Telemetry 100% in `istio-system`, `bookinfo`, `ambient-demo`; waypoints restarted  
7. `UIPlugin` `distributed-tracing`  
8. Kiali `external_services.tracing` → Tempo, `url_format: openshift`, tenant `mesh1`  

**Verified:** Tempo search returns bookinfo/ambient traces; TraceQL `{ resource.k8s.cluster.name = "spoke-two" }` matches cross-cluster spans.

Remote receiver Route host (at deploy):  
`otel-remote-spoke-two-istio-system.apps.spoke.example.com`

### Phase D — Health status alerts (done, verified)

**Spoke (Kiali only there):**

1. UWM already enabled  
2. Kiali `server.observability.metrics` + `health_status.enabled: true` (port `tcp-metrics` 9090)  
3. `ServiceMonitor` `kiali` with ConfigMap CA (`kiali-cabundle-openshift`), not `caFile`  
4. PrometheusRules in `istio-system` (`leaf-prometheus`):  
   - `kiali-health-status` (recording + Failure/Degraded/Namespace alerts)  
   - `kiali-health-status-bookinfo`  
   - `kiali-health-status-not-ready`  
5. Demo: shortened `for` → forced Failure → `KialiHealthFailure` **firing** → restored VS / `health_config` / `for: 5m`  

**Hub:**

1. Appended `kiali_health_status` to `observability-metrics-custom-allowlist`  
2. Created `thanos-ruler-custom-rules` with `KialiHubHealthFailure|Degraded|NamespaceHealthFailure`  
3. Verified series in hub Thanos (`kiali_health_status` present)

Gauge: `0` Healthy, `1` Not Ready, `2` Degraded, `3` Failure. Use `exported_namespace` in PromQL (UWM rewrites `namespace`).

---

## URLs (apps need VPC / VPN — DNS is private 10.0.x.x)

| What | URL |
|------|-----|
| **Kiali (both meshes)** | https://kiali-istio-system.apps.spoke.example.com |
| Hub console | https://console-openshift-console.apps.hub.example.com |
| Spoke1 console | https://console-openshift-console.apps.spoke.example.com |
| Spoke2 console | https://console-openshift-console.apps.spoke-two.example.com |
| Observatorium (hub) | https://observatorium-api-open-cluster-management-observability.apps.hub.example.com/api/metrics/v1/default |

**Why console/Kiali fail from home laptop without VPN:** `*.apps.*` resolves to private AWS IPs (e.g. `<PRIVATE_APPS_IP>`). Use RHQE VPN / bastion, or work from a host on that network.

### Console paths (spoke1)

| Feature | Path |
|---------|------|
| Perses dashboards | Observe → Dashboards (Perses) |
| Traces (Tempo) | Observe → Traces (TempoStack `istio`, tenant `mesh1`) |
| Health metrics | Observe → Metrics → `kiali_health_status` |
| Local alerts | Observe → Alerting → `KialiHealth*` |

### How to see both OSSM clusters in Kiali

1. VPN into the environment.  
2. Open Kiali URL above; log in as OpenShift user on **spoke**.  
3. Cluster dropdown: select **`spoke`** and **`spoke-two`** (OAuth for spoke-two).  
4. Traffic Graph → namespaces `ambient-demo` + `bookinfo`.  
5. Mesh page → both control planes.  
6. Distributed Tracing / “View in Tracing” → OCP Observe > Traces.  
7. Workload metrics → “View in Perses” (known bug [#10021](https://github.com/kiali/kiali/issues/10021): may land on list — pick dashboard + fill vars).  

There is **no** Kiali server on spoke-two (remote resources only).

### Demo tip — show traffic one cluster → another

1. Kiali Graph on `bookinfo` with both clusters selected (productpage/reviews on spoke → ratings/`ratings-v2` on spoke-two).  
2. Prove with Tempo TraceQL: `{ resource.k8s.cluster.name = "spoke-two" }`.  
3. Ambient helloworld federation is a good second slide; lead with Bookinfo.

### Traffic already running

- `ambient-demo/traffic-gen` on spoke1 → helloworld (load-balances across both clusters).  
- `bookinfo/traffic-gen` on spoke1 → productpage → reviews → ratings (incl. remote `ratings-v2`).  

```bash
oc --context=ossm-kiali-spoke logs -n ambient-demo deploy/traffic-gen -c client --tail=20
oc --context=ossm-kiali-spoke logs -n bookinfo deploy/traffic-gen -c client --tail=20
```

---

## Known pitfalls discovered during deploy

1. **`istioctl create-remote-secret`** with SA in `istio-system` requires **`-n istio-system`** (otherwise looks in `default`).  
2. Bookinfo `oc wait --all pods` after rollout restart can time out while old pods terminate; wait on **deployments Available** instead.  
3. AWS LB may use IP or hostname; we used IPs successfully.  
4. Spoke-two API DNS may use a different hostname pattern than spoke1 — verify before login.  
5. Kiali patches must be **merge-safe** — never wipe `external_services.prometheus` / Perses / Tempo / OAuth TLS skip.  
6. ServiceMonitor for Kiali: use ConfigMap `tlsConfig.ca`, **not** `caFile` (UWM denies FS access).  
7. Health alert demo: `failure: 0` does not trigger Failure — use `failure: 1` (#10072). With hub Thanos, set `health_config.compute.duration: 10m`.  
8. Perses deep-link bug: [#10021](https://github.com/kiali/kiali/issues/10021).  
9. Transient spoke API TLS handshake timeouts happened during long applies — retry the failed step.

---

## Quick health check (resume checklist)

```bash
export KUBECONFIG=~/.kube/ossm-acm-hub-spoke
export PATH="$HOME/.local/bin:$PATH"

for c in ossm-kiali-hub ossm-kiali-spoke ossm-kiali-spoke-two; do
  echo -n "$c: "; oc --context=$c whoami --show-server
done

oc --context=ossm-kiali-hub get managedclusters
oc --context=ossm-kiali-spoke get istio,ztunnel
oc --context=ossm-kiali-spoke-two get istio,ztunnel
oc --context=ossm-kiali-spoke get gateway -n istio-system
oc --context=ossm-kiali-spoke-two get gateway -n istio-system
oc --context=ossm-kiali-spoke get secrets -n istio-system -l istio/multiCluster=true
oc --context=ossm-kiali-spoke-two get secrets -n istio-system -l istio/multiCluster=true
oc --context=ossm-kiali-spoke get secret kiali-multi-cluster-secret -n istio-system --show-labels

# Perses / Tempo
oc --context=ossm-kiali-spoke get pods -l app.kubernetes.io/name=perses -n openshift-operators
oc --context=ossm-kiali-spoke get persesdashboard -n perses
oc --context=ossm-kiali-spoke get tempostack -n tempo
oc --context=ossm-kiali-spoke get pods -n istio-system -l app.kubernetes.io/managed-by=opentelemetry-operator
oc --context=ossm-kiali-spoke-two get pods -n istio-system -l app.kubernetes.io/managed-by=opentelemetry-operator
oc --context=ossm-kiali-spoke get kiali kiali -n istio-system \
  -o jsonpath='perses={.spec.external_services.perses.enabled} tracing={.spec.external_services.tracing.enabled} health={.spec.server.observability.metrics.health_status.enabled}{"\n"}'

# Health alerts
oc --context=ossm-kiali-spoke get servicemonitor,prometheusrule -n istio-system | grep -E 'kiali|NAME'
oc --context=ossm-kiali-hub -n open-cluster-management-observability \
  get configmap observability-metrics-custom-allowlist \
  -o jsonpath='{.data.uwl_metrics_list\.yaml}' | grep kiali_health_status
oc --context=ossm-kiali-hub -n open-cluster-management-observability \
  get configmap thanos-ruler-custom-rules -o name
```

---

## Possible next work

- [ ] Live talk dry-run: Kiali graph → Tempo cluster filter → Perses / alerts  
- [ ] Optional: Slack/email Alertmanager routing (tutorial optional section)  
- [ ] Teardown / cleanup (only if requested — each tutorial has Cleanup)  
- [ ] Repo automation / commit wiped tree (explicitly out of scope so far)  
- [ ] Rewrite HANDOFF into repo docs if you want it versioned (ask first)

---

## Agent resume one-liner

> Full OSSM ACM tutorial series is live on RHQE: hub-spoke + multi-primary + Perses/Tempo + health alerts. Kubeconfig `~/.kube/ossm-acm-hub-spoke`, contexts hub/spoke/spoke-two, Istio 1.30.1. Read `~/.local/share/ossm-acm/HANDOFF.md` (or workspace `HANDOFF.md`). Do not commit secrets. VPN required for console/Kiali from home. Series tutorials are done — next is demo polish or cleanup only if asked.
