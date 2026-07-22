SHELL := /bin/sh
.DEFAULT_GOAL := help

# ---------------------------------------------------------------------------
# Variables
# ---------------------------------------------------------------------------
INVENTORY      := inventory/hosts.yml
PLAYBOOK_DIR   := playbooks
ANSIBLE_OPTS   ?=
# ---------------------------------------------------------------------------
# Help
# ---------------------------------------------------------------------------
.PHONY: help
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ---------------------------------------------------------------------------
# Setup
# ---------------------------------------------------------------------------
.PHONY: deps
deps: ## Install Ansible Galaxy collections
	ansible-galaxy collection install -r requirements.yml

.PHONY: setup
setup: deps ## Full setup (install collections)

# ---------------------------------------------------------------------------
# Lint & Validation
# ---------------------------------------------------------------------------
.PHONY: lint
lint: ## Run ansible-lint on all playbooks and roles
	ansible-lint $(PLAYBOOK_DIR)/ roles/

.PHONY: yamllint
yamllint: ## Run yamllint on all YAML files
	yamllint -d relaxed $(PLAYBOOK_DIR)/ roles/ inventory/

.PHONY: syntax
syntax: ## Syntax-check all playbooks
	@for pb in $(PLAYBOOK_DIR)/*.yml; do \
		echo "--- $$pb"; \
		ansible-playbook --syntax-check -i $(INVENTORY) $$pb || exit 1; \
	done

.PHONY: check
check: lint syntax ## Run all checks (lint + syntax)

# ---------------------------------------------------------------------------
# Full lifecycle
# ---------------------------------------------------------------------------
.PHONY: deploy
deploy: ## Run the full multi-cluster setup (site.yml)
	ansible-playbook -i $(INVENTORY) $(PLAYBOOK_DIR)/site.yml $(ANSIBLE_OPTS)

.PHONY: teardown
teardown: ## Tear down the entire POC environment
	ansible-playbook -i $(INVENTORY) $(PLAYBOOK_DIR)/teardown.yml $(ANSIBLE_OPTS)

.PHONY: verify
verify: ## Run cross-cluster connectivity verification only
	ansible-playbook -i $(INVENTORY) $(PLAYBOOK_DIR)/07-verify.yml $(ANSIBLE_OPTS)

.PHONY: redeploy
redeploy: teardown deploy ## Teardown then deploy from scratch

# ---------------------------------------------------------------------------
# Individual phases
# ---------------------------------------------------------------------------
.PHONY: certificates
certificates: ## Phase 1 - Generate CA certificates
	ansible-playbook -i $(INVENTORY) $(PLAYBOOK_DIR)/01-certificates.yml $(ANSIBLE_OPTS)

.PHONY: mesh-control-plane
mesh-control-plane: ## Phase 2 - Deploy ServiceMeshControlPlane
	ansible-playbook -i $(INVENTORY) $(PLAYBOOK_DIR)/02-mesh-control-plane.yml $(ANSIBLE_OPTS)

.PHONY: eastwest-gateway
eastwest-gateway: ## Phase 3 - Deploy east-west gateways
	ansible-playbook -i $(INVENTORY) $(PLAYBOOK_DIR)/03-eastwest-gateway.yml $(ANSIBLE_OPTS)

.PHONY: remote-secrets
remote-secrets: ## Phase 4 - Create cross-cluster remote secrets
	ansible-playbook -i $(INVENTORY) $(PLAYBOOK_DIR)/04-remote-secrets.yml $(ANSIBLE_OPTS)

.PHONY: mesh-networks
mesh-networks: ## Phase 5 - Update SMCP with real gateway addresses
	ansible-playbook -i $(INVENTORY) $(PLAYBOOK_DIR)/05-mesh-networks.yml $(ANSIBLE_OPTS)

.PHONY: demo-apps
demo-apps: ## Phase 6 - Deploy bookinfo and sleep apps
	ansible-playbook -i $(INVENTORY) $(PLAYBOOK_DIR)/06-demo-apps.yml $(ANSIBLE_OPTS)

# ---------------------------------------------------------------------------
# Dry-run
# ---------------------------------------------------------------------------
.PHONY: dry-run
dry-run: ## Dry-run the full setup (--check --diff)
	ansible-playbook -i $(INVENTORY) $(PLAYBOOK_DIR)/site.yml --check --diff $(ANSIBLE_OPTS)

# ---------------------------------------------------------------------------
# Clean
# ---------------------------------------------------------------------------
.PHONY: clean
clean: ## Remove generated certs and downloaded manifests
	rm -rf files/certs/
	rm -f /tmp/bookinfo.yaml /tmp/sleep.yaml

