# TODO: specific option settings
MAKEFLAGS += --no-print-directory

# TODO: specific rake variable settings
SHELL := /bin/bash
ISSUER_ROOT_DIR := $(dir $(realpath $(lastword $(MAKEFILE_LIST))))

.PHONY: help
help:
	@. ${ISSUER_ROOT_DIR}.make/scripts/help.sh

.PHONY: build
build:
	@. ${ISSUER_ROOT_DIR}.make/scripts/build.sh

.PHONY: run
run: build
	@bun run ${ISSUER_ROOT_DIR}src/

.PHONY: dev
dev: build
	@bun run dev ${ISSUER_ROOT_DIR}src/

.PHONY: test

test: pattern='<unit>'
test: build
	@bun test --test-name-pattern=${pattern}

.PHONY: watch
watch: pattern='<unit>'
watch: build
	@bun --watch --test-name-pattern=${pattern} test
