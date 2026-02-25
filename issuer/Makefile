# TODO: specific option settings
MAKEFLAGS += --no-print-directory

# TODO: specific rake variable settings
SHELL := /bin/bash
ISSUER_ROOT_DIR := $(dir $(realpath $(lastword $(MAKEFILE_LIST))))

.PHONY: help
help:
	@. ${ISSUER_ROOT_DIR}.make/scripts/help.sh

.PHONY: run
run:
	@bun run ${ISSUER_ROOT_DIR}src/

.PHONY: dev
dev:
	@bun run dev ${ISSUER_ROOT_DIR}src/

.PHONY: test

test: pattern='<unit>'
test:
	@bun test --test-name-pattern=${pattern}

.PHONY: watch
watch: pattern='<unit>'
watch:
	@bun --watch --test-name-pattern=${pattern} test
