# TODO: specific option settings
MAKEFLAGS += --no-print-directory

# TODO: specific rake variable settings
SHELL := /bin/bash
CUSTOMER_ROOT_DIR := $(dir $(realpath $(lastword $(MAKEFILE_LIST))))

.PHONY: help
help:
	@. ${CUSTOMER_ROOT_DIR}.make/scripts/help.sh

.PHONY: test
test: pattern='<unit>'
test:
	@bun test --test-name-pattern=${pattern}

.PHONY: watch
watch: pattern='<unit>'
watch:
	@bun --watch test --test-name-pattern=${pattern}
