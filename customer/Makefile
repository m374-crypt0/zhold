# TODO: specific option settings
MAKEFLAGS += --no-print-directory

# TODO: specific rake variable settings
SHELL := /bin/bash
CUSTOMER_ROOT_DIR := $(dir $(realpath $(lastword $(MAKEFILE_LIST))))

.PHONY: help
help:
	@. ${CUSTOMER_ROOT_DIR}.make/scripts/help.sh

.PHONY: test
test:
	@bun test ${CUSTOMER_ROOT_DIR}test

.PHONY: watch
watch:
	@bun --watch test ${CUSTOMER_ROOT_DIR}test
