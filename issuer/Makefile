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
	@bun ${ISSUER_ROOT_DIR}src/index.ts

.PHONY: test
test:
	@bun test ${ISSUER_ROOT_DIR}test

.PHONY: watch
watch:
	@bun --watch test ${ISSUER_ROOT_DIR}test
