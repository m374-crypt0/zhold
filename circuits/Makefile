# TODO: specific option settings
MAKEFLAGS += --no-print-directory

# TODO: specific rake variable settings
SHELL := /bin/bash
CIRCUITS_ROOT_DIR := $(dir $(realpath $(lastword $(MAKEFILE_LIST))))

export

.PHONY: help
help:
	@. ${CIRCUITS_ROOT_DIR}.make/scripts/help.sh

.PHONY: clean
clean:
	@rm -rf ${CIRCUITS_ROOT_DIR}target

.PHONY: compile
compile: clean
	@cd ${CIRCUITS_ROOT_DIR} && nargo compile

.PHONY: generate_solidity_verifiers
generate_solidity_verifiers: compile
	@. ${CIRCUITS_ROOT_DIR}.make/scripts/generate_solidity_verifiers.sh

.PHONY: test
test:
	@cd ${CIRCUITS_ROOT_DIR} && nargo test --show-output

.PHONY: watch
watch:
	@. ${CIRCUITS_ROOT_DIR}.make/scripts/watch.sh
