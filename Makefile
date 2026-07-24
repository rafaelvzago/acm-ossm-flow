.PHONY: galaxy bootstrap hub-spoke multi-primary perses-tempo health-alerts site verify teardown

galaxy:
	ansible-galaxy collection install -r requirements.yml

bootstrap:
	ansible-playbook playbooks/00-bootstrap.yml

hub-spoke:
	ansible-playbook playbooks/01-hub-spoke.yml

multi-primary:
	ansible-playbook playbooks/02-multi-primary.yml

perses-tempo:
	ansible-playbook playbooks/03-perses-tempo.yml

health-alerts:
	ansible-playbook playbooks/04-health-alerts.yml

site:
	ansible-playbook playbooks/site.yml

verify:
	ansible-playbook playbooks/verify.yml

teardown:
	ansible-playbook playbooks/teardown.yml
