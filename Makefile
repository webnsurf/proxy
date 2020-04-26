.PHONY: default
default:
	@echo Tasks:
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)


.PHONY:
run: ## Start Effectas docker containers
	@docker-compose up -d || (echo "Run failed? Try building first with make clean build" && exit 1)


.PHONY:
stop: ## Stop Effectas docker containers
	@docker-compose stop


.PHONY:
clean: ## Stop and remove Effectas docker containers and images
	@docker-compose down || true
